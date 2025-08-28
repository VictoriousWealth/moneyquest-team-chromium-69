import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, DollarSign, Volume2, VolumeX, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Typewriter } from "@/components/ui/typewriter";
import { supabase } from "@/integrations/supabase/client";


interface TimeTravel {
  year: number;
  flour: number;
  eggs: number;
  butter: number;
  totalCost: number;
  moneyPower: number;
}

interface InflationScenario {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    explanation: string;
    isCorrect: boolean;
  }[];
}

interface PancakeStandProps {
  isActive: boolean;
  onComplete: (score: number, choice: string, wasCorrect: boolean) => void;
  onUseScanner: () => void;
}

export const PancakeStand = ({ isActive, onComplete, onUseScanner }: PancakeStandProps) => {
  const [gamePhase, setGamePhase] = useState<"intro" | "time-travel" | "ready-for-questions" | "decision">("intro");
  const [totalScore, setTotalScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasSpoken, setHasSpoken] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  
  const { speak, stop, isPlaying, isLoading } = useTextToSpeech();
  
  const pippaText = "Hello there! I'm Pippa, and I've been running this pancake stand for decades. Something strange has been happening - my pancake ingredients cost more each year, but I still charge the same price! Can you help me understand what's going on with my money?";

  const timeData: TimeTravel[] = [
    { year: 1990, flour: 0.50, eggs: 0.80, butter: 1.20, totalCost: 2.50, moneyPower: 100 },
    { year: 2000, flour: 0.65, eggs: 1.00, butter: 1.50, totalCost: 3.15, moneyPower: 79 },
    { year: 2010, flour: 0.85, eggs: 1.30, butter: 2.00, totalCost: 4.15, moneyPower: 60 },
    { year: 2020, flour: 1.10, eggs: 1.60, butter: 2.50, totalCost: 5.20, moneyPower: 48 },
    { year: 2024, flour: 1.25, eggs: 1.80, butter: 2.80, totalCost: 5.85, moneyPower: 43 },
  ];

  const scenarios: InflationScenario[] = [
    {
      id: 1,
      question: "If £10 in 1990 could buy the same things as £23 today, what happened to money's power?",
      options: [
        { id: "a", text: "Money became more powerful", explanation: "Not quite! If you need £23 today to buy what £10 bought before, money became weaker.", isCorrect: false },
        { id: "b", text: "Money's power decreased", explanation: "Exactly! This is inflation - over time, the same amount of money buys less stuff.", isCorrect: true },
        { id: "c", text: "Money stayed the same", explanation: "Nope! The fact that prices changed means money's purchasing power changed too.", isCorrect: false },
      ]
    },
    {
      id: 2, 
      question: "What's the best way to protect your money from inflation?",
      options: [
        { id: "a", text: "Hide it under your mattress", explanation: "This won't help! Money sitting still loses value during inflation.", isCorrect: false },
        { id: "b", text: "Spend it all immediately", explanation: "Not the best idea! You still need to save for the future.", isCorrect: false },
        { id: "c", text: "Invest it or put it in savings that grow", explanation: "Smart thinking! Growing your money faster than inflation helps maintain its power.", isCorrect: true },
      ]
    },
    {
      id: 3,
      question: "Why do pancake ingredient prices keep going up over the decades?",
      options: [
        { id: "a", text: "Farmers are getting greedy", explanation: "It's not about greed! Many factors contribute to price increases.", isCorrect: false },
        { id: "b", text: "Inflation makes everything more expensive over time", explanation: "Correct! Inflation is a normal part of the economy that gradually increases prices.", isCorrect: true },
        { id: "c", text: "Ingredients are getting worse quality", explanation: "Quality isn't the issue here - it's about the changing value of money over time.", isCorrect: false },
      ]
    }
  ];

  const currentData = timeData[currentYearIndex];
  const currentScenario = scenarios[currentRound];

  const startTimeTravel = async () => {
    const confirmationText = "Excellent! Let me show you my time machine calculator. Click the button to travel through each decade!";
    
    try {
      await speak(confirmationText);
      
      const waitForSpeechEnd = () => {
        return new Promise<void>((resolve) => {
          const checkSpeech = () => {
            if (!isPlaying && !isLoading) {
              resolve();
            } else {
              setTimeout(checkSpeech, 100);
            }
          };
          setTimeout(checkSpeech, 500);
        });
      };
      
      await waitForSpeechEnd();
      
      setGamePhase("time-travel");
      setTotalScore(0);
      setCurrentRound(0);
      setCurrentYearIndex(0);
      
    } catch (error) {
      console.error('Speech failed:', error);
      // Fallback without speech
      setGamePhase("time-travel");
      setTotalScore(0);
      setCurrentRound(0);
      setCurrentYearIndex(0);
    }
  };

  const nextYear = () => {
    if (currentYearIndex < timeData.length - 1) {
      setCurrentYearIndex(prev => prev + 1);
      toast.success(`Traveled to ${timeData[currentYearIndex + 1].year}!`);
    }
  };

  const previousYear = () => {
    if (currentYearIndex > 0) {
      setCurrentYearIndex(prev => prev - 1);
      toast.success(`Traveled back to ${timeData[currentYearIndex - 1].year}!`);
    }
  };

  const helpPippa = () => {
    setGamePhase("ready-for-questions");
    toast.success("🕒 Time travel complete! Let's help Pippa understand inflation!");
  };

  const continueToQuestions = () => {
    setGamePhase("decision");
    toast.success("Now let's test your understanding!");
  };

  const makeChoice = async (optionId: string) => {
    setSelectedOption(optionId);
    const chosen = currentScenario.options.find(o => o.id === optionId);
    if (!chosen) return;

    const isCorrect = chosen.isCorrect;
    const roundScore = isCorrect ? 10 : 5;
    const newTotalScore = totalScore + roundScore;
    
    // Save response to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('quest_responses').insert({
          user_id: user.id,
          quest_id: 'pancake-inflation',
          round_number: currentRound + 1,
          question_text: currentScenario.question,
          selected_option: chosen.text,
          correct_answer: currentScenario.options.find(opt => opt.isCorrect)?.text || '',
          is_correct: isCorrect,
          score_earned: roundScore
        });
      }
    } catch (error) {
      console.error('Error saving quest response:', error);
    }
    
    // Show explanation
    toast(chosen.explanation, {
      duration: 4000,
    });
    
    setTimeout(() => {
      if (currentRound < scenarios.length - 1) {
        // Move to next round
        setCurrentRound(prev => prev + 1);
        setSelectedOption("");
        setTotalScore(newTotalScore);
      } else {
        // Game complete
        onComplete(newTotalScore, chosen.text, isCorrect);
      }
    }, 2500);
  };

  // Auto-play Pippa's speech and show typewriter when intro loads
  useEffect(() => {
    if (gamePhase === "intro" && !hasSpoken && isActive) {
      setShowTypewriter(true);
      setTimeout(() => {
        speak(pippaText);
      }, 500);
      setHasSpoken(true);
    }
  }, [gamePhase, hasSpoken, isActive, speak, pippaText]);

  const handleSpeakToggle = () => {
    if (isPlaying) {
      stop();
    } else if (gamePhase === "intro") {
      speak(pippaText);
    }
  };

  const handleTypewriterComplete = () => {
    console.log("Typewriter animation completed");
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-gradient-sky overflow-y-auto z-50 p-4">
      <div className="min-h-full flex items-center justify-center py-8">
        <Card className="w-full max-w-4xl bg-card shadow-game border-2 border-secondary">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-foreground">Pippa's Pancake Paradise</h2>
            </div>
            <p className="text-muted-foreground mb-3">Discover the mystery of rising prices over time!</p>
            <img 
              src="/lovable-uploads/dcd607a8-a6a7-46fd-8184-a3c97346339c.png" 
              alt="Pippa the Pancake Maker" 
              className="mx-auto mb-4 rounded-lg max-w-32" 
            />
          </div>

          {gamePhase === "intro" && (
            <div className="text-center space-y-6">
              <div className="bg-card/50 border border-primary/20 rounded-lg p-4 relative">
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div className="absolute -top-2 -right-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSpeakToggle}
                    disabled={isLoading}
                    className="w-8 h-8 p-0 rounded-full bg-background hover:bg-accent"
                  >
                    {isLoading ? (
                      <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <VolumeX className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <div className="text-lg text-foreground">
                  <p className="mb-2 font-medium">
                    "
                    {showTypewriter ? (
                      <Typewriter 
                        text={pippaText} 
                        speed={30}
                        onComplete={handleTypewriterComplete}
                      />
                    ) : (
                      pippaText
                    )}
                    "
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={startTimeTravel}
                  type="button"
                  size="lg"
                  variant="default"
                  className="shadow-game hover:shadow-game-hover animate-float inline-flex items-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  <span>Let's investigate!</span>
                </Button>
                
                <Button
                  onClick={startTimeTravel}
                  type="button"
                  size="lg"
                  variant="outline"
                  className="shadow-game hover:shadow-game-hover animate-bounce inline-flex items-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Show me the magic calculator!</span>
                </Button>
              </div>
            </div>
          )}

          {gamePhase === "time-travel" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">Time Travel Calculator</h3>
                <Badge variant="outline" className="mb-4 text-lg px-4 py-2 animate-[scale-color-fluctuate_2s_ease-in-out_infinite]">
                  <Clock className="w-4 h-4 mr-2" />
                  Year: {currentData.year}
                </Badge>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <Progress value={(currentYearIndex / (timeData.length - 1)) * 100} className="flex-1" />
                    <span className="text-sm font-medium">
                      {currentYearIndex + 1} of {timeData.length}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Button
                      onClick={previousYear}
                      size="lg"
                      variant="outline"
                      className="shadow-game hover:shadow-game-hover inline-flex items-center gap-2"
                      disabled={currentYearIndex <= 0}
                    >
                      <Clock className="w-5 h-5 rotate-180" />
                      <span>Go Back</span>
                    </Button>
                    
                    <Button
                      onClick={nextYear}
                      size="lg"
                      variant="default"
                      className="shadow-game hover:shadow-game-hover inline-flex items-center gap-2"
                      disabled={currentYearIndex >= timeData.length - 1}
                    >
                      <Clock className="w-5 h-5" />
                      <span>
                        {currentYearIndex >= timeData.length - 1 ? "At Present Day" : `Travel to ${timeData[currentYearIndex + 1]?.year}`}
                      </span>
                    </Button>
                  </div>

                  {currentYearIndex >= timeData.length - 1 && (
                    <div className="pt-4">
                      <Button
                        onClick={helpPippa}
                        size="lg"
                        variant="secondary"
                        className="shadow-game hover:shadow-game-hover animate-[scale-fluctuate_2s_ease-in-out_infinite] flex-col items-center gap-3 bg-gradient-to-r from-primary/20 to-secondary/20 px-8 py-6 h-auto"
                      >
                        <span>Ready to help Pippa!</span>
                        <img src="/lovable-uploads/d5ed5bf6-f934-4d5f-bada-4721a17b0885.png" alt="Pancakes" className="w-12 h-12" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-2 border-primary/20">
                  <div className="text-center">
                    <img src="/lovable-uploads/a36fc4d1-e064-4721-8b14-c6130ffd561b.png" alt="Flour bag" className="w-12 h-12 mx-auto mb-2" />
                    <h4 className="font-semibold">Flour (1kg)</h4>
                    <p className="text-2xl font-bold text-primary">£{currentData.flour.toFixed(2)}</p>
                  </div>
                </Card>
                
                <Card className="p-4 border-2 border-secondary/20">
                  <div className="text-center">
                    <img src="/lovable-uploads/a747b99f-711a-4fc7-a4b6-90f1e5ada0fa.png" alt="Eggs in carton" className="w-15 h-12 mx-auto mb-2" />
                    <h4 className="font-semibold">Eggs (dozen)</h4>
                    <p className="text-2xl font-bold text-secondary">£{currentData.eggs.toFixed(2)}</p>
                  </div>
                </Card>
                
                <Card className="p-4 border-2 border-accent/20">
                  <div className="text-center">
                    <img src="/lovable-uploads/44234059-f55f-4afd-b208-5b3c6d629c2d.png" alt="Butter block" className="w-12 h-12 mx-auto mb-2" />
                    <h4 className="font-semibold">Butter (500g)</h4>
                    <p className="text-2xl font-bold text-accent">£{currentData.butter.toFixed(2)}</p>
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-2">
                <div className="text-center space-y-4">
                  <h4 className="text-xl font-bold">Money Power Meter</h4>
                  <div className="flex items-center justify-center gap-4">
                    <DollarSign className="w-8 h-8 text-primary" />
                    <Progress value={currentData.moneyPower} className="flex-1" />
                    <span className="font-bold text-lg">{currentData.moneyPower}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    £10 in 1990 = £{(1000/currentData.moneyPower*10).toFixed(0)} today
                  </p>
                </div>
              </Card>
            </div>
          )}

          {gamePhase === "ready-for-questions" && (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Time Travel Complete!</h3>
                <p className="text-lg text-muted-foreground">
                  Amazing! You've seen how prices changed from 1990 to 2024. 
                  Now Pippa wants to test what you've learned about inflation and money's changing power.
                </p>
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6">
                  <p className="text-foreground font-medium mb-2">
                    "I hope that helped you understand why my pancake costs keep rising! 
                    Are you ready for some questions to test your knowledge?"
                  </p>
                  <p className="text-sm text-muted-foreground italic">- Pippa</p>
                </div>
              </div>

              <Button
                onClick={continueToQuestions}
                size="lg"
                variant="default"
                className="shadow-game hover:shadow-game-hover animate-pulse inline-flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Ready for the Challenge!</span>
              </Button>
            </div>
          )}

          {gamePhase === "decision" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Inflation Challenge!</h3>
                <p className="text-muted-foreground mb-2">{currentScenario?.question}</p>
                <div className="flex justify-center items-center gap-4 mb-4">
                  <Badge 
                    variant="outline" 
                    className="px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/10 cursor-pointer animate-pulse border-primary/30"
                  >
                    🎯 Question {currentRound + 1} of {scenarios.length}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-secondary/10 cursor-pointer animate-bounce border-secondary/30"
                  >
                    ⭐ Score: {totalScore}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                {currentScenario?.options.map((option) => (
                  <Card 
                    key={option.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-game-hover ${
                      selectedOption === option.id ? "ring-2 ring-primary bg-primary/10" : ""
                    }`}
                    onClick={() => makeChoice(option.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-bold text-secondary-foreground">
                        {option.id.toUpperCase()}
                      </div>
                      <p className="flex-1 font-medium text-foreground">{option.text}</p>
                      {selectedOption === option.id && (
                        <AlertCircle className="w-5 h-5 text-primary animate-pulse" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {selectedOption && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Great choice! Pippa is checking your understanding...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        </Card>
      </div>
    </div>
  );
};