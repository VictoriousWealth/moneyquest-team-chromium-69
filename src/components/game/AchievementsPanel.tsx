import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Trophy, Star, Droplet, Cookie, PiggyBank, ShoppingBasket, Map, Crown, Coins, Banknote, Gem, Calendar, Flame, Target } from 'lucide-react';

const iconMap = {
  'trophy': Trophy,
  'star': Star,
  'droplet': Droplet,
  'cookie': Cookie,
  'piggy-bank': PiggyBank,
  'shopping-basket': ShoppingBasket,
  'map': Map,
  'crown': Crown,
  'coins': Coins,
  'banknote': Banknote,
  'gem': Gem,
  'calendar': Calendar,
  'flame': Flame,
  'target': Target,
};

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsPanel = ({ isOpen, onClose }: AchievementsPanelProps) => {
  // Mock data for now - you can replace with your actual achievements hook
  const availableAchievements = [
    { id: '1', title: 'First Quest', description: 'Complete your first quest', icon: 'trophy', reward_coins: 5 },
    { id: '2', title: 'Streak Master', description: 'Play for 7 days straight', icon: 'flame', reward_coins: 10 },
  ];
  
  const userAchievements = [
    { id: '1', title: 'First Quest', description: 'Complete your first quest', reward_coins: 5, earned_at: new Date().toISOString() },
  ];
  
  const hasAchievement = (id: string) => userAchievements.some(a => a.id === id);
  const loading = false;

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Trophy;
    return IconComponent;
  };

  const earnedCount = userAchievements.length;
  const totalCount = availableAchievements.length;

  if (loading) {
    return <div>Loading achievements...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-bold">Achievements</h2>
        <p className="text-sm text-muted-foreground">
          Track your progress and unlock rewards! ({earnedCount}/{totalCount} earned)
        </p>
      </div>
      {/* Achievement content here */}
    </div>
  );
};