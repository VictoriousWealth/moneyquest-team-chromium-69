import { useState } from 'react';

export const useGameState = () => {
  const [loading] = useState(false);
  const gameState = { coins: 100, day: 1 };

  const startQuest = async (_id?: string) => ({ success: true });
  const completeQuest = async (_args?: any) => ({ success: true });

  return { gameState, loading, startQuest, completeQuest };
};
