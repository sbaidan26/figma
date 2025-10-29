import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface AttendanceRecord {
  id: string;
  date: string;
  class_id: string;
  schedule_entry_id?: string;
  course_name: string;
  teacher_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface AttendanceEntry {
  id: string;
  attendance_record_id: string;
  student_id: string;
  student_name?: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  arrival_time?: string;
  justification?: string;
  justification_provided_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface AttendanceJustification {
  id: string;
  attendance_entry_id: string;
  student_id: string;
  parent_id?: string;
  justification_text: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

interface Student {
  id: string;
  name: string;
  email?: string;
}

export function useAttendance(classId?: string) {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceEntries, setAttendanceEntries] = useState<AttendanceEntry[]>([]);
  const [justifications, setJustifications] = useState<AttendanceJustification[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
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
      fetchData(effectiveClassId);
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

  const fetchData = async (effectiveClassId: string) => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAttendanceRecords(effectiveClassId),
        fetchStudents(effectiveClassId),
        fetchJustifications(effectiveClassId),
      ]);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Erreur lors du chargement des présences');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = async (effectiveClassId: string) => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('class_id', effectiveClassId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    setAttendanceRecords(data || []);

    if (data && data.length > 0) {
      await fetchAttendanceEntries(data.map(r => r.id));
    }
  };

  const fetchAttendanceEntries = async (recordIds: string[]) => {
    if (recordIds.length === 0) return;

    const { data, error } = await supabase
      .from('attendance_entries')
      .select('*')
      .in('attendance_record_id', recordIds);

    if (error) throw error;
    setAttendanceEntries(data || []);
  };

  const fetchStudents = async (effectiveClassId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('class_id', effectiveClassId)
      .eq('role', 'student')
      .eq('status', 'active')
      .order('name');

    if (error) throw error;
    setStudents(data || []);
  };

  const fetchJustifications = async (effectiveClassId: string) => {
    const { data: records } = await supabase
      .from('attendance_records')
      .select('id')
      .eq('class_id', effectiveClassId);

    if (!records || records.length === 0) return;

    const { data: entries } = await supabase
      .from('attendance_entries')
      .select('id')
      .in('attendance_record_id', records.map(r => r.id));

    if (!entries || entries.length === 0) return;

    const { data, error } = await supabase
      .from('attendance_justifications')
      .select('*')
      .in('attendance_entry_id', entries.map(e => e.id))
      .order('created_at', { ascending: false });

    if (!error) {
      setJustifications(data || []);
    }
  };

  const subscribeToChanges = () => {
    const recordsChannel = supabase
      .channel('attendance_records_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_records' },
        () => {
          const effectiveClassId = classId || userClassId;
          if (effectiveClassId) fetchAttendanceRecords(effectiveClassId);
        }
      )
      .subscribe();

    const entriesChannel = supabase
      .channel('attendance_entries_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_entries' },
        () => {
          if (attendanceRecords.length > 0) {
            fetchAttendanceEntries(attendanceRecords.map(r => r.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(recordsChannel);
      supabase.removeChannel(entriesChannel);
    };
  };

  const createAttendanceRecord = async (data: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return null;
    }

    const { data: record, error } = await supabase
      .from('attendance_records')
      .insert({
        ...data,
        teacher_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la création de l\'appel');
      throw error;
    }

    toast.success('Appel créé avec succès');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchAttendanceRecords(effectiveClassId);
    }
    return record;
  };

  const saveAttendanceEntries = async (
    recordId: string,
    entries: Array<{
      student_id: string;
      status: 'present' | 'absent' | 'late' | 'excused';
      arrival_time?: string;
      notes?: string;
    }>
  ) => {
    const entriesWithNames = await Promise.all(
      entries.map(async (entry) => {
        const student = students.find(s => s.id === entry.student_id);
        return {
          attendance_record_id: recordId,
          student_id: entry.student_id,
          student_name: student?.name || '',
          status: entry.status,
          arrival_time: entry.arrival_time,
          notes: entry.notes,
          updated_at: new Date().toISOString(),
        };
      })
    );

    const { error } = await supabase
      .from('attendance_entries')
      .upsert(entriesWithNames, {
        onConflict: 'attendance_record_id,student_id',
      });

    if (error) {
      toast.error('Erreur lors de la sauvegarde des présences');
      throw error;
    }

    toast.success('Présences enregistrées avec succès');
    await fetchAttendanceEntries([recordId]);
  };

  const submitJustification = async (
    attendanceEntryId: string,
    studentId: string,
    justificationText: string,
    parentId?: string
  ) => {
    const { error } = await supabase
      .from('attendance_justifications')
      .insert({
        attendance_entry_id: attendanceEntryId,
        student_id: studentId,
        parent_id: parentId,
        justification_text: justificationText,
        status: 'pending',
      });

    if (error) {
      toast.error('Erreur lors de l\'envoi de la justification');
      throw error;
    }

    toast.success('Justification envoyée avec succès');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchJustifications(effectiveClassId);
    }
  };

  const reviewJustification = async (
    justificationId: string,
    status: 'approved' | 'rejected',
    reviewerId: string
  ) => {
    const { error } = await supabase
      .from('attendance_justifications')
      .update({
        status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', justificationId);

    if (error) {
      toast.error('Erreur lors de la révision de la justification');
      throw error;
    }

    if (status === 'approved') {
      const justification = justifications.find(j => j.id === justificationId);
      if (justification) {
        await supabase
          .from('attendance_entries')
          .update({
            status: 'excused',
            justification: justification.justification_text,
            justification_provided_at: new Date().toISOString(),
          })
          .eq('id', justification.attendance_entry_id);
      }
    }

    toast.success(`Justification ${status === 'approved' ? 'approuvée' : 'rejetée'}`);
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchJustifications(effectiveClassId);
      await fetchAttendanceRecords(effectiveClassId);
    }
  };

  const getEntriesForRecord = (recordId: string): AttendanceEntry[] => {
    return attendanceEntries.filter(e => e.attendance_record_id === recordId);
  };

  const getAttendanceStats = (recordId: string) => {
    const entries = getEntriesForRecord(recordId);
    return {
      total: entries.length,
      present: entries.filter(e => e.status === 'present').length,
      absent: entries.filter(e => e.status === 'absent').length,
      late: entries.filter(e => e.status === 'late').length,
      excused: entries.filter(e => e.status === 'excused').length,
    };
  };

  return {
    attendanceRecords,
    attendanceEntries,
    justifications,
    students,
    loading,
    userClassId,
    createAttendanceRecord,
    saveAttendanceEntries,
    submitJustification,
    reviewJustification,
    getEntriesForRecord,
    getAttendanceStats,
    refetch: () => {
      const effectiveClassId = classId || userClassId;
      if (effectiveClassId) {
        return fetchData(effectiveClassId);
      }
    },
  };
}
