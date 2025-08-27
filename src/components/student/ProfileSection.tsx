import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { demoStudent, demoPrefs, demoClassActivity, dailyActivity } from '../../lib/demoData';
import { Camera } from 'lucide-react';

// Util for GBP currency formatting
const formatGBP = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};

const ProfileSection = () => {
    const stats = useMemo(() => {
        return {
            episodesCompleted: dailyActivity.reduce((sum, day) => sum + day.pass, 0),
            timeSpent: dailyActivity.reduce((sum, day) => sum + day.time, 0),
            activeDays: dailyActivity.filter(day => day.attempts > 0).length
        };
    }, []);

    return (
        <Card className="p-5 h-full flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-semibold mb-3">Profile</h3>

            <div className="flex items-center gap-4 mb-3">
                <button className="relative group flex-shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                    <img
                        src={demoPrefs.avatarUrl}
                        alt="Student Avatar"
                        className="w-24 h-24 rounded-full ring-4 ring-surface shadow-md object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                        <Camera size={24} />
                        <span className="text-xs mt-1">Edit</span>
                    </div>
                </button>

                <div className="flex-grow min-w-0">
                    <h2 className="font-bold text-lg text-text truncate">{demoStudent.name}</h2>
                    <p className="text-subtext text-sm">Level {demoStudent.level}</p>
                    <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-[var(--blue-500)] to-[var(--teal-400)] transition-all duration-300"
                                style={{width: `${Math.min((demoStudent.xp % 1000) / 10, 100)}%`}}
                            />
                        </div>
                        <span className="text-xs text-subtext whitespace-nowrap">{demoStudent.xp} XP</span>
                    </div>
                </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                        <div className="font-bold text-lg text-text">{stats.episodesCompleted}</div>
                        <div className="text-xs text-subtext">Episodes</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg text-text">{Math.round(stats.timeSpent / 60)}h</div>
                        <div className="text-xs text-subtext">Study Time</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg text-text">{demoStudent.streakDays}</div>
                        <div className="text-xs text-subtext">Day Streak</div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 flex-grow">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-subtext">Profile Completeness</span>
                    <span className="font-medium text-text">{demoStudent.profileCompleteness}%</span>
                </div>
                <div className="bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                        className="h-full bg-[var(--accent)] transition-all duration-300"
                        style={{width: `${demoStudent.profileCompleteness}%`}}
                    />
                </div>
                <p className="text-xs text-subtext">
                    Complete your profile to unlock achievements and personalized recommendations.
                </p>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--ring)]">
                <Link 
                    to="/student/achievements" 
                    className="block text-center text-sm font-medium text-[var(--blue-500)] hover:text-[var(--blue-800)] transition-colors"
                >
                    View All Achievements →
                </Link>
            </div>
        </Card>
    );
};

export default ProfileSection;