import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

interface UnreadMessagesCount {
  count: number;
}

export function useUnreadMessages(userId: string | undefined) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', userId)
          .maybeSingle();

        if (!dbUser) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', dbUser.id)
          .eq('read', false);

        if (error) throw error;

        setUnreadCount(data || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    const channel = supabase
      .channel('messages_unread_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { unreadCount, loading };
}
