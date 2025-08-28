import { useState } from 'react';

export const useGameState = () => {
  const [loading] = useState(false);
  const gameState = { coins: 100, day: 1, streakDays: 0 };

  const startQuest = async (_id?: string) => ({ success: true });
  const completeQuest = async (_score?: number, _choice?: string, _wasCorrect?: boolean) => ({ success: true });

  return { gameState, loading, startQuest, completeQuest };
};
