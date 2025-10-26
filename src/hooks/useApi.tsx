import { useState, useCallback } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useAuth } from '../contexts/AuthContext';

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9846636e`;

export const useApi = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    return session?.access_token || publicAnonKey;
  };

  const request = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${serverUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('API Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Boards
  const createBoard = useCallback((boardData: any) => {
    return request('/boards', {
      method: 'POST',
      body: JSON.stringify(boardData)
    });
  }, [request]);

  const getBoards = useCallback(() => {
    return request('/boards');
  }, [request]);

  const updateBoard = useCallback((boardId: string, updates: any) => {
    return request(`/boards/${boardId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }, [request]);

  const deleteBoard = useCallback((boardId: string) => {
    return request(`/boards/${boardId}`, {
      method: 'DELETE'
    });
  }, [request]);

  // Messages
  const createMessage = useCallback((messageData: any) => {
    return request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }, [request]);

  const getMessages = useCallback((type?: 'sent' | 'received') => {
    const query = type ? `?type=${type}` : '';
    return request(`/messages${query}`);
  }, [request]);

  const markMessageAsRead = useCallback((messageId: string) => {
    return request(`/messages/${messageId}/read`, {
      method: 'PUT'
    });
  }, [request]);

  // Homework
  const createHomework = useCallback((homeworkData: any) => {
    return request('/homework', {
      method: 'POST',
      body: JSON.stringify(homeworkData)
    });
  }, [request]);

  const getHomework = useCallback(() => {
    return request('/homework');
  }, [request]);

  const submitHomework = useCallback((homeworkId: string, submissionData: any) => {
    return request(`/homework/${homeworkId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    });
  }, [request]);

  // Grades
  const createGrade = useCallback((gradeData: any) => {
    return request('/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData)
    });
  }, [request]);

  const getGrades = useCallback((studentId?: string) => {
    const query = studentId ? `?studentId=${studentId}` : '';
    return request(`/grades${query}`);
  }, [request]);

  // Schedule
  const createScheduleEntry = useCallback((scheduleData: any) => {
    return request('/schedule', {
      method: 'POST',
      body: JSON.stringify(scheduleData)
    });
  }, [request]);

  const getSchedule = useCallback((classId?: string) => {
    const query = classId ? `?classId=${classId}` : '';
    return request(`/schedule${query}`);
  }, [request]);

  // Resources
  const createResource = useCallback((resourceData: any) => {
    return request('/resources', {
      method: 'POST',
      body: JSON.stringify(resourceData)
    });
  }, [request]);

  const getResources = useCallback(() => {
    return request('/resources');
  }, [request]);

  // Liaison
  const createLiaisonEntry = useCallback((liaisonData: any) => {
    return request('/liaison', {
      method: 'POST',
      body: JSON.stringify(liaisonData)
    });
  }, [request]);

  const getLiaison = useCallback(() => {
    return request('/liaison');
  }, [request]);

  const signLiaisonEntry = useCallback((entryId: string) => {
    return request(`/liaison/${entryId}/sign`, {
      method: 'POST'
    });
  }, [request]);

  // Classes
  const createClass = useCallback((classData: any) => {
    return request('/classes', {
      method: 'POST',
      body: JSON.stringify(classData)
    });
  }, [request]);

  const getClasses = useCallback(() => {
    return request('/classes');
  }, [request]);

  // Attendance
  const createAttendanceRecord = useCallback((attendanceData: any) => {
    return request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData)
    });
  }, [request]);

  const getAttendance = useCallback((params?: { studentId?: string; classId?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/attendance${query ? `?${query}` : ''}`);
  }, [request]);

  // Events
  const createEvent = useCallback((eventData: any) => {
    return request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }, [request]);

  const getEvents = useCallback(() => {
    return request('/events');
  }, [request]);

  // Users (Admin only)
  const getUsers = useCallback(() => {
    return request('/users');
  }, [request]);

  const deleteUser = useCallback((userId: string) => {
    return request(`/users/${userId}`, {
      method: 'DELETE'
    });
  }, [request]);

  // Profile
  const updateProfile = useCallback((updates: any) => {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }, [request]);

  return {
    loading,
    error,
    // Boards
    createBoard,
    getBoards,
    updateBoard,
    deleteBoard,
    // Messages
    createMessage,
    getMessages,
    markMessageAsRead,
    // Homework
    createHomework,
    getHomework,
    submitHomework,
    // Grades
    createGrade,
    getGrades,
    // Schedule
    createScheduleEntry,
    getSchedule,
    // Resources
    createResource,
    getResources,
    // Liaison
    createLiaisonEntry,
    getLiaison,
    signLiaisonEntry,
    // Classes
    createClass,
    getClasses,
    // Attendance
    createAttendanceRecord,
    getAttendance,
    // Events
    createEvent,
    getEvents,
    // Users
    getUsers,
    deleteUser,
    // Profile
    updateProfile
  };
};
