/*
  # Enhanced messaging system features

  1. New Tables
    - `message_attachments`
      - `id` (uuid, primary key) - Unique identifier
      - `message_id` (uuid) - Foreign key to messages table
      - `file_name` (text) - Original file name
      - `file_url` (text) - Storage URL for the file
      - `file_type` (text) - MIME type
      - `file_size` (bigint) - File size in bytes
      - `created_at` (timestamptz) - Upload timestamp

    - `message_reactions`
      - `id` (uuid, primary key) - Unique identifier
      - `message_id` (uuid) - Foreign key to messages table
      - `user_id` (uuid) - Foreign key to users table
      - `reaction` (text) - Emoji reaction
      - `created_at` (timestamptz) - Reaction timestamp

  2. Enhancements
    - Add `archived` and `deleted` flags to messages table
    - Add indexes for better performance

  3. Security
    - Enable RLS on all new tables
    - Proper policies for attachments and reactions
*/

-- Add new columns to messages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'archived'
  ) THEN
    ALTER TABLE messages ADD COLUMN archived boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'deleted_by_sender'
  ) THEN
    ALTER TABLE messages ADD COLUMN deleted_by_sender boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'deleted_by_recipient'
  ) THEN
    ALTER TABLE messages ADD COLUMN deleted_by_recipient boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Create message_attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view attachments from their messages
CREATE POLICY "Users can view attachments from their messages"
  ON message_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages
      WHERE messages.id = message_attachments.message_id
      AND (
        messages.sender_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
        OR messages.recipient_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      )
    )
  );

-- Policy: Users can add attachments to messages they send
CREATE POLICY "Users can add attachments to their messages"
  ON message_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages
      WHERE messages.id = message_attachments.message_id
      AND messages.sender_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reaction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view reactions on their messages
CREATE POLICY "Users can view reactions on their messages"
  ON message_reactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages
      WHERE messages.id = message_reactions.message_id
      AND (
        messages.sender_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
        OR messages.recipient_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      )
    )
  );

-- Policy: Users can add reactions
CREATE POLICY "Users can add reactions"
  ON message_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Policy: Users can remove their reactions
CREATE POLICY "Users can remove their reactions"
  ON message_reactions
  FOR DELETE
  TO authenticated
  USING (
    user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON message_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_archived ON messages(archived);
