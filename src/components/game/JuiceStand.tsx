import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Star, AlertTriangle, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Typewriter } from "@/components/ui/typewriter";
import { supabase } from "@/integrations/supabase/client";

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
}

export const JuiceStand = ({ isActive, onComplete, onUseScanner }: JuiceStandProps) => {
  const [gamePhase, setGamePhase] = useState<"intro" | "crafting" | "decision">("intro");
  const [totalScore, setTotalScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [craftingProgress, setCraftingProgress] = useState(0);
  const [selectedJuice, setSelectedJuice] = useState<string>("");
  const [hasSpoken, setHasSpoken] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  
  const { speak, stop, isPlaying, isLoading } = useTextToSpeech();
  
  const momoText = "Hey there! I'm Momo, I work part-time here at the juice stand in Food Row while studying. My manager asked me to help choose the best value juices for our smoothies, but I've noticed something strange - some bottles seem smaller than they used to be, but prices haven't changed. Can you help me figure out which bottles give the best value for the shop?";

  const comparisons: Comparison[] = [
    {
      id: 1,
      optionA: { id: "option-a", name: "Orange Burst", price: 1.00, volume: 250 },
      optionB: { id: "option-b", name: "Orange Burst", price: 1.00, volume: 200, isNewSize: true },
      correctChoice: "option-a"
    },
    {
      id: 2,
      optionA: { id: "option-a", name: "Citrus Mix", price: 1.50, volume: 350 },
      optionB: { id: "option-b", name: "Citrus Mix", price: 1.20, volume: 270, isNewSize: true },
      correctChoice: "option-a"
    },
    {
      id: 3,
      optionA: { id: "option-a", name: "Tropical Blend", price: 2.20, volume: 500 },
      optionB: { id: "option-b", name: "Tropical Blend", price: 2.00, volume: 450, isNewSize: true },
      correctChoice: "option-a"
    },
    {
      id: 4,
      optionA: { id: "option-a", name: "Berry Fusion", price: 3.60, volume: 800 },
      optionB: { id: "option-b", name: "Berry Fusion", price: 3.50, volume: 770, isNewSize: true },
      correctChoice: "option-a"
    },
    {
      id: 5,
      optionA: { id: "option-a", name: "Ultimate Mix", price: 4.95, volume: 1100 },
      optionB: { id: "option-b", name: "Ultimate Mix", price: 4.92, volume: 1090, isNewSize: true },
      correctChoice: "option-a"
    }
  ];

  const currentComparison = comparisons[currentRound];
  const juiceOptions = currentComparison ? [currentComparison.optionA, currentComparison.optionB] : [];

  const startCrafting = async () => {
    // First, speak the confirmation text
    const confirmationText = "Great! Let me prepare the juices for you. I'll get everything ready so you can help me choose the best value!";
    
    try {
      await speak(confirmationText);
      
      // Wait for speech to finish by polling isPlaying state
      const waitForSpeechEnd = () => {
        return new Promise<void>((resolve) => {
          const checkSpeech = () => {
            if (!isPlaying && !isLoading) {
              resolve();
            } else {
              setTimeout(checkSpeech, 100);
            }
          };
          // Start checking after a brief delay to ensure speech has started
          setTimeout(checkSpeech, 500);
        });
      };
      
      await waitForSpeechEnd();
      
      // Now proceed with the original crafting logic
      setGamePhase("crafting");
      setTotalScore(0);
      setCurrentRound(0);
      setCraftingProgress(0);
      
      // Simulate smoothie crafting progress
      const interval = setInterval(() => {
        setCraftingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setGamePhase("decision");
            toast.success("🥤 Smoothie crafted! Now compare your options.");
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    } catch (error) {
      console.error('Speech failed:', error);
      // If speech fails, still proceed with the game
      setGamePhase("crafting");
      setTotalScore(0);
      setCurrentRound(0);
      setCraftingProgress(0);
      
      const interval = setInterval(() => {
        setCraftingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setGamePhase("decision");
            toast.success("🥤 Smoothie crafted! Now compare your options.");
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  const makeChoice = async (optionId: string) => {
    setSelectedJuice(optionId);
    const chosen = juiceOptions.find(j => j.id === optionId);
    if (!chosen || !currentComparison) return;

    const isCorrect = optionId === currentComparison.correctChoice;
    const roundScore = isCorrect ? 10 : 5;
    const newTotalScore = totalScore + roundScore;
    
    // Save response to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('quest_responses').insert({
          user_id: user.id,
          quest_id: 'juice-shrinkflation',
          round_number: currentRound + 1,
          question_text: `Which juice offers better value between ${currentComparison.optionA.name} (${currentComparison.optionA.price} for ${currentComparison.optionA.volume}ml) and ${currentComparison.optionB.name} (${currentComparison.optionB.price} for ${currentComparison.optionB.volume}ml)?`,
          selected_option: chosen.name,
          correct_answer: currentComparison.correctChoice === currentComparison.optionA.id ? currentComparison.optionA.name : currentComparison.optionB.name,
          is_correct: isCorrect,
          score_earned: roundScore
        });
      }
    } catch (error) {
      console.error('Error saving quest response:', error);
    }
    
    setTimeout(() => {
      if (currentRound < comparisons.length - 1) {
        // Move to next round
        setCurrentRound(prev => prev + 1);
        setSelectedJuice("");
        setGamePhase("crafting");
        setCraftingProgress(0);
        setTotalScore(newTotalScore);
        
        // Quick crafting for subsequent rounds
        const interval = setInterval(() => {
          setCraftingProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setGamePhase("decision");
              return 100;
            }
            return prev + 10;
          });
        }, 50);
      } else {
        // Game complete
        onComplete(newTotalScore, optionId, isCorrect);
      }
    }, 1000);
  };

  const calculateUnitPrice = (price: number, volume: number) => {
    return ((price / volume) * 100).toFixed(2);
  };

  const getJuiceImage = (juiceName: string) => {
    switch (juiceName.toLowerCase()) {
      case 'orange burst':
        return "/lovable-uploads/7f571ee2-895c-40b2-9cd8-9481cd3dbb9f.png";
      case 'citrus mix':
        return "/lovable-uploads/a1bfc63a-8bff-46eb-a224-3d075ebdbaac.png";
      case 'tropical blend':
        return "/lovable-uploads/d8e8b90b-ee13-4504-9d86-8504b19db622.png";
      case 'berry fusion':
        return "/lovable-uploads/82870c1a-e2cb-4753-aa4d-851ee9411598.png";
      case 'ultimate mix':
        return "/lovable-uploads/65753fed-f484-42f8-a710-aae0e9776064.png";
      default:
        return "/lovable-uploads/7f571ee2-895c-40b2-9cd8-9481cd3dbb9f.png";
    }
  };

  // Auto-play Momo's speech and show typewriter when intro loads
  useEffect(() => {
    if (gamePhase === "intro" && !hasSpoken && isActive) {
      // Start typewriter effect immediately
      setShowTypewriter(true);
      // Start speech after a short delay to sync with typewriter
      setTimeout(() => {
        speak(momoText);
      }, 500);
      setHasSpoken(true);
    }
  }, [gamePhase, hasSpoken, isActive, speak, momoText]);

  const handleSpeakToggle = () => {
    if (isPlaying) {
      stop();
    } else if (gamePhase === "intro") {
      speak(momoText);
    }
  };

  const handleTypewriterComplete = () => {
    // Typewriter animation completed
    console.log("Typewriter animation completed");
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-gradient-sky overflow-y-auto z-50 p-4">
      <div className="min-h-full flex items-center justify-center py-8">
        <Card className="w-full max-w-2xl bg-card shadow-game border-2 border-secondary">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-foreground">Momo's Juice Stand</h2>
            </div>
            <p className="text-muted-foreground mb-3">Help craft the perfect smoothie and spot the best value!</p>
            <img src="/src/assets/the-juice-that-shrunk-story-image.png" alt="Momo the Juice Maker" className="mx-auto mb-4 rounded-lg max-w-32" />
          </div>

          {gamePhase === "intro" && (
            <div className="text-center space-y-6">
              <div className="bg-card/50 border border-primary/20 rounded-lg p-4 relative">
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
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
                        text={momoText} 
                        speed={30}
                        onComplete={handleTypewriterComplete}
                      />
                    ) : (
                      momoText
                    )}
                    "
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={startCrafting}
                  type="button"
                  size="lg"
                  variant="primary"
                  className="shadow-game hover:shadow-game-hover animate-float inline-flex items-center gap-2"
                >
                  <span>Okay, let's do this!</span>
                  <img
                    src="/lovable-uploads/7f571ee2-895c-40b2-9cd8-9481cd3dbb9f.png"
                    alt="orange burst juice"
                    aria-hidden="true"
                    className="h-5 w-5 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </Button>
                
                <Button
                  onClick={startCrafting}
                  type="button"
                  size="lg"
                  variant="outline"
                  className="shadow-game hover:shadow-game-hover animate-bounce inline-flex items-center gap-2"
                >
                  <span>I can't wait to help!</span>
                  <span className="text-lg">🥤</span>
                </Button>
              </div>
            </div>
          )}

          {gamePhase === "crafting" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">Crafting Your Smoothie...</h3>
                <div className="space-y-2">
                  <Progress value={craftingProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{craftingProgress.toFixed(0)}% Complete</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🍊</div>
                  <p className="text-sm">Fresh Oranges</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🧊</div>
                  <p className="text-sm">Ice Cubes</p>
                </div>
              </div>
            </div>
          )}

          {gamePhase === "decision" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">Choose Your Juice!</h3>
                <p className="text-muted-foreground mb-2">Which option gives you the best value for money?</p>
                <div className="flex justify-center items-center gap-4 mb-4">
                  <Badge 
                    variant="blue" 
                    className="px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/10 cursor-pointer animate-pulse border-primary/30"
                  >
                    🎯 Round {currentRound + 1} of {comparisons.length}
                  </Badge>
                  <Badge 
                    variant="teal" 
                    className="px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-secondary/10 cursor-pointer animate-bounce border-secondary/30"
                  >
                    ⭐ Score: {totalScore}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {juiceOptions.map((juice) => (
                  <Card 
                    key={juice.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-game-hover ${
                      selectedJuice === juice.id ? "ring-2 ring-primary bg-primary/10" : ""
                    }`}
                    onClick={() => makeChoice(juice.id)}
                  >
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto">
                        <img src={getJuiceImage(juice.name)} alt={juice.name} className="w-full h-full object-contain animate-bounce hover:scale-110 transition-transform duration-300" style={{ animation: 'bounce 2s infinite' }} />
                      </div>
                      <h4 className="font-semibold text-foreground">{juice.name}</h4>
                      
                      {juice.isNewSize && (
                        <Badge variant="muted" className="animate-pulse">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          New Size!
                        </Badge>
                      )}
                      
                      {!juice.isNewSize && (
                        <Badge
                          className="animate-pulse bg-yellow-400 text-yellow-950 hover:bg-yellow-400/90 border-transparent"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Old Size!
                        </Badge>
                      )}

                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-primary">£{juice.price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">{juice.volume}ml</div>
                        <div className="text-xs text-muted-foreground">
                          £{calculateUnitPrice(juice.price, juice.volume)}/100ml
                        </div>
                      </div>
                      
                      <Button 
                        variant={selectedJuice === juice.id ? "primary" : "outline"}
                        className="w-full shadow-game hover:shadow-game-hover"
                        disabled={!!selectedJuice}
                      >
                        {selectedJuice === juice.id ? (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Selected!
                          </>
                        ) : (
                          "Choose This"
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {selectedJuice && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Great choice! Momo is analyzing your selection...
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