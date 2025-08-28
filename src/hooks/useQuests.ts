import { useState, useEffect } from 'react';

interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'available' | 'in_progress' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: {
    coins: number;
    xp: number;
  };
}

export const useQuests = (gameState: any) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock quest data for now
    const mockQuests: Quest[] = [
      {
        id: 'juice-shrinkflation',
        title: "Momo's Juice Stand",
        description: 'Help Momo understand value and shrinkflation by comparing juice bottles',
        status: 'available',
        difficulty: 'easy',
        rewards: { coins: 50, xp: 100 }
      },
      {
        id: 'pancake-inflation',
        title: "Pippa's Pancake Paradise",
        description: 'Learn about inflation through decades of pancake ingredient prices',
        status: 'available',
        difficulty: 'medium',
        rewards: { coins: 75, xp: 150 }
      }
    ];

    setQuests(mockQuests);
    setLoading(false);
  }, [gameState]);

  return { quests, loading };
};