/*
  # Create schedule entries table

  1. New Tables
    - `schedule_entries`
      - `id` (uuid, primary key) - Unique identifier for each schedule entry
      - `subject` (text) - Subject of the course
      - `teacher` (text) - Name of the teacher
      - `room` (text, nullable) - Room or location
      - `day_of_week` (integer) - Day of the week (0=Monday, 1=Tuesday, etc.)
      - `start_time` (time) - Start time of the course
      - `end_time` (time) - End time of the course
      - `class_id` (uuid) - Foreign key to classes table
      - `color` (text, nullable) - Custom color for the course
      - `notes` (text, nullable) - Additional notes
      - `created_by` (uuid) - Foreign key to users table (who created the entry)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `schedule_entries` table
    - Teachers and admins can create/update/delete schedule entries for their class
    - Students and parents can read schedule entries for their class
    - Admins have full access

  3. Notes
    - day_of_week: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday
*/

CREATE TABLE IF NOT EXISTS schedule_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL CHECK (subject IN ('math', 'french', 'science', 'history', 'geography', 'english', 'arabic', 'islamic_studies', 'physical_education', 'arts', 'music', 'sport', 'art')),
  teacher text NOT NULL,
  room text,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL CHECK (end_time > start_time),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  color text,
  notes text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE schedule_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read schedule for their class"
  ON schedule_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.class_id = schedule_entries.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can create schedule entries"
  ON schedule_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = schedule_entries.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can update schedule entries"
  ON schedule_entries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = schedule_entries.class_id
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
        OR users.class_id = schedule_entries.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can delete schedule entries"
  ON schedule_entries
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = schedule_entries.class_id
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_schedule_entries_class_id ON schedule_entries(class_id);
CREATE INDEX IF NOT EXISTS idx_schedule_entries_day_of_week ON schedule_entries(day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedule_entries_start_time ON schedule_entries(start_time);
