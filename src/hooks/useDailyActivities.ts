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
          // Demo fallback: generate last 30 days of synthetic activity
          const demo: DailyActivity[] = Array.from({ length: 30 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const attempts = Math.floor(Math.random() * 6); // 0-5
            const passes = Math.max(0, Math.min(attempts, Math.floor(Math.random() * (attempts + 1))));
            const time = attempts === 0 ? 0 : Math.floor(Math.random() * 46) + 15; // 15-60
            const conceptsPool = ['Budgeting', 'Saving', 'Investment', 'Risk', 'Taxes'];
            const concepts = conceptsPool.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3));
            return {
              activity_date: d.toISOString().split('T')[0],
              attempts,
              passes,
              time_spent_minutes: time,
              concepts,
            };
          }).reverse();

          setActivities(demo);
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