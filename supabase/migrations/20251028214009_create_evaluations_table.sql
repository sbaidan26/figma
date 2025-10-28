/*
  # Create evaluations table

  1. New Tables
    - `evaluations`
      - `id` (uuid, primary key) - Unique identifier for each evaluation
      - `title` (text) - Title/name of the evaluation
      - `description` (text, nullable) - Description or details about the evaluation
      - `subject` (text) - Subject of the evaluation (math, french, science, etc.)
      - `type` (text) - Type of evaluation: test, quiz, homework, project, oral
      - `date` (date) - Date of the evaluation
      - `max_grade` (numeric) - Maximum possible grade (e.g., 20)
      - `coefficient` (numeric) - Weight/coefficient for average calculation
      - `class_id` (uuid) - Foreign key to classes table
      - `teacher_id` (uuid) - Foreign key to users table (teacher who created it)
      - `teacher_name` (text) - Name of the teacher (denormalized)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `evaluations` table
    - Teachers can create evaluations for their classes
    - Teachers can read/update/delete their own evaluations
    - Students and parents can read evaluations for their class
    - Admins have full access
*/

CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL CHECK (subject IN ('math', 'french', 'science', 'history', 'geography', 'english', 'arabic', 'islamic_studies', 'physical_education', 'arts', 'music')),
  type text NOT NULL CHECK (type IN ('test', 'quiz', 'homework', 'project', 'oral', 'participation')),
  date date NOT NULL,
  max_grade numeric NOT NULL DEFAULT 20 CHECK (max_grade > 0),
  coefficient numeric NOT NULL DEFAULT 1 CHECK (coefficient > 0),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teacher_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create evaluations for their classes"
  ON evaluations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role = 'teacher'
      AND users.class_id = evaluations.class_id
    )
  );

CREATE POLICY "Teachers can read their class evaluations"
  ON evaluations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR (users.role = 'teacher' AND users.class_id = evaluations.class_id)
        OR (users.role IN ('student', 'parent') AND users.class_id = evaluations.class_id)
      )
    )
  );

CREATE POLICY "Teachers can update their own evaluations"
  ON evaluations
  FOR UPDATE
  TO authenticated
  USING (
    teacher_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    teacher_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Teachers and admins can delete evaluations"
  ON evaluations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR (users.role = 'teacher' AND users.id = evaluations.teacher_id)
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_evaluations_class_id ON evaluations(class_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_teacher_id ON evaluations(teacher_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_date ON evaluations(date DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_subject ON evaluations(subject);
