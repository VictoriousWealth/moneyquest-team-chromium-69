import React from 'react';
import { Coins, Zap, Calendar } from 'lucide-react';
import { GameState } from '@/hooks/useGameState';

interface GameHUDProps {
  gameState: GameState | null;
}

export const GameHUD: React.FC<GameHUDProps> = ({ gameState }) => {
  if (!gameState) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft">
      {/* Coins */}
      <div className="flex items-center gap-2">
        <Coins className="w-4 h-4 text-[var(--primary)]" />
        <span className="font-semibold text-[var(--text)]">{Math.round(gameState.coins)}</span>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[var(--primary)]" />
        <span className="font-semibold text-[var(--text)]">{gameState.streak_days}d</span>
      </div>

      {/* Day */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-[var(--primary)]" />
        <span className="font-semibold text-[var(--text)]">Day {gameState.day}</span>
      </div>
    </div>
  );
};