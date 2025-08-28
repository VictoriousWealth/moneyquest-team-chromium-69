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