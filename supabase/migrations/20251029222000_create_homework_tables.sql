/*
  # Create homework tables

  1. New Tables
    - `homework_assignments`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Homework title
      - `description` (text) - Detailed description
      - `subject` (text) - Subject code (math, french, etc.)
      - `class_id` (uuid) - Foreign key to classes table
      - `teacher_id` (uuid) - Foreign key to users table (who assigned)
      - `curriculum_topic_id` (uuid, nullable) - Optional link to curriculum topic
      - `due_date` (date) - Due date
      - `due_time` (time, nullable) - Due time
      - `assigned_date` (date) - When it was assigned
      - `difficulty` (text) - Difficulty level: easy, medium, hard
      - `estimated_time_minutes` (integer) - Estimated time in minutes
      - `instructions` (text, nullable) - Additional instructions
      - `attachments` (jsonb, nullable) - File attachments metadata
      - `status` (text) - Status: active, completed, archived
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `homework_submissions`
      - `id` (uuid, primary key) - Unique identifier
      - `homework_id` (uuid) - Foreign key to homework_assignments
      - `student_id` (uuid) - Foreign key to users table
      - `status` (text) - Status: not_started, in_progress, submitted, late, graded
      - `submitted_at` (timestamptz, nullable) - Submission timestamp
      - `content` (text, nullable) - Student's work/answer
      - `attachments` (jsonb, nullable) - File attachments metadata
      - `grade` (decimal, nullable) - Grade received
      - `max_grade` (decimal, nullable) - Maximum possible grade
      - `feedback` (text, nullable) - Teacher feedback
      - `graded_at` (timestamptz, nullable) - When it was graded
      - `graded_by` (uuid, nullable) - Foreign key to users table (who graded)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Teachers can create and manage homework for their class
    - Students can view homework assigned to their class
    - Students can create/update their own submissions
    - Parents can view homework for their children

  3. Notes
    - difficulty: 'easy', 'medium', 'hard'
    - assignment status: 'active', 'completed', 'archived'
    - submission status: 'not_started', 'in_progress', 'submitted', 'late', 'graded'
*/

-- Homework assignments table
CREATE TABLE IF NOT EXISTS homework_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  subject text NOT NULL,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  curriculum_topic_id uuid REFERENCES curriculum_topics(id) ON DELETE SET NULL,
  due_date date NOT NULL,
  due_time time,
  assigned_date date NOT NULL DEFAULT CURRENT_DATE,
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_time_minutes integer DEFAULT 30,
  instructions text,
  attachments jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Homework submissions table
CREATE TABLE IF NOT EXISTS homework_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id uuid NOT NULL REFERENCES homework_assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'late', 'graded')),
  submitted_at timestamptz,
  content text,
  attachments jsonb,
  grade decimal(5,2),
  max_grade decimal(5,2),
  feedback text,
  graded_at timestamptz,
  graded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(homework_id, student_id)
);

-- Enable RLS
ALTER TABLE homework_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for homework_assignments
CREATE POLICY "Users can view homework for their class"
  ON homework_assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.class_id = homework_assignments.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can create homework"
  ON homework_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = homework_assignments.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can update homework"
  ON homework_assignments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = homework_assignments.class_id
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
        OR users.class_id = homework_assignments.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can delete homework"
  ON homework_assignments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = homework_assignments.class_id
      )
    )
  );

-- Policies for homework_submissions
CREATE POLICY "Users can view submissions for their class or own submissions"
  ON homework_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      LEFT JOIN homework_assignments ha ON ha.id = homework_submissions.homework_id
      WHERE u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        u.role IN ('teacher', 'admin')
        OR u.id = homework_submissions.student_id
        OR (u.role = 'parent' AND EXISTS (
          SELECT 1 FROM users children
          WHERE children.id = homework_submissions.student_id
          AND children.class_id = u.class_id
        ))
      )
    )
  );

CREATE POLICY "Students can create their own submissions"
  ON homework_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = homework_submissions.student_id
      AND users.role = 'student'
    )
  );

CREATE POLICY "Students can update their own submissions"
  ON homework_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.id = homework_submissions.student_id
        OR users.role IN ('teacher', 'admin')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.id = homework_submissions.student_id
        OR users.role IN ('teacher', 'admin')
      )
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_homework_assignments_class ON homework_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_teacher ON homework_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_due_date ON homework_assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_subject ON homework_assignments(subject);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_status ON homework_assignments(status);
CREATE INDEX IF NOT EXISTS idx_homework_submissions_homework ON homework_submissions(homework_id);
CREATE INDEX IF NOT EXISTS idx_homework_submissions_student ON homework_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_submissions_status ON homework_submissions(status);

-- Function to automatically create submissions for all students when homework is assigned
CREATE OR REPLACE FUNCTION create_homework_submissions()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO homework_submissions (homework_id, student_id, status)
  SELECT NEW.id, u.id, 'not_started'
  FROM users u
  WHERE u.class_id = NEW.class_id
  AND u.role = 'student'
  AND u.status = 'active';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create submissions when homework is assigned
DROP TRIGGER IF EXISTS create_homework_submissions_trigger ON homework_assignments;
CREATE TRIGGER create_homework_submissions_trigger
AFTER INSERT ON homework_assignments
FOR EACH ROW
EXECUTE FUNCTION create_homework_submissions();
