import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface ScheduleEntry {
  id: string;
  subject: string;
  teacher: string;
  room?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  class_id: string;
  color?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function useSchedule(classId?: string) {
  const { user } = useAuth();
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userClassId, setUserClassId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserClassId();
    }
  }, [user]);

  useEffect(() => {
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      fetchSchedule(effectiveClassId);
      return subscribeToChanges();
    } else {
      setLoading(false);
    }
  }, [userClassId, classId]);

  const fetchUserClassId = async () => {
    if (!user || classId) return;

    const { data, error } = await supabase
      .from('users')
      .select('class_id')
      .eq('id', user.id)
      .single();

    if (!error && data?.class_id) {
      setUserClassId(data.class_id);
    }
  };

  const fetchSchedule = async (effectiveClassId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedule_entries')
        .select('*')
        .eq('class_id', effectiveClassId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setScheduleEntries(data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Erreur lors du chargement de l\'emploi du temps');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('schedule_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedule_entries' },
        () => {
          const effectiveClassId = classId || userClassId;
          if (effectiveClassId) fetchSchedule(effectiveClassId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createScheduleEntry = async (data: Omit<ScheduleEntry, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    const { error } = await supabase
      .from('schedule_entries')
      .insert({
        ...data,
        created_by: user.id,
      });

    if (error) {
      toast.error('Erreur lors de la création du cours');
      throw error;
    }

    toast.success('Cours ajouté avec succès');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchSchedule(effectiveClassId);
    }
  };

  const updateScheduleEntry = async (id: string, data: Partial<ScheduleEntry>) => {
    const { error } = await supabase
      .from('schedule_entries')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour du cours');
      throw error;
    }

    toast.success('Cours mis à jour');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchSchedule(effectiveClassId);
    }
  };

  const deleteScheduleEntry = async (id: string) => {
    const { error } = await supabase
      .from('schedule_entries')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression du cours');
      throw error;
    }

    toast.success('Cours supprimé');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchSchedule(effectiveClassId);
    }
  };

  const getEntriesForDay = (dayOfWeek: number): ScheduleEntry[] => {
    return scheduleEntries.filter(entry => entry.day_of_week === dayOfWeek);
  };

  const hasConflict = (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): boolean => {
    const entries = getEntriesForDay(dayOfWeek).filter(e => e.id !== excludeId);

    return entries.some(entry => {
      const existingStart = entry.start_time;
      const existingEnd = entry.end_time;

      return (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd)
      );
    });
  };

  return {
    scheduleEntries,
    loading,
    userClassId,
    createScheduleEntry,
    updateScheduleEntry,
    deleteScheduleEntry,
    getEntriesForDay,
    hasConflict,
    refetch: () => {
      const effectiveClassId = classId || userClassId;
      if (effectiveClassId) {
        return fetchSchedule(effectiveClassId);
      }
    },
  };
}
