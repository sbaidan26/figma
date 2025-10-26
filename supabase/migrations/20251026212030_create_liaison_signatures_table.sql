/*
  # Create liaison signatures table

  1. New Tables
    - `liaison_signatures`
      - `id` (uuid, primary key) - Unique identifier for each signature
      - `liaison_entry_id` (uuid) - Foreign key to liaison_entries table
      - `parent_id` (uuid) - Foreign key to users table (parent who signed)
      - `parent_name` (text) - Name of the parent (denormalized)
      - `signed_at` (timestamptz) - Timestamp when signed
      - Unique constraint on (liaison_entry_id, parent_id) to prevent duplicate signatures

  2. Security
    - Enable RLS on `liaison_signatures` table
    - Add policy for authenticated users to read signatures for entries they can see
    - Add policy for parents to create their own signatures
    - Add policy to prevent duplicate signatures

  3. Notes
    - Parents can only sign entries once
    - Both parents can sign the same entry (if applicable)
    - Signatures are permanent (no update/delete policies)
*/

CREATE TABLE IF NOT EXISTS liaison_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liaison_entry_id uuid NOT NULL REFERENCES liaison_entries(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_name text NOT NULL,
  signed_at timestamptz DEFAULT now(),
  UNIQUE(liaison_entry_id, parent_id)
);

ALTER TABLE liaison_signatures ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read signatures for liaison entries they can access
CREATE POLICY "Users can read signatures for accessible entries"
  ON liaison_signatures
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM liaison_entries 
      WHERE liaison_entries.id = liaison_entry_id
      AND (
        liaison_entries.class_id IS NULL 
        OR liaison_entries.class_id IN (
          SELECT class_id FROM users WHERE users.id = (
            SELECT id FROM users WHERE auth_user_id = auth.uid()
          )
        )
      )
    )
  );

-- Policy: Parents can create their own signatures
CREATE POLICY "Parents can create their own signatures"
  ON liaison_signatures
  FOR INSERT
  TO authenticated
  WITH CHECK (
    parent_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role = 'parent'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_liaison_signatures_entry_id ON liaison_signatures(liaison_entry_id);
CREATE INDEX IF NOT EXISTS idx_liaison_signatures_parent_id ON liaison_signatures(parent_id);
CREATE INDEX IF NOT EXISTS idx_liaison_signatures_signed_at ON liaison_signatures(signed_at DESC);