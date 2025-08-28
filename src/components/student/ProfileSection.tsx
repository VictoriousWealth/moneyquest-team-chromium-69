import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { demoStudent, demoPrefs, demoClassActivity, dailyActivity } from '../../lib/demoData';
import { Camera, Trophy, Clock, Calendar, PiggyBank, Award } from 'lucide-react';
import { useCompleteStudentData } from '../../hooks/useCompleteStudentData';
import { useDatabaseAchievements } from '../../hooks/useDatabaseAchievements';
import Badge from '../ui/Badge';

// Util for GBP currency formatting
const formatGBP = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};

const ProfileSection = () => {
    const { profile, progress, gameState, loading } = useCompleteStudentData();
    const { badges } = useDatabaseAchievements();
    
    const stats = useMemo(() => {
        if (loading || !progress) {
            return {
                episodesCompleted: dailyActivity.reduce((sum, day) => sum + day.pass, 0),
                timeSpent: dailyActivity.reduce((sum, day) => sum + day.time, 0),
                activeDays: dailyActivity.filter(day => day.attempts > 0).length
            };
        }
        return {
            episodesCompleted: progress.episodes_passed || 0,
            timeSpent: progress.time_spent_minutes || 0,
            activeDays: progress.active_days || 0
        };
    }, [progress, loading]);

    // Get achievements earned this month from database
    const thisMonthAchievements = useMemo(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        return badges.filter(badge => {
            if (!badge.isEarned || !badge.earnedAt) return false;
            const earnedDate = new Date(badge.earnedAt);
            return earnedDate.getMonth() === currentMonth && earnedDate.getFullYear() === currentYear;
        }).slice(0, 3); // Show up to 3 recent badges
    }, [badges]);

    const formatTimeSpent = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const activities = [
        { seed: 'Maria', name: 'Maria', text: 'is learning "The Stock Market Maze"' },
        { seed: 'Sam', name: 'Sam', text: 'just earned "Budget Boss"' },
        { seed: 'Ava', name: 'Ava', text: 'continued a 10-day streak' },
        { seed: 'Jake', name: 'Jake', text: 'completed "Investment Basics"' },
        { seed: 'Emma', name: 'Emma', text: 'reached level 5 in Savings' },
        { seed: 'Oliver', name: 'Oliver', text: 'unlocked "Crypto Explorer"' },
        { seed: 'Lily', name: 'Lily', text: 'mastered "Tax Basics"' },
        { seed: 'Noah', name: 'Noah', text: 'started "Real Estate Basics"' },
    ];
    const ROW_H = 25; // px, must match each row height
    
    // Create tripled array for seamless infinite loop
    const infiniteActivities = [...activities, ...activities, ...activities];
    return (
        <Card className="p-3 h-full flex flex-col relative overflow-hidden rounded-xl">
            <h3 className="text-base font-semibold mb-2">Profile</h3>
            <div className="flex items-center gap-3 mb-2">
                <div className="relative group cursor-pointer">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Alex'}`} 
                        alt={profile?.username || 'Student'} 
                        className="w-16 h-16 rounded-full bg-muted object-cover shadow-sm ring-2 ring-surface transition-opacity group-hover:opacity-75" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={16} className="text-white" />
                        <span className="sr-only">Change image</span>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Change image
                    </div>
                </div>
                <div>
                    <h4 className="text-base font-semibold text-text">{profile?.username || 'Loading...'}</h4>
                </div>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 items-baseline mb-2 text-xs">
                {[
                    { label: 'Year group', value: profile?.year || 'Loading...' },
                    { label: 'School', value: profile?.school || 'Loading...' },
                    { label: 'District', value: profile?.district || 'Loading...' },
                    { label: 'Student ID', value: profile?.student_id || 'Loading...' },
                ].map(({ label, value }) => (
                    <React.Fragment key={label}>
                        <p className="font-medium text-subtext text-xs leading-relaxed">{label}</p>
                        <p className="text-xs font-medium text-text leading-relaxed">{value}</p>
                    </React.Fragment>
                ))}
            </div>

            {/* Consolidated Stats & Activity Block */}
            <div className="flex-grow flex flex-col pt-2 mt-4 border-t border-muted min-h-0">
                {/* Stats */}
                <div className="space-y-4 flex-shrink-0">
                     <div className="grid grid-cols-3 gap-2 text-center">
                         <div>
                             <div className="flex items-center justify-center gap-1 mb-1">
                                 <Trophy size={16} className="text-blue-500" />
                                 <p className="font-semibold text-sm text-text">{stats.episodesCompleted}</p>
                             </div>
                             <p className="text-xs text-subtext">Episodes passed</p>
                         </div>
                         <div>
                             <div className="flex items-center justify-center gap-1 mb-1">
                                 <Clock size={16} className="text-blue-500" />
                                 <p className="font-semibold text-sm text-text">{formatTimeSpent(stats.timeSpent)}</p>
                             </div>
                             <p className="text-xs text-subtext">Time spent</p>
                         </div>
                         <div>
                             <div className="flex items-center justify-center gap-1 mb-1">
                                 <Calendar size={16} className="text-blue-500" />
                                 <p className="font-semibold text-sm text-text">{stats.activeDays}</p>
                             </div>
                             <p className="text-xs text-subtext">Active days</p>
                         </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2 text-center">
                         <div>
                             <div className="flex items-center justify-center gap-1 mb-1">
                                 <PiggyBank size={16} className="text-mint-400" />
                                 <p className="font-semibold text-sm text-text">{formatGBP(progress?.money_saved || 125.50)}</p>
                             </div>
                             <p className="text-xs text-subtext">Money saved</p>
                         </div>
                         <div>
                             <div className="flex items-center justify-center gap-1 mb-1">
                                 <Award size={16} className="text-blue-500" />
                                 <p className="font-semibold text-sm text-text">#{progress?.class_rank || 12}</p>
                             </div>
                             <p className="text-xs text-subtext">Class rank</p>
                         </div>
                     </div>
                 </div>


                {/* Activity Ticker - Continuous rolling animation */}
                <div className="mt-3 flex-grow flex flex-col border-t border-muted pt-4 min-h-0">
                    <h4 className="font-medium text-xs text-subtext mb-3 flex-shrink-0">Class Activity</h4>
                    <div className="relative overflow-hidden h-12 flex-shrink-0" aria-live="off">
                        <div className="activity-ticker-scroll">
                          {infiniteActivities.map((a, index) => (
                            <div key={`${a.seed}-${index}`} className="flex w-full items-center gap-2 px-1 h-[25px] text-xs">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.seed}`} alt={a.name} className="w-5 h-5 rounded-full flex-shrink-0" />
                              <p className="text-subtext text-left truncate">
                                <span className="font-medium text-text">{a.name}</span> {a.text}
                              </p>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileSection;