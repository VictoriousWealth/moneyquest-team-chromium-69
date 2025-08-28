import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface JournalEntry {
  id: string;
  episode_title: string;
  result: 'Pass' | 'Fail';
  summary: string;
  concepts: string[];
  time_spent_minutes?: number;
  created_at: string;
}

export const useJournalEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Demo fallback
          const now = new Date();
          const entriesDemo: JournalEntry[] = [
            {
              id: 'demo-1',
              episode_title: 'The Stock Market Maze',
              result: 'Pass',
              summary: 'Learned about diversification and risk vs reward; practiced choosing ETFs.',
              concepts: ['Investment', 'Risk Management', 'Portfolio'],
              time_spent_minutes: 45,
              created_at: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
            },
            {
              id: 'demo-2',
              episode_title: 'Budget Boss Challenge',
              result: 'Pass',
              summary: 'Built a monthly budget and found extra savings in subscriptions.',
              concepts: ['Budgeting', 'Expense Tracking'],
              time_spent_minutes: 30,
              created_at: new Date(now.getTime() - 1000 * 60 * 60 * 26).toISOString(),
            },
          ];
          setEntries(entriesDemo);
          return;
        }

        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setEntries((data || []) as JournalEntry[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch journal entries');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return { entries, loading, error, formatTimestamp };
};