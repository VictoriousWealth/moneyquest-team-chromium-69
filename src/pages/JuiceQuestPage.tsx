import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { JuiceStand } from "@/components/game/JuiceStand";
import { GameHUD } from "@/components/game/GameHUD";
import { useGameState } from "@/hooks/useGameState";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface ScannedItem {
  id: string;
  name: string;
  price: number;
  size: number;
  unit: string;
  previousPrice?: number;
  previousSize?: number;
}

const JuiceQuestPage = () => {
  const navigate = useNavigate();
  const { gameState, loading, updateGameState } = useGameState();

  useEffect(() => {
    // Show welcome message when quest page loads
    toast.success("🍊 Welcome to Momo's Juice Stand!");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary font-semibold">Loading quest...</p>
        </div>
      </div>
    );
  }

  const handleQuestComplete = async (score: number, choice: string, wasCorrect: boolean) => {
    try {
      const coinsEarned = wasCorrect ? 1.0 : 0.5;
      await updateGameState({
        coins: (gameState?.coins || 0) + (score > 0 ? 10 : 0),
        day: gameState?.day || 1,
        streak_days: gameState?.streak_days || 0
      });

      // Show completion effects
      if (wasCorrect) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success(`Quest completed! You earned 10 coins! 🎉`);
      } else {
        toast.info("Good try! Practice makes perfect! 🌟");
      }

      // Navigate back after 3 seconds
      setTimeout(() => {
        navigate("/student/play");
      }, 3000);
    } catch (error) {
      console.error("Error completing quest:", error);
      toast.error("Error completing quest");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky overflow-hidden" style={{
    background: 'linear-gradient(135deg, hsl(200 75% 85%), hsl(210 85% 70%))'
  }} >
      
      {/* Game Content */}
      <JuiceStand
        isActive={true}
        onComplete={handleQuestComplete}
      />
    </div>
  );
};

export default JuiceQuestPage;