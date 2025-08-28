-- Insert consistent demo data for daily activities
-- This replaces the randomly generated demo data with fixed database records

-- First, let's create some demo data for a sample user
-- We'll use a placeholder user_id that can be updated later with real user IDs

INSERT INTO public.daily_activities (user_id, activity_date, attempts, passes, time_spent_minutes, concepts) VALUES
-- July 2025 data
('00000000-0000-0000-0000-000000000001', '2025-07-01', 2, 1, 25, ARRAY['Budgeting', 'Saving']),
('00000000-0000-0000-0000-000000000001', '2025-07-03', 1, 1, 15, ARRAY['Inflation']),
('00000000-0000-0000-0000-000000000001', '2025-07-05', 3, 2, 35, ARRAY['Budgeting', 'Inflation', 'Saving']),
('00000000-0000-0000-0000-000000000001', '2025-07-08', 2, 2, 20, ARRAY['Budgeting']),
('00000000-0000-0000-0000-000000000001', '2025-07-12', 1, 0, 10, ARRAY['Saving']),
('00000000-0000-0000-0000-000000000001', '2025-07-15', 2, 1, 30, ARRAY['Inflation', 'Budgeting']),
('00000000-0000-0000-0000-000000000001', '2025-07-18', 3, 3, 40, ARRAY['Budgeting', 'Saving', 'Inflation']),
('00000000-0000-0000-0000-000000000001', '2025-07-22', 1, 1, 12, ARRAY['Saving']),
('00000000-0000-0000-0000-000000000001', '2025-07-25', 2, 1, 28, ARRAY['Budgeting', 'Inflation']),
('00000000-0000-0000-0000-000000000001', '2025-07-28', 1, 1, 18, ARRAY['Budgeting']),

-- August 2025 data (current 12-day streak leading up to Aug 29)
('00000000-0000-0000-0000-000000000001', '2025-08-01', 1, 0, 15, ARRAY['Saving']),
('00000000-0000-0000-0000-000000000001', '2025-08-05', 2, 1, 25, ARRAY['Budgeting', 'Inflation']),
('00000000-0000-0000-0000-000000000001', '2025-08-08', 1, 1, 20, ARRAY['Saving']),

-- 12-day current streak (Aug 18-29, 2025)
('00000000-0000-0000-0000-000000000001', '2025-08-18', 2, 2, 30, ARRAY['Budgeting', 'Saving']),
('00000000-0000-0000-0000-000000000001', '2025-08-19', 1, 1, 15, ARRAY['Inflation']),
('00000000-0000-0000-0000-000000000001', '2025-08-20', 3, 2, 45, ARRAY['Budgeting', 'Inflation', 'Saving']),
('00000000-0000-0000-0000-000000000001', '2025-08-21', 2, 1, 25, ARRAY['Budgeting', 'Saving']),
('00000000-0000-0000-0000-000000000001', '2025-08-22', 1, 1, 18, ARRAY['Inflation']),
('00000000-0000-0000-0000-000000000001', '2025-08-23', 2, 2, 32, ARRAY['Budgeting', 'Saving']),
('00000000-0000-0000-0000-000000000001', '2025-08-24', 1, 0, 12, ARRAY['Saving']),
('00000000-0000-0000-0000-000000000001', '2025-08-25', 3, 3, 38, ARRAY['Budgeting', 'Inflation', 'Saving']),
('00000000-0000-0000-0000-000000000001', '2025-08-26', 2, 1, 28, ARRAY['Budgeting', 'Inflation']),
('00000000-0000-0000-0000-000000000001', '2025-08-27', 1, 1, 16, ARRAY['Saving']),
('00000000-0000-0000-0000-000000000001', '2025-08-28', 2, 2, 24, ARRAY['Budgeting', 'Saving']),
('00000000-0000-0000-0000-000000000001', '2025-08-29', 1, 1, 20, ARRAY['Inflation']),

-- June 2025 data (some previous activity)
('00000000-0000-0000-0000-000000000001', '2025-06-10', 2, 1, 22, ARRAY['Budgeting']),
('00000000-0000-0000-0000-000000000001', '2025-06-15', 1, 1, 18, ARRAY['Saving']),
('00000000-0000-0000-0000-000000000001', '2025-06-20', 3, 2, 35, ARRAY['Budgeting', 'Inflation']),
('00000000-0000-0000-0000-000000000001', '2025-06-25', 1, 0, 14, ARRAY['Saving']),
('00000000-0000-0000-0000-000000000001', '2025-06-30', 2, 2, 26, ARRAY['Budgeting', 'Saving']);

-- Create a function to update existing user data with demo activities
-- This will help when real users exist
CREATE OR REPLACE FUNCTION public.populate_demo_activities_for_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete existing demo data for this user to avoid duplicates
  DELETE FROM public.daily_activities 
  WHERE user_id = target_user_id 
  AND activity_date >= '2025-06-01' 
  AND activity_date <= '2025-08-29';
  
  -- Insert demo data for the specific user
  INSERT INTO public.daily_activities (user_id, activity_date, attempts, passes, time_spent_minutes, concepts) 
  SELECT 
    target_user_id,
    activity_date,
    attempts,
    passes,
    time_spent_minutes,
    concepts
  FROM public.daily_activities 
  WHERE user_id = '00000000-0000-0000-0000-000000000001';
END;
$$;