import { useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { dailyActivity, allStreaks, allBadges } from '../lib/demoData';
import { episodes } from '../lib/mockData';

export const useDataSync = () => {
  const syncAllData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('Starting data sync for user:', user.id);

      // 1. Sync daily activities from demoData
      for (const activity of dailyActivity) {
        if (activity.attempts > 0) { // Only sync days with actual activity
          await supabase
            .from('daily_activities')
            .upsert({
              user_id: user.id,
              activity_date: activity.date,
              attempts: activity.attempts,
              passes: activity.pass,
              time_spent_minutes: activity.time,
              concepts: Object.keys(activity.concepts).filter(key => activity.concepts[key] > 0)
            });
        }
      }

      // 2. Sync streaks data
      for (const streak of allStreaks) {
        await supabase
          .from('streaks')
          .upsert({
            user_id: user.id,
            streak_type: streak.id,
            current_count: streak.currentCount,
            best_count: streak.bestCount,
            last_activity_date: new Date().toISOString().split('T')[0]
          });
      }

      // 3. Sync earned achievements/badges - specifically August 2025 badges
      const augustBadges = [
        {
          id: 'risk_ranger',
          name: 'Risk Ranger',
          earnedAt: '2025-08-02T14:30:00Z',
          contextStat: 'Diversified portfolio saved 15% risk'
        },
        {
          id: 'value_detective',
          name: 'Value Detective', 
          earnedAt: '2025-08-05T16:45:00Z',
          contextStat: 'You saved £14 by comparing!'
        },
        {
          id: 'goal_setter',
          name: 'Goal Setter',
          earnedAt: '2025-08-08T11:20:00Z',
          contextStat: 'Weekly goal achieved!'
        },
        {
          id: 'first_pound',
          name: 'First Pound',
          earnedAt: '2025-07-15T10:00:00Z',
          contextStat: 'Your first earned pound!'
        },
        {
          id: 'lemonade_tycoon',
          name: 'Lemonade Tycoon',
          earnedAt: '2025-07-25T13:30:00Z',
          contextStat: 'Profit: £67.50'
        }
      ];

      for (const badge of augustBadges) {
        await supabase
          .from('achievements')
          .upsert({
            user_id: user.id,
            achievement_definition_id: badge.id,
            title: badge.name,
            description: allBadges.find(b => b.id === badge.id)?.unlockHint || 'Achievement unlocked!',
            achievement_type: allBadges.find(b => b.id === badge.id)?.category.toLowerCase() || 'skill',
            reward_coins: 25,
            earned_at: badge.earnedAt,
            achievement_data: {
              contextStat: badge.contextStat,
              category: allBadges.find(b => b.id === badge.id)?.category || 'Skill'
            }
          });
      }

      // 4. Sync journal entries from recent activity details
      const recentActivities = dailyActivity
        .filter(a => a.details.length > 0)
        .slice(-10); // Last 10 days with activity

      for (const activity of recentActivities) {
        for (const detail of activity.details) {
          await supabase
            .from('journal_entries')
            .upsert({
              user_id: user.id,
              episode_title: detail.episode,
              result: detail.result,
              summary: detail.reason || `${detail.result} after ${detail.time} minutes studying ${detail.concepts.join(', ')}.`,
              concepts: detail.concepts,
              time_spent_minutes: detail.time,
              created_at: new Date(activity.date + 'T' + (12 + Math.floor(Math.random() * 6)) + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0') + ':00Z').toISOString()
            });
        }
      }

      // 5. Sync episode progress to quest responses
      const completedEpisodes = episodes.filter(ep => ep.status === 'Completed' || ep.status === 'Failed');
      for (const episode of completedEpisodes) {
        await supabase
          .from('quest_responses')
          .upsert({
            user_id: user.id,
            quest_id: `episode_${episode.id}`,
            round_number: 1,
            is_correct: episode.status === 'Completed',
            question_text: `Complete episode: ${episode.title}`,
            selected_option: episode.status,
            correct_answer: 'Completed',
            score_earned: episode.status === 'Completed' ? episode.xpReward : 0,
            response_time_ms: Math.floor(Math.random() * 180000) + 600000 // 10-20 minutes
          });
      }

      // 6. Sync transactions (rewards from completed episodes)
      for (const episode of completedEpisodes.filter(ep => ep.status === 'Completed')) {
        await supabase
          .from('transactions')
          .upsert({
            user_id: user.id,
            type: 'earn',
            amount: episode.xpReward,
            description: `Completed episode: ${episode.title}`,
            quest_id: `episode_${episode.id}`,
            item_category: 'episode_reward'
          });
      }

      console.log('Data sync completed successfully');
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  return { syncAllData };
};