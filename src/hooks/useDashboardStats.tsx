import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';

interface DashboardStats {
  totalStudents: number;
  totalParents: number;
  totalTeachers: number;
  totalClasses: number;
  activeTeachers: number;
  connectedParentsRate: number;
  averageGrade: number | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalParents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    activeTeachers: 0,
    connectedParentsRate: 0,
    averageGrade: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResult, classesResult, gradesResult] = await Promise.all([
          supabase
            .from('users')
            .select('role, status, last_login')
            .eq('status', 'active'),
          supabase
            .from('classes')
            .select('id'),
          supabase
            .from('grades')
            .select('grade')
        ]);

        if (usersResult.error) throw usersResult.error;
        if (classesResult.error) throw classesResult.error;

        const users = usersResult.data || [];
        const students = users.filter(u => u.role === 'student');
        const parents = users.filter(u => u.role === 'parent');
        const teachers = users.filter(u => u.role === 'teacher');

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const activeTeachers = teachers.filter(
          t => t.last_login && new Date(t.last_login) > oneWeekAgo
        ).length;

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const connectedParents = parents.filter(
          p => p.last_login && new Date(p.last_login) > oneMonthAgo
        ).length;
        const connectedParentsRate = parents.length > 0
          ? Math.round((connectedParents / parents.length) * 100)
          : 0;

        let averageGrade = null;
        if (!gradesResult.error && gradesResult.data && gradesResult.data.length > 0) {
          const validGrades = gradesResult.data
            .map(g => parseFloat(g.grade))
            .filter(g => !isNaN(g) && g > 0);

          if (validGrades.length > 0) {
            const sum = validGrades.reduce((acc, g) => acc + g, 0);
            averageGrade = Math.round((sum / validGrades.length) * 10) / 10;
          }
        }

        setStats({
          totalStudents: students.length,
          totalParents: parents.length,
          totalTeachers: teachers.length,
          totalClasses: classesResult.data?.length || 0,
          activeTeachers,
          connectedParentsRate,
          averageGrade,
          loading: false,
          error: null
        });
      } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}
