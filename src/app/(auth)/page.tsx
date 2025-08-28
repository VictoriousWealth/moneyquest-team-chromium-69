import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/student/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please check your credentials and try again.');
          } else {
            setError(error.message);
          }
        } else {
          navigate('/student/dashboard');
        }
      } else {
        // Sign up
        const redirectUrl = `${window.location.origin}/student/dashboard`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: username || email.split('@')[0],
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            setError('An account with this email already exists. Please try logging in instead.');
          } else {
            setError(error.message);
          }
        } else {
          setMessage('Check your email for a confirmation link to complete your registration.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    
    // Create demo account if it doesn't exist
    const demoEmail = 'alex.johnson@demo.com';
    const demoPassword = 'demo123456';
    
    try {
      // Try to sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInError) {
        // If sign in fails, create the demo account
        const { error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/student/dashboard`,
            data: {
              username: 'Alex Johnson',
            }
          }
        });

        if (signUpError) {
          setError('Failed to create demo account: ' + signUpError.message);
          return;
        }

        setMessage('Demo account created! Please check the email for confirmation, or try signing in.');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError('Failed to access demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text mb-2">MoneyQuest</h1>
          <p className="text-subtext">Financial literacy learning platform</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex rounded-lg bg-muted p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isLogin ? 'bg-background text-text shadow-sm' : 'text-subtext hover:text-text'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isLogin ? 'bg-background text-text shadow-sm' : 'text-subtext hover:text-text'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text mb-1">
                    Display Name
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-text"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-text"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-text"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-subtext hover:text-text"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  'Please wait...'
                ) : (
                  <>
                    {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-subtext">or</span>
              </div>
            </div>

            <Button
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Try Demo as Alex Johnson
            </Button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600">{message}</p>
              </div>
            )}
          </div>
        </Card>

        <p className="text-center text-xs text-subtext">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;