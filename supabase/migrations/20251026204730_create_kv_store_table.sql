/*
  # Create KV Store Table for Application Data

  1. New Tables
    - `kv_store_9846636e`
      - `key` (text, primary key) - Unique identifier for stored data
      - `value` (jsonb) - JSON data storage for flexible data types
  
  2. Security
    - Enable RLS on `kv_store_9846636e` table
    - Add policy for service role to access all data (since this is accessed via edge function)
  
  3. Purpose
    - This table provides a simple key-value store for the application
    - Used by the edge function to store user data, boards, messages, homework, grades, etc.
    - All access is through authenticated edge function endpoints
*/

CREATE TABLE IF NOT EXISTS kv_store_9846636e (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Enable RLS
ALTER TABLE kv_store_9846636e ENABLE ROW LEVEL SECURITY;

-- Policy for service role (edge function) to access all data
CREATE POLICY "Service role can access all data"
  ON kv_store_9846636e
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);