/*
  # Create course resources tables

  1. New Tables
    - `course_resources`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Resource title
      - `description` (text) - Resource description
      - `type` (text) - Resource type: pdf, video, image, document, exercise, presentation, link
      - `subject` (text) - Subject code (math, french, etc.)
      - `class_id` (uuid, nullable) - Optional link to specific class
      - `curriculum_topic_id` (uuid, nullable) - Optional link to curriculum topic
      - `uploaded_by` (uuid) - Foreign key to users table (who uploaded)
      - `file_url` (text, nullable) - URL to file (if external or uploaded)
      - `file_size_bytes` (bigint, nullable) - File size in bytes
      - `file_mime_type` (text, nullable) - MIME type of file
      - `thumbnail_url` (text, nullable) - Thumbnail URL
      - `external_link` (text, nullable) - External link (YouTube, etc.)
      - `tags` (text[]) - Tags for categorization
      - `level` (text) - Educational level
      - `downloads_count` (integer) - Number of downloads
      - `views_count` (integer) - Number of views
      - `is_public` (boolean) - Public or class-only
      - `status` (text) - Status: active, archived, draft
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `resource_downloads`
      - `id` (uuid, primary key) - Unique identifier
      - `resource_id` (uuid) - Foreign key to course_resources
      - `user_id` (uuid) - Foreign key to users table
      - `downloaded_at` (timestamptz) - Download timestamp
      - `created_at` (timestamptz) - Creation timestamp

    - `resource_favorites`
      - `id` (uuid, primary key) - Unique identifier
      - `resource_id` (uuid) - Foreign key to course_resources
      - `user_id` (uuid) - Foreign key to users table
      - `created_at` (timestamptz) - Creation timestamp
      - UNIQUE(resource_id, user_id)

  2. Security
    - Enable RLS on all tables
    - Teachers and admins can create and manage resources
    - Students and parents can view resources for their class
    - Track downloads and favorites per user

  3. Notes
    - type: 'pdf', 'video', 'image', 'document', 'exercise', 'presentation', 'link'
    - status: 'active', 'archived', 'draft'
    - Downloads and views are tracked separately
*/

-- Course resources table
CREATE TABLE IF NOT EXISTS course_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('pdf', 'video', 'image', 'document', 'exercise', 'presentation', 'link')),
  subject text NOT NULL,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  curriculum_topic_id uuid REFERENCES curriculum_topics(id) ON DELETE SET NULL,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url text,
  file_size_bytes bigint,
  file_mime_type text,
  thumbnail_url text,
  external_link text,
  tags text[] DEFAULT ARRAY[]::text[],
  level text NOT NULL,
  downloads_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  is_public boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resource downloads tracking table
CREATE TABLE IF NOT EXISTS resource_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES course_resources(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Resource favorites table
CREATE TABLE IF NOT EXISTS resource_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES course_resources(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource_id, user_id)
);

-- Enable RLS
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for course_resources
CREATE POLICY "Users can view resources for their class or public resources"
  ON course_resources
  FOR SELECT
  TO authenticated
  USING (
    is_public = true
    OR status = 'active'
    AND (
      EXISTS (
        SELECT 1 FROM users
        WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
        AND (
          users.role = 'admin'
          OR users.class_id = course_resources.class_id
          OR course_resources.class_id IS NULL
        )
      )
    )
  );

CREATE POLICY "Teachers and admins can create resources"
  ON course_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers and admins can update their resources"
  ON course_resources
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = course_resources.uploaded_by
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = course_resources.uploaded_by
      )
    )
  );

CREATE POLICY "Teachers and admins can delete their resources"
  ON course_resources
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = course_resources.uploaded_by
      )
    )
  );

-- Policies for resource_downloads
CREATE POLICY "Users can view their own downloads"
  ON resource_downloads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role IN ('teacher', 'admin')
        OR users.id = resource_downloads.user_id
      )
    )
  );

CREATE POLICY "Users can create download records"
  ON resource_downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = resource_downloads.user_id
    )
  );

-- Policies for resource_favorites
CREATE POLICY "Users can view their own favorites"
  ON resource_favorites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = resource_favorites.user_id
    )
  );

CREATE POLICY "Users can add favorites"
  ON resource_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = resource_favorites.user_id
    )
  );

CREATE POLICY "Users can delete their own favorites"
  ON resource_favorites
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = resource_favorites.user_id
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_course_resources_class ON course_resources(class_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_subject ON course_resources(subject);
CREATE INDEX IF NOT EXISTS idx_course_resources_type ON course_resources(type);
CREATE INDEX IF NOT EXISTS idx_course_resources_uploaded_by ON course_resources(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_course_resources_status ON course_resources(status);
CREATE INDEX IF NOT EXISTS idx_course_resources_created_at ON course_resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource ON resource_downloads(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_user ON resource_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_favorites_resource ON resource_favorites(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_favorites_user ON resource_favorites(user_id);

-- Function to increment downloads count
CREATE OR REPLACE FUNCTION increment_downloads_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE course_resources
  SET downloads_count = downloads_count + 1,
      updated_at = now()
  WHERE id = NEW.resource_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment downloads count
DROP TRIGGER IF EXISTS increment_downloads_count_trigger ON resource_downloads;
CREATE TRIGGER increment_downloads_count_trigger
AFTER INSERT ON resource_downloads
FOR EACH ROW
EXECUTE FUNCTION increment_downloads_count();
