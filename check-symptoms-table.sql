-- Check the structure of the symptoms table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'symptoms' 
AND table_schema = 'public'
ORDER BY ordinal_position;