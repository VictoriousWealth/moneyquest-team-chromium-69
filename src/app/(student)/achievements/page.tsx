import React, { useState, useMemo, useEffect } from 'react';
import { allBadges, allStreaks } from '../../../lib/demoData';
import { useAchievements } from '../../../hooks/useAchievements';
import type { Badge as BadgeType, Streak as StreakType, BadgeCategory, Tier } from '../../../types';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Search, Lock, Award, Flame, Star, Zap, Gem, Shield, ChevronDown, Trophy } from 'lucide-react';
import UIBadge from '../../../components/ui/Badge';

// --- PERSISTENT STATE HOOK ---
function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
      try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
      }
    });
  
    useEffect(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }, [key, state]);
  
    return [state, setState];
}


// --- HELPER FUNCTIONS & COMPONENTS ---

const formatShortDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const badgeFunCopy: Record<string, { title: string; description: string }> = {
    first_pound: { title: "Ka-ching!", description: "You passed your first episode and banked your first £." },
    level_up: { title: "Level-Up Learner", description: "10 passes! You're levelling up faster than interest compounds." },
    marathon: { title: "Marathon Learner", description: "Keep going! Pass 25 episodes." },
    value_detective: { title: "Value Detective", description: "You sniffed out the best unit price. Grocery stores fear you now." },
    paycheck_pro: { title: "Paycheck Pro", description: "Decode a full payslip (gross, net, NI, tax code)." },
    apr_unmasker: { title: "APR Unmasker", description: "Pick the cheaper plan when APR/fees are hiding (3×)." },
    risk_ranger: { title: "Risk Ranger", description: "Diversified like a pro in Stock Market Maze. Yee-haw!" },
    goal_setter: { title: "Goal Setter", description: "Set a weekly goal and actually hit it. Consistency FTW." },
    comeback_kid: { title: "Comeback Kid", description: "Pass an episode you previously failed. Bounce back!" },
    latte_factor: { title: "Latte Factor", description: "Oops—little treats add up. You spotted the drip-drip spend." },
    lemonade_tycoon: { title: "Lemonade Tycoon", description: "Citrus CEO! You squeezed ≥£X profit from Lemonade Stand." },
    bogof_boss: { title: "BOGOF Boss", description: "Win big using multi-buy/unit-price logic." },
};

const BadgePopover: React.FC<{ badge: BadgeType }> = ({ badge }) => {
    const copy = badgeFunCopy[badge.id] || { title: badge.name, description: badge.unlockHint };

    return (
        <div className="absolute bottom-full mb-2 w-60 rounded-lg bg-surface p-3 shadow-lg ring-1 ring-ring text-left opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none z-10">
            <h4 className="font-bold text-sm text-text">{copy.title}</h4>
            <p className="text-xs text-subtext mt-1">{badge.state === 'earned' ? copy.description : `How to unlock: ${badge.unlockHint}`}</p>
            {badge.state === 'earned' && badge.contextStat && (
                 <p className="text-xs font-semibold text-blue-500 mt-2">{badge.contextStat}</p>
            )}
             {badge.state === 'earned' && badge.earnedAt && (
                 <p className="text-xs text-subtext mt-2">Earned: {formatShortDate(badge.earnedAt)}</p>
            )}
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-surface rotate-45" />
        </div>
    );
};

const BadgeTile: React.FC<{ badge: BadgeType }> = ({ badge }) => {
  const isLocked = badge.state === 'locked';

  const tierRingColorMap: Record<Tier, string> = {
    none: 'ring-transparent',
    bronze: 'ring-[#CD7F32]',
    silver: 'ring-[#C0C0C0]',
    gold: 'ring-[#FFD700]',
  };
  const tierRingClass = badge.tier && badge.tier !== 'none' ? `ring-2 ${tierRingColorMap[badge.tier]}` : '';

  return (
    <div tabIndex={0} className="relative group flex flex-col items-center justify-start text-center p-4 rounded-lg transition-all duration-150 ease-out bg-muted hover:shadow-lg hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      <BadgePopover badge={badge} />
      
      {/* Square Image Slot */}
      <div className={`relative w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] lg:w-[120px] lg:h-[120px] flex-shrink-0 transition-all rounded-lg ${tierRingClass} ring-offset-2 ring-offset-muted ${isLocked ? 'grayscale' : ''}`}>
        <div className={`w-full h-full rounded-lg bg-surface flex items-center justify-center p-1 shadow-inner`}>
           {/* Placeholder */}
           <div className="w-full h-full rounded-md border border-dashed border-slate-300 flex items-center justify-center">
             <Trophy className="text-slate-300" size={32}/>
           </div>
        </div>
        {isLocked && (
          <div className="absolute top-1 right-1 bg-surface/50 rounded-full p-1">
            <Lock size={14} className="text-subtext" />
          </div>
        )}
      </div>
      <p className="text-[10px] text-subtext/70 mt-1.5">Badge art coming soon</p>
      
      {/* Title & Subline */}
      <div className="flex-grow flex flex-col justify-center mt-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <p className={`font-semibold text-sm ${isLocked ? 'text-subtext' : 'text-text'}`}>{badge.name}</p>
            <UIBadge variant="muted" className="text-[10px] px-1 py-0">
              {badge.category}
            </UIBadge>
          </div>
          <p className="text-xs text-subtext mt-1 leading-tight">
            {isLocked ? `How to unlock: ${badge.unlockHint}` : `Earned: ${formatShortDate(badge.earnedAt!)}`}
          </p>
      </div>

    </div>
  );
};


const StreakCard: React.FC<{ streak: StreakType }> = ({ streak }) => {
    const tierConfig = {
        none:   { name: 'None',   color: 'var(--subtext)',    progressBg: 'bg-muted' },
        bronze: { name: 'Bronze', color: 'var(--blue-500)',   progressBg: 'bg-blue-500' },
        silver: { name: 'Silver', color: 'var(--teal-400)',   progressBg: 'bg-teal-400' },
        gold:   { name: 'Gold',   color: 'var(--mint-400)',   progressBg: 'bg-mint-400' },
    };

    const currentTierConfig = tierConfig[streak.currentTier];
    const unit = streak.id.includes('daily') || streak.id.includes('savings') ? 'days' : 'times';

    const totalTiers = streak.tiers.length;
    const currentTierIndex = streak.tiers.findIndex(t => streak.currentCount < t);
    const nextThreshold = streak.nextThreshold || streak.tiers[totalTiers - 1];
    const prevThreshold = currentTierIndex > 0 ? streak.tiers[currentTierIndex - 1] : 0;
    
    const progressInSegment = Math.max(0, streak.currentCount - prevThreshold);
    const segmentTotal = nextThreshold - prevThreshold;
    const progressPercent = segmentTotal > 0 ? (progressInSegment / segmentTotal) * 100 : (streak.currentCount >= nextThreshold ? 100 : 0);

    return (
        <Card className="p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-semibold text-sm text-text">{streak.name}</p>
                    <p className="text-xs text-subtext mt-1">{streak.description}</p>
                </div>
                {streak.currentTier !== 'none' && (
                    <UIBadge 
                        variant={streak.currentTier === 'gold' ? 'mint' : streak.currentTier === 'silver' ? 'teal' : 'blue'} 
                        className="capitalize text-xs"
                    >
                        {streak.currentTier}
                    </UIBadge>
                )}
            </div>
            
            {/* Main Stats */}
            <div className="flex items-baseline justify-center gap-2 text-center my-2">
                <span className="text-3xl font-bold" style={{ color: currentTierConfig.color }}>
                    {streak.currentCount}
                </span>
                <span className="text-base font-medium text-subtext">{unit}</span>
            </div>

            {/* Sub Stats & Progress */}
            <div>
                <div className="flex justify-between items-baseline text-xs text-subtext">
                    <span>Best: <span className="font-semibold text-text/90">{streak.bestCount}</span></span>
                    {streak.nextThreshold && streak.currentTier !== 'gold' && (
                       <span>Next Tier: <span className="font-semibold text-text/90">{streak.nextThreshold}</span></span>
                    )}
                </div>
                {streak.nextThreshold && streak.currentTier !== 'gold' && (
                    <div className="w-full bg-muted rounded-full h-2.5 mt-1.5 ring-1 ring-inset ring-black/5 relative">
                        <div 
                            className={`h-2.5 rounded-full transition-all duration-500 ${currentTierConfig.progressBg}`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                )}
            </div>
        </Card>
    );
};


// --- MAIN PAGE COMPONENT ---

const StudentAchievements: React.FC = () => {
  const { achievements: backendAchievements } = useAchievements();
  const [badgeFilter, setBadgeFilter] = usePersistentState<'all' | 'earned' | 'locked'>('mq-achievements-filter', 'all');
  
  const badgeCategories: BadgeCategory[] = ['Milestone', 'Skill', 'Habit', 'Fun', 'Quest'];
  const [selectedTags, setSelectedTags] = usePersistentState<BadgeCategory[]>('mq-achievements-tags', [...badgeCategories]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = usePersistentState('mq-achievements-sort', 'newest');

  // Merge frontend badges with backend achievements
  const mergedBadges = useMemo(() => {
    const frontendBadges = [...allBadges];
    const backendAchievementIds = backendAchievements.map(ba => ba.id);
    
    // Remove frontend badges that exist in backend (to avoid duplicates)
    const filteredFrontendBadges = frontendBadges.filter(fb => !backendAchievementIds.includes(fb.id));
    
    // Convert backend achievements to frontend badge format
    const backendBadgesConverted = backendAchievements.map(backendAch => {
      const categoryMap: { [key: string]: BadgeCategory } = {
        'milestone': 'Milestone',
        'skill': 'Skill', 
        'habit': 'Habit',
        'fun': 'Fun',
        'quest': 'Quest'
      };
      
      return {
        id: backendAch.id,
        name: backendAch.title,
        category: categoryMap[backendAch.achievement_type] || 'Skill',
        state: backendAch.state,
        earnedAt: backendAch.earned_at || undefined,
        unlockHint: backendAch.description,
        artKey: backendAch.achievement_type
      };
    });
    
    // Combine filtered frontend badges with backend badges
    return [...filteredFrontendBadges, ...backendBadgesConverted];
  }, [backendAchievements]);

  const handleTagToggle = (tag: BadgeCategory) => {
    setSelectedTags(prev => 
        prev.includes(tag) 
            ? prev.filter(t => t !== tag) 
            : [...prev, tag]
    );
  };

  const processedBadges = useMemo(() => {
    let badges = [...mergedBadges];
    
    // 1. Filter by earned state
    if (badgeFilter !== 'all') {
      badges = badges.filter(b => b.state === badgeFilter);
    }
    
    // 2. Filter by selected tags (only if not all are selected)
    if (selectedTags.length > 0 && selectedTags.length < badgeCategories.length) {
      badges = badges.filter(b => selectedTags.includes(b.category));
    } else if (selectedTags.length === 0) {
      badges = [];
    }
    
    // 3. Filter by search term
    if (searchTerm) {
      badges = badges.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.unlockHint.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 4. Sort
    switch (sortBy) {
        case 'newest':
            badges.sort((a, b) => {
                if (a.state === 'locked' && b.state === 'earned') return 1;
                if (b.state === 'locked' && a.state === 'earned') return -1;
                if (a.state === 'locked' && b.state === 'locked') return a.name.localeCompare(b.name);
                return new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime();
            });
            break;
        case 'rarest':
            const categoryOrder: Record<BadgeCategory, number> = { 'Milestone': 1, 'Skill': 2, 'Habit': 3, 'Fun': 4, 'Quest': 5 };
            badges.sort((a, b) => categoryOrder[a.category] - categoryOrder[b.category] || a.name.localeCompare(b.name));
            break;
        case 'category':
            badges.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
            break;
        case 'az':
            badges.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'progress':
            // TODO: Implement sorting by progress when data is available
            badges.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    return badges;
  }, [mergedBadges, badgeFilter, selectedTags, searchTerm, sortBy]);
  
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-base font-semibold mb-4">Active Streaks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {allStreaks.map(streak => <StreakCard key={streak.id} streak={streak} />)}
        </div>
      </section>
      
      <section>
        <h3 className="text-base font-semibold mb-4">Badge Collection</h3>
        
        <Card className="p-4 mb-6">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 rounded-full bg-muted p-1">
                        {(['all', 'earned', 'locked'] as const).map(f => (
                            <Button key={f} variant={badgeFilter === f ? 'primary' : 'ghost'} onClick={() => setBadgeFilter(f)} className="!rounded-full !px-3 !py-1 !text-xs capitalize">{f}</Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtext" />
                            <input placeholder="Search badges..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-48 rounded-md bg-muted py-2 pl-9 pr-3 text-sm" />
                        </div>
                        <div className="relative">
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-48 appearance-none rounded-md bg-muted py-2 pl-3 pr-8 text-sm font-medium text-subtext focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="newest">Sort: Newest earned</option>
                                <option value="rarest">Sort: Rarest first</option>
                                <option value="category">Sort: Category</option>
                                <option value="az">Sort: A → Z</option>
                                <option value="progress">Sort: Progress to next</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtext pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap border-t border-muted pt-4">
                    <span className="text-sm font-medium text-subtext mr-2">Categories:</span>
                    {badgeCategories.map(tag => (
                        <Button 
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            variant={selectedTags.includes(tag) ? 'primary' : 'outline'}
                            className="!rounded-full !px-3 !py-1 !text-xs"
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>
        </Card>
        
        {processedBadges.length === 0 ? (
             <div className="text-center py-10 rounded-lg bg-muted"><p className="text-subtext">No badges match your filters.</p></div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {processedBadges.map(badge => <BadgeTile key={badge.id} badge={badge} />)}
            </div>
        )}
      </section>
    </div>
  );
};

export default StudentAchievements;