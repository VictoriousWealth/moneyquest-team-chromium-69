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
                        <div className="flex items-center gap-1 text-primary">
                            <Coins className="w-4 h-4" />
                            <span className="text-sm font-medium">{quest.reward_coins}</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
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
  const quests = React.useMemo(() => groupedQuests.flatMap(g => g.quests), [groupedQuests]);

  useEffect(() => {
    const fetchCurriculumData = async () => {
      try {
        // Fetch curriculum sections first
        const { data: sections, error: sectionsError } = await supabase
          .from('curriculum_sections')
          .select('*')
          .order('curriculum_order', { ascending: true });

        if (sectionsError) {
          console.error('Error fetching curriculum sections:', sectionsError);
          return;
        }

        // Fetch quests without joins
        const { data: questsData, error: questsError } = await supabase
          .from('quests')
          .select('*')
          .order('order_in_section', { ascending: true })
          .order('created_at', { ascending: true });

        if (questsError) {
          console.error('Error fetching quests:', questsError);
          return;
        }

        // Fetch user's quest progress
        const currentUser = (await supabase.auth.getUser()).data.user;
        const { data: progressData, error: progressError } = await supabase
          .from('user_quest_progress')
          .select('quest_id, status, completed_at')
          .eq('user_id', currentUser?.id || '00000000-0000-0000-0000-000000000000');

        if (progressError) {
          console.error('Error fetching progress:', progressError);
        }

        // Map progress by quest_id
        const progressMap = new Map(progressData?.map(p => [p.quest_id, p]) || []);

        // Attach status from progress to quests
        const questsWithStatus: Quest[] = (questsData || []).map((q: any) => {
          const progress = progressMap.get(q.id);
          let status: 'Completed' | 'In progress' | 'Not started' = 'Not started';
          if (progress) {
            if (progress.status === 'completed') status = 'Completed';
            else if (progress.status === 'started' || progress.status === 'in_progress') status = 'In progress';
          }
          return { ...q, status } as Quest;
        });

        // Group quests by curriculum section
        const sectionMap = new Map((sections || []).map(s => [s.id, s]));
        const grouped: GroupedQuests[] = [];

        for (const quest of questsWithStatus) {
          const section = sectionMap.get(quest.curriculum_section_id);
          if (!section) continue; // skip quests not assigned to a section

          let group = grouped.find(g => g.section.id === section.id);
          if (!group) {
            group = { section, quests: [], completedCount: 0, totalCount: 0 } as GroupedQuests;
            grouped.push(group);
          }
          group.quests.push(quest);
          group.totalCount += 1;
          if (quest.status === 'Completed') group.completedCount += 1;
        }

        // Ensure groups are ordered by curriculum_order
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

  if (!loading && groupedQuests.length === 0) {
    return (
      <div>
        <h1 className="h1 mb-6">Financial Quest Journey</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">No quests found. Add quests in the database or assign them to curriculum sections.</p>
        </Card>
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
                    {group.section.curriculum_order}. {group.section.title}
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