import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface JuiceOption {
  id: string;
  name: string;
  price: number;
  volume: number;
  isNewSize?: boolean;
}

interface Comparison {
  id: number;
  optionA: JuiceOption;
  optionB: JuiceOption;
  correctChoice: string;
}

interface ScannedItem {
  id: string;
  name: string;
  price: number;
  size: number;
  unit: string;
  previousPrice?: number;
  previousSize?: number;
}

interface JuiceStandProps {
  isActive: boolean;
  onComplete: (score: number, choice: string, wasCorrect: boolean) => void;
  onUseScanner: () => void;
  scannedItem?: ScannedItem;
}

export const JuiceStand = ({ isActive, onComplete, onUseScanner, scannedItem }: JuiceStandProps) => {
  const [gamePhase, setGamePhase] = useState<"intro" | "crafting" | "decision">("intro");
  const [totalScore, setTotalScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [craftingProgress, setCraftingProgress] = useState(0);
  const [selectedJuice, setSelectedJuice] = useState<string>("");
  const [showTypewriter, setShowTypewriter] = useState(false);

  const juiceComparisons: Comparison[] = [
    {
      id: 1,
      optionA: { id: "a1", name: "Orange Juice", price: 3.50, volume: 500 },
      optionB: { id: "b1", name: "Orange Juice", price: 3.50, volume: 450, isNewSize: true },
      correctChoice: "a1"
    },
    {
      id: 2,
      optionA: { id: "a2", name: "Apple Juice", price: 4.00, volume: 600 },
      optionB: { id: "b2", name: "Apple Juice", price: 3.80, volume: 500 },
      correctChoice: "a2"
    },
    {
      id: 3,
      optionA: { id: "a3", name: "Grape Juice", price: 5.00, volume: 750 },
      optionB: { id: "b3", name: "Grape Juice", price: 4.50, volume: 600 },
      correctChoice: "a3"
    }
  ];

  const currentComparison = juiceComparisons[currentRound];

  useEffect(() => {
    if (gamePhase === "intro") {
      setTimeout(() => setShowTypewriter(true), 500);
    }
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === "crafting") {
      const interval = setInterval(() => {
        setCraftingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setGamePhase("decision");
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [gamePhase]);

  const handleStartGame = () => {
    setGamePhase("crafting");
    toast.success("Let's start crafting some juice! 🍊");
  };

  const handleJuiceChoice = (choice: string) => {
    const isCorrect = choice === currentComparison.correctChoice;
    const roundScore = isCorrect ? 100 : 0;
    const newTotalScore = totalScore + roundScore;
    
    setTotalScore(newTotalScore);
    setSelectedJuice(choice);

    if (isCorrect) {
      toast.success("Great choice! You picked the better value! 🎉");
    } else {
      toast.error("Not quite right. Think about price per ml! 🤔");
    }

    // Complete quest after showing result
    setTimeout(() => {
      onComplete(newTotalScore, choice, isCorrect);
    }, 2000);
  };

  const calculateValuePerMl = (option: JuiceOption) => {
    return (option.price / option.volume).toFixed(3);
  };

  if (!isActive) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Juice Stand Quest</h2>
        <p className="text-[var(--subtext)]">Quest not active</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {gamePhase === "intro" && (
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-4xl">
              🍊
            </div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-4">Welcome to Momo's Juice Stand!</h1>
            {showTypewriter && (
              <div className="text-[var(--text)] text-lg leading-relaxed max-w-2xl mx-auto">
                <p className="mb-4">
                  Hi there! I'm Momo, and I run this juice stand. I've been noticing something strange lately - 
                  my juice bottles look the same but something feels different...
                </p>
                <p className="mb-6">
                  Can you help me figure out which juice bottles give the best value for money? 
                  You'll need to compare different options and pick the one that gives you more juice for your buck!
                </p>
              </div>
            )}
          </div>
          <Button 
            onClick={handleStartGame}
            size="lg"
            variant="primary"
            className="px-8"
          >
            Help Momo! 🚀
          </Button>
        </Card>
      )}

      {gamePhase === "crafting" && (
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-4xl animate-bounce">
              🧪
            </div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Preparing the Juice Comparison...</h2>
            <p className="text-[var(--subtext)] mb-6">Momo is setting up the juice bottles for you to analyze!</p>
          </div>
          <div className="max-w-md mx-auto">
            <Progress value={craftingProgress} className="mb-4" />
            <p className="text-sm text-[var(--subtext)]">{craftingProgress}% Complete</p>
          </div>
        </Card>
      )}

      {gamePhase === "decision" && currentComparison && (
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Choose the Better Value!</h2>
            <p className="text-[var(--subtext)]">Which juice gives you more for your money?</p>
            <div className="mt-4">
              <Badge variant="blue">Round {currentRound + 1} of {juiceComparisons.length}</Badge>
            </div>
          </div>

          {scannedItem && (
            <div className="mb-6 p-4 bg-[var(--muted)] rounded-lg">
              <h3 className="font-semibold text-[var(--text)] mb-2">🔍 Scanner Results:</h3>
              <p className="text-sm text-[var(--subtext)]">
                {scannedItem.name}: ${scannedItem.price} for {scannedItem.size}{scannedItem.unit}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Option A */}
            <Card className={`p-6 cursor-pointer transition-all ${
              selectedJuice === currentComparison.optionA.id 
                ? 'ring-2 ring-primary bg-blue-50' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => !selectedJuice && handleJuiceChoice(currentComparison.optionA.id)}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-300 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
                  🧃
                </div>
                <h3 className="font-bold text-[var(--text)] mb-2">{currentComparison.optionA.name}</h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-[var(--primary)]">${currentComparison.optionA.price}</p>
                  <p className="text-[var(--subtext)]">{currentComparison.optionA.volume}ml</p>
                  <div className="text-xs text-[var(--subtext)] bg-[var(--muted)] rounded px-2 py-1">
                    ${calculateValuePerMl(currentComparison.optionA)} per ml
                  </div>
                  {currentComparison.optionA.isNewSize && (
                    <Badge variant="mint" className="text-xs">New Size!</Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Option B */}
            <Card className={`p-6 cursor-pointer transition-all ${
              selectedJuice === currentComparison.optionB.id 
                ? 'ring-2 ring-primary bg-blue-50' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => !selectedJuice && handleJuiceChoice(currentComparison.optionB.id)}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-300 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
                  🧃
                </div>
                <h3 className="font-bold text-[var(--text)] mb-2">{currentComparison.optionB.name}</h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-[var(--primary)]">${currentComparison.optionB.price}</p>
                  <p className="text-[var(--subtext)]">{currentComparison.optionB.volume}ml</p>
                  <div className="text-xs text-[var(--subtext)] bg-[var(--muted)] rounded px-2 py-1">
                    ${calculateValuePerMl(currentComparison.optionB)} per ml
                  </div>
                  {currentComparison.optionB.isNewSize && (
                    <Badge variant="mint" className="text-xs">New Size!</Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={onUseScanner}
              variant="outline"
              className="mr-4"
            >
              🔍 Use Price Scanner
            </Button>
            <div className="mt-4">
              <p className="text-sm text-[var(--subtext)]">
                💡 Tip: Calculate the price per ml to find the better value!
              </p>
            </div>
          </div>

          {selectedJuice && (
            <div className="mt-6 p-4 bg-[var(--muted)] rounded-lg text-center">
              <p className="text-[var(--text)]">
                {selectedJuice === currentComparison.correctChoice 
                  ? "🎉 Excellent choice! You picked the better value option."
                  : "🤔 That's not the best value. The other option gives you more juice per dollar."}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};