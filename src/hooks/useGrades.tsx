import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface Evaluation {
  id: string;
  title: string;
  description?: string;
  subject: string;
  type: string;
  date: string;
  max_grade: number;
  coefficient: number;
  class_id: string;
  teacher_id: string;
  teacher_name: string;
  created_at: string;
  updated_at: string;
}

interface Grade {
  id: string;
  evaluation_id: string;
  student_id: string;
  student_name: string;
  grade: number | null;
  comment?: string;
  graded_by?: string;
  graded_at?: string;
  created_at: string;
  updated_at: string;
}

interface Student {
  id: string;
  name: string;
  email?: string;
}

export function useGrades(classId?: string) {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
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
        fetchEvaluations(effectiveClassId),
        fetchGrades(effectiveClassId),
        fetchStudents(effectiveClassId),
      ]);
    } catch (error) {
      console.error('Error fetching grades data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluations = async (effectiveClassId: string) => {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('class_id', effectiveClassId)
      .order('date', { ascending: false });

    if (error) throw error;
    setEvaluations(data || []);
  };

  const fetchGrades = async (effectiveClassId: string) => {
    const { data, error } = await supabase
      .from('grades')
      .select(`
        *,
        evaluation:evaluations!inner(class_id)
      `)
      .eq('evaluation.class_id', effectiveClassId);

    if (error) throw error;
    setGrades(data || []);
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

  const subscribeToChanges = () => {
    const evaluationsChannel = supabase
      .channel('evaluations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'evaluations' },
        () => {
          const effectiveClassId = classId || userClassId;
          if (effectiveClassId) fetchEvaluations(effectiveClassId);
        }
      )
      .subscribe();

    const gradesChannel = supabase
      .channel('grades_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'grades' },
        () => {
          const effectiveClassId = classId || userClassId;
          if (effectiveClassId) fetchGrades(effectiveClassId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(evaluationsChannel);
      supabase.removeChannel(gradesChannel);
    };
  };

  const createEvaluation = async (data: Omit<Evaluation, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('evaluations')
      .insert(data);

    if (error) {
      toast.error('Erreur lors de la création de l\'évaluation');
      throw error;
    }

    toast.success('Évaluation créée avec succès');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchEvaluations(effectiveClassId);
    }
  };

  const updateEvaluation = async (id: string, data: Partial<Evaluation>) => {
    const { error } = await supabase
      .from('evaluations')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour de l\'évaluation');
      throw error;
    }

    toast.success('Évaluation mise à jour');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchEvaluations(effectiveClassId);
    }
  };

  const deleteEvaluation = async (id: string) => {
    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression de l\'évaluation');
      throw error;
    }

    toast.success('Évaluation supprimée');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchEvaluations(effectiveClassId);
    }
  };

  const saveGrade = async (evaluationId: string, studentId: string, grade: number | null, comment?: string) => {
    if (!user) return;

    const gradeData = {
      evaluation_id: evaluationId,
      student_id: studentId,
      student_name: students.find(s => s.id === studentId)?.name || '',
      grade,
      comment,
      graded_by: user.id,
      graded_at: grade !== null ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('grades')
      .upsert(gradeData, {
        onConflict: 'evaluation_id,student_id',
      });

    if (error) {
      toast.error('Erreur lors de la sauvegarde de la note');
      throw error;
    }

    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchGrades(effectiveClassId);
    }
  };

  const saveMultipleGrades = async (gradesData: Array<{
    evaluationId: string;
    studentId: string;
    grade: number | null;
    comment?: string;
  }>) => {
    if (!user) return;

    const gradesToUpsert = gradesData.map(item => ({
      evaluation_id: item.evaluationId,
      student_id: item.studentId,
      student_name: students.find(s => s.id === item.studentId)?.name || '',
      grade: item.grade,
      comment: item.comment,
      graded_by: user.id,
      graded_at: item.grade !== null ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('grades')
      .upsert(gradesToUpsert, {
        onConflict: 'evaluation_id,student_id',
      });

    if (error) {
      toast.error('Erreur lors de la sauvegarde des notes');
      throw error;
    }

    toast.success('Notes enregistrées avec succès');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchGrades(effectiveClassId);
    }
  };

  const getGradeForStudent = (evaluationId: string, studentId: string): Grade | undefined => {
    return grades.find(g => g.evaluation_id === evaluationId && g.student_id === studentId);
  };

  const getGradesForEvaluation = (evaluationId: string): Grade[] => {
    return grades.filter(g => g.evaluation_id === evaluationId);
  };

  const getGradesForStudent = (studentId: string): Grade[] => {
    return grades.filter(g => g.student_id === studentId);
  };

  return {
    evaluations,
    grades,
    students,
    loading,
    userClassId,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    saveGrade,
    saveMultipleGrades,
    getGradeForStudent,
    getGradesForEvaluation,
    getGradesForStudent,
    refetch: () => {
      const effectiveClassId = classId || userClassId;
      if (effectiveClassId) {
        return fetchData(effectiveClassId);
      }
    },
  };
}
