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
        <Card className="p-4 h-full flex flex-col relative overflow-hidden rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Profile</h3>
            <div className="mb-2">
                <h2 className="text-xl font-semibold text-text">Alex Johnson</h2>
                <p className="text-sm mt-1 text-subtext">
                    Year 9 &bull; Northwood High &bull; STU-001
                </p>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-baseline mb-3 text-sm">
                {[
                    { label: 'Year group', value: 'Year 9' },
                    { label: 'School', value: 'Northwood High' },
                    { label: 'District', value: 'Northwood' },
                    { label: 'Student ID', value: 'STU-001' },
                ].map(({ label, value }) => (
                    <React.Fragment key={label}>
                        <p className="font-medium text-subtext text-xs">{label}</p>
                        <p className="text-sm font-medium text-text">{value}</p>
                    </React.Fragment>
                ))}
            </div>

            {/* Consolidated Stats & Activity Block */}
            <div className="flex-grow flex flex-col pt-3 mt-3 border-t border-muted min-h-0">
                {/* Stats */}
                <div className="space-y-3 mb-3">
                    <div className="grid grid-cols-5 gap-3 text-center">
                        <div>
                            <p className="font-bold text-base text-text">20</p>
                            <p className="text-sm text-subtext">Episodes passed</p>
                        </div>
                        <div>
                            <p className="font-bold text-base text-text">8h 33m</p>
                            <p className="text-sm text-subtext">Time spent</p>
                        </div>
                        <div>
                            <p className="font-bold text-base text-text">29</p>
                            <p className="text-sm text-subtext">Active days</p>
                        </div>
                        <div>
                            <p className="font-bold text-base text-text">£125.50</p>
                            <p className="text-sm text-subtext">Money saved</p>
                        </div>
                        <div>
                            <p className="font-bold text-base text-text">#12</p>
                            <p className="text-sm text-subtext">Class rank</p>
                        </div>
                    </div>
                </div>

                {/* Activity Ticker - Flex container ensures title and ticker are separate */}
                <div className="flex-grow flex flex-col border-t border-muted pt-2 min-h-0">
                    <h4 className="font-medium text-sm text-subtext mb-2 flex-shrink-0">Class Activity</h4>
                    <div className="relative flex-1 group overflow-hidden" aria-live="off">
                        <div className="absolute top-0 w-full animate-[vertical-ticker-scroll_12s_linear_infinite] group-hover:[animation-play-state:paused]">
                            <div className="flex w-full items-center gap-2 rounded-lg px-1 h-[32px] text-sm">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" alt="Maria" className="w-6 h-6 rounded-full flex-shrink-0" />
                                <p className="text-subtext text-left truncate">
                                    <span className="font-medium text-text">Maria</span> is learning "The Stock Market Maze"
                                </p>
                            </div>
                            <div className="flex w-full items-center gap-2 rounded-lg px-1 h-[32px] text-sm">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sam" alt="Sam" className="w-6 h-6 rounded-full flex-shrink-0" />
                                <p className="text-subtext text-left truncate">
                                    <span className="font-medium text-text">Sam</span> just earned "Budget Boss"
                                </p>
                            </div>
                            <div className="flex w-full items-center gap-2 rounded-lg px-1 h-[32px] text-sm">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ava" alt="Ava" className="w-6 h-6 rounded-full flex-shrink-0" />
                                <p className="text-subtext text-left truncate">
                                    <span className="font-medium text-text">Ava</span> continued a 10-day streak
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileSection;