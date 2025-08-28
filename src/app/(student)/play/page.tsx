import React, { useEffect, useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../../components/ui/dialog';
import { Coins, Zap, MapPin, Users, Search, Filter, X } from 'lucide-react';

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

const QuestCard: React.FC<{ quest: Quest; onClick: () => void }> = ({ quest, onClick }) => {
    const statusColor = {
        'Completed': 'mint',
        'In progress': 'teal',
        'Not started': 'muted',
    } as const;

    const status = quest.status || 'Not started';

    return (
        <Card className="flex flex-col justify-between rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
            <div>
                <img 
                    src={`https://picsum.photos/seed/${quest.id}/500/240`} 
                    alt={quest.title} 
                    className="w-full h-40 object-cover" 
                />
                <div className="p-4">
                    {/* Header with title and status */}
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className="font-semibold text-sm text-foreground flex-1 min-w-0">{quest.title}</h3>
                      <Badge variant={statusColor[status]} className="flex-shrink-0">{status}</Badge>
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
        </Card>
    );
}

const StudentPlay: React.FC = () => {
  console.log('StudentPlay component loaded - using curriculum structure');
  const [groupedQuests, setGroupedQuests] = useState<GroupedQuests[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  
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

  // Filter and search logic
  const filteredGroupedQuests = React.useMemo(() => {
    return groupedQuests.map(group => {
      const filteredQuests = group.quests.filter(quest => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
          quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quest.concepts.some(concept => concept.toLowerCase().includes(searchTerm.toLowerCase())) ||
          quest.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quest.npc.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus = statusFilter === 'all' || quest.status === statusFilter;

        // Section filter
        const matchesSection = sectionFilter === 'all' || group.section.id.toString() === sectionFilter;

        return matchesSearch && matchesStatus && matchesSection;
      });

      return {
        ...group,
        quests: filteredQuests,
        totalCount: filteredQuests.length,
        completedCount: filteredQuests.filter(q => q.status === 'Completed').length
      };
    }).filter(group => group.quests.length > 0); // Only show sections with matching quests
  }, [groupedQuests, searchTerm, statusFilter, sectionFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSectionFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || sectionFilter !== 'all';

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
      
      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar - Full Width */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search quests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-gray-200 focus:border-blue-400"
          />
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Status Filter Group */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Status:</span>
            <div className="flex gap-1">
              {['all', 'Not started', 'In progress', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-blue-50 bg-gray-100'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
          
          {/* Separator */}
          <div className="h-6 w-px bg-border"></div>
          
          {/* Section Filter Group */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Section:</span>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-50 text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer appearance-none"
            >
              <option value="all">All Sections</option>
              {groupedQuests.map(group => (
                <option key={group.section.id} value={group.section.id.toString()}>
                  {group.section.curriculum_order}. {group.section.title}
                </option>
              ))}
            </select>
          </div>
          
          {/* Clear Filters */}
          {hasActiveFilters && (
            <>
              <div className="h-6 w-px bg-border"></div>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-blue-50 bg-gray-100 transition-all"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </>
          )}
        </div>
        
        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredGroupedQuests.reduce((acc, group) => acc + group.quests.length, 0)}</span> quests
            {filteredGroupedQuests.length !== groupedQuests.length && 
              <span> across <span className="font-medium text-foreground">{filteredGroupedQuests.length}</span> sections</span>
            }
          </div>
        )}
      </div>
      
      {/* Quest Sections */}
      <div className="space-y-8">
        {filteredGroupedQuests.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No quests match your current filters.</p>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="mt-3"
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          filteredGroupedQuests.map(group => (
            <div key={group.section.id} className="space-y-4">
              {/* Section Header */}
              <div className="border-l-4 border-primary pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-foreground mb-1">
                      {group.section.curriculum_order}. {group.section.title}
                    </h2>
                    <p className="text-muted-foreground text-xs mb-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ml-4">
                {group.quests.map(quest => (
                  <QuestCard key={quest.id} quest={quest} onClick={() => setSelectedQuest(quest)} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Quest Details Popup */}
      <Dialog open={!!selectedQuest} onOpenChange={() => setSelectedQuest(null)}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-600">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {selectedQuest && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">
                    <img 
                      src={`https://picsum.photos/seed/${selectedQuest.id}/100/100`} 
                      alt={selectedQuest.title} 
                      className="w-16 h-16 rounded-lg object-cover" 
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-blue-900">{selectedQuest.title}</DialogTitle>
                    <p className="text-blue-700 font-medium">with {selectedQuest.npc}</p>
                  </div>
                </div>
              </DialogHeader>

              <p className="text-blue-800 mb-4 leading-relaxed">{selectedQuest.description}</p>

              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-2 bg-blue-200 rounded-lg p-3">
                  <MapPin className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-medium text-blue-800">{selectedQuest.zone}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-200 rounded-lg p-3">
                  <Users className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-medium text-blue-800">{selectedQuest.npc}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-blue-700" />
                    <span className="text-sm font-medium text-blue-800">{selectedQuest.reward_coins} coins</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Zap className="w-5 h-5 text-blue-700" />
                    <span className="text-sm font-medium text-blue-800">{selectedQuest.reward_xp} XP</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-y-2 flex-col">
                {selectedQuest.status === "Not started" && (
                  <Button
                    size="lg"
                    onClick={() => {
                      // Handle quest start - open in new tab
                      window.open(`/quest/${selectedQuest.id}`, '_blank');
                      setSelectedQuest(null);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg"
                  >
                    🚀 Start Quest
                  </Button>
                )}
                {selectedQuest.status === "In progress" && (
                  <Button
                    size="lg"
                    onClick={() => {
                      // Handle quest continue - open in new tab
                      window.open(`/quest/${selectedQuest.id}`, '_blank');
                      setSelectedQuest(null);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg animate-pulse"
                  >
                    ⚡ Continue Quest
                  </Button>
                )}
                {selectedQuest.status === "Completed" && (
                  <Button size="lg" disabled className="bg-gray-400 text-gray-600 font-bold px-8 py-3 rounded-xl">
                    ✅ Completed
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPlay;