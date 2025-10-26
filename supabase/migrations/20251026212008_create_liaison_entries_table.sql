/*
  # Create liaison entries table

  1. New Tables
    - `liaison_entries`
      - `id` (uuid, primary key) - Unique identifier for each liaison entry
      - `title` (text) - Title of the liaison message
      - `content` (text) - Content/body of the liaison message
      - `type` (text) - Type of entry: 'note', 'information', 'event', 'authorization'
      - `created_by` (uuid) - Foreign key to users table (author)
      - `created_by_name` (text) - Name of the author (denormalized for performance)
      - `author_role` (text) - Role of the author: 'teacher', 'admin', 'director'
      - `class_id` (uuid, nullable) - Foreign key to classes table (if specific to a class)
      - `requires_signature` (boolean) - Whether this entry requires parent signatures
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `liaison_entries` table
    - Add policy for authenticated users to read liaison entries related to their class
    - Add policy for teachers and admins to create liaison entries
    - Add policy for creators to update their own entries
*/

CREATE TABLE IF NOT EXISTS liaison_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'information' CHECK (type IN ('note', 'information', 'event', 'authorization')),
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_by_name text NOT NULL,
  author_role text NOT NULL DEFAULT 'teacher' CHECK (author_role IN ('teacher', 'admin', 'director')),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  requires_signature boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE liaison_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read liaison entries for their class or school-wide entries
CREATE POLICY "Users can read liaison entries for their class"
  ON liaison_entries
  FOR SELECT
  TO authenticated
  USING (
    class_id IS NULL 
    OR class_id IN (
      SELECT class_id FROM users WHERE users.id = (
        SELECT id FROM users WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Policy: Teachers and admins can create liaison entries
CREATE POLICY "Teachers and admins can create liaison entries"
  ON liaison_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  );

-- Policy: Users can update their own liaison entries
CREATE POLICY "Users can update own liaison entries"
  ON liaison_entries
  FOR UPDATE
  TO authenticated
  USING (
    created_by = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    created_by = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Policy: Admins can delete liaison entries
CREATE POLICY "Admins can delete liaison entries"
  ON liaison_entries
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role = 'admin'
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_liaison_entries_class_id ON liaison_entries(class_id);
CREATE INDEX IF NOT EXISTS idx_liaison_entries_created_at ON liaison_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_liaison_entries_created_by ON liaison_entries(created_by);