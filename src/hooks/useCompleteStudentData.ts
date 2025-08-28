import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface CompleteStudentData {
  profile: any;
  progress: any;
  gameState: any;
  achievements: any[];
  dailyActivities: any[];
  journalEntries: any[];
  streaks: any[];
  questResponses: any[];
  transactions: any[];
  loading: boolean;
  error: string | null;
}

export const useCompleteStudentData = (): CompleteStudentData => {
  const [data, setData] = useState<CompleteStudentData>({
    profile: null,
    progress: null,
    gameState: null,
    achievements: [],
    dailyActivities: [],
    journalEntries: [],
    streaks: [],
    questResponses: [],
    transactions: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setData(prev => ({ ...prev, loading: false, error: 'No user found' }));
          return;
        }

        // Fetch all data in parallel
        const [
          profileResult,
          progressResult,
          gameStateResult,
          achievementsResult,
          dailyActivitiesResult,
          journalEntriesResult,
          streaksResult,
          questResponsesResult,
          transactionsResult
        ] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('student_progress').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('game_states').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('achievements').select('*').eq('user_id', user.id).order('earned_at', { ascending: false }),
          supabase.from('daily_activities').select('*').eq('user_id', user.id).order('activity_date', { ascending: false }),
          supabase.from('journal_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('streaks').select('*').eq('user_id', user.id),
          supabase.from('quest_responses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        ]);

        setData({
          profile: profileResult.data,
          progress: progressResult.data,
          gameState: gameStateResult.data,
          achievements: achievementsResult.data || [],
          dailyActivities: dailyActivitiesResult.data || [],
          journalEntries: journalEntriesResult.data || [],
          streaks: streaksResult.data || [],
          questResponses: questResponsesResult.data || [],
          transactions: transactionsResult.data || [],
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching complete student data:', error);
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }));
      }
    };

    fetchAllData();
  }, []);

  return data;
};