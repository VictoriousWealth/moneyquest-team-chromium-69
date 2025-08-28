import { useState, useEffect, useRef } from 'react';
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
  const seededRef = useRef(false);

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

        let userAchievementsData = userAchievements || [];

        // Auto-seed demo achievements for first-time users (idempotent via unique rows)
        if (userAchievementsData.length === 0 && !seededRef.current) {
          seededRef.current = true;
          const dateMap: Record<string, string> = {
            risk_ranger: '2025-08-02T14:30:00Z',
            value_detective: '2025-08-05T16:45:00Z',
            goal_setter: '2025-08-08T11:20:00Z'
          };
          const contextMap: Record<string, { contextStat: string; performance_summary: string }> = {
            risk_ranger: { contextStat: 'Diversified portfolio saved 15% risk', performance_summary: 'You diversified like a pro in Stock Market Maze. Yee-haw!' },
            value_detective: { contextStat: 'You saved £40 by comparing!', performance_summary: 'You sniffed out the best unit price. Grocery stores fear you now.' },
            goal_setter: { contextStat: 'Weekly goal achieved!', performance_summary: 'Set a weekly goal and actually hit it. Consistency FTW.' }
          };

          const seedIds = ['risk_ranger', 'value_detective', 'goal_setter'];
          const seeds = seedIds
            .map((id) => {
              const def = definitions?.find((d: any) => d.id === id);
              if (!def) return null;
              return {
                user_id: user.id,
                achievement_definition_id: id,
                achievement_type: def.achievement_type,
                title: def.title,
                description: def.description,
                reward_coins: def.reward_coins,
                earned_at: dateMap[id],
                achievement_data: contextMap[id]
              };
            })
            .filter(Boolean) as any[];

          if (seeds.length > 0) {
            const { data: inserted, error: insertError } = await supabase
              .from('achievements')
              .insert(seeds)
              .select('*');
            if (!insertError && inserted) {
              userAchievementsData = inserted;
            } else if (insertError) {
              console.warn('Seeding achievements failed:', insertError);
            }
          }
        }

        // Create a map of earned achievements
        const earnedMap = new Map();
        userAchievementsData.forEach((achievement: any) => {
          const achievementData = achievement.achievement_data as any;
          earnedMap.set(achievement.achievement_definition_id, {
            earnedAt: achievement.earned_at,
            contextStat: achievementData?.contextStat,
            performanceSummary: achievementData?.performance_summary
          });
        });

        // Combine definitions with user's earned status
        const combinedBadges: DatabaseBadge[] = definitions?.map((def: any) => {
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