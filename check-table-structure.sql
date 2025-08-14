-- First, let's see what columns exist in your symptoms table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'symptoms' 
AND table_schema = 'public'
ORDER BY ordinal_position;