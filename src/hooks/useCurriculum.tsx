import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface CurriculumSubject {
  id: string;
  name: string;
  code: string;
  description?: string;
  color?: string;
  icon?: string;
  class_id?: string;
  level: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface CurriculumTopic {
  id: string;
  subject_id: string;
  title: string;
  description?: string;
  objectives?: string[];
  week_number?: number;
  duration_hours?: number;
  order_index: number;
  resources?: any;
  created_at: string;
  updated_at: string;
}

interface CurriculumProgress {
  id: string;
  topic_id: string;
  class_id: string;
  teacher_id?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_date?: string;
  completion_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface StudentProgress {
  id: string;
  topic_id: string;
  student_id: string;
  status: 'not_started' | 'in_progress' | 'mastered';
  mastery_level: number;
  last_assessed?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useCurriculum(classId?: string) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<CurriculumSubject[]>([]);
  const [topics, setTopics] = useState<CurriculumTopic[]>([]);
  const [progress, setProgress] = useState<CurriculumProgress[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
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
        fetchSubjects(effectiveClassId),
        fetchProgress(effectiveClassId),
        user?.role === 'student' ? fetchStudentProgress(user.id) : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('Error fetching curriculum data:', error);
      toast.error('Erreur lors du chargement du programme');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (effectiveClassId: string) => {
    const { data, error } = await supabase
      .from('curriculum_subjects')
      .select('*')
      .or(`class_id.eq.${effectiveClassId},class_id.is.null`)
      .order('order_index');

    if (error) throw error;
    setSubjects(data || []);

    if (data && data.length > 0) {
      await fetchTopics(data.map(s => s.id));
    }
  };

  const fetchTopics = async (subjectIds: string[]) => {
    if (subjectIds.length === 0) return;

    const { data, error } = await supabase
      .from('curriculum_topics')
      .select('*')
      .in('subject_id', subjectIds)
      .order('order_index');

    if (error) throw error;
    setTopics(data || []);
  };

  const fetchProgress = async (effectiveClassId: string) => {
    const { data, error } = await supabase
      .from('curriculum_progress')
      .select('*')
      .eq('class_id', effectiveClassId);

    if (error) throw error;
    setProgress(data || []);
  };

  const fetchStudentProgress = async (studentId: string) => {
    const { data, error } = await supabase
      .from('curriculum_student_progress')
      .select('*')
      .eq('student_id', studentId);

    if (error) throw error;
    setStudentProgress(data || []);
  };

  const subscribeToChanges = () => {
    const subjectsChannel = supabase
      .channel('curriculum_subjects_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'curriculum_subjects' },
        () => {
          const effectiveClassId = classId || userClassId;
          if (effectiveClassId) fetchSubjects(effectiveClassId);
        }
      )
      .subscribe();

    const topicsChannel = supabase
      .channel('curriculum_topics_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'curriculum_topics' },
        () => {
          if (subjects.length > 0) {
            fetchTopics(subjects.map(s => s.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subjectsChannel);
      supabase.removeChannel(topicsChannel);
    };
  };

  const createSubject = async (data: Omit<CurriculumSubject, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('curriculum_subjects')
      .insert(data);

    if (error) {
      toast.error('Erreur lors de la création de la matière');
      throw error;
    }

    toast.success('Matière créée avec succès');
    const effectiveClassId = classId || userClassId;
    if (effectiveClassId) {
      await fetchSubjects(effectiveClassId);
    }
  };

  const createTopic = async (data: Omit<CurriculumTopic, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('curriculum_topics')
      .insert(data);

    if (error) {
      toast.error('Erreur lors de la création du sujet');
      throw error;
    }

    toast.success('Sujet ajouté avec succès');
    await fetchTopics([data.subject_id]);
  };

  const updateTopic = async (topicId: string, data: Partial<CurriculumTopic>) => {
    const { error } = await supabase
      .from('curriculum_topics')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', topicId);

    if (error) {
      toast.error('Erreur lors de la mise à jour du sujet');
      throw error;
    }

    toast.success('Sujet mis à jour');
    if (subjects.length > 0) {
      await fetchTopics(subjects.map(s => s.id));
    }
  };

  const deleteTopic = async (topicId: string) => {
    const { error } = await supabase
      .from('curriculum_topics')
      .delete()
      .eq('id', topicId);

    if (error) {
      toast.error('Erreur lors de la suppression du sujet');
      throw error;
    }

    toast.success('Sujet supprimé');
    if (subjects.length > 0) {
      await fetchTopics(subjects.map(s => s.id));
    }
  };

  const updateProgress = async (
    topicId: string,
    effectiveClassId: string,
    data: {
      status: 'not_started' | 'in_progress' | 'completed';
      completion_percentage?: number;
      completion_date?: string;
      notes?: string;
    }
  ) => {
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    const existingProgress = progress.find(
      p => p.topic_id === topicId && p.class_id === effectiveClassId
    );

    if (existingProgress) {
      const { error } = await supabase
        .from('curriculum_progress')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id);

      if (error) {
        toast.error('Erreur lors de la mise à jour du progrès');
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('curriculum_progress')
        .insert({
          topic_id: topicId,
          class_id: effectiveClassId,
          teacher_id: user.id,
          ...data,
        });

      if (error) {
        toast.error('Erreur lors de la création du progrès');
        throw error;
      }
    }

    toast.success('Progrès mis à jour');
    await fetchProgress(effectiveClassId);
  };

  const updateStudentProgress = async (
    topicId: string,
    studentId: string,
    data: {
      status: 'not_started' | 'in_progress' | 'mastered';
      mastery_level?: number;
      last_assessed?: string;
      notes?: string;
    }
  ) => {
    const existingProgress = studentProgress.find(
      p => p.topic_id === topicId && p.student_id === studentId
    );

    if (existingProgress) {
      const { error } = await supabase
        .from('curriculum_student_progress')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id);

      if (error) {
        toast.error('Erreur lors de la mise à jour du progrès élève');
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('curriculum_student_progress')
        .insert({
          topic_id: topicId,
          student_id: studentId,
          ...data,
        });

      if (error) {
        toast.error('Erreur lors de la création du progrès élève');
        throw error;
      }
    }

    toast.success('Progrès élève mis à jour');
    await fetchStudentProgress(studentId);
  };

  const getTopicsForSubject = (subjectId: string): CurriculumTopic[] => {
    return topics.filter(t => t.subject_id === subjectId);
  };

  const getProgressForTopic = (topicId: string, effectiveClassId: string): CurriculumProgress | undefined => {
    return progress.find(p => p.topic_id === topicId && p.class_id === effectiveClassId);
  };

  const getStudentProgressForTopic = (topicId: string, studentId: string): StudentProgress | undefined => {
    return studentProgress.find(p => p.topic_id === topicId && p.student_id === studentId);
  };

  const calculateSubjectProgress = (subjectId: string, effectiveClassId: string) => {
    const subjectTopics = getTopicsForSubject(subjectId);
    if (subjectTopics.length === 0) return 0;

    const completedTopics = subjectTopics.filter(topic => {
      const prog = getProgressForTopic(topic.id, effectiveClassId);
      return prog?.status === 'completed';
    }).length;

    return Math.round((completedTopics / subjectTopics.length) * 100);
  };

  return {
    subjects,
    topics,
    progress,
    studentProgress,
    loading,
    userClassId,
    createSubject,
    createTopic,
    updateTopic,
    deleteTopic,
    updateProgress,
    updateStudentProgress,
    getTopicsForSubject,
    getProgressForTopic,
    getStudentProgressForTopic,
    calculateSubjectProgress,
    refetch: () => {
      const effectiveClassId = classId || userClassId;
      if (effectiveClassId) {
        return fetchAllData(effectiveClassId);
      }
    },
  };
}
