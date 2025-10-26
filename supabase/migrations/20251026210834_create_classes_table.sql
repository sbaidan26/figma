/*
  # Create classes table for Madrasati

  1. New Tables
    - `classes`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the class (e.g., CM2-A)
      - `level` (text) - Level of the class (e.g., CM2, CM1, CE2)
      - `teacher_id` (uuid, nullable) - Foreign key to users table for the main teacher
      - `teacher_name` (text) - Name of the teacher (denormalized for display)
      - `student_count` (integer) - Number of students in the class
      - `subjects` (text[]) - Array of subjects taught in this class
      - `room` (text) - Room number/location
      - `status` (text) - Class status: active, inactive
      - `created_at` (timestamptz) - Record creation time
      - `updated_at` (timestamptz) - Last update time

  2. Security
    - Enable RLS on `classes` table
    - Add policy for admins to manage all classes
    - Add policy for teachers to read classes they teach
    - Add policy for authenticated users to read active classes

  3. Notes
    - The teacher_name is denormalized for easier display
    - student_count will be updated via triggers when students are assigned
*/

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  level text NOT NULL CHECK (level IN ('CP', 'CE1', 'CE2', 'CM1', 'CM2')),
  teacher_id uuid REFERENCES users(id) ON DELETE SET NULL,
  teacher_name text,
  student_count integer DEFAULT 0,
  subjects text[] DEFAULT '{}',
  room text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_level ON classes(level);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage all classes
CREATE POLICY "Admins can manage all classes"
  ON classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_user_id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_user_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Teachers can read classes they teach
CREATE POLICY "Teachers can read their classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (
    teacher_id IN (
      SELECT id FROM users
      WHERE users.auth_user_id = auth.uid()
      AND users.role = 'teacher'
    )
  );

-- Policy: All authenticated users can read active classes
CREATE POLICY "Authenticated users can read active classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Trigger to update updated_at
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Update users table to link student class
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'class_id'
  ) THEN
    ALTER TABLE users ADD COLUMN class_id uuid REFERENCES classes(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_users_class_id ON users(class_id);
  END IF;
END $$;