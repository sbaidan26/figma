/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `sender_id` (uuid) - Foreign key to users table (who sent the message)
      - `sender_name` (text) - Name of the sender (denormalized)
      - `sender_role` (text) - Role of sender: 'student', 'parent', 'teacher', 'admin'
      - `recipient_id` (uuid) - Foreign key to users table (who receives the message)
      - `recipient_name` (text) - Name of the recipient (denormalized)
      - `recipient_role` (text) - Role of recipient: 'student', 'parent', 'teacher', 'admin'
      - `subject` (text) - Subject of the message
      - `content` (text) - Content/body of the message
      - `read` (boolean) - Whether the message has been read
      - `replied` (boolean) - Whether the message has been replied to
      - `parent_message_id` (uuid, nullable) - For threading replies
      - `created_at` (timestamptz) - Creation timestamp
      - `read_at` (timestamptz, nullable) - When the message was read

  2. Security
    - Enable RLS on `messages` table
    - Add policy for users to read their own messages (sent or received)
    - Add policy for users to send messages
    - Add policy for users to mark their received messages as read

  3. Notes
    - Messages can be threaded using parent_message_id
    - Admins can receive messages from all users
    - Read status only updatable by recipient
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  sender_role text NOT NULL CHECK (sender_role IN ('student', 'parent', 'teacher', 'admin')),
  recipient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  recipient_role text NOT NULL CHECK (recipient_role IN ('student', 'parent', 'teacher', 'admin')),
  subject text NOT NULL,
  content text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  replied boolean NOT NULL DEFAULT false,
  parent_message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read messages they sent or received
CREATE POLICY "Users can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    sender_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    OR recipient_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Policy: Authenticated users can send messages
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Policy: Recipients can update their received messages (mark as read)
CREATE POLICY "Recipients can update their messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (
    recipient_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    recipient_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_parent_id ON messages(parent_message_id);