/*
  # Create curriculum/programme tables

  1. New Tables
    - `curriculum_subjects`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Subject name (Mathématiques, Français, etc.)
      - `code` (text) - Subject code (math, french, science, etc.)
      - `description` (text, nullable) - Subject description
      - `color` (text, nullable) - Color for UI display
      - `icon` (text, nullable) - Icon identifier
      - `class_id` (uuid, nullable) - Optional link to specific class
      - `level` (text) - Educational level
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `curriculum_topics`
      - `id` (uuid, primary key) - Unique identifier
      - `subject_id` (uuid) - Foreign key to curriculum_subjects
      - `title` (text) - Topic title
      - `description` (text, nullable) - Topic description
      - `objectives` (text[], nullable) - Learning objectives
      - `week_number` (integer, nullable) - Week in curriculum
      - `duration_hours` (integer, nullable) - Estimated duration
      - `order_index` (integer) - Display order within subject
      - `resources` (jsonb, nullable) - Links to resources
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `curriculum_progress`
      - `id` (uuid, primary key) - Unique identifier
      - `topic_id` (uuid) - Foreign key to curriculum_topics
      - `class_id` (uuid) - Foreign key to classes table
      - `teacher_id` (uuid) - Foreign key to users table
      - `status` (text) - Status: not_started, in_progress, completed
      - `completion_date` (date, nullable) - When completed
      - `completion_percentage` (integer) - Progress percentage (0-100)
      - `notes` (text, nullable) - Teacher notes
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `curriculum_student_progress`
      - `id` (uuid, primary key) - Unique identifier
      - `topic_id` (uuid) - Foreign key to curriculum_topics
      - `student_id` (uuid) - Foreign key to users table
      - `status` (text) - Status: not_started, in_progress, mastered
      - `mastery_level` (integer) - Mastery level (0-100)
      - `last_assessed` (date, nullable) - Last assessment date
      - `notes` (text, nullable) - Notes about student progress
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Teachers and admins can manage curriculum
    - Students and parents can view curriculum for their class
    - Students can view their own progress

  3. Notes
    - status options: 'not_started', 'in_progress', 'completed', 'mastered'
    - Resources stored as JSONB for flexibility
*/

-- Curriculum subjects table
CREATE TABLE IF NOT EXISTS curriculum_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  description text,
  color text,
  icon text,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  level text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Curriculum topics table
CREATE TABLE IF NOT EXISTS curriculum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES curriculum_subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  objectives text[],
  week_number integer,
  duration_hours integer,
  order_index integer DEFAULT 0,
  resources jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Curriculum progress (class-level)
CREATE TABLE IF NOT EXISTS curriculum_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completion_date date,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(topic_id, class_id)
);

-- Student curriculum progress
CREATE TABLE IF NOT EXISTS curriculum_student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'mastered')),
  mastery_level integer DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  last_assessed date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(topic_id, student_id)
);

-- Enable RLS
ALTER TABLE curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_student_progress ENABLE ROW LEVEL SECURITY;

-- Policies for curriculum_subjects
CREATE POLICY "Users can view curriculum subjects for their level/class"
  ON curriculum_subjects
  FOR SELECT
  TO authenticated
  USING (
    class_id IS NULL OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.class_id = curriculum_subjects.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can manage curriculum subjects"
  ON curriculum_subjects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  );

-- Policies for curriculum_topics
CREATE POLICY "Users can view curriculum topics"
  ON curriculum_topics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM curriculum_subjects cs
      LEFT JOIN users u ON u.class_id = cs.class_id
      WHERE cs.id = curriculum_topics.subject_id
      AND u.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        cs.class_id IS NULL
        OR u.role = 'admin'
        OR u.class_id = cs.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can manage curriculum topics"
  ON curriculum_topics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  );

-- Policies for curriculum_progress
CREATE POLICY "Users can view curriculum progress for their class"
  ON curriculum_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role = 'admin'
        OR users.class_id = curriculum_progress.class_id
      )
    )
  );

CREATE POLICY "Teachers and admins can manage curriculum progress"
  ON curriculum_progress
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
      AND (
        users.role = 'admin'
        OR users.class_id = curriculum_progress.class_id
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
        OR users.class_id = curriculum_progress.class_id
      )
    )
  );

-- Policies for curriculum_student_progress
CREATE POLICY "Users can view own student progress"
  ON curriculum_student_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND (
        users.role IN ('teacher', 'admin')
        OR users.id = curriculum_student_progress.student_id
      )
    )
  );

CREATE POLICY "Teachers and admins can manage student progress"
  ON curriculum_student_progress
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      AND users.role IN ('teacher', 'admin')
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_curriculum_subjects_class ON curriculum_subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_subjects_level ON curriculum_subjects(level);
CREATE INDEX IF NOT EXISTS idx_curriculum_topics_subject ON curriculum_topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_progress_topic ON curriculum_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_progress_class ON curriculum_progress(class_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_student_progress_topic ON curriculum_student_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_student_progress_student ON curriculum_student_progress(student_id);
