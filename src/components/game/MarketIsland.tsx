import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameHUD } from "./GameHUD";
import { QuestBoard } from "./QuestBoard";
import { ValueScanner } from "./ValueScanner";
import { useGameState } from "@/hooks/useGameState";
import { useQuests } from "@/hooks/useQuests";
import { toast } from "sonner";

interface ScannedItem {
  id: string;
  name: string;
  price: number;
  size: number;
  unit: string;
  previousPrice?: number;
  previousSize?: number;
}

// Analytics event tracking
const trackEvent = (eventType: string, data: any) => {
  console.log(`[Analytics] ${eventType}:`, data);
  // Here you would send to your analytics service
};

export const MarketIsland = () => {
  const navigate = useNavigate();
  const { gameState, loading } = useGameState();
  const { quests, loading: questsLoading } = useQuests(gameState);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<ScannedItem | undefined>();

  // All hooks must be called before any early returns
  useEffect(() => {
    if (!loading) {
      trackEvent("session_start", { coins: gameState?.coins, day: gameState?.day });
    }
  }, [loading, gameState?.coins, gameState?.day]);

  // Show loading while fetching game state or quests
  if (loading || questsLoading) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary font-semibold">Loading your island...</p>
        </div>
      </div>
    );
  }

  const handleQuestStart = async (questId: string) => {
    trackEvent("quest_started", { quest_id: questId });
    
    // Navigate to quest page based on quest id
    if (questId === 'juice-shrinkflation') {
      navigate('/student/play/juice');
    } else if (questId === 'pancake-inflation') {
      navigate('/student/play/pancake');
    }
  };

  const handleQuestContinue = (questId: string) => {
    // Navigate to quest page for continuing
    navigate(`/quest/${questId}`);
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
      trackEvent("scanner_used", {
        item_id: itemId,
        price: item.price,
        size: item.size,
        unit_price_calc: (item.price / item.size) * 100,
      });
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
      <GameHUD gameState={gameState} />

      {/* Main Game Area */}
      <div className="pt-20 pb-8 px-4 relative z-10">
        <QuestBoard
          quests={quests || []}
          onQuestStart={handleQuestStart}
          onQuestContinue={handleQuestContinue}
        />
      </div>

      {/* Value Scanner Modal */}
      <ValueScanner
        isOpen={scannerOpen}
        onClose={() => {
          setScannerOpen(false);
          setScannedItem(undefined);
        }}
        onItemScanned={setScannedItem}
      />

      {/* Footer */}
      <div className="fixed bottom-4 left-4 right-4 z-40">
        <div className="text-center text-sm text-muted-foreground bg-card/80 backdrop-blur-sm rounded-lg p-2">
          🏝️ Market Island • Learn smart shopping through adventure!
        </div>
      </div>
    </div>
  );
};