import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: 'meeting' | 'activity' | 'celebration' | 'trip' | 'exam' | 'holiday' | 'other';
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  class_id?: string;
  is_public: boolean;
  color: string;
  icon?: string;
  created_by: string;
  created_by_name?: string;
  participants_count: number;
  requires_permission: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'attended' | 'absent' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export function useEvents(classId?: string) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userClassId, setUserClassId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserClassId();
    }
  }, [user]);

  useEffect(() => {
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId || user?.role === 'admin') {
      fetchAllData(effectiveClassId);
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

  const fetchAllData = async (effectiveClassId?: string | null) => {
    try {
      setLoading(true);
      await Promise.all([
        fetchEvents(effectiveClassId),
        user ? fetchParticipants() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('Error fetching events data:', error);
      toast.error('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async (effectiveClassId?: string | null) => {
    let query = supabase
      .from('events')
      .select(`
        *,
        users!events_created_by_fkey(name)
      `)
      .order('event_date', { ascending: true });

    if (effectiveClassId) {
      query = query.or(`class_id.eq.${effectiveClassId},class_id.is.null,is_public.eq.true`);
    } else if (user?.role !== 'admin') {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    const eventsWithNames = (data || []).map((event: any) => ({
      ...event,
      created_by_name: event.users?.name,
    }));

    setEvents(eventsWithNames);
  };

  const fetchParticipants = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('event_participants')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    setParticipants(data || []);
  };

  const subscribeToChanges = () => {
    const eventsChannel = supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          const effectiveClassId = classId || userClassId;
          fetchEvents(effectiveClassId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
    };
  };

  const createEvent = async (data: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'participants_count'>) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return null;
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        ...data,
        created_by: user.id,
        participants_count: 0,
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la création de l\'événement');
      throw error;
    }

    toast.success('Événement créé avec succès');
    const effectiveClassId = classId || userClassId;
    await fetchEvents(effectiveClassId);
    return event;
  };

  const updateEvent = async (id: string, data: Partial<Event>) => {
    const { error } = await supabase
      .from('events')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour de l\'événement');
      throw error;
    }

    toast.success('Événement mis à jour');
    const effectiveClassId = classId || userClassId;
    await fetchEvents(effectiveClassId);
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression de l\'événement');
      throw error;
    }

    toast.success('Événement supprimé');
    const effectiveClassId = classId || userClassId;
    await fetchEvents(effectiveClassId);
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    const { error } = await supabase
      .from('event_participants')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status: 'registered',
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Vous êtes déjà inscrit à cet événement');
      } else {
        toast.error('Erreur lors de l\'inscription');
      }
      throw error;
    }

    toast.success('Inscription confirmée');
    await fetchParticipants();
    const effectiveClassId = classId || userClassId;
    await fetchEvents(effectiveClassId);
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!user) return;

    const participant = participants.find(
      p => p.event_id === eventId && p.user_id === user.id
    );

    if (!participant) return;

    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('id', participant.id);

    if (error) {
      toast.error('Erreur lors de la désinscription');
      throw error;
    }

    toast.success('Désinscription confirmée');
    await fetchParticipants();
    const effectiveClassId = classId || userClassId;
    await fetchEvents(effectiveClassId);
  };

  const isRegistered = (eventId: string): boolean => {
    if (!user) return false;
    return participants.some(p => p.event_id === eventId && p.user_id === user.id);
  };

  const getUpcomingEvents = (limit?: number): Event[] => {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = events.filter(e =>
      e.event_date >= today && e.status === 'upcoming'
    );
    return limit ? upcoming.slice(0, limit) : upcoming;
  };

  const getPastEvents = (limit?: number): Event[] => {
    const today = new Date().toISOString().split('T')[0];
    const past = events.filter(e =>
      e.event_date < today || e.status === 'completed'
    ).reverse();
    return limit ? past.slice(0, limit) : past;
  };

  const getEventsByType = (type: string): Event[] => {
    return events.filter(e => e.event_type === type);
  };

  const getEventsByMonth = (year: number, month: number): Event[] => {
    return events.filter(e => {
      const eventDate = new Date(e.event_date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const getTodayEvents = (): Event[] => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.event_date === today);
  };

  const getThisWeekEvents = (): Event[] => {
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);

    const todayStr = today.toISOString().split('T')[0];
    const weekStr = weekFromNow.toISOString().split('T')[0];

    return events.filter(e => e.event_date >= todayStr && e.event_date <= weekStr);
  };

  const getThisMonthEvents = (): Event[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    return getEventsByMonth(year, month);
  };

  const formatEventDate = (date: string): string => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatEventTime = (time?: string): string => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const getEventDaysUntil = (date: string): number => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return {
    events,
    participants,
    loading,
    userClassId,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    isRegistered,
    getUpcomingEvents,
    getPastEvents,
    getEventsByType,
    getEventsByMonth,
    getTodayEvents,
    getThisWeekEvents,
    getThisMonthEvents,
    formatEventDate,
    formatEventTime,
    getEventDaysUntil,
    refetch: () => {
      const effectiveClassId = classId || userClassId;
      return fetchAllData(effectiveClassId);
    },
  };
}
