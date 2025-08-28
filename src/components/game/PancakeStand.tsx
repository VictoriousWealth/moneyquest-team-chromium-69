import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { toast } from "sonner";

interface PancakeStandProps {
  isActive: boolean;
  onComplete: (score: number, choice: string, wasCorrect: boolean) => void;
}

export const PancakeStand = ({ isActive, onComplete }: PancakeStandProps) => {
  const [gamePhase, setGamePhase] = useState<"intro" | "decision">("intro");
  const [selectedChoice, setSelectedChoice] = useState<string>("");

  const choices = [
    { 
      id: "choice1", 
      text: "Buy pancakes now before prices go up more", 
      isCorrect: false,
      explanation: "This might seem logical, but panic buying can lead to worse financial decisions."
    },
    { 
      id: "choice2", 
      text: "Wait and see if prices stabilize, budget for the increase", 
      isCorrect: true,
      explanation: "Smart! This shows patience and good budgeting skills during inflation."
    },
    { 
      id: "choice3", 
      text: "Stop eating pancakes completely", 
      isCorrect: false,
      explanation: "While this saves money, it's not always necessary to cut out everything you enjoy."
    }
  ];

  const handleStartGame = () => {
    setGamePhase("decision");
    toast.success("Let's see how you handle inflation! 🥞");
  };

  const handleChoice = (choiceId: string) => {
    const choice = choices.find(c => c.id === choiceId);
    if (!choice) return;

    setSelectedChoice(choiceId);
    const score = choice.isCorrect ? 100 : 0;

    if (choice.isCorrect) {
      toast.success("Excellent decision! 🎉");
    } else {
      toast.error("Not the best choice, but you're learning! 🤔");
    }

    setTimeout(() => {
      onComplete(score, choiceId, choice.isCorrect);
    }, 2000);
  };

  if (!isActive) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Pancake Price Storm</h2>
        <p className="text-[var(--subtext)]">Quest not active</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {gamePhase === "intro" && (
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-48 h-32 mx-auto mb-4 rounded-lg overflow-hidden">
              <img 
                src="/images/pancake-price-storm-story-image.png" 
                alt="Pancake Price Storm story illustration" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-4">Pancake Price Storm!</h1>
            <div className="text-[var(--text)] text-lg leading-relaxed max-w-2xl mx-auto">
              <p className="mb-4">
                Oh no! The price of pancakes at your favorite breakfast spot just went up by 25% due to inflation. 
                Your weekly pancake budget is now not enough!
              </p>
              <p className="mb-6">
                What's the smartest way to handle this price increase? Think carefully about your financial strategy.
              </p>
            </div>
          </div>
          <Button 
            onClick={handleStartGame}
            size="lg"
            variant="primary"
            className="px-8"
          >
            Face the Challenge! 🚀
          </Button>
        </Card>
      )}

      {gamePhase === "decision" && (
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">What's Your Strategy?</h2>
            <p className="text-[var(--subtext)]">Pancake prices just increased 25%. How do you respond?</p>
          </div>

          <div className="space-y-4 mb-6">
            {choices.map((choice) => (
              <Card 
                key={choice.id}
                className={`p-6 cursor-pointer transition-all ${
                  selectedChoice === choice.id 
                    ? choice.isCorrect 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'ring-2 ring-red-500 bg-red-50'
                    : 'hover:shadow-lg'
                }`}
                onClick={() => !selectedChoice && handleChoice(choice.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {choice.id === "choice1" ? "A" : choice.id === "choice2" ? "B" : "C"}
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--text)] font-medium mb-2">{choice.text}</p>
                    {selectedChoice === choice.id && (
                      <div className="mt-4 p-3 bg-[var(--muted)] rounded-lg">
                        <p className="text-sm text-[var(--text)]">{choice.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedChoice && (
            <div className="text-center">
              <Badge variant={choices.find(c => c.id === selectedChoice)?.isCorrect ? "mint" : "muted"}>
                {choices.find(c => c.id === selectedChoice)?.isCorrect ? "Great Choice!" : "Learning Opportunity"}
              </Badge>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};