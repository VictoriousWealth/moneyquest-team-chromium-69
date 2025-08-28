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
            <div className="mb-3">
                <h2 className="text-2xl font-semibold text-text">{demoStudent.name}</h2>
                <p className="small mt-1">
                    {demoStudent.year} &bull; {demoStudent.school} &bull; {demoStudent.id}
                </p>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 items-baseline mb-4">
                {[
                    { label: 'Year group', value: demoStudent.year },
                    { label: 'School', value: demoStudent.school },
                    { label: 'District', value: demoStudent.district },
                    { label: 'Student ID', value: demoStudent.id },
                ].map(({ label, value }) => (
                    <React.Fragment key={label}>
                        <p className="font-semibold text-sm text-subtext">{label}</p>
                        <p className="text-base font-medium text-text">{value}</p>
                    </React.Fragment>
                ))}
            </div>

            {/* Consolidated Stats & Activity Block */}
            <div className="flex-grow flex flex-col pt-4 mt-4 border-t border-muted">
                {/* Stats */}
                <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-5 gap-3 text-center">
                        <div>
                            <p className="font-bold text-lg text-text">{stats.episodesCompleted}</p>
                            <p className="text-sm text-subtext">Episodes passed</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-text">{Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m</p>
                            <p className="text-sm text-subtext">Time spent</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-text">{stats.activeDays}</p>
                            <p className="text-sm text-subtext">Active days</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-text">{formatGBP(demoStudent.moneySaved)}</p>
                            <p className="text-sm text-subtext">Money saved</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-text">#{demoStudent.rank}</p>
                            <p className="text-sm text-subtext">Class rank</p>
                        </div>
                    </div>
                </div>

                {/* Activity Ticker - Flex container ensures title and ticker are separate */}
                <div className="flex-grow flex flex-col border-t border-muted pt-3">
                    <h4 className="font-medium text-base text-subtext mb-2 flex-shrink-0">Class Activity</h4>
                    <div className="relative flex-1 group overflow-hidden" aria-live="off">
                        <div className="absolute top-0 w-full animate-[vertical-ticker-scroll_12s_linear_infinite] group-hover:[animation-play-state:paused]">
                            {[...demoClassActivity, ...demoClassActivity].map((activity, index) => (
                                <Link to={activity.link} key={`${activity.id}-${index}`} className="flex w-full items-center gap-3 rounded-lg px-1 h-[40px] text-base">
                                    <img src={activity.avatarUrl} alt={activity.peerName} className="w-8 h-8 rounded-full flex-shrink-0" />
                                    <p className="text-subtext text-left truncate">
                                        <span className="font-semibold text-text">{activity.peerName}</span> {activity.text}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileSection;