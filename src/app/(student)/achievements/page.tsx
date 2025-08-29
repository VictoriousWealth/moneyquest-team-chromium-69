import React, { useState, useMemo, useEffect } from 'react';
import { allStreaks } from '../../../lib/demoData';
import { useDatabaseAchievements, type DatabaseBadge } from '../../../hooks/useDatabaseAchievements';
import type { Streak as StreakType, BadgeCategory, Tier } from '../../../types';
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

const BadgeImageWithFallback: React.FC<{ badgeId: string; onFallback: (isFallback: boolean) => void }> = ({ badgeId, onFallback }) => {
  const [imageError, setImageError] = useState(false);
  const imagePath = `/images/${badgeId}.png`;

  const handleImageError = () => {
    setImageError(true);
    onFallback(true);
  };

  const handleImageLoad = () => {
    onFallback(false);
  };

  if (imageError) {
    return (
      <div className="w-full h-full rounded-md border border-dashed border-slate-300 flex items-center justify-center">
        <Trophy className="text-slate-300" size={32}/>
      </div>
    );
  }

  return (
    <img 
      src={imagePath}
      alt={`${badgeId} badge`}
      className="w-full h-full object-cover rounded-md"
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
};

// Map achievement types to badge categories
const typeToCategory: Record<string, BadgeCategory> = {
  milestone: 'Milestone',
  skill: 'Skill',
  habit: 'Habit',
  fun: 'Fun',
  quest: 'Quest'
};

const BadgePopover: React.FC<{ badge: DatabaseBadge }> = ({ badge }) => {
    return (
        <div className="absolute bottom-full mb-2 w-60 rounded-lg bg-surface p-3 shadow-lg ring-1 ring-ring text-left opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none z-10">
            <h4 className="font-bold text-sm text-text">{badge.title}</h4>
            <p className="text-xs text-subtext mt-1">
              {badge.isEarned ? 
                (badge.performanceSummary || badge.description) : 
                `How to unlock: ${badge.description}`
              }
            </p>
            {badge.isEarned && badge.contextStat && (
                 <p className="text-xs font-semibold text-blue-500 mt-2">{badge.contextStat}</p>
            )}
             {badge.isEarned && badge.earnedAt && (
                 <p className="text-xs text-subtext mt-2">Earned: {formatShortDate(badge.earnedAt)}</p>
            )}
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-surface rotate-45" />
        </div>
    );
};

const BadgeTile: React.FC<{ badge: DatabaseBadge }> = ({ badge }) => {
  const isLocked = !badge.isEarned;
  const category = typeToCategory[badge.achievement_type] || 'Skill';
  const [showFallback, setShowFallback] = useState(false);

  return (
    <div tabIndex={0} className="relative group flex flex-col items-center justify-start text-center p-4 rounded-lg transition-all duration-150 ease-out bg-muted hover:shadow-lg hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      <BadgePopover badge={badge} />
      
      {/* Square Image Slot */}
      <div className={`relative w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] lg:w-[120px] lg:h-[120px] flex-shrink-0 transition-all rounded-lg ring-offset-2 ring-offset-muted ${isLocked ? 'grayscale' : ''}`}>
        <div className={`w-full h-full rounded-lg bg-surface flex items-center justify-center p-1 shadow-inner`}>
           <BadgeImageWithFallback badgeId={badge.id} onFallback={setShowFallback} />
        </div>
        {isLocked && (
          <div className="absolute top-1 right-1 bg-surface/50 rounded-full p-1">
            <Lock size={14} className="text-subtext" />
          </div>
        )}
      </div>
      {showFallback && <p className="text-[10px] text-subtext/70 mt-1.5">Badge art coming soon</p>}
      
      {/* Title & Subline */}
      <div className="flex-grow flex flex-col justify-center mt-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <p className={`font-semibold text-sm ${isLocked ? 'text-subtext' : 'text-text'}`}>{badge.title}</p>
            <UIBadge variant="muted" className="text-[10px] px-1 py-0">
              {category}
            </UIBadge>
          </div>
          <p className="text-xs text-subtext mt-1 leading-tight">
            {isLocked ? 
              `How to unlock: ${badge.description}` : 
              `Earned: ${formatShortDate(badge.earnedAt!)}`
            }
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
  const { badges, loading, error } = useDatabaseAchievements();
  const [badgeFilter, setBadgeFilter] = usePersistentState<'all' | 'earned' | 'locked'>('mq-achievements-filter', 'all');
  
  const badgeCategories: BadgeCategory[] = ['Milestone', 'Skill', 'Habit', 'Fun', 'Quest'];
  const [selectedTags, setSelectedTags] = usePersistentState<BadgeCategory[]>('mq-achievements-tags', [...badgeCategories]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = usePersistentState('mq-achievements-sort', 'newest');

  const handleTagToggle = (tag: BadgeCategory) => {
    setSelectedTags(prev => 
        prev.includes(tag) 
            ? prev.filter(t => t !== tag) 
            : [...prev, tag]
    );
  };

  const processedBadges = useMemo(() => {
    let filteredBadges = [...badges];
    
    // 1. Filter by earned state
    if (badgeFilter === 'earned') {
      filteredBadges = filteredBadges.filter(b => b.isEarned);
    } else if (badgeFilter === 'locked') {
      filteredBadges = filteredBadges.filter(b => !b.isEarned);
    }
    
    // 2. Filter by selected tags
    if (selectedTags.length > 0 && selectedTags.length < badgeCategories.length) {
      filteredBadges = filteredBadges.filter(b => {
        const category = typeToCategory[b.achievement_type] || 'Skill';
        return selectedTags.includes(category);
      });
    } else if (selectedTags.length === 0) {
      filteredBadges = [];
    }
    
    // 3. Filter by search term
    if (searchTerm) {
      filteredBadges = filteredBadges.filter(b => 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 4. Sort
    switch (sortBy) {
        case 'newest':
            filteredBadges.sort((a, b) => {
                if (!a.isEarned && b.isEarned) return 1;
                if (!b.isEarned && a.isEarned) return -1;
                if (!a.isEarned && !b.isEarned) return a.title.localeCompare(b.title);
                return new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime();
            });
            break;
        case 'category':
            filteredBadges.sort((a, b) => a.achievement_type.localeCompare(b.achievement_type) || a.title.localeCompare(b.title));
            break;
        case 'az':
            filteredBadges.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            filteredBadges.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

    return filteredBadges;
  }, [badges, badgeFilter, selectedTags, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading achievements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">Error loading achievements: {error}</div>
      </div>
    );
  }
  
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
                                <option value="category">Sort: Category</option>
                                <option value="az">Sort: A → Z</option>
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