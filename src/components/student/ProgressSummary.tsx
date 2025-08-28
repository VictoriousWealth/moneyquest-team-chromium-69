import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import UIBadge from '../ui/Badge';
import { useDailyActivities, type DailyActivity } from '../../hooks/useDailyActivities';
import { useStreaks } from '../../hooks/useStreaks';
import { useAchievements } from '../../hooks/useAchievements';
import { Flame, Clock, BookOpen, ArrowRight, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import Button from '../ui/Button';

// --- HELPER FUNCTIONS & COMPONENTS ---

const Tooltip = ({ activity, position }: { activity: DailyActivity; position: { top: number; left: number } }) => {
    if (!activity || activity.attempts === 0) return null;
    
    return (
        <div 
            className="absolute z-10 w-64 rounded-xl bg-surface p-3 shadow-soft ring-1 ring-blue800/50 text-left pointer-events-none"
            style={{ top: position.top, left: position.left, transform: 'translate(-50%, calc(-100% - 8px))' }}
        >
            <p className="font-semibold text-sm text-text">{new Date(activity.activity_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <p className="text-xs mt-1">Attempts: {activity.attempts} (Pass {activity.passes} / Fail {activity.attempts - activity.passes})</p>
            <p className="text-xs">Time: {activity.time_spent_minutes}m</p>
            {activity.concepts && activity.concepts.length > 0 && (
                <div className="mt-2 pt-2 border-t border-muted">
                    <p className="text-xs font-semibold text-text mb-1">Concepts covered:</p>
                    {activity.concepts.map((concept, i) => (
                        <p key={i} className="text-xs text-subtext">{concept}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

const getIntensityClass = (attempts: number) => {
    if (attempts === 0) return 'bg-surface ring-1 ring-inset ring-ring shadow-inner';
    if (attempts <= 1) return 'bg-[#d6e9fb]';
    if (attempts <= 3) return 'bg-[#a9d2f5]';
    if (attempts <= 5) return 'bg-[#6bb5ea]';
    return 'bg-[#338aca]';
};

const generateMonthGrid = (date: Date) => {
    const grid = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday is 0

    for (let i = 0; i < startDayOfWeek; i++) {
        grid.push(null);
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        grid.push(new Date(year, month, i));
    }
    return grid;
};

// --- RIGHT PANEL COMPONENTS ---

const MonthSummary = ({ activities }: { activities: DailyActivity[] }) => {
    const { getCurrentStreak, getBestStreak } = useStreaks();
    const { achievements } = useAchievements();
    
    const currentStreak = getCurrentStreak('daily_play');
    const bestStreak = getBestStreak('daily_play');
    
    // Get recent earned achievements
    const recentAchievements = achievements
        .filter(a => a.state === 'earned')
        .slice(0, 3);

    return (
        <div className="flex flex-col h-full py-3">
            <h4 className="font-semibold text-sm text-text mb-3">This Month</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted text-sm">
                    <Flame className="text-orange-500" size={20} />
                    <div>
                        <p className="font-bold text-lg">{currentStreak}</p>
                        <p className="text-xs text-subtext">Current streak</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted text-sm">
                    <Trophy className="text-subtext" size={20} />
                    <div>
                        <p className="font-bold text-lg">{bestStreak}</p>
                        <p className="text-xs text-subtext">Longest streak</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm text-text">Recent achievements</h4>
                <Link to="/student/achievements">
                    <Button variant="ghost" size="sm">View all</Button>
                </Link>
            </div>
            
            {recentAchievements.length > 0 ? (
                <div className="flex items-start gap-4 mb-4">
                    {recentAchievements.map(achievement => (
                        <div key={achievement.id} className="text-center group flex-1">
                            <img 
                                src={`https://picsum.photos/seed/${achievement.id}/64/64`} 
                                alt={achievement.title} 
                                className="w-14 h-14 rounded-full mx-auto bg-muted object-cover shadow-sm ring-2 ring-surface transition-transform group-hover:scale-110" 
                            />
                            <p className="text-[11px] font-medium leading-tight text-text mt-1.5 truncate">{achievement.title}</p>
                            {achievement.earned_at && (
                                <p className="text-[11px] leading-tight text-subtext">
                                    {new Date(achievement.earned_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-sm text-subtext mb-4">No achievements earned yet</div>
            )}

            <div className="mt-auto">
                {/* Space for future content */}
            </div>
        </div>
    );
};

const DayDetail = ({ activity }: { activity: DailyActivity }) => {
    const date = new Date(activity.activity_date + 'T00:00:00');
    
    return (
        <div className="flex flex-col h-full">
            <h4 className="font-semibold text-sm text-text mb-3">
                {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} — Activity
            </h4>
            <div className="space-y-3 flex-grow overflow-y-auto pr-2 -mr-2">
                <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <UIBadge variant={activity.passes > 0 ? 'mint' : 'muted'}>
                            {activity.passes > 0 ? 'Pass' : 'Attempted'}
                        </UIBadge>
                        <p className="font-medium text-text">Learning Activity</p>
                    </div>
                    <div className="flex items-center gap-4 pl-2 text-xs">
                        <span><Clock size={12} className="inline mr-1" />{activity.time_spent_minutes}m</span>
                        <span>Attempts: {activity.attempts}</span>
                        <span>Passes: {activity.passes}</span>
                    </div>
                    {activity.concepts && activity.concepts.length > 0 && (
                        <div className="flex items-start gap-1.5 pl-2 mt-2 text-xs">
                            <BookOpen size={12} className="mt-0.5" />
                            <div>
                                <p className="font-medium">Concepts covered:</p>
                                <p className="text-subtext">{activity.concepts.join(', ')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-auto border-t border-muted pt-3 space-y-2">
                <div className="bg-blue-800/10 text-blue-500 p-3 rounded-lg text-xs font-medium text-center">
                    Great work today! Keep up the momentum.
                </div>
                <Link to="/student/journal" className="inline-flex items-center justify-center w-full gap-1 text-sm font-medium text-blue-500 hover:underline">
                    Open full Journal <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const ProgressSummary = () => {
    const { activities, loading, error } = useDailyActivities();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [hoveredDay, setHoveredDay] = useState<DailyActivity | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const gridRef = useRef<HTMLDivElement>(null);
    const TODAY = new Date();

    const activityMap = useMemo(() => 
        new Map(activities.map(d => [d.activity_date, d])), 
        [activities]
    );
    
    const calendarGrid = useMemo(() => generateMonthGrid(currentDate), [currentDate]);
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const activitiesForMonth = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        return activities.filter(d => {
            const activityDate = new Date(d.activity_date);
            return activityDate.getMonth() === month && activityDate.getFullYear() === year;
        });
    }, [currentDate, activities]);

    const selectedDayActivity = selectedDay ? activityMap.get(selectedDay) : null;
    const numDateRows = Math.ceil(calendarGrid.length / 7);

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
        setSelectedDay(null);
    };
    
    const handleMouseEnter = (day: Date, e: React.MouseEvent<HTMLButtonElement>) => {
        const activity = activityMap.get(day.toISOString().split('T')[0]);
        if (activity) {
            setHoveredDay(activity);
            const rect = e.currentTarget.getBoundingClientRect();
            const containerRect = gridRef.current?.getBoundingClientRect();
            if (containerRect) {
                setTooltipPos({
                    top: rect.top - containerRect.top,
                    left: rect.left - containerRect.left + rect.width / 2
                });
            }
        }
    };

    if (loading) {
        return (
            <Card className="p-5 h-full flex flex-col">
                <div className="animate-pulse">
                    <div className="h-6 bg-muted rounded w-48 mb-4"></div>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className="h-8 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-5 h-full flex flex-col">
                <h3 className="text-base font-semibold mb-4">Progress</h3>
                <div className="text-sm text-red-500">Error loading progress data: {error}</div>
            </Card>
        );
    }

    return (
        <Card className="p-5 h-full flex flex-col">
            <header className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold">Progress — {monthName}</h3>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleMonthChange('prev')} 
                        className="p-1 text-subtext hover:text-text disabled:opacity-50" 
                        aria-label="Previous month"
                    >
                        <ChevronLeft size={20}/>
                    </button>
                    <button 
                        onClick={() => handleMonthChange('next')} 
                        className="p-1 text-subtext hover:text-text disabled:opacity-50" 
                        aria-label="Next month"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>
            
            <div className="flex flex-row gap-6 md:gap-8 flex-grow min-h-0">
                {/* Left Panel: Calendar */}
                <div className="flex-shrink-0 w-full md:w-[380px] flex flex-col">
                    <div className="relative flex-grow flex flex-col" ref={gridRef}>
                        {hoveredDay && <Tooltip activity={hoveredDay} position={tooltipPos} />}
                        <div className="grid grid-cols-7 gap-1.5 flex-grow" style={{ gridTemplateRows: `auto repeat(${numDateRows}, 1fr)` }}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => 
                                <div key={day} className="flex items-center justify-center text-center text-xs h-8">{day}</div>
                            )}
                            {calendarGrid.map((day, index) => {
                                if (!day) return <div key={`empty-${index}`} />;
                                
                                const dateStr = day.toISOString().split('T')[0];
                                const isFuture = day > TODAY;

                                if (isFuture) {
                                    return (
                                        <div
                                            key={dateStr}
                                            className="w-full h-full flex items-center justify-center rounded-xl text-xs text-subtext/50 pointer-events-none"
                                            aria-disabled="true"
                                        >
                                            {day.getDate()}
                                        </div>
                                    );
                                }
                                
                                const isToday = dateStr === TODAY.toISOString().split('T')[0];
                                const activity = activityMap.get(dateStr);
                                const isSelected = selectedDay === dateStr;
                                const attempts = activity?.attempts || 0;

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                                        onMouseLeave={() => setHoveredDay(null)}
                                        onFocus={(e) => handleMouseEnter(day, e as any)}
                                        onBlur={() => setHoveredDay(null)}
                                        aria-label={`${day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: ${attempts} attempts`}
                                        className={`w-full h-full flex items-center justify-center rounded-xl text-xs transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 ${getIntensityClass(attempts)} ${isSelected ? 'ring-2 ring-blue-800 ring-offset-1' : ''} ${isToday ? 'font-bold ring-2 ring-blue-500' : ''}`}
                                    >
                                        {day.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-subtext shrink-0">
                            <span>Activity level (attempts/day)</span>
                            <div className="flex items-center gap-1.5">
                                <span>Low</span>
                                <div title="0 attempts" className="w-3.5 h-3.5 rounded-full bg-surface ring-1 ring-inset ring-gray-300" />
                                <div title="1 attempt" className="w-3.5 h-3.5 rounded-full bg-[#d6e9fb] ring-1 ring-inset ring-gray-300" />
                                <div title="2-3 attempts" className="w-3.5 h-3.5 rounded-full bg-[#a9d2f5] ring-1 ring-inset ring-gray-300" />
                                <div title="4-5 attempts" className="w-3.5 h-3.5 rounded-full bg-[#6bb5ea] ring-1 ring-inset ring-gray-300" />
                                <div title="6+ attempts" className="w-3.5 h-3.5 rounded-full bg-[#338aca] ring-1 ring-inset ring-gray-300" />
                                <span>High</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Summary/Details */}
                <div className="flex-1 md:border-l md:pl-6 lg:pl-8 border-muted">
                    {selectedDayActivity && selectedDayActivity.attempts > 0
                        ? <DayDetail activity={selectedDayActivity} />
                        : <MonthSummary activities={activitiesForMonth} />
                    }
                </div>
            </div>
        </Card>
    );
};

export default ProgressSummary;