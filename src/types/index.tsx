// User and Auth Types
export type UserRole = 'teacher' | 'parent' | 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  metadata?: {
    classId?: string;
    className?: string;
    childrenIds?: string[];
    schoolId?: string;
  };
}

// Board/Pancarte Types
export interface Board {
  id: string;
  title: string;
  description: string;
  type: 'announcement' | 'homework' | 'resource' | 'event';
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  classId?: string;
  attachments?: string[];
  tags?: string[];
  pinned?: boolean;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId?: string;
  recipientName?: string;
  subject: string;
  content: string;
  read: boolean;
  moderated?: boolean;
  createdAt: string;
  attachments?: string[];
  type: 'school-family' | 'student-messaging';
}

// Liaison Types
export interface LiaisonEntry {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'information' | 'event' | 'authorization';
  createdBy: string;
  createdByName: string;
  classId: string;
  createdAt: string;
  signatures?: {
    userId: string;
    userName: string;
    signedAt: string;
  }[];
  requiresSignature: boolean;
}

// Homework Types
export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  classId: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  attachments?: string[];
  submissions?: {
    studentId: string;
    studentName: string;
    submittedAt: string;
    files?: string[];
    grade?: number;
    feedback?: string;
  }[];
}

// Course Resource Types
export interface CourseResource {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  classId: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  tags?: string[];
}

// Schedule Types
export interface ScheduleEntry {
  id: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
  subject: string;
  teacher?: string;
  room?: string;
  classId: string;
  color?: string;
}

// Grade/Evaluation Types
export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  title: string;
  grade: number;
  maxGrade: number;
  type: 'test' | 'quiz' | 'homework' | 'project' | 'participation';
  date: string;
  classId: string;
  teacherId: string;
  teacherName: string;
  comment?: string;
  term: 'Q1' | 'Q2' | 'Q3' | 'Q4';
}

// Class Management Types
export interface ClassInfo {
  id: string;
  name: string;
  level: string;
  teacherId: string;
  teacherName: string;
  year: string;
  studentCount: number;
  createdAt: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: 'school' | 'class' | 'personal';
  classId?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}
