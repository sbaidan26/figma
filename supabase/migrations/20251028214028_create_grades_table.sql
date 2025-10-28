/*
  # Create grades table

  1. New Tables
    - `grades`
      - `id` (uuid, primary key) - Unique identifier for each grade entry
      - `evaluation_id` (uuid) - Foreign key to evaluations table
      - `student_id` (uuid) - Foreign key to users table (student)
      - `student_name` (text) - Name of the student (denormalized)
      - `grade` (numeric, nullable) - The grade obtained (nullable if not yet graded)
      - `comment` (text, nullable) - Teacher's comment on the grade
      - `graded_by` (uuid) - Foreign key to users table (teacher who graded)
      - `graded_at` (timestamptz, nullable) - When the grade was entered
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `grades` table
    - Teachers can create and update grades for their class students
    - Students can read their own grades
    - Parents can read their children's grades
    - Admins have full access

  3. Constraints
    - Unique constraint on (evaluation_id, student_id) to prevent duplicate grades
*/

CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  grade numeric CHECK (grade IS NULL OR grade >= 0),
  comment text,
  graded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  graded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(evaluation_id, student_id)
);

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create grades for their class"
  ON grades
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN evaluations e ON e.id = evaluation_id
      WHERE u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND u.role = 'teacher'
      AND u.class_id = e.class_id
    )
  );

CREATE POLICY "Users can read relevant grades"
  ON grades
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        u.role = 'admin'
        OR (u.role = 'student' AND u.id = grades.student_id)
        OR (u.role = 'parent' AND grades.student_id = ANY(u.children::uuid[]))
        OR (u.role = 'teacher' AND EXISTS (
          SELECT 1 FROM evaluations e
          WHERE e.id = grades.evaluation_id
          AND e.class_id = u.class_id
        ))
      )
    )
  );

CREATE POLICY "Teachers can update grades for their class"
  ON grades
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN evaluations e ON e.id = evaluation_id
      WHERE u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND u.role = 'teacher'
      AND u.class_id = e.class_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN evaluations e ON e.id = evaluation_id
      WHERE u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND u.role = 'teacher'
      AND u.class_id = e.class_id
    )
  );

CREATE POLICY "Teachers and admins can delete grades"
  ON grades
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        u.role = 'admin'
        OR (u.role = 'teacher' AND u.id = graded_by)
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_grades_evaluation_id ON grades(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_graded_by ON grades(graded_by);
