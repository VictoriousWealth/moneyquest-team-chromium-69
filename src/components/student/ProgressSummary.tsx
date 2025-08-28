import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import UIBadge from '../ui/Badge';
import type { DailyActivity } from '../../lib/demoData';
import { Flame, Clock, BookOpen, ArrowRight, ChevronLeft, ChevronRight, Trophy, Eye } from 'lucide-react';
import Button from '../ui/Button';
import { useCompleteStudentData } from '../../hooks/useCompleteStudentData';
import { useDatabaseAchievements } from '../../hooks/useDatabaseAchievements';

// --- HELPER FUNCTIONS & COMPONENTS ---

// Helper to format dates consistently for local comparison
const toLocalISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Tooltip = ({ activity, position }: { activity: DailyActivity; position: { top: number; left: number } }) => {
    if (!activity || activity.attempts === 0) return null;
    const conceptEntries = Object.entries(activity.concepts).filter(([, count]) => count > 0);
    
    return (
        <div 
            className="absolute z-10 w-64 rounded-xl bg-surface p-3 shadow-soft ring-1 ring-blue800/50 text-left pointer-events-none"
            style={{ top: position.top, left: position.left, transform: 'translate(-50%, calc(-100% - 8px))' }}
        >
            <p className="font-semibold text-sm text-text">{new Date(activity.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <p className="text-xs mt-1">Attempts: {activity.attempts} (Pass {activity.pass} / Fail {activity.fail})</p>
            <p className="text-xs">Time: {activity.time}m</p>
            {conceptEntries.length > 0 && (
                <div className="mt-2 pt-2 border-t border-muted">
                    <p className="text-xs font-semibold text-text mb-1">Concepts covered:</p>
                    {conceptEntries.map(([concept, count]) => (
                        <p key={concept} className="text-xs text-subtext">{concept} (x{count})</p>
                    ))}
                </div>
            )}
             {activity.details[0]?.reason && (
                <div className="mt-2 pt-2 border-t border-muted">
                    <p className="text-xs font-semibold text-text mb-1">Note:</p>
                    <p className="text-xs text-subtext">{activity.details[0].reason}</p>
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

const MonthSummary = ({ activity, currentDate }: { activity: any[]; currentDate: Date }) => {
    const { badges } = useDatabaseAchievements();
    
    // Filter badges to the selected month
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const badgesToShow = badges
      .filter(b => b.isEarned && b.earnedAt && new Date(b.earnedAt).getMonth() === month && new Date(b.earnedAt).getFullYear() === year)
      .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
      .slice(0, 3);

    // Calculate streaks ONLY from the current month's activities
    const activeDaysInMonth = activity.filter((d: any) => d.attempts > 0);

    let mainStreak;
    if (activeDaysInMonth.length === 0) {
      mainStreak = { current_count: 0, best_count: 0 };
    } else {
      const dayMs = 24 * 60 * 60 * 1000;
      const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

      const activeDates = activeDaysInMonth
        .map((d: any) => normalize(new Date(d.date + 'T00:00:00')))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime());

      // Remove duplicates
      const uniqueDates: Date[] = [];
      for (const d of activeDates) {
        if (!uniqueDates.length || uniqueDates[uniqueDates.length - 1].getTime() !== d.getTime()) {
          uniqueDates.push(d);
        }
      }

      let best = 0;
      let current = 0;
      let prev: Date | null = null;
      
      // Calculate current streak (ending at the latest day) and best streak
      for (const d of uniqueDates) {
        if (prev && d.getTime() - prev.getTime() === dayMs) {
          current += 1;
        } else {
          current = 1;
        }
        best = Math.max(best, current);
        prev = d;
      }

      mainStreak = { current_count: current, best_count: best };
    }

    return (
        <div className="flex flex-col h-full py-3">
            <h4 className="font-semibold text-sm text-text mb-3">This Month</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted text-sm">
                    <Flame className="text-orange-500" size={20} />
                    <div>
                        <p className="font-bold text-lg">{mainStreak.current_count}</p>
                        <p className="text-xs text-subtext capitalize">Daily Play Streak</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-md bg-muted text-sm">
                    <Trophy className="text-subtext" size={20} />
                    <div>
                        <p className="font-bold text-lg">{mainStreak.best_count}</p>
                        <p className="text-xs text-subtext">Longest streak</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm text-text">Badges earned</h4>
                <Link to="/student/achievements">
                    <Button variant="ghost" size="sm">View all</Button>
                </Link>
            </div>
             <div className="flex items-start gap-4 mb-4">
                {badgesToShow.length > 0 ? badgesToShow.map(badge => (
                    <div 
                        key={badge.id} 
                        className="text-center group flex-1" 
                    >
                        <div className="w-14 h-14 rounded-full mx-auto bg-muted flex items-center justify-center shadow-sm ring-2 ring-surface transition-transform group-hover:scale-110">
                            <Trophy className="text-blue-500" size={20} />
                        </div>
                        <p className="text-[11px] font-medium leading-tight text-text mt-1.5 truncate">{badge.title}</p>
                        <p className="text-[11px] leading-tight text-subtext">
                            {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recently'}
                        </p>
                    </div>
                )) : (
                    <div className="text-center text-subtext text-sm py-4">
                        No badges earned this month yet
                    </div>
                )}
            </div>


            <div className="mt-auto">
                {/* Totals section moved to ProfileSection.tsx */}
            </div>
        </div>
    );
};

const DayDetail = ({ activity, journalEntries, questResponses }: { 
    activity: DailyActivity; 
    journalEntries: any[];
    questResponses: any[];
}) => {
    const date = new Date(activity.date + 'T00:00:00');
    
    // Get journal entries and quest responses for this specific date
    const dayJournalEntries = journalEntries.filter(entry => {
        const entryDate = new Date(entry.created_at).toLocaleDateString('en-CA');
        return entryDate === activity.date;
    });
    
    const dayQuestResponses = questResponses.filter(response => {
        const responseDate = new Date(response.created_at).toLocaleDateString('en-CA');
        return responseDate === activity.date;
    });

    // Generate mentor tips based on recent concepts and performance
    const getMentorTip = () => {
        const concepts = activity.concepts || [];
        const successRate = activity.attempts > 0 ? (activity.pass / activity.attempts) * 100 : 0;
        
        if (concepts.length === 0) {
            return "Keep exploring! Every day brings new learning opportunities.";
        }
        
        const mainConcept = concepts[0];
        
        if (successRate >= 80) {
            return `Excellent work with ${mainConcept}! You're mastering these concepts.`;
        } else if (successRate >= 60) {
            return `Good progress on ${mainConcept}. Keep practicing to strengthen your understanding.`;
        } else if (successRate >= 40) {
            return `${mainConcept} can be tricky. Try breaking it down into smaller steps.`;
        } else {
            return `Don't worry about ${mainConcept} - every expert was once a beginner. Keep trying!`;
        }
    };
    
    return (
        <div className="flex flex-col h-full">
             <h4 className="font-semibold text-sm text-text mb-3">
                {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} — Activity
            </h4>
            <div className="space-y-3 flex-grow overflow-y-auto pr-2 -mr-2">
                {/* Show quest responses for this day */}
                {dayQuestResponses.slice(0, 3).map((response, i) => (
                    <div key={i} className="text-sm">
                        <div className="flex items-center gap-2">
                            <UIBadge variant={response.is_correct ? 'mint' : 'muted'}>
                                {response.is_correct ? 'Correct' : 'Incorrect'}
                            </UIBadge>
                            <p className="font-medium text-text truncate">{response.quest_id}</p>
                        </div>
                        <div className="flex items-center gap-4 pl-2 mt-1.5 text-xs">
                            <span><Clock size={12} className="inline mr-1" />{Math.round((response.response_time_ms || 0) / 1000 / 60)}m</span>
                             <div className="flex items-center gap-1.5 truncate">
                                <BookOpen size={12} />
                                <span className="truncate">{response.question_text || 'Quest activity'}</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Show journal entries for this day */}
                {dayJournalEntries.slice(0, 2).map((entry, i) => (
                    <div key={`journal-${i}`} className="text-sm">
                        <div className="flex items-center gap-2">
                            <UIBadge variant="teal">Journal</UIBadge>
                            <p className="font-medium text-text truncate">{entry.episode_title}</p>
                        </div>
                        <div className="flex items-center gap-4 pl-2 mt-1.5 text-xs">
                            <span><Clock size={12} className="inline mr-1" />{entry.time_spent_minutes || 0}m</span>
                             <div className="flex items-center gap-1.5 truncate">
                                <BookOpen size={12} />
                                <span className="truncate">{(entry.concepts || []).join(', ')}</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* If no activities, show a message */}
                {dayQuestResponses.length === 0 && dayJournalEntries.length === 0 && (
                    <div className="text-sm text-subtext text-center py-4">
                        No detailed activities recorded for this day
                    </div>
                )}
            </div>
             <div className="mt-auto border-t border-muted pt-3 space-y-2">
                <div className="bg-blue-800/10 text-blue-500 p-3 rounded-lg text-xs font-medium text-center">
                    {getMentorTip()}
                </div>
                 <Link to="/student/journal" className="inline-flex items-center justify-center w-full gap-1 text-sm font-medium text-blue-500 hover:underline">
                    Open full Journal <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}


// --- MAIN COMPONENT ---

const ProgressSummary = () => {
    const { dailyActivities, streaks, journalEntries, questResponses } = useCompleteStudentData();
    const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [hoveredDay, setHoveredDay] = useState<DailyActivity | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const gridRef = useRef<HTMLDivElement>(null);
    const TODAY = new Date(2025, 7, 29); // Friday, Aug 29, 2025 is "today"

    // Convert database daily activities to the format expected by the component
    const formattedActivities = dailyActivities.map(activity => ({
        date: activity.activity_date,
        attempts: activity.attempts,
        pass: activity.passes,
        fail: activity.attempts - activity.passes,
        time: activity.time_spent_minutes,
        concepts: activity.concepts || [],
        details: [] // Could be expanded to show more details
    }));

    const activityMap = useMemo(() => new Map(formattedActivities.map(d => [d.date, d])), [formattedActivities]);
    const calendarGrid = useMemo(() => generateMonthGrid(currentDate), [currentDate]);
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const activityForMonth = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        return formattedActivities.filter(d => {
            const dt = new Date(d.date + 'T00:00:00');
            return dt.getMonth() === month && dt.getFullYear() === year;
        });
    }, [currentDate, formattedActivities]);

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
        const activity = activityMap.get(toLocalISO(day));
        if (activity) {
            setHoveredDay(activity);
            const rect = e.currentTarget.getBoundingClientRect();
            const containerRect = gridRef.current?.getBoundingClientRect();
            if(containerRect){
                setTooltipPos({
                    top: rect.top - containerRect.top,
                    left: rect.left - containerRect.left + rect.width / 2
                });
            }
        }
    };

    return (
        <Card className="p-5 h-full flex flex-col">
            <header className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold">Progress — {monthName}</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleMonthChange('prev')} className="p-1 text-subtext hover:text-text disabled:opacity-50" aria-label="Previous month"><ChevronLeft size={20}/></button>
                    <button onClick={() => handleMonthChange('next')} className="p-1 text-subtext hover:text-text disabled:opacity-50" aria-label="Next month"><ChevronRight size={20} /></button>
                </div>
            </header>
            
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 flex-grow min-h-0">
                {/* Left Panel: Calendar */}
                <div className="flex-shrink-0 w-full lg:w-[380px] flex flex-col min-h-0">
                    <div className="relative flex-grow flex flex-col min-h-0" ref={gridRef}>
                        {hoveredDay && <Tooltip activity={hoveredDay} position={tooltipPos} />}
                        <div className="grid grid-cols-7 gap-1.5 flex-grow min-h-0" style={{ gridTemplateRows: `auto repeat(${numDateRows}, minmax(0, 1fr))` }}>
                             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => 
                                <div key={day} className="flex items-center justify-center text-center text-xs h-8">{day}</div>
                             )}
                            {calendarGrid.map((day, index) => {
                                if (!day) return <div key={`empty-${index}`} />;
                                
                                const dateStr = toLocalISO(day);
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
                                
                                const isToday = dateStr === toLocalISO(TODAY);
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
                <div className="flex-1 lg:border-l lg:pl-6 xl:pl-8 border-muted lg:border-t-0 border-t pt-6 lg:pt-0">
                    {selectedDayActivity && selectedDayActivity.attempts > 0
                        ? <DayDetail 
                            activity={selectedDayActivity} 
                            journalEntries={journalEntries} 
                            questResponses={questResponses}
                          />
                        : <MonthSummary activity={activityForMonth} currentDate={currentDate} />
                    }
                </div>
            </div>
        </Card>
    );
};

export default ProgressSummary;