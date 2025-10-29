/*
  # Seed default curriculum subjects

  1. Purpose
    - Add default subjects for common educational levels
    - Provides starting point for teachers to build curriculum
    
  2. Subjects Added
    - Mathématiques (Mathematics)
    - Français (French)
    - Sciences (Sciences)
    - Géographie (Geography)
    - Histoire (History)
    - Anglais (English)
    - Arabe (Arabic)
    - Éducation Physique (Physical Education)
    - Arts Plastiques (Visual Arts)
*/

-- Insert default subjects if they don't exist
INSERT INTO curriculum_subjects (name, code, description, color, icon, level, order_index)
VALUES
  ('Mathématiques', 'math', 'Calcul, géométrie, algèbre et résolution de problèmes', 'from-blue-400 to-blue-500', 'calculator', 'primaire', 1),
  ('Français', 'french', 'Lecture, écriture, grammaire et littérature', 'from-purple-400 to-purple-500', 'book', 'primaire', 2),
  ('Sciences', 'science', 'Biologie, physique, chimie et sciences naturelles', 'from-green-400 to-green-500', 'science', 'primaire', 3),
  ('Géographie', 'geography', 'Étude des territoires, climats et populations', 'from-amber-400 to-amber-500', 'globe', 'primaire', 4),
  ('Histoire', 'history', 'Événements historiques et civilisations', 'from-red-400 to-red-500', 'book', 'primaire', 5),
  ('Anglais', 'english', 'Langue anglaise et communication', 'from-pink-400 to-pink-500', 'book', 'primaire', 6),
  ('Arabe', 'arabic', 'Langue arabe et littérature', 'from-orange-400 to-orange-500', 'book', 'primaire', 7),
  ('Éducation Physique', 'pe', 'Sport et activités physiques', 'from-cyan-400 to-cyan-500', 'art', 'primaire', 8),
  ('Arts Plastiques', 'art', 'Dessin, peinture et créativité artistique', 'from-indigo-400 to-indigo-500', 'art', 'primaire', 9)
ON CONFLICT DO NOTHING;

-- Add some example topics for Mathematics
INSERT INTO curriculum_topics (subject_id, title, description, week_number, duration_hours, order_index)
SELECT 
  id,
  'Les nombres décimaux',
  'Comparaison, addition et soustraction des nombres décimaux',
  1,
  4,
  1
FROM curriculum_subjects
WHERE code = 'math'
ON CONFLICT DO NOTHING;

INSERT INTO curriculum_topics (subject_id, title, description, week_number, duration_hours, order_index)
SELECT 
  id,
  'Les fractions',
  'Introduction aux fractions simples et opérations de base',
  3,
  5,
  2
FROM curriculum_subjects
WHERE code = 'math'
ON CONFLICT DO NOTHING;

INSERT INTO curriculum_topics (subject_id, title, description, week_number, duration_hours, order_index)
SELECT 
  id,
  'La géométrie plane',
  'Triangles, quadrilatères et calcul de périmètres',
  7,
  4,
  3
FROM curriculum_subjects
WHERE code = 'math'
ON CONFLICT DO NOTHING;

-- Add some example topics for French
INSERT INTO curriculum_topics (subject_id, title, description, week_number, duration_hours, order_index)
SELECT 
  id,
  'La conjugaison',
  'Présent, passé composé et imparfait',
  1,
  4,
  1
FROM curriculum_subjects
WHERE code = 'french'
ON CONFLICT DO NOTHING;

INSERT INTO curriculum_topics (subject_id, title, description, week_number, duration_hours, order_index)
SELECT 
  id,
  'Les adjectifs qualificatifs',
  'Accord des adjectifs en genre et en nombre',
  2,
  3,
  2
FROM curriculum_subjects
WHERE code = 'french'
ON CONFLICT DO NOTHING;

-- Add some example topics for Sciences
INSERT INTO curriculum_topics (subject_id, title, description, week_number, duration_hours, order_index)
SELECT 
  id,
  'Le corps humain',
  'Système digestif et système respiratoire',
  1,
  4,
  1
FROM curriculum_subjects
WHERE code = 'science'
ON CONFLICT DO NOTHING;

INSERT INTO curriculum_topics (subject_id, title, description, week_number, duration_hours, order_index)
SELECT 
  id,
  'L''eau dans la nature',
  'Cycle de l''eau et états de la matière',
  3,
  3,
  2
FROM curriculum_subjects
WHERE code = 'science'
ON CONFLICT DO NOTHING;
