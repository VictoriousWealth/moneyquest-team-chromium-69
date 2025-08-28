import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { ArrowLeft, Calendar, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useCompleteStudentData } from '../../../hooks/useCompleteStudentData';

const StudentJournal: React.FC = () => {
  const { journalEntries, dailyActivities, loading } = useCompleteStudentData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading journal...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/student/dashboard">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="h1">Learning Journal</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Activity Summary */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {dailyActivities.slice(0, 7).map((activity, index) => (
                <div key={activity.id} className="flex justify-between items-center text-sm">
                  <span className="text-subtext">
                    {new Date(activity.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-mint/20 text-mint-500 px-2 py-1 rounded">
                      {activity.passes}P
                    </span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {activity.time_spent_minutes}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Journal Entries */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-4">Journal Entries</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {journalEntries.length === 0 ? (
                <p className="text-subtext text-center py-8">No journal entries yet. Complete some episodes to start building your learning journal!</p>
              ) : (
                journalEntries.map((entry) => (
                  <div key={entry.id} className="border-b border-muted pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{entry.episode_title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={entry.result === 'Pass' ? 'mint' : entry.result === 'Fail' ? 'blue' : 'muted'}
                          className="text-xs"
                        >
                          {entry.result === 'Pass' ? (
                            <><TrendingUp className="h-3 w-3 mr-1" />{entry.result}</>
                          ) : (
                            <><TrendingDown className="h-3 w-3 mr-1" />{entry.result}</>
                          )}
                        </Badge>
                        {entry.time_spent_minutes && (
                          <div className="flex items-center gap-1 text-xs text-subtext">
                            <Clock className="h-3 w-3" />
                            {entry.time_spent_minutes}m
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-subtext mb-3">{entry.summary}</p>
                    {entry.concepts && entry.concepts.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {entry.concepts.map((concept, index) => (
                          <Badge key={index} variant="blue" className="text-xs">{concept}</Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-subtext">{formatDate(entry.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentJournal;