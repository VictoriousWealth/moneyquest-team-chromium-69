import React from 'react';
import Card from '../ui/Card';
import { dailyActivity } from '../../lib/demoData';

const ProgressSummary = () => {
    // Get last 7 days of activity for the chart
    const recentActivity = dailyActivity.slice(-7);
    const maxXP = Math.max(...recentActivity.map(day => day.xpEarned));

    return (
        <Card className="p-5 h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Weekly Progress</h3>
            
            {/* Activity Chart */}
            <div className="flex-grow">
                <div className="flex items-end justify-between h-32 gap-2 mb-4">
                    {recentActivity.map((day, index) => {
                        const height = maxXP > 0 ? (day.xpEarned / maxXP) * 100 : 0;
                        const dayName = new Date(day.date).toLocaleDateString('en', { weekday: 'short' });
                        
                        return (
                            <div key={day.date} className="flex flex-col items-center flex-1">
                                <div className="w-full bg-muted rounded-sm overflow-hidden h-24 flex items-end">
                                    <div 
                                        className="w-full bg-gradient-to-t from-[var(--blue-500)] to-[var(--teal-400)] rounded-sm transition-all duration-300"
                                        style={{ height: `${Math.max(height, 4)}%` }}
                                    />
                                </div>
                                <span className="text-xs text-subtext mt-2">{dayName}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-text">
                            {recentActivity.reduce((sum, day) => sum + day.xpEarned, 0)}
                        </div>
                        <div className="text-sm text-subtext">XP This Week</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-text">
                            {recentActivity.reduce((sum, day) => sum + day.pass, 0)}
                        </div>
                        <div className="text-sm text-subtext">Episodes Done</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProgressSummary;