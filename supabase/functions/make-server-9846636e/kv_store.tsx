import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function get(key: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('kv_store_9846636e')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.error('KV get error:', error);
      return null;
    }

    return data?.value || null;
  } catch (error) {
    console.error('KV get exception:', error);
    return null;
  }
}

export async function set(key: string, value: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('kv_store_9846636e')
      .upsert({
        key,
        value
      });

    if (error) {
      console.error('KV set error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('KV set exception:', error);
    return false;
  }
}

export async function del(key: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('kv_store_9846636e')
      .delete()
      .eq('key', key);

    if (error) {
      console.error('KV delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('KV delete exception:', error);
    return false;
  }
}