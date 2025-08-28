import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Coins, Trophy, Star, Play } from "lucide-react";

interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'available' | 'in_progress' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: {
    coins: number;
    xp: number;
  };
}

interface QuestBoardProps {
  quests: Quest[];
  onQuestStart: (questId: string) => void;
  onQuestContinue: (questId: string) => void;
}

export const QuestBoard = ({ quests, onQuestStart, onQuestContinue }: QuestBoardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'completed': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Quest Board</h1>
        <p className="text-muted-foreground">Choose your adventure and learn financial skills!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {quests.map((quest) => (
          <Card key={quest.id} className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{quest.title}</h3>
                  <p className="text-muted-foreground text-sm">{quest.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${getDifficultyColor(quest.difficulty)} text-white border-transparent`}
                  >
                    {quest.difficulty}
                  </Badge>
                  <span className={`text-sm font-medium ${getStatusColor(quest.status)}`}>
                    {quest.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span>{quest.rewards.coins} coins</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-blue-500" />
                  <span>{quest.rewards.xp} XP</span>
                </div>
              </div>

              <div className="pt-2">
                {quest.status === 'available' && (
                  <Button 
                    onClick={() => onQuestStart(quest.id)}
                    className="w-full"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Quest
                  </Button>
                )}
                {quest.status === 'in_progress' && (
                  <Button 
                    onClick={() => onQuestContinue(quest.id)}
                    className="w-full"
                    size="lg"
                    variant="outline"
                  >
                    Continue Quest
                  </Button>
                )}
                {quest.status === 'completed' && (
                  <Button 
                    disabled
                    className="w-full"
                    size="lg"
                    variant="outline"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Completed
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};