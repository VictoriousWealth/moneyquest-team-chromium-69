import React, { useState, useMemo } from 'react';
import { useAchievements, AchievementWithStatus } from '../../../hooks/useAchievements';
import { useAwardAchievement } from '../../../hooks/useAwardAchievement';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Search, Lock, Trophy, ChevronDown, Award } from 'lucide-react';
import UIBadge from '../../../components/ui/Badge';

// Helper functions
const formatShortDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// Badge tile component for backend achievements
const BackendBadgeTile: React.FC<{ achievement: AchievementWithStatus }> = ({ achievement }) => {
  const isLocked = achievement.state === 'locked';

  return (
    <div tabIndex={0} className="relative group flex flex-col items-center justify-start text-center p-4 rounded-lg transition-all duration-150 ease-out bg-muted hover:shadow-lg hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      
      {/* Square Image Slot */}
      <div className={`relative w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] lg:w-[120px] lg:h-[120px] flex-shrink-0 transition-all rounded-lg ring-offset-2 ring-offset-muted ${isLocked ? 'grayscale' : ''}`}>
        <div className={`w-full h-full rounded-lg bg-surface flex items-center justify-center p-1 shadow-inner`}>
          {/* Achievement icon */}
          <div className="w-full h-full rounded-md flex items-center justify-center text-4xl">
            {achievement.icon || <Trophy className="text-slate-300" size={32}/>}
          </div>
        </div>
        {isLocked && (
          <div className="absolute top-1 right-1 bg-surface/50 rounded-full p-1">
            <Lock size={14} className="text-subtext" />
          </div>
        )}
      </div>
      
      {/* Title & Description */}
      <div className="flex-grow flex flex-col justify-center mt-3">
        <p className={`font-semibold text-sm ${isLocked ? 'text-subtext' : 'text-text'}`}>
          {achievement.title}
        </p>
        <p className="text-xs text-subtext mt-1 leading-tight">
          {isLocked 
            ? achievement.description 
            : achievement.earned_at ? `Earned: ${formatShortDate(achievement.earned_at)}` : 'Earned'
          }
        </p>
        {achievement.state === 'earned' && achievement.reward_coins > 0 && (
          <p className="text-xs font-semibold text-yellow-600 mt-1">
            +{achievement.reward_coins} coins
          </p>
        )}
      </div>
    </div>
  );
};

const BackendStudentAchievements: React.FC = () => {
  const { achievements, loading, error } = useAchievements();
  const { awardAchievement } = useAwardAchievement();
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [awarding, setAwarding] = useState<string | null>(null);

  // Get unique categories from backend data
  const achievementCategories = useMemo(() => {
    const categories = [...new Set(achievements.map(a => a.category))];
    return categories.sort();
  }, [achievements]);

  const [selectedTags, setSelectedTags] = useState<string[]>(achievementCategories);

  // Update selected tags when categories change
  React.useEffect(() => {
    if (achievementCategories.length > 0 && selectedTags.length === 0) {
      setSelectedTags(achievementCategories);
    }
  }, [achievementCategories, selectedTags.length]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const processedAchievements = useMemo(() => {
    let filtered = [...achievements];
    
    // 1. Filter by earned state
    if (badgeFilter !== 'all') {
      filtered = filtered.filter(a => a.state === badgeFilter);
    }
    
    // 2. Filter by selected categories
    if (selectedTags.length > 0 && selectedTags.length < achievementCategories.length) {
      filtered = filtered.filter(a => selectedTags.includes(a.category));
    } else if (selectedTags.length === 0) {
      filtered = [];
    }
    
    // 3. Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 4. Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => {
          if (a.state === 'locked' && b.state === 'earned') return 1;
          if (b.state === 'locked' && a.state === 'earned') return -1;
          if (a.state === 'locked' && b.state === 'locked') return a.title.localeCompare(b.title);
          if (!a.earned_at || !b.earned_at) return 0;
          return new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime();
        });
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
        break;
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [achievements, badgeFilter, selectedTags, searchTerm, sortBy, achievementCategories.length]);

  // Test function to award achievements
  const handleTestAward = async (achievementId: string) => {
    try {
      setAwarding(achievementId);
      await awardAchievement(achievementId);
      // Refresh the page to see the new achievement
      window.location.reload();
    } catch (error) {
      console.error('Failed to award achievement:', error);
      alert('Failed to award achievement. Make sure you are logged in.');
    } finally {
      setAwarding(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Trophy className="h-12 w-12 text-blue-500 mx-auto animate-pulse" />
            <p className="text-subtext mt-2">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Trophy className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-red-600 mt-2">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const earnedCount = achievements.filter(a => a.state === 'earned').length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-8">
      {/* Stats Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg p-6 text-white">
        <h1 className="h1 mb-2">Your Achievements</h1>
        <p className="text-blue-100">
          You've earned <span className="font-bold">{earnedCount}</span> out of <span className="font-bold">{totalCount}</span> achievements
        </p>
      </div>
      
      {/* Test Section for Awarding Achievements */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-600" />
          Test Achievement System
        </h3>
        <p className="text-sm text-subtext mb-4">
          Click the buttons below to test awarding achievements. Note: You need to be logged in for this to work.
        </p>
        <div className="flex flex-wrap gap-2">
          {achievements.filter(a => a.state === 'locked').slice(0, 5).map(achievement => (
            <Button
              key={achievement.id}
              variant="outline"
              size="sm"
              onClick={() => handleTestAward(achievement.id)}
              disabled={awarding === achievement.id}
              className="text-xs"
            >
              {awarding === achievement.id ? 'Awarding...' : `Award "${achievement.title}"`}
            </Button>
          ))}
          {achievements.filter(a => a.state === 'locked').length === 0 && (
            <p className="text-sm text-green-600">🎉 All achievements earned!</p>
          )}
        </div>
      </Card>
      
      <section>
        <h3 className="text-base font-semibold mb-4">Achievement Collection</h3>
        
        <Card className="p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 rounded-full bg-muted p-1">
                {(['all', 'earned', 'locked'] as const).map(f => (
                  <Button 
                    key={f} 
                    variant={badgeFilter === f ? 'primary' : 'ghost'} 
                    onClick={() => setBadgeFilter(f)} 
                    className="!rounded-full !px-3 !py-1 !text-xs capitalize"
                  >
                    {f}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtext" />
                  <input 
                    placeholder="Search achievements..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="w-48 rounded-md bg-muted py-2 pl-9 pr-3 text-sm" 
                  />
                </div>
                <div className="relative">
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)} 
                    className="w-48 appearance-none rounded-md bg-muted py-2 pl-3 pr-8 text-sm font-medium text-subtext focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Sort: Newest earned</option>
                    <option value="category">Sort: Category</option>
                    <option value="az">Sort: A → Z</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtext pointer-events-none" />
                </div>
              </div>
            </div>
            
            {achievementCategories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap border-t border-muted pt-4">
                <span className="text-sm font-medium text-subtext mr-2">Categories:</span>
                {achievementCategories.map(category => (
                  <Button 
                    key={category}
                    onClick={() => handleTagToggle(category)}
                    variant={selectedTags.includes(category) ? 'primary' : 'outline'}
                    className="!rounded-full !px-3 !py-1 !text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Card>
        
        {processedAchievements.length === 0 ? (
          <div className="text-center py-10 rounded-lg bg-muted">
            <p className="text-subtext">No achievements match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {processedAchievements.map(achievement => (
              <BackendBadgeTile key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BackendStudentAchievements;