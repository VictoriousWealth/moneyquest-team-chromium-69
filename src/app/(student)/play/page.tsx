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

const QuestCard: React.FC<{ quest: Quest; onClick?: () => void }> = ({ quest, onClick }) => {
    const statusColor = {
        'Completed': 'mint',
        'In progress': 'teal',
        'Not started': 'muted',
    } as const;

    const status = quest.status || 'Not started';
    
    // Check if this quest should use popup (only for the 3 specific quests)
    const usePopup = ["The Juice That Shrunk", "Pancake Price Storm", "Momo Summer Job Dilemma"].includes(quest.title);

    return (
        <Card className="flex flex-col justify-between rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div>
                <img 
                    src={quest.title === "The Juice That Shrunk" ? "/lovable-uploads/3d24a1f5-6261-49c1-8237-6f1c0cff430c.png" : `https://picsum.photos/seed/${quest.id}/500/240`} 
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
            <div className="p-4 pt-0">
                <Button 
                    variant="primary" 
                    className="w-full mt-2"
                    onClick={usePopup ? onClick : undefined}
                >
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
                {group.quests.map(quest => {
                  const usePopup = ["The Juice That Shrunk", "Pancake Price Storm", "Momo Summer Job Dilemma", "Pippa\'s Business Challenge"].includes(quest.title);
                  return (
                    <QuestCard 
                      key={quest.id} 
                      quest={quest} 
                      onClick={usePopup ? () => setSelectedQuest(quest) : undefined} 
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Quest Details Popup */}
      <Dialog open={!!selectedQuest} onOpenChange={() => setSelectedQuest(null)}>
        <DialogContent className="max-w-md bg-[var(--surface)] border-0 shadow-[var(--shadow-soft)] ring-1 ring-[var(--ring)] rounded-xl overflow-hidden">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {selectedQuest && (
            <div className="p-3 rounded-xl">
              <DialogHeader className="mb-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <img 
                      src={`https://picsum.photos/seed/${selectedQuest.id}/50/50`} 
                      alt={selectedQuest.title} 
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-[var(--ring)]" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-[var(--text)] font-semibold mb-1" style={{ fontSize: 'var(--body)' }}>{selectedQuest.title}</DialogTitle>
                    <p className="text-[var(--subtext)]" style={{ fontSize: '13px' }}>Adventure with {selectedQuest.npc}</p>
                    <div className="mt-2">
                      <Badge variant={selectedQuest.status === 'Completed' ? 'mint' : selectedQuest.status === 'In progress' ? 'teal' : 'muted'}>
                        {selectedQuest.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="mb-3 bg-[var(--muted)]/30 p-3 rounded-xl">
                <p className="text-[var(--text)]" style={{ fontSize: '13px', lineHeight: '1.3' }}>{selectedQuest.description}</p>
                
                {/* Concepts */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedQuest.concepts?.slice(0, 3).map(concept => (
                    <Badge key={concept} variant="blue" className="text-xs px-2 py-0.5 rounded-full">{concept}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-2 bg-[var(--muted)] rounded-xl p-2">
                  <MapPin className="w-3 h-3 text-[var(--primary)] flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[var(--subtext)] block" style={{ fontSize: '10px' }}>Location</span>
                    <span className="text-[var(--text)] font-medium truncate block" style={{ fontSize: '12px' }}>{selectedQuest.zone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[var(--muted)] rounded-xl p-2">
                  <Users className="w-3 h-3 text-[var(--primary)] flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[var(--subtext)] block" style={{ fontSize: '10px' }}>Guide</span>
                    <span className="text-[var(--text)] font-medium truncate block" style={{ fontSize: '12px' }}>{selectedQuest.npc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[var(--muted)] rounded-xl p-2">
                  <Coins className="w-3 h-3 text-[var(--primary)] flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[var(--subtext)] block" style={{ fontSize: '10px' }}>Coins</span>
                    <span className="text-[var(--text)] font-medium" style={{ fontSize: '12px' }}>{selectedQuest.reward_coins}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[var(--muted)] rounded-xl p-2">
                  <Zap className="w-3 h-3 text-[var(--primary)] flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[var(--subtext)] block" style={{ fontSize: '10px' }}>XP</span>
                    <span className="text-[var(--text)] font-medium" style={{ fontSize: '12px' }}>{selectedQuest.reward_xp}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                {selectedQuest.status === "Not started" && (
                  <Button
                    variant="primary"
                    size="default"
                    onClick={() => {
                       // Map quest titles to URLs for same-tab navigation
                       const questUrlMap: Record<string, string> = {
                         "The Juice That Shrunk": "#/student/quest/juice-shrinkflation",
                         "Pancake Price Storm": "#/student/quest/pancake-price-storm", 
                         "Momo Summer Job Dilemma": "#/student/quest/momo-summer-job-dilemma"
                       };
                       const questUrl = questUrlMap[selectedQuest.title];
                       if (questUrl) {
                         window.location.href = questUrl;
                       }
                       setSelectedQuest(null);
                    }}
                    className="px-6 py-3 rounded-xl"
                  >
                    🚀 Start Quest
                  </Button>
                )}
                {selectedQuest.status === "In progress" && (
                  <Button
                    variant="accent"
                    size="default"
                    onClick={() => {
                       // Map quest titles to URLs for same-tab navigation
                       const questUrlMap: Record<string, string> = {
                         "The Juice That Shrunk": "#/student/quest/juice-shrinkflation",
                         "Pancake Price Storm": "#/student/quest/pancake-price-storm", 
                         "Momo Summer Job Dilemma": "#/student/quest/momo-summer-job-dilemma"
                       };
                       const questUrl = questUrlMap[selectedQuest.title];
                       if (questUrl) {
                         window.location.href = questUrl;
                       }
                       setSelectedQuest(null);
                    }}
                    className="px-6 py-3 animate-pulse rounded-xl"
                  >
                    ⚡ Continue Quest
                  </Button>
                )}
                {selectedQuest.status === "Completed" && (
                  <Button variant="muted" size="default" disabled className="px-6 py-3 rounded-xl">
                    ✅ Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPlay;