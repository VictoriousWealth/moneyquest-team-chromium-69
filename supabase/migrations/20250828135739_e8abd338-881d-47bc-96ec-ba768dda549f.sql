-- Replace existing user's random demo data with consistent demo data
-- First, create a function to ensure demo activities for the current user
CREATE OR REPLACE FUNCTION public.ensure_demo_activities_for_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Delete existing activities to replace with consistent demo data
  DELETE FROM public.daily_activities 
  WHERE user_id = current_user_id 
  AND activity_date >= '2025-06-01' 
  AND activity_date <= '2025-08-29';
  
  -- Insert consistent demo data for July 2025
  INSERT INTO public.daily_activities (user_id, activity_date, attempts, passes, time_spent_minutes, concepts) VALUES
  (current_user_id, '2025-07-01', 2, 1, 25, ARRAY['Budgeting', 'Saving']),
  (current_user_id, '2025-07-03', 1, 1, 15, ARRAY['Inflation']),
  (current_user_id, '2025-07-05', 3, 2, 35, ARRAY['Budgeting', 'Inflation', 'Saving']),
  (current_user_id, '2025-07-08', 2, 2, 20, ARRAY['Budgeting']),
  (current_user_id, '2025-07-12', 1, 0, 10, ARRAY['Saving']),
  (current_user_id, '2025-07-15', 2, 1, 30, ARRAY['Inflation', 'Budgeting']),
  (current_user_id, '2025-07-18', 3, 3, 40, ARRAY['Budgeting', 'Saving', 'Inflation']),
  (current_user_id, '2025-07-22', 1, 1, 12, ARRAY['Saving']),
  (current_user_id, '2025-07-25', 2, 1, 28, ARRAY['Budgeting', 'Inflation']),
  (current_user_id, '2025-07-28', 1, 1, 18, ARRAY['Budgeting']),

  -- August 2025 data (current 12-day streak leading up to Aug 29)
  (current_user_id, '2025-08-01', 1, 0, 15, ARRAY['Saving']),
  (current_user_id, '2025-08-05', 2, 1, 25, ARRAY['Budgeting', 'Inflation']),
  (current_user_id, '2025-08-08', 1, 1, 20, ARRAY['Saving']),

  -- 12-day current streak (Aug 18-29, 2025)
  (current_user_id, '2025-08-18', 2, 2, 30, ARRAY['Budgeting', 'Saving']),
  (current_user_id, '2025-08-19', 1, 1, 15, ARRAY['Inflation']),
  (current_user_id, '2025-08-20', 3, 2, 45, ARRAY['Budgeting', 'Inflation', 'Saving']),
  (current_user_id, '2025-08-21', 2, 1, 25, ARRAY['Budgeting', 'Saving']),
  (current_user_id, '2025-08-22', 1, 1, 18, ARRAY['Inflation']),
  (current_user_id, '2025-08-23', 2, 2, 32, ARRAY['Budgeting', 'Saving']),
  (current_user_id, '2025-08-24', 1, 0, 12, ARRAY['Saving']),
  (current_user_id, '2025-08-25', 3, 3, 38, ARRAY['Budgeting', 'Inflation', 'Saving']),
  (current_user_id, '2025-08-26', 2, 1, 28, ARRAY['Budgeting', 'Inflation']),
  (current_user_id, '2025-08-27', 1, 1, 16, ARRAY['Saving']),
  (current_user_id, '2025-08-28', 2, 2, 24, ARRAY['Budgeting', 'Saving']),
  (current_user_id, '2025-08-29', 1, 1, 20, ARRAY['Inflation']),

  -- June 2025 data (some previous activity)
  (current_user_id, '2025-06-10', 2, 1, 22, ARRAY['Budgeting']),
  (current_user_id, '2025-06-15', 1, 1, 18, ARRAY['Saving']),
  (current_user_id, '2025-06-20', 3, 2, 35, ARRAY['Budgeting', 'Inflation']),
  (current_user_id, '2025-06-25', 1, 0, 14, ARRAY['Saving']),
  (current_user_id, '2025-06-30', 2, 2, 26, ARRAY['Budgeting', 'Saving']);
END;
$$;