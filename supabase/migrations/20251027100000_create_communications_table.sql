/*
  # Create communications table for school notifications

  1. New Tables
    - `communications`
      - `id` (uuid, primary key)
      - `title` (text) - Title of the communication
      - `message` (text) - Content of the communication
      - `target` (text) - Target audience: 'all', 'parents', 'teachers', 'class'
      - `target_details` (text, nullable) - Additional target details (e.g., class names)
      - `status` (text) - Status: 'draft', 'sent', 'scheduled'
      - `scheduled_date` (timestamptz, nullable) - When to send if scheduled
      - `created_by` (uuid, foreign key) - User who created the communication
      - `created_at` (timestamptz) - Creation timestamp
      - `sent_at` (timestamptz, nullable) - When it was sent
      - `read_count` (integer) - Number of recipients who read it
      - `total_recipients` (integer) - Total number of recipients

  2. Security
    - Enable RLS on `communications` table
    - Add policy for admins to create/read/update/delete communications
    - Add policy for users to read communications targeted to them
*/

CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  target text NOT NULL CHECK (target IN ('all', 'parents', 'teachers', 'class')),
  target_details text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'scheduled')),
  scheduled_date timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz,
  read_count integer DEFAULT 0,
  total_recipients integer DEFAULT 0
);

ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all communications"
  ON communications
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

CREATE POLICY "Users can read sent communications targeted to them"
  ON communications
  FOR SELECT
  TO authenticated
  USING (
    status = 'sent' AND (
      target = 'all' OR
      (target = 'parents' AND EXISTS (
        SELECT 1 FROM users
        WHERE users.auth_user_id = auth.uid()
        AND users.role = 'parent'
      )) OR
      (target = 'teachers' AND EXISTS (
        SELECT 1 FROM users
        WHERE users.auth_user_id = auth.uid()
        AND users.role = 'teacher'
      )) OR
      (target = 'class' AND EXISTS (
        SELECT 1 FROM users
        WHERE users.auth_user_id = auth.uid()
        AND users.role = 'student'
      ))
    )
  );

CREATE INDEX IF NOT EXISTS idx_communications_status ON communications(status);
CREATE INDEX IF NOT EXISTS idx_communications_target ON communications(target);
CREATE INDEX IF NOT EXISTS idx_communications_created_at ON communications(created_at DESC);
