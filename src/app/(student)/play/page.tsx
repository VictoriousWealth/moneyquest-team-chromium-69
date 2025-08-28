import React, { useEffect, useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Coins, Zap, MapPin, Users } from 'lucide-react';

interface Quest {
    id: string;
    title: string;
    description: string;
    zone: string;
    npc: string;
    reward_coins: number;
    reward_xp: number;
    concepts: string[];
    status?: 'Completed' | 'In progress' | 'Not started';
}

const QuestCard: React.FC<{ quest: Quest }> = ({ quest }) => {
    const statusColor = {
        'Completed': 'mint',
        'In progress': 'teal',
        'Not started': 'muted',
    } as const;

    const status = quest.status || 'Not started';

    return (
        <Card className="flex flex-col justify-between rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div>
                <img 
                    src={`https://picsum.photos/seed/${quest.id}/400/200`} 
                    alt={quest.title} 
                    className="w-full h-32 object-cover" 
                />
                <div className="p-4">
                    {/* Header with title and status */}
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="h3 mb-2 text-foreground">{quest.title}</h3>
                        <Badge variant={statusColor[status]}>{status}</Badge>
                    </div>
                    
                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-3">{quest.description}</p>
                    
                    {/* Zone and NPC info */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{quest.zone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{quest.npc}</span>
                        </div>
                    </div>
                    
                    {/* Rewards */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-amber-600">
                            <Coins className="w-4 h-4" />
                            <span className="text-sm font-medium">{quest.reward_coins}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm font-medium">{quest.reward_xp} XP</span>
                        </div>
                    </div>
                    
                    {/* Concepts */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {quest.concepts?.map(concept => (
                            <Badge key={concept} variant="blue">{concept}</Badge>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-4 pt-0">
                <Button variant="primary" className="w-full mt-2">
                    {status === 'In progress' ? 'Resume' : 'Start'}
                </Button>
            </div>
        </Card>
    );
}

const StudentPlay: React.FC = () => {
  console.log('StudentPlay component loaded - using quests from database');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestsWithProgress = async () => {
      try {
        // Fetch all quests
        const { data: questsData, error: questsError } = await supabase
          .from('quests')
          .select('*')
          .order('created_at', { ascending: true });

        if (questsError) {
          console.error('Error fetching quests:', questsError);
          return;
        }

        // Fetch user's quest progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_quest_progress')
          .select('quest_id, status, completed_at')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        if (progressError) {
          console.error('Error fetching progress:', progressError);
        }

        // Create a map of quest progress for quick lookup
        const progressMap = new Map(
          progressData?.map(p => [p.quest_id, p]) || []
        );

        // Combine quests with user progress
        const questsWithStatus: Quest[] = (questsData || []).map(quest => {
          const progress = progressMap.get(quest.id);
          let status: 'Completed' | 'In progress' | 'Not started' = 'Not started';
          
          if (progress) {
            if (progress.status === 'completed') {
              status = 'Completed';
            } else if (progress.status === 'started' || progress.status === 'in_progress') {
              status = 'In progress';
            }
          }

          return {
            ...quest,
            status
          };
        });

        setQuests(questsWithStatus);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestsWithProgress();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="h1 mb-6">Play Episodes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="h1 mb-6">Play Episodes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map(quest => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
};

export default StudentPlay;