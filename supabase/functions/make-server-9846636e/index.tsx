import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client for server operations
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error during verification:', error);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    
    c.set('user', user);
    await next();
  } catch (error) {
    console.log('Exception during auth verification:', error);
    return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
  }
};

// Health check endpoint
app.get("/make-server-9846636e/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================
// AUTH ROUTES
// ============================================

// Sign up new user
app.post("/make-server-9846636e/auth/signup", async (c) => {
  try {
    const { email, password, name, role, metadata } = await c.req.json();
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields: email, password, name, role' }, 400);
    }

    // Validate role
    const validRoles = ['teacher', 'parent', 'student', 'admin'];
    if (!validRoles.includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since email server is not configured
      user_metadata: {
        name,
        role,
        ...metadata
      }
    });

    if (error) {
      console.log('Error creating user in auth:', error);
      return c.json({ error: `Failed to create user: ${error.message}` }, 400);
    }

    // Store user data in KV store
    const userData = {
      id: data.user.id,
      email,
      name,
      role,
      avatar: '',
      createdAt: new Date().toISOString(),
      metadata: metadata || {}
    };

    await kv.set(`user:${data.user.id}`, userData);
    await kv.set(`user:email:${email}`, data.user.id);

    // Also create user in Supabase users table
    try {
      await supabaseAdmin.from('users').insert({
        auth_user_id: data.user.id,
        name,
        email,
        role,
        status: 'active'
      });
    } catch (dbError) {
      console.log('Error creating user in database (non-fatal):', dbError);
    }

    return c.json({
      success: true,
      user: userData,
      message: 'User created successfully'
    });
  } catch (error) {
    console.log('Exception during signup:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get current session
app.get("/make-server-9846636e/auth/session", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    
    if (!userData) {
      return c.json({ error: 'User data not found' }, 404);
    }

    return c.json({ user: userData });
  } catch (error) {
    console.log('Exception getting session:', error);
    return c.json({ error: 'Failed to get session' }, 500);
  }
});

// Update user profile
app.put("/make-server-9846636e/auth/profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const updates = await c.req.json();
    
    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUser = {
      ...userData,
      ...updates,
      id: userData.id, // Preserve id
      email: userData.email, // Preserve email
      role: userData.role, // Preserve role
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedUser);

    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log('Exception updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ============================================
// USER MANAGEMENT ROUTES (Admin only)
// ============================================

app.get("/make-server-9846636e/users", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');
    const currentUserData = await kv.get(`user:${currentUser.id}`);
    
    if (currentUserData?.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const users = await kv.getByPrefix('user:');
    const filteredUsers = users
      .filter((u: any) => u.value && !u.key.includes('email:'))
      .map((u: any) => u.value);

    return c.json({ users: filteredUsers });
  } catch (error) {
    console.log('Exception fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

app.delete("/make-server-9846636e/users/:userId", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');
    const currentUserData = await kv.get(`user:${currentUser.id}`);

    if (currentUserData?.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const userId = c.req.param('userId');
    const userData = await kv.get(`user:${userId}`);

    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Delete from auth
    await supabaseAdmin.auth.admin.deleteUser(userId);

    // Delete from KV store
    await kv.del(`user:${userId}`);
    await kv.del(`user:email:${userData.email}`);

    return c.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.log('Exception deleting user:', error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

app.post("/make-server-9846636e/users/sync", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');
    const currentUserData = await kv.get(`user:${currentUser.id}`);

    if (currentUserData?.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const users = await kv.getByPrefix('user:');
    const usersToSync = users
      .filter((u: any) => u && u.value && !u.key?.includes('email:'))
      .map((u: any) => u.value);

    let synced = 0;
    let errors = 0;

    for (const user of usersToSync) {
      try {
        const { error } = await supabaseAdmin.from('users').upsert({
          auth_user_id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: 'active'
        }, { onConflict: 'auth_user_id' });

        if (error) throw error;
        synced++;
      } catch (error) {
        console.log(`Error syncing user ${user.id}:`, error);
        errors++;
      }
    }

    return c.json({
      success: true,
      synced,
      errors,
      total: usersToSync.length
    });
  } catch (error) {
    console.log('Exception syncing users:', error);
    return c.json({ error: 'Failed to sync users' }, 500);
  }
});

// ============================================
// BOARD/PANCARTE ROUTES
// ============================================

app.post("/make-server-9846636e/boards", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const boardData = await c.req.json();
    
    const board = {
      id: crypto.randomUUID(),
      ...boardData,
      createdBy: user.id,
      createdByName: userData.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`board:${board.id}`, board);
    
    return c.json({ success: true, board });
  } catch (error) {
    console.log('Exception creating board:', error);
    return c.json({ error: 'Failed to create board' }, 500);
  }
});

app.get("/make-server-9846636e/boards", requireAuth, async (c) => {
  try {
    const boards = await kv.getByPrefix('board:');
    const boardsList = boards.map((b: any) => b.value);
    
    return c.json({ boards: boardsList });
  } catch (error) {
    console.log('Exception fetching boards:', error);
    return c.json({ error: 'Failed to fetch boards' }, 500);
  }
});

app.put("/make-server-9846636e/boards/:boardId", requireAuth, async (c) => {
  try {
    const boardId = c.req.param('boardId');
    const updates = await c.req.json();
    
    const board = await kv.get(`board:${boardId}`);
    if (!board) {
      return c.json({ error: 'Board not found' }, 404);
    }

    const updatedBoard = {
      ...board,
      ...updates,
      id: board.id,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`board:${boardId}`, updatedBoard);
    
    return c.json({ success: true, board: updatedBoard });
  } catch (error) {
    console.log('Exception updating board:', error);
    return c.json({ error: 'Failed to update board' }, 500);
  }
});

app.delete("/make-server-9846636e/boards/:boardId", requireAuth, async (c) => {
  try {
    const boardId = c.req.param('boardId');
    await kv.del(`board:${boardId}`);
    
    return c.json({ success: true, message: 'Board deleted successfully' });
  } catch (error) {
    console.log('Exception deleting board:', error);
    return c.json({ error: 'Failed to delete board' }, 500);
  }
});

// ============================================
// MESSAGE ROUTES
// ============================================

app.post("/make-server-9846636e/messages", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const messageData = await c.req.json();
    
    const message = {
      id: crypto.randomUUID(),
      ...messageData,
      senderId: user.id,
      senderName: userData.name,
      senderRole: userData.role,
      read: false,
      createdAt: new Date().toISOString()
    };

    await kv.set(`message:${message.id}`, message);
    
    // Also store in recipient's inbox
    if (message.recipientId) {
      const recipientMessages = await kv.get(`inbox:${message.recipientId}`) || [];
      recipientMessages.push(message.id);
      await kv.set(`inbox:${message.recipientId}`, recipientMessages);
    }
    
    return c.json({ success: true, message });
  } catch (error) {
    console.log('Exception creating message:', error);
    return c.json({ error: 'Failed to create message' }, 500);
  }
});

app.get("/make-server-9846636e/messages", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const type = c.req.query('type'); // 'sent' or 'received'
    
    const allMessages = await kv.getByPrefix('message:');
    let userMessages = allMessages.map((m: any) => m.value);

    if (type === 'sent') {
      userMessages = userMessages.filter((m: any) => m.senderId === user.id);
    } else if (type === 'received') {
      userMessages = userMessages.filter((m: any) => m.recipientId === user.id);
    } else {
      // Return all messages involving the user
      userMessages = userMessages.filter((m: any) => 
        m.senderId === user.id || m.recipientId === user.id
      );
    }
    
    return c.json({ messages: userMessages });
  } catch (error) {
    console.log('Exception fetching messages:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

app.put("/make-server-9846636e/messages/:messageId/read", requireAuth, async (c) => {
  try {
    const messageId = c.req.param('messageId');
    const message = await kv.get(`message:${messageId}`);
    
    if (!message) {
      return c.json({ error: 'Message not found' }, 404);
    }

    message.read = true;
    await kv.set(`message:${messageId}`, message);
    
    return c.json({ success: true, message });
  } catch (error) {
    console.log('Exception marking message as read:', error);
    return c.json({ error: 'Failed to mark message as read' }, 500);
  }
});

// ============================================
// HOMEWORK ROUTES
// ============================================

app.post("/make-server-9846636e/homework", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const homeworkData = await c.req.json();
    
    const homework = {
      id: crypto.randomUUID(),
      ...homeworkData,
      createdBy: user.id,
      createdByName: userData.name,
      createdAt: new Date().toISOString(),
      submissions: []
    };

    await kv.set(`homework:${homework.id}`, homework);
    
    return c.json({ success: true, homework });
  } catch (error) {
    console.log('Exception creating homework:', error);
    return c.json({ error: 'Failed to create homework' }, 500);
  }
});

app.get("/make-server-9846636e/homework", requireAuth, async (c) => {
  try {
    const homeworks = await kv.getByPrefix('homework:');
    const homeworkList = homeworks.map((h: any) => h.value);
    
    return c.json({ homework: homeworkList });
  } catch (error) {
    console.log('Exception fetching homework:', error);
    return c.json({ error: 'Failed to fetch homework' }, 500);
  }
});

app.post("/make-server-9846636e/homework/:homeworkId/submit", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const homeworkId = c.req.param('homeworkId');
    const submissionData = await c.req.json();
    
    const homework = await kv.get(`homework:${homeworkId}`);
    if (!homework) {
      return c.json({ error: 'Homework not found' }, 404);
    }

    const submission = {
      studentId: user.id,
      studentName: userData.name,
      submittedAt: new Date().toISOString(),
      ...submissionData
    };

    homework.submissions = homework.submissions || [];
    
    // Remove existing submission if any
    homework.submissions = homework.submissions.filter((s: any) => s.studentId !== user.id);
    homework.submissions.push(submission);

    await kv.set(`homework:${homeworkId}`, homework);
    
    return c.json({ success: true, homework });
  } catch (error) {
    console.log('Exception submitting homework:', error);
    return c.json({ error: 'Failed to submit homework' }, 500);
  }
});

// ============================================
// GRADES ROUTES
// ============================================

app.post("/make-server-9846636e/grades", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const gradeData = await c.req.json();
    
    const grade = {
      id: crypto.randomUUID(),
      ...gradeData,
      teacherId: user.id,
      teacherName: userData.name,
      date: gradeData.date || new Date().toISOString()
    };

    await kv.set(`grade:${grade.id}`, grade);
    
    // Also index by student
    const studentGrades = await kv.get(`student:${grade.studentId}:grades`) || [];
    studentGrades.push(grade.id);
    await kv.set(`student:${grade.studentId}:grades`, studentGrades);
    
    return c.json({ success: true, grade });
  } catch (error) {
    console.log('Exception creating grade:', error);
    return c.json({ error: 'Failed to create grade' }, 500);
  }
});

app.get("/make-server-9846636e/grades", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const studentId = c.req.query('studentId');
    
    let grades = await kv.getByPrefix('grade:');
    let gradesList = grades.map((g: any) => g.value);

    // Filter based on role
    if (userData.role === 'student') {
      gradesList = gradesList.filter((g: any) => g.studentId === user.id);
    } else if (userData.role === 'parent' && studentId) {
      gradesList = gradesList.filter((g: any) => g.studentId === studentId);
    } else if (studentId) {
      gradesList = gradesList.filter((g: any) => g.studentId === studentId);
    }
    
    return c.json({ grades: gradesList });
  } catch (error) {
    console.log('Exception fetching grades:', error);
    return c.json({ error: 'Failed to fetch grades' }, 500);
  }
});

// ============================================
// SCHEDULE ROUTES
// ============================================

app.post("/make-server-9846636e/schedule", requireAuth, async (c) => {
  try {
    const scheduleData = await c.req.json();
    
    const entry = {
      id: crypto.randomUUID(),
      ...scheduleData
    };

    await kv.set(`schedule:${entry.id}`, entry);
    
    return c.json({ success: true, entry });
  } catch (error) {
    console.log('Exception creating schedule entry:', error);
    return c.json({ error: 'Failed to create schedule entry' }, 500);
  }
});

app.get("/make-server-9846636e/schedule", requireAuth, async (c) => {
  try {
    const classId = c.req.query('classId');
    
    let schedules = await kv.getByPrefix('schedule:');
    let scheduleList = schedules.map((s: any) => s.value);

    if (classId) {
      scheduleList = scheduleList.filter((s: any) => s.classId === classId);
    }
    
    return c.json({ schedule: scheduleList });
  } catch (error) {
    console.log('Exception fetching schedule:', error);
    return c.json({ error: 'Failed to fetch schedule' }, 500);
  }
});

// ============================================
// COURSE RESOURCES ROUTES
// ============================================

app.post("/make-server-9846636e/resources", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const resourceData = await c.req.json();
    
    const resource = {
      id: crypto.randomUUID(),
      ...resourceData,
      createdBy: user.id,
      createdByName: userData.name,
      createdAt: new Date().toISOString()
    };

    await kv.set(`resource:${resource.id}`, resource);
    
    return c.json({ success: true, resource });
  } catch (error) {
    console.log('Exception creating resource:', error);
    return c.json({ error: 'Failed to create resource' }, 500);
  }
});

app.get("/make-server-9846636e/resources", requireAuth, async (c) => {
  try {
    const resources = await kv.getByPrefix('resource:');
    const resourcesList = resources.map((r: any) => r.value);
    
    return c.json({ resources: resourcesList });
  } catch (error) {
    console.log('Exception fetching resources:', error);
    return c.json({ error: 'Failed to fetch resources' }, 500);
  }
});

// ============================================
// LIAISON ROUTES
// ============================================

app.post("/make-server-9846636e/liaison", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const liaisonData = await c.req.json();
    
    const entry = {
      id: crypto.randomUUID(),
      ...liaisonData,
      createdBy: user.id,
      createdByName: userData.name,
      createdAt: new Date().toISOString(),
      signatures: []
    };

    await kv.set(`liaison:${entry.id}`, entry);
    
    return c.json({ success: true, entry });
  } catch (error) {
    console.log('Exception creating liaison entry:', error);
    return c.json({ error: 'Failed to create liaison entry' }, 500);
  }
});

app.get("/make-server-9846636e/liaison", requireAuth, async (c) => {
  try {
    const entries = await kv.getByPrefix('liaison:');
    const liaisonList = entries.map((e: any) => e.value);
    
    return c.json({ liaison: liaisonList });
  } catch (error) {
    console.log('Exception fetching liaison entries:', error);
    return c.json({ error: 'Failed to fetch liaison entries' }, 500);
  }
});

app.post("/make-server-9846636e/liaison/:entryId/sign", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const entryId = c.req.param('entryId');
    
    const entry = await kv.get(`liaison:${entryId}`);
    if (!entry) {
      return c.json({ error: 'Liaison entry not found' }, 404);
    }

    const signature = {
      userId: user.id,
      userName: userData.name,
      signedAt: new Date().toISOString()
    };

    entry.signatures = entry.signatures || [];
    
    // Remove existing signature if any
    entry.signatures = entry.signatures.filter((s: any) => s.userId !== user.id);
    entry.signatures.push(signature);

    await kv.set(`liaison:${entryId}`, entry);
    
    return c.json({ success: true, entry });
  } catch (error) {
    console.log('Exception signing liaison entry:', error);
    return c.json({ error: 'Failed to sign liaison entry' }, 500);
  }
});

// ============================================
// CLASSES ROUTES
// ============================================

app.post("/make-server-9846636e/classes", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const classData = await c.req.json();
    
    const classInfo = {
      id: crypto.randomUUID(),
      ...classData,
      teacherId: user.id,
      teacherName: userData.name,
      createdAt: new Date().toISOString(),
      studentCount: 0
    };

    await kv.set(`class:${classInfo.id}`, classInfo);
    
    return c.json({ success: true, class: classInfo });
  } catch (error) {
    console.log('Exception creating class:', error);
    return c.json({ error: 'Failed to create class' }, 500);
  }
});

app.get("/make-server-9846636e/classes", requireAuth, async (c) => {
  try {
    const classes = await kv.getByPrefix('class:');
    const classList = classes.map((cls: any) => cls.value);
    
    return c.json({ classes: classList });
  } catch (error) {
    console.log('Exception fetching classes:', error);
    return c.json({ error: 'Failed to fetch classes' }, 500);
  }
});

// ============================================
// ATTENDANCE ROUTES
// ============================================

app.post("/make-server-9846636e/attendance", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const attendanceData = await c.req.json();
    
    const record = {
      id: crypto.randomUUID(),
      ...attendanceData,
      recordedBy: user.id,
      recordedAt: new Date().toISOString()
    };

    await kv.set(`attendance:${record.id}`, record);
    
    return c.json({ success: true, record });
  } catch (error) {
    console.log('Exception creating attendance record:', error);
    return c.json({ error: 'Failed to create attendance record' }, 500);
  }
});

app.get("/make-server-9846636e/attendance", requireAuth, async (c) => {
  try {
    const studentId = c.req.query('studentId');
    const classId = c.req.query('classId');
    
    let records = await kv.getByPrefix('attendance:');
    let attendanceList = records.map((r: any) => r.value);

    if (studentId) {
      attendanceList = attendanceList.filter((r: any) => r.studentId === studentId);
    }
    if (classId) {
      attendanceList = attendanceList.filter((r: any) => r.classId === classId);
    }
    
    return c.json({ attendance: attendanceList });
  } catch (error) {
    console.log('Exception fetching attendance:', error);
    return c.json({ error: 'Failed to fetch attendance' }, 500);
  }
});

// ============================================
// EVENTS ROUTES
// ============================================

app.post("/make-server-9846636e/events", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userData = await kv.get(`user:${user.id}`);
    const eventData = await c.req.json();
    
    const event = {
      id: crypto.randomUUID(),
      ...eventData,
      createdBy: user.id,
      createdByName: userData.name,
      createdAt: new Date().toISOString()
    };

    await kv.set(`event:${event.id}`, event);
    
    return c.json({ success: true, event });
  } catch (error) {
    console.log('Exception creating event:', error);
    return c.json({ error: 'Failed to create event' }, 500);
  }
});

app.get("/make-server-9846636e/events", requireAuth, async (c) => {
  try {
    const events = await kv.getByPrefix('event:');
    const eventsList = events.map((e: any) => e.value);

    return c.json({ events: eventsList });
  } catch (error) {
    console.log('Exception fetching events:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

// ============================================
// COMMUNICATIONS ROUTES
// ============================================

app.post("/make-server-9846636e/communications", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');
    const { title, message, target, target_details, status, scheduled_date } = await c.req.json();

    if (!title || !message || !target || !status) {
      return c.json({ error: 'Missing required fields: title, message, target, status' }, 400);
    }

    const { data: currentUserData, error: currentUserError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', currentUser.id)
      .maybeSingle();

    if (currentUserError || !currentUserData || currentUserData.role !== 'admin') {
      return c.json({ error: 'Unauthorized: Only admins can create communications' }, 403);
    }

    let totalRecipients = 0;
    if (status === 'sent' || status === 'scheduled') {
      const { count } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', target === 'all' ? undefined : target === 'class' ? 'student' : target);

      totalRecipients = count || 0;
    }

    const communicationData: any = {
      title,
      message,
      target,
      target_details: target_details || null,
      status,
      scheduled_date: scheduled_date || null,
      created_by: currentUser.id,
      total_recipients: totalRecipients,
      sent_at: status === 'sent' ? new Date().toISOString() : null
    };

    const { data, error } = await supabaseAdmin
      .from('communications')
      .insert([communicationData])
      .select()
      .single();

    if (error) {
      console.log('Error creating communication:', error);
      return c.json({ error: 'Failed to create communication' }, 500);
    }

    return c.json({ success: true, communication: data });
  } catch (error) {
    console.log('Exception creating communication:', error);
    return c.json({ error: 'Failed to create communication' }, 500);
  }
});

app.get("/make-server-9846636e/communications", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');

    const { data: currentUserData, error: currentUserError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', currentUser.id)
      .maybeSingle();

    if (currentUserError || !currentUserData) {
      return c.json({ error: 'Failed to verify user permissions' }, 403);
    }

    const { data, error } = await supabaseAdmin
      .from('communications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error fetching communications:', error);
      return c.json({ error: 'Failed to fetch communications' }, 500);
    }

    return c.json({ success: true, communications: data || [] });
  } catch (error) {
    console.log('Exception fetching communications:', error);
    return c.json({ error: 'Failed to fetch communications' }, 500);
  }
});

app.put("/make-server-9846636e/communications/:id", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');
    const commId = c.req.param('id');
    const updates = await c.req.json();

    const { data: currentUserData, error: currentUserError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', currentUser.id)
      .maybeSingle();

    if (currentUserError || !currentUserData || currentUserData.role !== 'admin') {
      return c.json({ error: 'Unauthorized: Only admins can update communications' }, 403);
    }

    if (updates.status === 'sent' && !updates.sent_at) {
      updates.sent_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('communications')
      .update(updates)
      .eq('id', commId)
      .select()
      .single();

    if (error) {
      console.log('Error updating communication:', error);
      return c.json({ error: 'Failed to update communication' }, 500);
    }

    return c.json({ success: true, communication: data });
  } catch (error) {
    console.log('Exception updating communication:', error);
    return c.json({ error: 'Failed to update communication' }, 500);
  }
});

app.delete("/make-server-9846636e/communications/:id", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');
    const commId = c.req.param('id');

    const { data: currentUserData, error: currentUserError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', currentUser.id)
      .maybeSingle();

    if (currentUserError || !currentUserData || currentUserData.role !== 'admin') {
      return c.json({ error: 'Unauthorized: Only admins can delete communications' }, 403);
    }

    const { error } = await supabaseAdmin
      .from('communications')
      .delete()
      .eq('id', commId);

    if (error) {
      console.log('Error deleting communication:', error);
      return c.json({ error: 'Failed to delete communication' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Exception deleting communication:', error);
    return c.json({ error: 'Failed to delete communication' }, 500);
  }
});

// ============================================
// PASSWORD RESET ROUTE
// ============================================

app.post("/make-server-9846636e/users/reset-password", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');
    const { auth_user_id, new_password } = await c.req.json();

    if (!auth_user_id || !new_password) {
      return c.json({ error: 'Missing required fields: auth_user_id, new_password' }, 400);
    }

    // Check if current user is admin
    const { data: currentUserData, error: currentUserError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', currentUser.id)
      .single();

    if (currentUserError || !currentUserData) {
      return c.json({ error: 'Failed to verify user permissions' }, 403);
    }

    if (currentUserData.role !== 'admin') {
      return c.json({ error: 'Unauthorized: Only admins can reset passwords' }, 403);
    }

    // Verify target user exists
    const { data: targetUser, error: targetError } = await supabaseAdmin
      .from('users')
      .select('name, role')
      .eq('auth_user_id', auth_user_id)
      .single();

    if (targetError || !targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Admins cannot reset other admin passwords
    if (targetUser.role === 'admin') {
      return c.json({ error: 'Cannot reset password for admin users' }, 403);
    }

    // Reset password using Supabase Admin API
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      auth_user_id,
      { password: new_password }
    );

    if (updateError) {
      console.log('Error resetting password:', updateError);
      return c.json({ error: 'Failed to reset password' }, 500);
    }

    return c.json({
      success: true,
      message: `Password reset successfully for ${targetUser.name}`
    });
  } catch (error) {
    console.log('Exception resetting password:', error);
    return c.json({ error: 'Failed to reset password' }, 500);
  }
});

Deno.serve(app.fetch);
