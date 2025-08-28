import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface DatabaseBadge {
  id: string;
  title: string;
  description: string;
  achievement_type: string;
  icon: string;
  reward_coins: number;
  criteria: any;
  isEarned: boolean;
  earnedAt?: string;
  contextStat?: string;
  performanceSummary?: string;
}

export const useDatabaseAchievements = () => {
  const [badges, setBadges] = useState<DatabaseBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('No user found');
          setLoading(false);
          return;
        }

        // Get all achievement definitions
        const { data: definitions, error: defError } = await supabase
          .from('achievement_definitions')
          .select('*')
          .order('title');

        if (defError) throw defError;

        // Get user's earned achievements
        const { data: userAchievements, error: userError } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', user.id);

        if (userError) throw userError;

        // Create a map of earned achievements
        const earnedMap = new Map();
        userAchievements?.forEach(achievement => {
          const achievementData = achievement.achievement_data as any;
          earnedMap.set(achievement.achievement_definition_id, {
            earnedAt: achievement.earned_at,
            contextStat: achievementData?.contextStat,
            performanceSummary: achievementData?.performance_summary
          });
        });

        // Combine definitions with user's earned status
        const combinedBadges: DatabaseBadge[] = definitions?.map(def => {
          const earnedData = earnedMap.get(def.id);
          return {
            id: def.id,
            title: def.title,
            description: def.description,
            achievement_type: def.achievement_type,
            icon: def.icon,
            reward_coins: def.reward_coins,
            criteria: def.criteria,
            isEarned: !!earnedData,
            earnedAt: earnedData?.earnedAt,
            contextStat: earnedData?.contextStat,
            performanceSummary: earnedData?.performanceSummary
          };
        }) || [];

        setBadges(combinedBadges);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return { badges, loading, error };
};