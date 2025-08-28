
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import UIBadge from '../ui/Badge';
import { useJournalEntries } from '../../hooks/useJournalEntries';
import { ArrowRight } from 'lucide-react';

const JournalPreview = () => {
    const { entries, loading, error, formatTimestamp } = useJournalEntries();

    if (loading) {
        return (
            <Card className="p-3 h-full flex flex-col rounded-xl overflow-hidden">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <h3 className="text-base font-semibold">Journal Preview</h3>
                    <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="p-2 animate-pulse">
                            <div className="flex items-baseline gap-3 mb-1">
                                <div className="h-4 bg-muted rounded w-32"></div>
                                <div className="h-5 bg-muted rounded w-12"></div>
                            </div>
                            <div className="h-3 bg-muted rounded w-full mb-1"></div>
                            <div className="h-3 bg-muted rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-3 h-full flex flex-col rounded-xl overflow-hidden">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <h3 className="text-base font-semibold">Journal Preview</h3>
                    <Link to="/student/journal" className="inline-flex items-center gap-1 text-sm font-medium text-blue-500 hover:underline">
                        See all in Journal <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="text-sm text-red-500">Error loading journal entries: {error}</div>
            </Card>
        );
    }

    const recentEntries = entries.slice(0, 2);

    return (
        <Card className="p-3 h-full flex flex-col rounded-xl overflow-hidden">
            <div className="flex justify-between items-center mb-2 flex-shrink-0">
                <h3 className="text-base font-semibold">Journal Preview</h3>
                <Link to="/student/journal" className="inline-flex items-center gap-1 text-sm font-medium text-blue-500 hover:underline">
                    See all in Journal <ArrowRight size={14} />
                </Link>
            </div>
            <div className="space-y-2">
                {recentEntries.length === 0 ? (
                    <div className="text-sm text-subtext">No journal entries yet. Complete some episodes to see them here!</div>
                ) : (
                    recentEntries.map(entry => (
                        <Link to={`/student/journal?entry=${entry.id}`} key={entry.id} className="block p-2 -mx-2 group hover:bg-muted/50 rounded-xl transition-colors">
                            <div className="flex justify-between items-start gap-4">
                               <div className="flex-grow">
                                    <div className="flex items-baseline gap-3 mb-1">
                                        <p className="text-sm font-medium text-text">{entry.episode_title}</p>
                                        <UIBadge variant={entry.result === 'Pass' ? 'mint' : 'muted'}>{entry.result}</UIBadge>
                                    </div>
                                    <p className="text-xs text-subtext leading-relaxed">{entry.summary}</p>
                               </div>
                               <span className="text-xs text-subtext text-right flex-shrink-0 pt-1">{formatTimestamp(entry.created_at)}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </Card>
    );
};

export default JournalPreview;
