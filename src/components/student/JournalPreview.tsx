import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PenTool, TrendingUp } from 'lucide-react';

const JournalPreview = () => {
    const recentEntries = [
        {
            id: 1,
            date: '2024-08-26',
            mood: '😊',
            preview: 'Learned about compound interest today. Amazing how money can grow over time...',
            lessonCompleted: 'Investment Basics'
        },
        {
            id: 2,
            date: '2024-08-25',
            mood: '🤔',
            preview: 'Budget planning session. Need to work on my spending habits...',
            lessonCompleted: 'Budget Basics'
        }
    ];

    return (
        <Card className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Learning Journal</h3>
                <Link to="/student/journal">
                    <Button variant="ghost" className="text-[var(--blue-500)] hover:text-[var(--blue-800)]">
                        <PenTool size={16} />
                        Write
                    </Button>
                </Link>
            </div>

            <div className="flex-grow space-y-3">
                {recentEntries.map(entry => (
                    <div key={entry.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{entry.mood}</span>
                                <span className="text-xs text-subtext">
                                    {new Date(entry.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[var(--teal-400)]">
                                <TrendingUp size={12} />
                                {entry.lessonCompleted}
                            </div>
                        </div>
                        <p className="text-sm text-text line-clamp-2">{entry.preview}</p>
                    </div>
                ))}

                {recentEntries.length === 0 && (
                    <div className="text-center py-8 text-subtext">
                        <PenTool size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Start your learning journal</p>
                        <p className="text-xs">Reflect on your financial learning journey</p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--ring)]">
                <Link 
                    to="/student/journal" 
                    className="block text-center text-sm font-medium text-[var(--blue-500)] hover:text-[var(--blue-800)] transition-colors"
                >
                    View Full Journal →
                </Link>
            </div>
        </Card>
    );
};

export default JournalPreview;