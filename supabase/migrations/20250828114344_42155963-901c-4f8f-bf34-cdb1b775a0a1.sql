-- Enhance profiles table with additional student info
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS student_id text;

-- Create student_progress table for learning metrics
CREATE TABLE IF NOT EXISTS public.student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  episodes_passed integer NOT NULL DEFAULT 0,
  time_spent_minutes integer NOT NULL DEFAULT 0,
  active_days integer NOT NULL DEFAULT 0,
  money_saved numeric(10,2) NOT NULL DEFAULT 0.00,
  class_rank integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create daily_activities table for calendar data
CREATE TABLE IF NOT EXISTS public.daily_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date date NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  passes integer NOT NULL DEFAULT 0,
  time_spent_minutes integer NOT NULL DEFAULT 0,
  concepts text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Create journal_entries table for student reflections
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_title text NOT NULL,
  result text NOT NULL CHECK (result IN ('Pass', 'Fail')),
  summary text NOT NULL,
  concepts text[],
  time_spent_minutes integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create streaks table for various streak tracking
CREATE TABLE IF NOT EXISTS public.streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type text NOT NULL,
  current_count integer NOT NULL DEFAULT 0,
  best_count integer NOT NULL DEFAULT 0,
  last_activity_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

-- Enable RLS on all new tables
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for student_progress
CREATE POLICY "Users can view their own progress" ON public.student_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own progress" ON public.student_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.student_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for daily_activities
CREATE POLICY "Users can view their own activities" ON public.daily_activities
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own activities" ON public.daily_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own activities" ON public.daily_activities
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for journal_entries
CREATE POLICY "Users can view their own journal entries" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own journal entries" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journal entries" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for streaks
CREATE POLICY "Users can view their own streaks" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own streaks" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_student_progress_updated_at
  BEFORE UPDATE ON public.student_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_activities_updated_at
  BEFORE UPDATE ON public.daily_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo data for Alex Johnson (using a placeholder user_id)
-- Note: This will need to be updated with actual user_id when user signs up
INSERT INTO public.profiles (user_id, username, school, year, district, student_id) 
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Alex Johnson',
  'Northwood High',
  'Year 9',
  'Northwood',
  'STU-001'
) ON CONFLICT (user_id) DO UPDATE SET
  school = EXCLUDED.school,
  year = EXCLUDED.year,
  district = EXCLUDED.district,
  student_id = EXCLUDED.student_id;

-- Insert demo student progress
INSERT INTO public.student_progress (user_id, episodes_passed, time_spent_minutes, active_days, money_saved, class_rank)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  20,
  513, -- 8h 33m in minutes
  29,
  125.50,
  12
) ON CONFLICT (user_id) DO UPDATE SET
  episodes_passed = EXCLUDED.episodes_passed,
  time_spent_minutes = EXCLUDED.time_spent_minutes,
  active_days = EXCLUDED.active_days,
  money_saved = EXCLUDED.money_saved,
  class_rank = EXCLUDED.class_rank;

-- Insert demo daily activities (last 30 days)
INSERT INTO public.daily_activities (user_id, activity_date, attempts, passes, time_spent_minutes, concepts)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  (CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 29))::date,
  (random() * 5)::integer + 1,
  (random() * 3)::integer,
  (random() * 60)::integer + 15,
  ARRAY['Budgeting', 'Saving', 'Investment']
ON CONFLICT (user_id, activity_date) DO NOTHING;

-- Insert demo journal entries
INSERT INTO public.journal_entries (user_id, episode_title, result, summary, concepts, time_spent_minutes)
VALUES 
  ('00000000-0000-0000-0000-000000000000'::uuid, 'The Stock Market Maze', 'Pass', 'Learned about different types of investments and how to diversify a portfolio. The risk vs reward concept really clicked for me.', ARRAY['Investment', 'Risk Management', 'Portfolio'], 45),
  ('00000000-0000-0000-0000-000000000000'::uuid, 'Budget Boss Challenge', 'Pass', 'Successfully created a monthly budget tracking all income and expenses. Discovered I was spending too much on entertainment.', ARRAY['Budgeting', 'Expense Tracking'], 30),
  ('00000000-0000-0000-0000-000000000000'::uuid, 'Savings Account Setup', 'Pass', 'Opened my first savings account and learned about compound interest. Set up automatic transfers for consistent saving.', ARRAY['Saving', 'Compound Interest', 'Banking'], 25)
ON CONFLICT DO NOTHING;

-- Insert demo streaks
INSERT INTO public.streaks (user_id, streak_type, current_count, best_count, last_activity_date)
VALUES 
  ('00000000-0000-0000-0000-000000000000'::uuid, 'daily_play', 7, 15, CURRENT_DATE),
  ('00000000-0000-0000-0000-000000000000'::uuid, 'learning_streak', 12, 18, CURRENT_DATE),
  ('00000000-0000-0000-0000-000000000000'::uuid, 'perfect_scores', 3, 5, CURRENT_DATE - INTERVAL '2 days')
ON CONFLICT (user_id, streak_type) DO UPDATE SET
  current_count = EXCLUDED.current_count,
  best_count = EXCLUDED.best_count,
  last_activity_date = EXCLUDED.last_activity_date;