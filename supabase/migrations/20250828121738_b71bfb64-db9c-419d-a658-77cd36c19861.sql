-- Create demo accounts for student and teacher
-- Note: These users will need to be created through Supabase Auth, but we can set up their profiles

-- Insert demo student profile
INSERT INTO public.profiles (user_id, username, student_id, school, year, district)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Alex Johnson',
  'STU001',
  'Greenfield Elementary',
  'Grade 5',
  'Central District'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert demo teacher profile  
INSERT INTO public.profiles (user_id, username, school, district)
VALUES (
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Sarah Chen',
  'Greenfield Elementary', 
  'Central District'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert student progress for demo student
INSERT INTO public.student_progress (user_id, episodes_passed, time_spent_minutes, active_days, money_saved, class_rank)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  12,
  180,
  15,
  25.50,
  3
) ON CONFLICT (user_id) DO NOTHING;

-- Insert game state for demo student
INSERT INTO public.game_states (user_id, day, coins, streak_days, coin_multiplier, xp_multiplier, last_played_date)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  15,
  150.00,
  7,
  1.2,
  1.1,
  CURRENT_DATE
) ON CONFLICT (user_id) DO NOTHING;