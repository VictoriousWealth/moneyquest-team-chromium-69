import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Seed demo data when user signs up or signs in
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            seedDemoData(session.user.id);
          }, 1000);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const seedDemoData = async (userId: string) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingProfile) return; // Profile already exists

      // Create profile
      await supabase.from('profiles').insert({
        user_id: userId,
        username: 'Alex Johnson',
        school: 'Northwood High',
        year: 'Year 9',
        district: 'Northwood',
        student_id: 'STU-001'
      });

      // Create student progress
      await supabase.from('student_progress').insert({
        user_id: userId,
        episodes_passed: 20,
        time_spent_minutes: 513,
        active_days: 29,
        money_saved: 125.50,
        class_rank: 12
      });

      // Create sample daily activities (last 30 days)
      const activities = Array.from({ length: 30 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const attempts = Math.floor(Math.random() * 6);
        const passes = Math.max(0, Math.min(attempts, Math.floor(Math.random() * (attempts + 1))));
        const concepts = ['Budgeting', 'Saving', 'Investment'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3));
        
        return {
          user_id: userId,
          activity_date: date.toISOString().split('T')[0],
          attempts,
          passes,
          time_spent_minutes: attempts === 0 ? 0 : Math.floor(Math.random() * 46) + 15,
          concepts
        };
      });

      await supabase.from('daily_activities').insert(activities);

      // Create sample journal entries
      await supabase.from('journal_entries').insert([
        {
          user_id: userId,
          episode_title: 'The Stock Market Maze',
          result: 'Pass',
          summary: 'Learned about different types of investments and how to diversify a portfolio. The risk vs reward concept really clicked for me.',
          concepts: ['Investment', 'Risk Management', 'Portfolio'],
          time_spent_minutes: 45
        },
        {
          user_id: userId,
          episode_title: 'Budget Boss Challenge',
          result: 'Pass',
          summary: 'Successfully created a monthly budget tracking all income and expenses. Discovered I was spending too much on entertainment.',
          concepts: ['Budgeting', 'Expense Tracking'],
          time_spent_minutes: 30
        }
      ]);

      // Create streaks
      await supabase.from('streaks').insert([
        {
          user_id: userId,
          streak_type: 'daily_play',
          current_count: 7,
          best_count: 15,
          last_activity_date: new Date().toISOString().split('T')[0]
        },
        {
          user_id: userId,
          streak_type: 'learning_streak',
          current_count: 12,
          best_count: 18,
          last_activity_date: new Date().toISOString().split('T')[0]
        }
      ]);

      console.log('Demo data seeded successfully for user:', userId);
    } catch (error) {
      console.error('Error seeding demo data:', error);
    }
  };

  const signOut = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // The auth state change will handle setting user/session to null
  }, []);

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!session
  };
};