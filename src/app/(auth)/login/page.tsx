import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../../lib/roles';
import { Button } from '../../../components/ui/Button';
import { Rocket, School, User } from 'lucide-react';
import { supabase } from '../../../integrations/supabase/client';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials - fixed accounts to avoid creating duplicates
  const DEMO_ACCOUNTS = {
    [Role.STUDENT]: {
      email: 'student.demo@moneyquest.com',
      password: 'moneyquest123',
      profile: {
        username: 'Alex Johnson',
        student_id: 'STU001',
        school: 'Greenfield Elementary',
        year: 'Grade 5',
        district: 'Central District'
      }
    },
    [Role.TEACHER]: {
      email: 'teacher.demo@moneyquest.com',
      password: 'moneyquest123',
      profile: {
        username: 'Sarah Chen',
        school: 'Greenfield Elementary',
        district: 'Central District'
      }
    }
  };

  const handleLogin = async (role: Role) => {
    setIsLoading(true);
    try {
      const account = DEMO_ACCOUNTS[role];
      
      // Try to sign in first
      let { data, error } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });

      // If user doesn't exist, create the account
      if (error && error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: account.email,
          password: account.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: account.profile
          }
        });

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          return;
        }

        data = signUpData;
      } else if (error) {
        console.error('Sign in error:', error);
        return;
      }

      if (data.user) {
        // Only create profile data if this is a new user or if the profile doesn't exist
        try {
          await supabase
            .from('profiles')
            .upsert({
              user_id: data.user.id,
              ...account.profile
            });

          // For student, also create progress and game state
          if (role === Role.STUDENT) {
            await supabase
              .from('student_progress')
              .upsert({
                user_id: data.user.id,
                episodes_passed: 12,
                time_spent_minutes: 180,
                active_days: 15,
                money_saved: 25.50,
                class_rank: 3
              });

            await supabase
              .from('game_states')
              .upsert({
                user_id: data.user.id,
                day: 15,
                coins: 150.00,
                streak_days: 7,
                coin_multiplier: 1.2,
                xp_multiplier: 1.1,
                last_played_date: new Date().toISOString().split('T')[0]
              });
          }
        } catch (profileError) {
          console.log('Profile creation error (might already exist):', profileError);
        }

        // Navigate after successful authentication
        navigate(role === Role.STUDENT ? '/student/play' : '/teacher/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="aurora flex min-h-screen items-center justify-center bg-bg p-4">
        <div className="relative w-full max-w-md space-y-8 bg-surface p-8 shadow-soft ring-1 ring-[var(--ring)]" style={{ borderRadius: '12px' }}>
            <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--blue-500)]/10 ring-1 ring-[var(--ring)]">
                    <Rocket className="h-6 w-6 text-[var(--blue-500)]" />
                </div>
                <h1 className="h1 mt-4 text-text">Welcome to MoneyQuest</h1>
                <p className="small mt-2">Choose your role to begin your adventure.</p>
            </div>
            <div className="space-y-4">
                <div className="rounded-md">
                    <input id="email" type="email" placeholder="Email address (optional)" className="w-full rounded-md bg-muted p-3 text-sm placeholder-subtext ring-1 ring-inset ring-transparent focus:ring-[var(--blue-500)] focus:bg-surface focus:outline-none" />
                </div>
                <div className="space-y-3">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => handleLogin(Role.STUDENT)}
                        className="flex items-center justify-center gap-3 h-12"
                    >
                        <User className="h-5 w-5" />
                        <span>Continue as Student</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        fullWidth
                        onClick={() => handleLogin(Role.TEACHER)}
                        className="flex items-center justify-center gap-3 h-12"
                    >
                        <School className="h-5 w-5" />
                        <span>Continue as Teacher</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;