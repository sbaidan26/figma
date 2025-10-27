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
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
  }
};

app.get("/make-server-9846636e/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/make-server-9846636e/communications", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');
    const { title, message, target, target_details, status, scheduled_date } = await c.req.json();

    if (!title || !message || !target || !status) {
      return c.json({ error: 'Missing required fields' }, 400);
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

    if (error) throw error;
    return c.json({ success: true, communication: data });
  } catch (error) {
    console.log('Exception creating communication:', error);
    return c.json({ error: 'Failed to create communication' }, 500);
  }
});

app.get("/make-server-9846636e/communications", requireAuth, async (c) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('communications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
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

    const { data: currentUserData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', currentUser.id)
      .maybeSingle();

    if (!currentUserData || currentUserData.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
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

    if (error) throw error;
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

    const { data: currentUserData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', currentUser.id)
      .maybeSingle();

    if (!currentUserData || currentUserData.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const { error } = await supabaseAdmin
      .from('communications')
      .delete()
      .eq('id', commId);

    if (error) throw error;
    return c.json({ success: true });
  } catch (error) {
    console.log('Exception deleting communication:', error);
    return c.json({ error: 'Failed to delete communication' }, 500);
  }
});

app.post("/make-server-9846636e/users/reset-password", requireAuth, async (c) => {
  try {
    const currentUser = c.get('user');
    const { auth_user_id, new_password } = await c.req.json();

    if (!auth_user_id || !new_password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const { data: currentUserData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('auth_user_id', currentUser.id)
      .maybeSingle();

    if (!currentUserData || currentUserData.role !== 'admin') {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const { data: targetUser } = await supabaseAdmin
      .from('users')
      .select('name, role')
      .eq('auth_user_id', auth_user_id)
      .maybeSingle();

    if (!targetUser || targetUser.role === 'admin') {
      return c.json({ error: 'Cannot reset password' }, 403);
    }

    await supabaseAdmin.auth.admin.updateUserById(auth_user_id, { password: new_password });
    return c.json({ success: true, message: `Password reset for ${targetUser.name}` });
  } catch (error) {
    console.log('Exception resetting password:', error);
    return c.json({ error: 'Failed to reset password' }, 500);
  }
});

Deno.serve(app.fetch);