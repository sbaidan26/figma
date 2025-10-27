/*
  # Fix infinite recursion in RLS policies

  1. Changes
    - Drop the problematic "Admins can manage all users" policy
    - Create new admin policies using auth metadata instead of querying users table
    - This prevents infinite recursion by not querying the same table in the policy

  2. Security
    - Admin role is checked via auth.jwt() metadata
    - Policies remain restrictive and secure
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create new admin policies using auth metadata to avoid recursion
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'admin'
    OR auth_user_id = auth.uid()
    OR status = 'active'
  );

CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'role')::text = 'admin'
  );

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'admin'
    OR auth_user_id = auth.uid()
  )
  WITH CHECK (
    (auth.jwt()->>'role')::text = 'admin'
    OR auth_user_id = auth.uid()
  );

CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'admin'
  );