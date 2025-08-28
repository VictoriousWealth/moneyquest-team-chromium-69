import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { toast } from "sonner";

interface MomoBakeryProps {
  isActive: boolean;
  onComplete: (score: number, choice: string, wasCorrect: boolean) => void;
}

export const MomoBakery = ({ isActive, onComplete }: MomoBakeryProps) => {
  const [gamePhase, setGamePhase] = useState<"intro" | "decision">("intro");
  const [selectedChoice, setSelectedChoice] = useState<string>("");

  const choices = [
    { 
      id: "choice1", 
      text: "Take the higher paying job even though it's less flexible", 
      isCorrect: false,
      explanation: "While more money is appealing, the lack of flexibility might hurt your studies and future opportunities."
    },
    { 
      id: "choice2", 
      text: "Choose the job that offers good work-life balance and learning opportunities", 
      isCorrect: true,
      explanation: "Excellent! Balancing money with personal growth and well-being leads to better long-term outcomes."
    },
    { 
      id: "choice3", 
      text: "Take both jobs to maximize income", 
      isCorrect: false,
      explanation: "This might seem smart, but overworking can lead to burnout and poor performance in both jobs and school."
    }
  ];

  const handleStartGame = () => {
    setGamePhase("decision");
    toast.success("Time to make a career decision! 💼");
  };

  const handleChoice = (choiceId: string) => {
    const choice = choices.find(c => c.id === choiceId);
    if (!choice) return;

    setSelectedChoice(choiceId);
    const score = choice.isCorrect ? 100 : 0;

    if (choice.isCorrect) {
      toast.success("Wise choice! 🎉");
    } else {
      toast.error("That might not be the best approach! 🤔");
    }

    setTimeout(() => {
      onComplete(score, choiceId, choice.isCorrect);
    }, 2000);
  };

  if (!isActive) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Momo's Summer Job Dilemma</h2>
        <p className="text-[var(--subtext)]">Quest not active</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {gamePhase === "intro" && (
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-4xl">
              💼
            </div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-4">Momo's Summer Job Dilemma</h1>
            <div className="text-[var(--text)] text-lg leading-relaxed max-w-2xl mx-auto">
              <p className="mb-4">
                Momo needs a summer job to save money for college. She has three job offers:
              </p>
              <ul className="text-left mb-6 space-y-2">
                <li>• <strong>Job A:</strong> $15/hour, 40 hours/week, very strict schedule</li>
                <li>• <strong>Job B:</strong> $12/hour, 25 hours/week, flexible schedule, skills training</li>
                <li>• <strong>Job C:</strong> Both jobs (if possible)</li>
              </ul>
              <p>
                Help Momo make the best decision for her future!
              </p>
            </div>
          </div>
          <Button 
            onClick={handleStartGame}
            size="lg"
            variant="primary"
            className="px-8"
          >
            Help Momo Decide! 🚀
          </Button>
        </Card>
      )}

      {gamePhase === "decision" && (
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">What Should Momo Choose?</h2>
            <p className="text-[var(--subtext)]">Consider both short-term income and long-term benefits</p>
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
                {choices.find(c => c.id === selectedChoice)?.isCorrect ? "Smart Decision!" : "Learning Moment"}
              </Badge>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};