/*
  # Create class photos tables

  1. New Tables
    - `photo_albums`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Album title
      - `description` (text, nullable) - Album description
      - `class_id` (uuid) - Foreign key to classes table
      - `created_by` (uuid) - Foreign key to users table (who created)
      - `event_date` (date, nullable) - Date of event/activity
      - `cover_photo_url` (text, nullable) - Cover photo URL
      - `is_public` (boolean) - Public to all or class-only
      - `status` (text) - Status: active, archived
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `class_photos`
      - `id` (uuid, primary key) - Unique identifier
      - `album_id` (uuid) - Foreign key to photo_albums
      - `photo_url` (text) - Photo URL
      - `thumbnail_url` (text, nullable) - Thumbnail URL
      - `caption` (text, nullable) - Photo caption
      - `uploaded_by` (uuid) - Foreign key to users table (who uploaded)
      - `taken_at` (timestamptz, nullable) - When photo was taken
      - `file_size_bytes` (bigint, nullable) - File size in bytes
      - `width` (integer, nullable) - Image width
      - `height` (integer, nullable) - Image height
      - `likes_count` (integer) - Number of likes
      - `order_index` (integer) - Order in album
      - `status` (text) - Status: active, archived
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `photo_likes`
      - `id` (uuid, primary key) - Unique identifier
      - `photo_id` (uuid) - Foreign key to class_photos
      - `user_id` (uuid) - Foreign key to users table
      - `created_at` (timestamptz) - Creation timestamp
      - UNIQUE(photo_id, user_id)

    - `photo_comments`
      - `id` (uuid, primary key) - Unique identifier
      - `photo_id` (uuid) - Foreign key to class_photos
      - `user_id` (uuid) - Foreign key to users table
      - `comment` (text) - Comment text
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Teachers and admins can create and manage albums/photos
    - Students and parents can view photos for their class
    - All class members can like and comment on photos

  3. Notes
    - status: 'active', 'archived'
    - Albums can be public or class-only
    - Photos have likes and comments for engagement
    - Order index for manual photo ordering
*/

-- Photo albums table
CREATE TABLE IF NOT EXISTS photo_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_date date,
  cover_photo_url text,
  is_public boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Class photos table
CREATE TABLE IF NOT EXISTS class_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  thumbnail_url text,
  caption text,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  taken_at timestamptz,
  file_size_bytes bigint,
  width integer,
  height integer,
  likes_count integer DEFAULT 0,
  order_index integer DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Photo likes table
CREATE TABLE IF NOT EXISTS photo_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid NOT NULL REFERENCES class_photos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(photo_id, user_id)
);

-- Photo comments table
CREATE TABLE IF NOT EXISTS photo_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid NOT NULL REFERENCES class_photos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_comments ENABLE ROW LEVEL SECURITY;

-- Policies for photo_albums
CREATE POLICY "Users can view albums for their class or public albums"
  ON photo_albums
  FOR SELECT
  TO authenticated
  USING (
    is_public = true
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.class_id = photo_albums.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can create albums"
  ON photo_albums
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers and admins can update their albums"
  ON photo_albums
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = photo_albums.created_by
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = photo_albums.created_by
      )
    )
  );

CREATE POLICY "Teachers and admins can delete their albums"
  ON photo_albums
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = photo_albums.created_by
      )
    )
  );

-- Policies for class_photos
CREATE POLICY "Users can view photos from accessible albums"
  ON class_photos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM photo_albums
      WHERE photo_albums.id = class_photos.album_id
      AND (
        photo_albums.is_public = true
        OR EXISTS (
          SELECT 1 FROM users
          WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
          AND (
            users.role = 'admin'
            OR users.class_id = photo_albums.class_id
          )
        )
      )
    )
  );

CREATE POLICY "Teachers and admins can add photos"
  ON class_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers and admins can update their photos"
  ON class_photos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = class_photos.uploaded_by
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = class_photos.uploaded_by
      )
    )
  );

CREATE POLICY "Teachers and admins can delete their photos"
  ON class_photos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = class_photos.uploaded_by
      )
    )
  );

-- Policies for photo_likes
CREATE POLICY "Users can view likes on accessible photos"
  ON photo_likes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_photos cp
      JOIN photo_albums pa ON pa.id = cp.album_id
      WHERE cp.id = photo_likes.photo_id
      AND (
        pa.is_public = true
        OR EXISTS (
          SELECT 1 FROM users
          WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
          AND (
            users.role = 'admin'
            OR users.class_id = pa.class_id
          )
        )
      )
    )
  );

CREATE POLICY "Users can add likes"
  ON photo_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = photo_likes.user_id
    )
  );

CREATE POLICY "Users can delete their own likes"
  ON photo_likes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = photo_likes.user_id
    )
  );

-- Policies for photo_comments
CREATE POLICY "Users can view comments on accessible photos"
  ON photo_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_photos cp
      JOIN photo_albums pa ON pa.id = cp.album_id
      WHERE cp.id = photo_comments.photo_id
      AND (
        pa.is_public = true
        OR EXISTS (
          SELECT 1 FROM users
          WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
          AND (
            users.role = 'admin'
            OR users.class_id = pa.class_id
          )
        )
      )
    )
  );

CREATE POLICY "Users can add comments"
  ON photo_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = photo_comments.user_id
    )
  );

CREATE POLICY "Users can update their own comments"
  ON photo_comments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = photo_comments.user_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.id = photo_comments.user_id
    )
  );

CREATE POLICY "Users can delete their own comments"
  ON photo_comments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.id = photo_comments.user_id
      )
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_photo_albums_class ON photo_albums(class_id);
CREATE INDEX IF NOT EXISTS idx_photo_albums_created_by ON photo_albums(created_by);
CREATE INDEX IF NOT EXISTS idx_photo_albums_status ON photo_albums(status);
CREATE INDEX IF NOT EXISTS idx_photo_albums_created_at ON photo_albums(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_class_photos_album ON class_photos(album_id);
CREATE INDEX IF NOT EXISTS idx_class_photos_uploaded_by ON class_photos(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_class_photos_status ON class_photos(status);
CREATE INDEX IF NOT EXISTS idx_class_photos_order ON class_photos(album_id, order_index);
CREATE INDEX IF NOT EXISTS idx_photo_likes_photo ON photo_likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_likes_user ON photo_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_comments_photo ON photo_comments(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_comments_user ON photo_comments(user_id);

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_photo_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE class_photos
  SET likes_count = likes_count + 1,
      updated_at = now()
  WHERE id = NEW.photo_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_photo_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE class_photos
  SET likes_count = GREATEST(likes_count - 1, 0),
      updated_at = now()
  WHERE id = OLD.photo_id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment likes count
DROP TRIGGER IF EXISTS increment_photo_likes_count_trigger ON photo_likes;
CREATE TRIGGER increment_photo_likes_count_trigger
AFTER INSERT ON photo_likes
FOR EACH ROW
EXECUTE FUNCTION increment_photo_likes_count();

-- Trigger to decrement likes count
DROP TRIGGER IF EXISTS decrement_photo_likes_count_trigger ON photo_likes;
CREATE TRIGGER decrement_photo_likes_count_trigger
AFTER DELETE ON photo_likes
FOR EACH ROW
EXECUTE FUNCTION decrement_photo_likes_count();
