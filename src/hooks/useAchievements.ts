import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AchievementDefinition {
  id: string;
  achievement_type: string;
  title: string;
  description: string;
  icon: string;
  criteria: any;
  reward_coins: number;
  created_at?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_definition_id: string;
  achievement_type: string;
  title?: string;
  description?: string;
  reward_coins: number;
  earned_at: string;
  achievement_data?: any;
}

export interface AchievementWithStatus extends AchievementDefinition {
  state: 'earned' | 'locked';
  earned_at?: string;
  category: string;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        
        // First get all achievement definitions
        const { data: definitions, error: defsError } = await supabase
          .from('achievement_definitions')
          .select('*');

        if (defsError) {
          console.error('Error fetching achievement definitions:', defsError);
          setError('Failed to load achievement definitions');
          return;
        }

        // Then get user's earned achievements (only when authenticated)
        const { data: { session } } = await supabase.auth.getSession();
        let userAchievements: UserAchievement[] = [];
        
        if (session?.user) {
          const { data: earned, error: earnedError } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', session.user.id);

          if (earnedError) {
            console.error('Error fetching user achievements:', earnedError);
            // Don't fail completely, just show no earned achievements
          } else {
            userAchievements = earned || [];
          }
        }

        // Combine definitions with user progress
        const achievementsWithStatus: AchievementWithStatus[] = definitions?.map(def => {
          const earned = userAchievements.find(ua => ua.achievement_definition_id === def.id);
          
          return {
            ...def,
            state: earned ? 'earned' as const : 'locked' as const,
            earned_at: earned?.earned_at,
            category: capitalizeCategory(def.achievement_type)
          };
        }) || [];

        setAchievements(achievementsWithStatus);
      } catch (err) {
        console.error('Error in fetchAchievements:', err);
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const capitalizeCategory = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return {
    achievements,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-trigger the useEffect
      window.location.reload();
    }
  };
};