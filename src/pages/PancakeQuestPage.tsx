import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PancakeStand } from "@/components/game/PancakeStand";
import { GameHUD } from "@/components/game/GameHUD";
import { useGameState } from "@/hooks/useGameState";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

const PancakeQuestPage = () => {
  const navigate = useNavigate();
  const { gameState, loading, updateGameState } = useGameState();

  useEffect(() => {
    toast.success("🥞 Welcome to the Pancake Price Storm!");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary font-semibold">Loading quest...</p>
        </div>
      </div>
    );
  }

  const handleQuestComplete = async (score: number, choice: string, wasCorrect: boolean) => {
    try {
      await updateGameState({
        coins: (gameState?.coins || 0) + (wasCorrect ? 15 : 0),
        day: gameState?.day || 1,
        streak_days: gameState?.streak_days || 0
      });

      if (wasCorrect) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success(`Quest completed! You earned 15 coins! 🎉`);
      } else {
        toast.info("Good try! Keep learning! 🌟");
      }

      setTimeout(() => {
        navigate("/student/play");
      }, 3000);
    } catch (error) {
      console.error("Error completing quest:", error);
      toast.error("Error completing quest");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/student/play")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quests
          </Button>
          <GameHUD gameState={gameState} />
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <PancakeStand
            isActive={true}
            onComplete={handleQuestComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default PancakeQuestPage;