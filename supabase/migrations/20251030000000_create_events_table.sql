/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Event title
      - `description` (text, nullable) - Event description
      - `event_type` (text) - Type: meeting, activity, celebration, trip, exam, holiday, other
      - `event_date` (date) - Date of the event
      - `start_time` (time, nullable) - Start time
      - `end_time` (time, nullable) - End time
      - `location` (text, nullable) - Event location
      - `class_id` (uuid, nullable) - Optional link to specific class
      - `is_public` (boolean) - Public to all or class-only
      - `color` (text) - Color code for display
      - `icon` (text, nullable) - Icon identifier
      - `created_by` (uuid) - Foreign key to users table (who created)
      - `participants_count` (integer) - Number of participants
      - `requires_permission` (boolean) - Requires parent permission
      - `status` (text) - Status: upcoming, ongoing, completed, cancelled
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `event_participants`
      - `id` (uuid, primary key) - Unique identifier
      - `event_id` (uuid) - Foreign key to events
      - `user_id` (uuid) - Foreign key to users table
      - `status` (text) - Status: registered, attended, absent, cancelled
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - UNIQUE(event_id, user_id)

    - `event_reminders`
      - `id` (uuid, primary key) - Unique identifier
      - `event_id` (uuid) - Foreign key to events
      - `user_id` (uuid) - Foreign key to users table
      - `reminded_at` (timestamptz) - When reminder was sent
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Teachers and admins can create and manage events
    - Students and parents can view events for their class or public events
    - Users can register for events

  3. Notes
    - event_type: 'meeting', 'activity', 'celebration', 'trip', 'exam', 'holiday', 'other'
    - status: 'upcoming', 'ongoing', 'completed', 'cancelled'
    - participant status: 'registered', 'attended', 'absent', 'cancelled'
*/

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('meeting', 'activity', 'celebration', 'trip', 'exam', 'holiday', 'other')),
  event_date date NOT NULL,
  start_time time,
  end_time time,
  location text,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  is_public boolean DEFAULT false,
  color text DEFAULT '#3b82f6',
  icon text,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participants_count integer DEFAULT 0,
  requires_permission boolean DEFAULT false,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'absent', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Event reminders table
CREATE TABLE IF NOT EXISTS event_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reminders ENABLE ROW LEVEL SECURITY;

-- Policies for events
CREATE POLICY "Users can view events for their class or public events"
  ON events
  FOR SELECT
  TO authenticated
  USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.class_id = events.class_id
        OR events.class_id IS NULL
      )
    )
  );

CREATE POLICY "Teachers and admins can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers and admins can update their events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = events.created_by
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = events.created_by
      )
    )
  );

CREATE POLICY "Teachers and admins can delete their events"
  ON events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = events.created_by
      )
    )
  );

-- Policies for event_participants
CREATE POLICY "Users can view participants of accessible events"
  ON event_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN users u ON u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      WHERE e.id = event_participants.event_id
      AND (
        e.is_public = true
        OR u.role = 'admin'
        OR u.class_id = e.class_id
        OR e.class_id IS NULL
      )
    )
  );

CREATE POLICY "Users can register for events"
  ON event_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = event_participants.user_id
    )
  );

CREATE POLICY "Users can update their own participation"
  ON event_participants
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role IN ('teacher', 'admin')
        OR users.id = event_participants.user_id
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role IN ('teacher', 'admin')
        OR users.id = event_participants.user_id
      )
    )
  );

CREATE POLICY "Users can cancel their own participation"
  ON event_participants
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role IN ('teacher', 'admin')
        OR users.id = event_participants.user_id
      )
    )
  );

-- Policies for event_reminders
CREATE POLICY "Users can view their own reminders"
  ON event_reminders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role IN ('teacher', 'admin')
        OR users.id = event_reminders.user_id
      )
    )
  );

CREATE POLICY "System can create reminders"
  ON event_reminders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_class ON events(class_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_event_participants_event ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_event ON event_reminders(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_user ON event_reminders(user_id);

-- Function to increment participants count
CREATE OR REPLACE FUNCTION increment_participants_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET participants_count = participants_count + 1,
      updated_at = now()
  WHERE id = NEW.event_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement participants count
CREATE OR REPLACE FUNCTION decrement_participants_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET participants_count = GREATEST(participants_count - 1, 0),
      updated_at = now()
  WHERE id = OLD.event_id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment participants count
DROP TRIGGER IF EXISTS increment_participants_count_trigger ON event_participants;
CREATE TRIGGER increment_participants_count_trigger
AFTER INSERT ON event_participants
FOR EACH ROW
EXECUTE FUNCTION increment_participants_count();

-- Trigger to decrement participants count
DROP TRIGGER IF EXISTS decrement_participants_count_trigger ON event_participants;
CREATE TRIGGER decrement_participants_count_trigger
AFTER DELETE ON event_participants
FOR EACH ROW
EXECUTE FUNCTION decrement_participants_count();
