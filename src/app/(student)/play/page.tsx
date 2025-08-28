import React, { useEffect, useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Coins, Zap, MapPin, Users } from 'lucide-react';

interface CurriculumSection {
    id: number;
    title: string;
    description: string;
    curriculum_order: number;
    concepts: string[];
}

interface Quest {
    id: string;
    title: string;
    description: string;
    zone: string;
    npc: string;
    reward_coins: number;
    reward_xp: number;
    concepts: string[];
    curriculum_section_id: number;
    order_in_section: number;
    status?: 'Completed' | 'In progress' | 'Not started';
}

interface GroupedQuests {
    section: CurriculumSection;
    quests: Quest[];
    completedCount: number;
    totalCount: number;
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
  console.log('StudentPlay component loaded - using curriculum structure');
  const [groupedQuests, setGroupedQuests] = useState<GroupedQuests[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurriculumData = async () => {
      try {
        // Fetch curriculum sections and quests with joins
        const { data: questsData, error: questsError } = await supabase
          .from('quests')
          .select(`
            *,
            curriculum_sections!inner (
              id,
              title,
              description,
              curriculum_order,
              concepts
            )
          `)
          .order('curriculum_sections.curriculum_order', { ascending: true })
          .order('order_in_section', { ascending: true });

        if (questsError) {
          console.error('Error fetching quests with curriculum:', questsError);
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

        // Process quests with status
        const questsWithStatus = (questsData || []).map(quest => {
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

        // Group quests by curriculum section
        const grouped = questsWithStatus.reduce((acc, quest) => {
          const section = quest.curriculum_sections;
          const existingGroup = acc.find(g => g.section.id === section.id);
          
          if (existingGroup) {
            existingGroup.quests.push(quest);
            existingGroup.totalCount++;
            if (quest.status === 'Completed') {
              existingGroup.completedCount++;
            }
          } else {
            acc.push({
              section,
              quests: [quest],
              completedCount: quest.status === 'Completed' ? 1 : 0,
              totalCount: 1
            });
          }
          
          return acc;
        }, [] as GroupedQuests[]);

        // Sort by curriculum order
        grouped.sort((a, b) => a.section.curriculum_order - b.section.curriculum_order);

        setGroupedQuests(grouped);
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculumData();
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
      <h1 className="h1 mb-6">Financial Quest Journey</h1>
      <div className="space-y-8">
        {groupedQuests.map(group => (
          <div key={group.section.id} className="space-y-4">
            {/* Section Header */}
            <div className="border-l-4 border-primary pl-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    📚 {group.section.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-2">
                    {group.section.description}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={group.completedCount === group.totalCount ? 'mint' : 'muted'}>
                    {group.completedCount}/{group.totalCount} completed
                  </Badge>
                </div>
              </div>
              
              {/* Section Concepts */}
              <div className="flex flex-wrap gap-2 mt-2">
                {group.section.concepts?.map(concept => (
                  <Badge key={concept} variant="teal" className="text-xs">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Quest Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-4">
              {group.quests.map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentPlay;