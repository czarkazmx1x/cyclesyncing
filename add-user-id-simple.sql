-- Add user_id column only to symptoms table (since moods table doesn't exist)
ALTER TABLE symptoms ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to cycles table if it doesn't exist
ALTER TABLE cycles ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;