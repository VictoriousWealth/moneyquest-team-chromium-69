import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DailyActivity {
  activity_date: string;
  attempts: number;
  passes: number;
  time_spent_minutes: number;
  concepts: string[];
}

export const useDailyActivities = () => {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('No authenticated user');
          return;
        }

        // Get last 30 days of activities
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data, error } = await supabase
          .from('daily_activities')
          .select('*')
          .eq('user_id', user.id)
          .gte('activity_date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('activity_date', { ascending: false });

        if (error) throw error;

        setActivities(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};