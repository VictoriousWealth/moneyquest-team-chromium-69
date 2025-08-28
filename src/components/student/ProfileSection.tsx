import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { demoStudent, demoPrefs, demoClassActivity, dailyActivity } from '../../lib/demoData';
import { Camera, Trophy, Clock, Calendar, PiggyBank, Award } from 'lucide-react';

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
        <Card className="p-3 h-full flex flex-col relative overflow-hidden rounded-xl">
            <h3 className="text-base font-semibold mb-2">Profile</h3>
            <div className="flex items-center gap-3 mb-2">
                <div className="relative group cursor-pointer">
                    <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                        alt="Alex Johnson" 
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
                    <h4 className="text-base font-semibold text-text">Alex Johnson</h4>
                    <p className="text-xs mt-1 text-subtext">
                        Year 9 &bull; Northwood High &bull; STU-001
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 items-baseline mb-2 text-xs">
                {[
                    { label: 'Year group', value: 'Year 9' },
                    { label: 'School', value: 'Northwood High' },
                    { label: 'District', value: 'Northwood' },
                    { label: 'Student ID', value: 'STU-001' },
                ].map(({ label, value }) => (
                    <React.Fragment key={label}>
                        <p className="font-medium text-subtext text-xs">{label}</p>
                        <p className="text-xs font-medium text-text">{value}</p>
                    </React.Fragment>
                ))}
            </div>

            {/* Consolidated Stats & Activity Block */}
            <div className="flex-grow flex flex-col pt-2 mt-2 border-t border-muted min-h-0">
                {/* Stats */}
                <div className="space-y-2 mb-2">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Trophy size={16} className="text-blue-500" />
                                <p className="font-semibold text-sm text-text">20</p>
                            </div>
                            <p className="text-xs text-subtext">Episodes passed</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Clock size={16} className="text-blue-500" />
                                <p className="font-semibold text-sm text-text">8h 33m</p>
                            </div>
                            <p className="text-xs text-subtext">Time spent</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Calendar size={16} className="text-blue-500" />
                                <p className="font-semibold text-sm text-text">29</p>
                            </div>
                            <p className="text-xs text-subtext">Active days</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <PiggyBank size={16} className="text-mint-400" />
                                <p className="font-semibold text-sm text-text">£125.50</p>
                            </div>
                            <p className="text-xs text-subtext">Money saved</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Award size={16} className="text-blue-500" />
                                <p className="font-semibold text-sm text-text">#12</p>
                            </div>
                            <p className="text-xs text-subtext">Class rank</p>
                        </div>
                    </div>
                </div>

                {/* Activity Ticker - Flex container ensures title and ticker are separate */}
                <div className="flex-grow flex flex-col border-t border-muted pt-2 min-h-0">
                    <h4 className="font-medium text-xs text-subtext mb-1 flex-shrink-0">Class Activity</h4>
                    <div className="relative flex-1 overflow-hidden h-6" aria-live="off">
                        <div className="absolute inset-0 animate-[continuous-scroll_20s_linear_infinite]">
                            {/* Complete list of activities that will scroll continuously */}
                            <div className="space-y-1">
                                <div className="flex w-full items-center gap-2 px-1 h-[24px] text-xs">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" alt="Maria" className="w-5 h-5 rounded-full flex-shrink-0" />
                                    <p className="text-subtext text-left truncate">
                                        <span className="font-medium text-text">Maria</span> is learning "The Stock Market Maze"
                                    </p>
                                </div>
                                <div className="flex w-full items-center gap-2 px-1 h-[24px] text-xs">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sam" alt="Sam" className="w-5 h-5 rounded-full flex-shrink-0" />
                                    <p className="text-subtext text-left truncate">
                                        <span className="font-medium text-text">Sam</span> just earned "Budget Boss"
                                    </p>
                                </div>
                                <div className="flex w-full items-center gap-2 px-1 h-[24px] text-xs">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ava" alt="Ava" className="w-5 h-5 rounded-full flex-shrink-0" />
                                    <p className="text-subtext text-left truncate">
                                        <span className="font-medium text-text">Ava</span> continued a 10-day streak
                                    </p>
                                </div>
                                <div className="flex w-full items-center gap-2 px-1 h-[24px] text-xs">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jake" alt="Jake" className="w-5 h-5 rounded-full flex-shrink-0" />
                                    <p className="text-subtext text-left truncate">
                                        <span className="font-medium text-text">Jake</span> completed "Investment Basics"
                                    </p>
                                </div>
                                <div className="flex w-full items-center gap-2 px-1 h-[24px] text-xs">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" alt="Emma" className="w-5 h-5 rounded-full flex-shrink-0" />
                                    <p className="text-subtext text-left truncate">
                                        <span className="font-medium text-text">Emma</span> reached level 5 in Savings
                                    </p>
                                </div>
                                <div className="flex w-full items-center gap-2 px-1 h-[24px] text-xs">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver" alt="Oliver" className="w-5 h-5 rounded-full flex-shrink-0" />
                                    <p className="text-subtext text-left truncate">
                                        <span className="font-medium text-text">Oliver</span> unlocked "Crypto Explorer"
                                    </p>
                                </div>
                                <div className="flex w-full items-center gap-2 px-1 h-[24px] text-xs">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lily" alt="Lily" className="w-5 h-5 rounded-full flex-shrink-0" />
                                    <p className="text-subtext text-left truncate">
                                        <span className="font-medium text-text">Lily</span> mastered "Tax Basics"
                                    </p>
                                </div>
                                <div className="flex w-full items-center gap-2 px-1 h-[24px] text-xs">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Noah" alt="Noah" className="w-5 h-5 rounded-full flex-shrink-0" />
                                    <p className="text-subtext text-left truncate">
                                        <span className="font-medium text-text">Noah</span> started "Real Estate Basics"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileSection;