import { useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { dailyActivity, allStreaks, allBadges } from '../lib/demoData';
import { episodes } from '../lib/mockData';

export const useDataSync = () => {
  const syncAllData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found for sync');
        return;
      }

      console.log('Starting data sync for user:', user.id, user.email);

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

      // 3. Sync earned achievements for Alex Johnson (user_id: 5c35a972-c2ee-4b1c-a7de-e34ec80f625e)
      const alexAchievements = [
        {
          achievement_definition_id: 'risk_ranger',
          achievement_type: 'quest',
          title: 'Risk Ranger',
          description: 'Complete the Stock Market Maze quest.',
          reward_coins: 70,
          earned_at: '2025-08-02T14:30:00Z',
          achievement_data: { 
            contextStat: 'Diversified portfolio saved 15% risk',
            performance_summary: 'You diversified like a pro in Stock Market Maze. Yee-haw!'
          }
        },
        {
          achievement_definition_id: 'value_detective',
          achievement_type: 'skill',
          title: 'Value Detective',
          description: 'Choose the best unit price 5 times.',
          reward_coins: 25,
          earned_at: '2025-08-05T16:45:00Z',
          achievement_data: { 
            contextStat: 'You saved £40 by comparing!',
            performance_summary: 'You sniffed out the best unit price. Grocery stores fear you now.'
          }
        },
        {
          achievement_definition_id: 'goal_setter',
          achievement_type: 'habit',
          title: 'Goal Setter',
          description: 'Set and meet a weekly goal.',
          reward_coins: 20,
          earned_at: '2025-08-08T11:20:00Z',
          achievement_data: { 
            contextStat: 'Weekly goal achieved!',
            performance_summary: 'Set a weekly goal and actually hit it. Consistency FTW.'
          }
        },
        {
          achievement_definition_id: 'first_pound',
          achievement_type: 'milestone',
          title: 'First Pound',
          description: 'Pass your first episode.',
          reward_coins: 10,
          earned_at: '2025-07-15T10:00:00Z',
          achievement_data: { 
            contextStat: 'Your first earned pound!',
            performance_summary: 'You passed your first episode and banked your first £.'
          }
        },
        {
          achievement_definition_id: 'lemonade_tycoon',
          achievement_type: 'quest',
          title: 'Lemonade Tycoon',
          description: 'Complete the Lemonade Stand quest with high profit.',
          reward_coins: 45,
          earned_at: '2025-07-25T13:30:00Z',
          achievement_data: { 
            contextStat: 'Profit: £67.50',
            performance_summary: 'Citrus CEO! You squeezed ≥£67.50 profit from Lemonade Stand.'
          }
        }
      ];

      // Insert achievements for this user
      console.log('Syncing achievements for user:', user.id);
      for (const achievement of alexAchievements) {
        console.log('Inserting achievement:', achievement.achievement_definition_id);
        const { data, error } = await supabase
          .from('achievements')
          .upsert({
            user_id: user.id,
            achievement_definition_id: achievement.achievement_definition_id,
            achievement_type: achievement.achievement_type,
            title: achievement.title,
            description: achievement.description,
            reward_coins: achievement.reward_coins,
            earned_at: achievement.earned_at,
            achievement_data: achievement.achievement_data
          });
        
        if (error) {
          console.error('Error inserting achievement:', achievement.achievement_definition_id, error);
        } else {
          console.log('Successfully inserted achievement:', achievement.achievement_definition_id, data);
        }
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