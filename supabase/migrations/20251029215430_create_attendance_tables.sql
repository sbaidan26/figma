/*
  # Create attendance tables

  1. New Tables
    - `attendance_records`
      - `id` (uuid, primary key) - Unique identifier for each attendance record
      - `date` (date) - Date of the attendance
      - `class_id` (uuid) - Foreign key to classes table
      - `schedule_entry_id` (uuid, nullable) - Optional link to schedule entry
      - `course_name` (text) - Name of the course/session
      - `teacher_id` (uuid) - Foreign key to users table (teacher who took attendance)
      - `notes` (text, nullable) - Additional notes about the session
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `attendance_entries`
      - `id` (uuid, primary key) - Unique identifier
      - `attendance_record_id` (uuid) - Foreign key to attendance_records
      - `student_id` (uuid) - Foreign key to users table
      - `status` (text) - Status: present, absent, late, excused
      - `arrival_time` (time, nullable) - Time of arrival (for late status)
      - `justification` (text, nullable) - Justification for absence
      - `justification_provided_at` (timestamptz, nullable) - When justification was provided
      - `notes` (text, nullable) - Additional notes
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `attendance_justifications`
      - `id` (uuid, primary key) - Unique identifier
      - `attendance_entry_id` (uuid) - Foreign key to attendance_entries
      - `student_id` (uuid) - Foreign key to users table
      - `parent_id` (uuid, nullable) - Foreign key to users table (parent who provided justification)
      - `justification_text` (text) - The justification provided
      - `status` (text) - Status: pending, approved, rejected
      - `reviewed_by` (uuid, nullable) - Foreign key to users table (who reviewed)
      - `reviewed_at` (timestamptz, nullable) - When it was reviewed
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Teachers and admins can create and manage attendance
    - Students and parents can view their own attendance
    - Parents can submit justifications
    - Teachers and admins can approve/reject justifications

  3. Notes
    - status: 'present', 'absent', 'late', 'excused'
    - justification_status: 'pending', 'approved', 'rejected'
*/

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  schedule_entry_id uuid REFERENCES schedule_entries(id) ON DELETE SET NULL,
  course_name text NOT NULL,
  teacher_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attendance entries table
CREATE TABLE IF NOT EXISTS attendance_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_record_id uuid NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  arrival_time time,
  justification text,
  justification_provided_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(attendance_record_id, student_id)
);

-- Attendance justifications table
CREATE TABLE IF NOT EXISTS attendance_justifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_entry_id uuid NOT NULL REFERENCES attendance_entries(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES users(id) ON DELETE SET NULL,
  justification_text text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_justifications ENABLE ROW LEVEL SECURITY;

-- Policies for attendance_records
CREATE POLICY "Users can read attendance for their class"
  ON attendance_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.class_id = attendance_records.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can create attendance"
  ON attendance_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = attendance_records.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can update attendance"
  ON attendance_records
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = attendance_records.class_id
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = attendance_records.class_id
      )
    )
  );

-- Policies for attendance_entries
CREATE POLICY "Users can read attendance entries for their class"
  ON attendance_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN attendance_records ar ON ar.id = attendance_entries.attendance_record_id
      WHERE u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        u.role = 'admin'
        OR u.class_id = ar.class_id
        OR u.id = attendance_entries.student_id
        OR (u.role = 'parent' AND EXISTS (
          SELECT 1 FROM users children
          WHERE children.id = attendance_entries.student_id
          AND children.class_id = u.class_id
        ))
      )
    )
  );

CREATE POLICY "Teachers and admins can manage attendance entries"
  ON attendance_entries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN attendance_records ar ON ar.id = attendance_entries.attendance_record_id
      WHERE u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND u.role IN ('teacher', 'admin')
      AND (
        u.role = 'admin'
        OR u.class_id = ar.class_id
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN attendance_records ar ON ar.id = attendance_entries.attendance_record_id
      WHERE u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND u.role IN ('teacher', 'admin')
      AND (
        u.role = 'admin'
        OR u.class_id = ar.class_id
      )
    )
  );

-- Policies for attendance_justifications
CREATE POLICY "Users can read justifications for their class or children"
  ON attendance_justifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role IN ('teacher', 'admin')
        OR users.id = attendance_justifications.student_id
        OR users.id = attendance_justifications.parent_id
      )
    )
  );

CREATE POLICY "Parents and students can create justifications"
  ON attendance_justifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.id = attendance_justifications.student_id
        OR users.id = attendance_justifications.parent_id
        OR users.role IN ('teacher', 'admin')
      )
    )
  );

CREATE POLICY "Teachers and admins can update justifications"
  ON attendance_justifications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attendance_records_class_date ON attendance_records(class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_teacher ON attendance_records(teacher_id);
CREATE INDEX IF NOT EXISTS idx_attendance_entries_record ON attendance_entries(attendance_record_id);
CREATE INDEX IF NOT EXISTS idx_attendance_entries_student ON attendance_entries(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_entries_status ON attendance_entries(status);
CREATE INDEX IF NOT EXISTS idx_attendance_justifications_entry ON attendance_justifications(attendance_entry_id);
CREATE INDEX IF NOT EXISTS idx_attendance_justifications_student ON attendance_justifications(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_justifications_status ON attendance_justifications(status);
