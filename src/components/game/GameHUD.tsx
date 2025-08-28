import { Coins, User, Flame, Calendar, Trophy, TrendingUp, TrendingDown, ShoppingBag, LogOut, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AchievementsPanel } from "./AchievementsPanel";

interface GameHUDProps {
  coins: number;
  day: number;
  streakDays: number;
  onTransactionsUpdate?: () => void;
}

interface UserProfile {
  username: string;
  school?: string;
  year?: string;
}

export const GameHUD = ({ coins, day, streakDays, onTransactionsUpdate }: GameHUDProps) => {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const formatCoins = (amount: number) => `£${amount.toFixed(2)}`;

  // Load user profile data and transactions
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadTransactions();
    }
  }, [user]);

  // Refresh transactions when coins change (quest completed)
  useEffect(() => {
    if (user && onTransactionsUpdate) {
      loadTransactions();
    }
  }, [coins, user]);  // Re-load when coins change

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, school, year')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Real streak data from game state
  const streakData = {
    currentStreak: streakDays,
    longestStreak: Math.max(streakDays, 1), // Could track this separately in the future
    totalDaysPlayed: day,
    achievements: [
      { name: "First Steps", description: "Played for 1 day", unlocked: streakDays >= 1 },
      { name: "Getting Started", description: "Played for 3 days", unlocked: streakDays >= 3 },
      { name: "Dedicated Learner", description: "Played for 7 days", unlocked: streakDays >= 7 },
    ]
  };

  // Mock transaction history - in a real app, this would come from props or context
  const transactionHistory = transactions.map(t => ({
    type: t.type,
    amount: parseFloat(t.amount) / 100, // Convert from cents to pounds
    source: t.description || "Unknown",
    time: new Date(t.created_at).toLocaleDateString(),
    icon: t.type === "earned" ? TrendingUp : TrendingDown
  }));

  const totalEarned = transactionHistory
    .filter(t => t.type === "earned")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSpent = transactionHistory
    .filter(t => t.type === "spent")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="flex justify-between items-center gap-4">
        {/* Coins */}
        <Popover>
          <PopoverTrigger asChild>
            <Card className="flex items-center gap-2 px-4 py-2 bg-gradient-coin shadow-game cursor-pointer hover:scale-105 transition-transform">
              <Coins className="w-5 h-5 text-coin-shadow animate-bounce-coin" />
              <span className="font-bold text-foreground animate-bounce-coin">{formatCoins(coins)}</span>
            </Card>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-lg font-bold text-foreground">Coin History</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-2xl font-bold text-green-600">{formatCoins(totalEarned)}</p>
                  <p className="text-sm text-green-700 dark:text-green-400">Total Earned</p>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-2xl font-bold text-red-600">{formatCoins(totalSpent)}</p>
                  <p className="text-sm text-red-700 dark:text-red-400">Total Spent</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Recent Transactions
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {transactionHistory.length > 0 ? transactionHistory.map((transaction, index) => {
                    const IconComponent = transaction.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <IconComponent className={`w-4 h-4 ${transaction.type === "earned" ? "text-green-500" : "text-red-500"}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{transaction.source}</p>
                          <p className="text-xs text-muted-foreground">{transaction.time}</p>
                        </div>
                        <p className={`text-sm font-bold ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "earned" ? "+" : "-"}{formatCoins(transaction.amount)}
                        </p>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No transactions yet</p>
                      <p className="text-xs">Complete quests to earn coins!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Streak Counter */}
        <Popover>
          <PopoverTrigger asChild>
            <Card className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 shadow-game cursor-pointer hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white animate-pulse" />
              <span className="font-bold text-white">{streakData.currentStreak} Day Streak</span>
            </Card>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="center">
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <h3 className="text-lg font-bold text-foreground">Streak Stats</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-500">{streakData.currentStreak}</p>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-500">{streakData.longestStreak}</p>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                </div>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xl font-bold text-primary">{streakData.totalDaysPlayed}</p>
                <p className="text-sm text-muted-foreground">Total Days Played</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <AchievementsPanel>
            <Card className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 shadow-game cursor-pointer hover:scale-105 transition-transform">
              <Trophy className="w-4 h-4 text-white" />
              <span className="font-bold text-white text-sm">Achievements</span>
            </Card>
          </AchievementsPanel>
        </div>

        {/* User Profile */}
        <Popover>
          <PopoverTrigger asChild>
            <Card className="flex items-center justify-center w-14 h-14 rounded-full bg-card shadow-game p-0 mr-4 cursor-pointer hover:scale-105 transition-transform">
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarImage 
                  src="/lovable-uploads/6738b4b9-6749-4cee-9b1c-b99d9785b341.png" 
                  alt="Player avatar"
                  className="object-cover object-center scale-110"
                />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
            </Card>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="end">
            <div className="space-y-3">
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage 
                    src="/lovable-uploads/6738b4b9-6749-4cee-9b1c-b99d9785b341.png" 
                    alt="Player avatar"
                    className="object-cover object-center scale-110"
                  />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-semibold text-foreground">{userProfile?.username || "Loading..."}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">{user?.email}</p>
                </div>

                {userProfile?.school && (
                  <div>
                    <p className="text-sm text-muted-foreground">School</p>
                    <p className="font-semibold text-foreground">{userProfile.school}</p>
                  </div>
                )}

                {userProfile?.year && (
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-semibold text-foreground">{userProfile.year}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Player ID</p>
                  <p className="font-semibold text-foreground">{user?.id.slice(0, 8)}...</p>
                </div>
                
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm" 
                  className="gap-2 mt-3"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};