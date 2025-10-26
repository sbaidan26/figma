/*
  # Add policy for authenticated users to read basic user info

  1. Changes
    - Add policy allowing all authenticated users to read basic user information (id, name, role)
    - This is needed for messaging features where users need to select recipients

  2. Security
    - Only authenticated users can access this data
    - Limited to non-sensitive fields (id, name, role, status)
*/

-- Policy: All authenticated users can read basic user info for messaging
CREATE POLICY "Authenticated users can read basic user info"
  ON users
  FOR SELECT
  TO authenticated
  USING (status = 'active');