import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface HomeworkAssignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  class_id: string;
  teacher_id: string;
  curriculum_topic_id?: string;
  due_date: string;
  due_time?: string;
  assigned_date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time_minutes: number;
  instructions?: string;
  attachments?: any;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

interface HomeworkSubmission {
  id: string;
  homework_id: string;
  student_id: string;
  student_name?: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'late' | 'graded';
  submitted_at?: string;
  content?: string;
  attachments?: any;
  grade?: number;
  max_grade?: number;
  feedback?: string;
  graded_at?: string;
  graded_by?: string;
  created_at: string;
  updated_at: string;
}

export function useHomework(classId?: string) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>([]);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
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

  const fetchAllData = async (effectiveClassId: string) => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAssignments(effectiveClassId),
        fetchSubmissions(effectiveClassId),
      ]);
    } catch (error) {
      console.error('Error fetching homework data:', error);
      toast.error('Erreur lors du chargement des devoirs');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (effectiveClassId: string) => {
    const { data, error } = await supabase
      .from('homework_assignments')
      .select('*')
      .eq('class_id', effectiveClassId)
      .order('due_date', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    setAssignments(data || []);
  };

  const fetchSubmissions = async (effectiveClassId: string) => {
    const query = supabase
      .from('homework_submissions')
      .select(`
        *,
        users!homework_submissions_student_id_fkey(name)
      `);

    if (user?.role === 'student') {
      query.eq('student_id', user.id);
    } else {
      const { data: homeworkIds } = await supabase
        .from('homework_assignments')
        .select('id')
        .eq('class_id', effectiveClassId);

      if (homeworkIds && homeworkIds.length > 0) {
        query.in('homework_id', homeworkIds.map(h => h.id));
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    const submissionsWithNames = (data || []).map((sub: any) => ({
      ...sub,
      student_name: sub.users?.name,
    }));

    setSubmissions(submissionsWithNames);
  };

  const subscribeToChanges = () => {
    const assignmentsChannel = supabase
      .channel('homework_assignments_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'homework_assignments' },
        () => {
          const effectiveClassId = classId || userClassId;
          if (effectiveClassId) fetchAssignments(effectiveClassId);
        }
      )
      .subscribe();

    const submissionsChannel = supabase
      .channel('homework_submissions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'homework_submissions' },
        () => {
          const effectiveClassId = classId || userClassId;
          if (effectiveClassId) fetchSubmissions(effectiveClassId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(assignmentsChannel);
      supabase.removeChannel(submissionsChannel);
    };
  };

  const createAssignment = async (data: Omit<HomeworkAssignment, 'id' | 'created_at' | 'updated_at' | 'teacher_id'>) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return null;
    }

    const { data: assignment, error } = await supabase
      .from('homework_assignments')
      .insert({
        ...data,
        teacher_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la création du devoir');
      throw error;
    }

    toast.success('Devoir créé avec succès');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchAssignments(effectiveClassId);
    }
    return assignment;
  };

  const updateAssignment = async (id: string, data: Partial<HomeworkAssignment>) => {
    const { error } = await supabase
      .from('homework_assignments')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour du devoir');
      throw error;
    }

    toast.success('Devoir mis à jour');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchAssignments(effectiveClassId);
    }
  };

  const deleteAssignment = async (id: string) => {
    const { error } = await supabase
      .from('homework_assignments')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression du devoir');
      throw error;
    }

    toast.success('Devoir supprimé');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchAssignments(effectiveClassId);
    }
  };

  const submitHomework = async (homeworkId: string, content?: string, attachments?: any) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    const submission = submissions.find(s => s.homework_id === homeworkId && s.student_id === user.id);

    const updateData = {
      status: 'submitted' as const,
      submitted_at: new Date().toISOString(),
      content,
      attachments,
      updated_at: new Date().toISOString(),
    };

    if (submission) {
      const { error } = await supabase
        .from('homework_submissions')
        .update(updateData)
        .eq('id', submission.id);

      if (error) {
        toast.error('Erreur lors de la soumission du devoir');
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('homework_submissions')
        .insert({
          homework_id: homeworkId,
          student_id: user.id,
          ...updateData,
        });

      if (error) {
        toast.error('Erreur lors de la soumission du devoir');
        throw error;
      }
    }

    toast.success('Devoir soumis avec succès');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchSubmissions(effectiveClassId);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: HomeworkSubmission['status']) => {
    const { error } = await supabase
      .from('homework_submissions')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (error) {
      toast.error('Erreur lors de la mise à jour du statut');
      throw error;
    }

    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchSubmissions(effectiveClassId);
    }
  };

  const gradeSubmission = async (
    submissionId: string,
    grade: number,
    maxGrade: number,
    feedback?: string
  ) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    const { error } = await supabase
      .from('homework_submissions')
      .update({
        grade,
        max_grade: maxGrade,
        feedback,
        status: 'graded',
        graded_at: new Date().toISOString(),
        graded_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (error) {
      toast.error('Erreur lors de la notation');
      throw error;
    }

    toast.success('Note enregistrée avec succès');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchSubmissions(effectiveClassId);
    }
  };

  const getSubmissionsForHomework = (homeworkId: string): HomeworkSubmission[] => {
    return submissions.filter(s => s.homework_id === homeworkId);
  };

  const getSubmissionForStudent = (homeworkId: string, studentId: string): HomeworkSubmission | undefined => {
    return submissions.find(s => s.homework_id === homeworkId && s.student_id === studentId);
  };

  const getHomeworkStats = (homeworkId: string) => {
    const homeworkSubmissions = getSubmissionsForHomework(homeworkId);
    return {
      total: homeworkSubmissions.length,
      submitted: homeworkSubmissions.filter(s => s.status === 'submitted' || s.status === 'graded').length,
      graded: homeworkSubmissions.filter(s => s.status === 'graded').length,
      not_started: homeworkSubmissions.filter(s => s.status === 'not_started').length,
      in_progress: homeworkSubmissions.filter(s => s.status === 'in_progress').length,
      late: homeworkSubmissions.filter(s => s.status === 'late').length,
    };
  };

  const getUpcomingHomework = (limit = 5) => {
    const today = new Date().toISOString().split('T')[0];
    return assignments
      .filter(a => a.due_date >= today && a.status === 'active')
      .slice(0, limit);
  };

  const getOverdueHomework = () => {
    const today = new Date().toISOString().split('T')[0];
    return assignments.filter(a => a.due_date < today && a.status === 'active');
  };

  return {
    assignments,
    submissions,
    loading,
    userClassId,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitHomework,
    updateSubmissionStatus,
    gradeSubmission,
    getSubmissionsForHomework,
    getSubmissionForStudent,
    getHomeworkStats,
    getUpcomingHomework,
    getOverdueHomework,
    refetch: () => {
      const effectiveClassId = classId || userClassId;
      if (effectiveClassId) {
        return fetchAllData(effectiveClassId);
      }
    },
  };
}
