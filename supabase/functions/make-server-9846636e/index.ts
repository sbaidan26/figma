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

// Note: Other routes omitted for brevity

Deno.serve(app.fetch);