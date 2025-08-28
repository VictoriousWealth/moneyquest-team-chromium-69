import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JuiceStand } from "@/components/game/JuiceStand";
import { ValueScanner } from "@/components/game/ValueScanner";
import { GameHUD } from "@/components/game/GameHUD";
import { useGameState } from "@/hooks/useGameState";
import { useAchievements } from "@/hooks/useAchievements";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
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
  const { questId } = useParams();
  const { gameState, loading, completeQuest } = useGameState();
  const { checkAndAwardAchievements } = useAchievements();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<ScannedItem | undefined>();

  useEffect(() => {
    // Show welcome message when quest page loads
    toast.success("🍊 Welcome to Momo's Juice Stand!");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary font-semibold">Loading quest...</p>
        </div>
      </div>
    );
  }

  const handleQuestComplete = async (score: number, choice: string, wasCorrect: boolean) => {
    const coinsEarned = wasCorrect ? 1.0 : 0.5;
    
    // Complete quest with achievements check
    await completeQuest(questId || "juice-shrinkflation", coinsEarned, async (updatedGameState, completedQuestId) => {
      const newAchievements = await checkAndAwardAchievements(updatedGameState, completedQuestId);
      return newAchievements;
    });
    
    // Trigger confetti animation
    const triggerConfetti = () => {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        particleCount: count / 3,
        spread: 45,
        startVelocity: 55,
        scalar: 1.2,
      };

      confetti({
        ...defaults,
        angle: 60,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      });

      confetti({
        ...defaults,
        angle: 120,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#AED6F1'],
      });

      confetti({
        ...defaults,
        angle: 90,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#FFB347', '#87CEEB', '#DDA0DD', '#F0E68C', '#FFA07A'],
        particleCount: count / 2,
        spread: 60,
      });
    };

    triggerConfetti();
    setTimeout(triggerConfetti, 300);
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']
      });
    }, 600);

    if (wasCorrect) {
      toast.success(`🎉 Quest completed! You earned £${coinsEarned.toFixed(2)}`);
    } else {
      toast("📚 Good try! You learned something valuable and earned £0.50");
    }

    // Navigate back after a short delay to show the celebration
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleScannerUse = (itemId: string) => {
    const scanData = {
      "juice-250ml": {
        id: "juice-250ml",
        name: "Orange Burst Juice",
        price: 1.00,
        size: 250,
        unit: "ml",
      },
      "juice-220ml": {
        id: "juice-220ml",
        name: "Orange Burst Juice",
        price: 1.00,
        size: 220,
        unit: "ml",
        previousPrice: 1.00,
        previousSize: 250,
      },
    };

    const item = scanData[itemId as keyof typeof scanData];
    if (item) {
      setScannedItem(item);
      toast.success("📱 Item scanned! Check the unit price analysis.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-grass"></div>
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-water rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-coin rounded-full animate-bounce-coin"></div>
      </div>

      {/* Game HUD */}
      <GameHUD
        coins={gameState.coins}
        day={gameState.day}
        streakDays={gameState.streakDays}
        onTransactionsUpdate={() => {}}
      />

      {/* Back Button */}
      <div className="fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="bg-card/80 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Island
        </Button>
      </div>

      {/* Value Scanner Modal */}
      <ValueScanner
        isOpen={scannerOpen}
        onClose={() => {
          setScannerOpen(false);
          setScannedItem(undefined);
        }}
        onScan={handleScannerUse}
        scannedItem={scannedItem}
      />

      {/* Juice Stand Quest */}
      <JuiceStand
        isActive={true}
        onComplete={handleQuestComplete}
        onUseScanner={() => setScannerOpen(true)}
      />
    </div>
  );
};

export default JuiceQuestPage;