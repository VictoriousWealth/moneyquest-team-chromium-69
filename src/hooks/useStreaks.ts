import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Streak {
  streak_type: string;
  current_count: number;
  best_count: number;
  last_activity_date?: string;
}

export const useStreaks = () => {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Demo fallback
          setStreaks([
            { streak_type: 'daily_play', current_count: 7, best_count: 15 },
            { streak_type: 'learning_streak', current_count: 12, best_count: 18 },
          ]);
          return;
        }

        const { data, error } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        setStreaks(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch streaks');
      } finally {
        setLoading(false);
      }
    };

    fetchStreaks();
  }, []);

  const getCurrentStreak = (type: string) => {
    const streak = streaks.find(s => s.streak_type === type);
    return streak?.current_count || 0;
  };

  const getBestStreak = (type: string) => {
    const streak = streaks.find(s => s.streak_type === type);
    return streak?.best_count || 0;
  };

  return { streaks, loading, error, getCurrentStreak, getBestStreak };
};