import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GameState {
  id: string;
  user_id: string;
  coins: number;
  day: number;
  xp_multiplier: number;
  coin_multiplier: number;
  streak_days: number;
  last_played_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGameState = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('game_states')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching game state:', error);
        return;
      }

      if (!data) {
        // Create initial game state if it doesn't exist
        const { data: newGameState, error: createError } = await supabase
          .from('game_states')
          .insert([{
            user_id: user.id,
            coins: 5,
            day: 1,
            xp_multiplier: 1.0,
            coin_multiplier: 1.0,
            streak_days: 0
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating game state:', createError);
          return;
        }

        setGameState(newGameState);
      } else {
        setGameState(data);
      }
    } catch (error) {
      console.error('Error in fetchGameState:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGameState = async (updates: Partial<GameState>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !gameState) return;

      const { data, error } = await supabase
        .from('game_states')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating game state:', error);
        return;
      }

      setGameState(data);
    } catch (error) {
      console.error('Error in updateGameState:', error);
    }
  };

  useEffect(() => {
    fetchGameState();
  }, []);

  return {
    gameState,
    loading,
    updateGameState,
    refetch: fetchGameState
  };
};