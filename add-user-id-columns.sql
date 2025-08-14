-- Add user_id column to symptoms table if it doesn't exist
ALTER TABLE symptoms ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to moods table if it doesn't exist  
ALTER TABLE moods ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to cycles table if it doesn't exist
ALTER TABLE cycles ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;