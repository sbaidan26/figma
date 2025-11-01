import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

app.use('*', logger(console.log));

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

app.get("/make-server-9846636e/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/make-server-9846636e/auth/signup", async (c) => {
  try {
    const { email, password, name, role, metadata } = await c.req.json();
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields: email, password, name, role' }, 400);
    }

    const validRoles = ['teacher', 'parent', 'student', 'admin'];
    if (!validRoles.includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
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

    const userData = {
      id: data.user.id,
      email,
      name,
      role,
      avatar: '',
      createdAt: new Date().toISOString(),
      metadata: metadata || {}
    };

    const kvSet1 = await kv.set(`user:${data.user.id}`, userData);
    const kvSet2 = await kv.set(`user:email:${email}`, data.user.id);

    console.log('KV store set results:', { kvSet1, kvSet2 });

    if (!kvSet1 || !kvSet2) {
      console.log('Warning: Failed to store user data in KV store');
    }

    let dbUserId = null;
    try {
      const { data: dbUser, error: dbError } = await supabaseAdmin.from('users').insert({
        auth_user_id: data.user.id,
        name,
        email,
        role,
        status: 'active'
      }).select('id').single();

      if (dbError) {
        console.log('Error creating user in database:', dbError);
      } else {
        dbUserId = dbUser?.id;
        console.log('User created in database with ID:', dbUserId);
      }
    } catch (dbError) {
      console.log('Error creating user in database (non-fatal):', dbError);
    }

    const enrichedUserData = {
      ...userData,
      dbUserId
    };

    return c.json({
      success: true,
      user: enrichedUserData,
      message: 'User created successfully'
    });
  } catch (error) {
    console.log('Exception during signup:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

app.get("/make-server-9846636e/auth/session", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    console.log('Fetching user data for:', user.id);
    const userData = await kv.get(`user:${user.id}`);

    console.log('User data from KV:', userData);

    if (!userData) {
      return c.json({ error: 'User data not found' }, 404);
    }

    const { data: dbUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const enrichedUserData = {
      ...userData,
      dbUserId: dbUser?.id || null
    };

    return c.json({ user: enrichedUserData });
  } catch (error) {
    console.log('Exception getting session:', error);
    return c.json({ error: 'Failed to get session' }, 500);
  }
});

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
      id: userData.id,
      email: userData.email,
      role: userData.role,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedUser);

    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log('Exception updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

app.post("/make-server-9846636e/users/sync", requireAuth, async (c) => {
  try {
    const { data: { users: authUsers }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return c.json({ error: 'Failed to list auth users' }, 500);
    }

    let synced = 0;
    for (const authUser of authUsers) {
      const { data: existing } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('auth_user_id', authUser.id)
        .maybeSingle();

      if (!existing) {
        const metadata = authUser.user_metadata || {};
        await supabaseAdmin.from('users').insert({
          auth_user_id: authUser.id,
          name: metadata.name || authUser.email?.split('@')[0] || 'Unknown',
          email: authUser.email || '',
          role: metadata.role || 'student',
          status: 'active'
        });
        synced++;
      }
    }

    return c.json({ success: true, synced });
  } catch (error) {
    console.log('Exception during sync:', error);
    return c.json({ error: 'Failed to sync users' }, 500);
  }
});

Deno.serve(app.fetch);