-- Create the RPC function to add a symptom (CORRECTED VERSION)
DROP FUNCTION IF EXISTS public.add_symptom CASCADE;

CREATE OR REPLACE FUNCTION public.add_symptom(
  p_type text,
  p_intensity integer,
  p_notes text DEFAULT '',
  p_date date DEFAULT CURRENT_DATE
)
RETURNS SETOF symptoms
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_result symptoms%ROWTYPE;
BEGIN
  -- Get the current user's ID
  v_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to log a symptom';
  END IF;
  
  -- Insert the new symptom and return the inserted row
  INSERT INTO symptoms (
    user_id,
    type,
    severity,
    notes,
    date
  ) VALUES (
    v_user_id,
    p_type,
    p_intensity,
    p_notes,
    p_date::timestamp with time zone
  )
  RETURNING * INTO v_result;
  
  RETURN NEXT v_result;
  RETURN;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.add_symptom TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_symptom TO anon;

-- Test the function (uncomment to test)
-- SELECT * FROM add_symptom('Headache', 2, 'Mild headache');