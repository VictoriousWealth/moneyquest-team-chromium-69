import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StudentProfile {
  id: string;
  username: string;
  school?: string;
  year?: string;
  district?: string;
  student_id?: string;
}

interface StudentProgress {
  episodes_passed: number;
  time_spent_minutes: number;
  active_days: number;
  money_saved: number;
  class_rank?: number;
}

export const useStudentProfile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('No authenticated user');
          return;
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // Fetch progress
        const { data: progressData, error: progressError } = await supabase
          .from('student_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError;
        }

        setProfile(profileData);
        setProgress(progressData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  return {
    profile,
    progress,
    loading,
    error,
    formatTimeSpent,
    formatCurrency
  };
};