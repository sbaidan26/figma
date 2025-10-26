/*
  # Add unique constraint on auth_user_id

  1. Changes
    - Add UNIQUE constraint on users.auth_user_id to prevent duplicate entries
    - This allows us to use ON CONFLICT in INSERT statements
*/

-- Add unique constraint on auth_user_id
ALTER TABLE users ADD CONSTRAINT users_auth_user_id_unique UNIQUE (auth_user_id);