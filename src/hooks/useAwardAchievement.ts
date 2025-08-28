import { supabase } from '@/integrations/supabase/client';

export const useAwardAchievement = () => {
  const awardAchievement = async (achievementId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('award-achievement', {
        body: { achievement_id: achievementId }
      });

      if (error) {
        console.error('Error awarding achievement:', error);
        throw new Error('Failed to award achievement');
      }

      return data;
    } catch (error) {
      console.error('Error in awardAchievement:', error);
      throw error;
    }
  };

  return { awardAchievement };
};