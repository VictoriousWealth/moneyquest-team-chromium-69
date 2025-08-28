
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { students } from '../../../lib/mockData';
import type { Student } from '../../../types';
import { Search, Award, Calendar, ChevronRight, AlertTriangle, Target, Activity } from 'lucide-react';

const TeacherStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [masteryFilter, setMasteryFilter] = useState('all');

  const masteryOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'struggling', label: 'Struggling' },
    { value: 'developing', label: 'Developing' },
    { value: 'mastered', label: 'Mastered' },
  ];

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      let masteryMatch = true;
      if (masteryFilter !== 'all') {
        const progress = student.masteryProgress ? parseInt(student.masteryProgress, 10) : 0;
        if (masteryFilter === 'struggling') {
          masteryMatch = progress < 40;
        } else if (masteryFilter === 'developing') {
          masteryMatch = progress >= 40 && progress < 80;
        } else if (masteryFilter === 'mastered') {
          masteryMatch = progress >= 80;
        }
      }

      return nameMatch && masteryMatch;
    });
  }, [searchTerm, masteryFilter]);

  const getMasteryColor = (progress: string) => {
    const num = parseInt(progress, 10);
    if (num >= 80) return 'mint';
    if (num >= 40) return 'teal';
    return 'muted';
  };

  const getMasteryIcon = (progress: string) => {
    const num = parseInt(progress, 10);
    if (num >= 80) return Target;
    if (num >= 40) return Activity;
    return AlertTriangle;
  };

  return (
    <div>
      {/* Search and Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtext" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--ring)] rounded-full bg-surface text-text placeholder:text-subtext focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={masteryFilter}
              onChange={(e) => setMasteryFilter(e.target.value)}
              className="px-3 pr-8 py-2 border border-[var(--ring)] rounded-full bg-surface text-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {masteryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Student Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--ring)] bg-muted/50">
                <th className="text-left p-4 font-medium text-sm text-text">Student</th>
                <th className="text-left p-4 font-medium text-sm text-text">Student ID</th>
                <th className="text-left p-4 font-medium text-sm text-text">Progress</th>
                <th className="text-left p-4 font-medium text-sm text-text">Badges</th>
                <th className="text-left p-4 font-medium text-sm text-text">Streak</th>
                <th className="text-right p-4 font-medium text-sm text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const MasteryIcon = getMasteryIcon(student.masteryProgress);
                const progress = parseInt(student.masteryProgress, 10);
                
                return (
                  <tr 
                    key={student.id} 
                    className={`border-b border-[var(--ring)] hover:bg-muted/30 transition-colors ${
                      index % 2 === 0 ? 'bg-surface' : 'bg-muted/10'
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatarUrl} 
                          alt={student.name} 
                          className="w-8 h-8 rounded-full ring-2 ring-surface shadow-sm" 
                        />
                        <div>
                          <div className="font-medium text-text">{student.name}</div>
                          <div className="text-xs text-subtext">Year 9 Set 1</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-text font-mono">RA{String(index + 91).padStart(3, '0')}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                progress >= 80 ? 'bg-mint-400' : 
                                progress >= 40 ? 'bg-teal-400' : 'bg-subtext'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <Badge variant={getMasteryColor(student.masteryProgress)} icon={<MasteryIcon size={12} />}>
                          {student.masteryProgress}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Award size={14} className="text-blue-500" />
                        <span className="font-medium text-sm">{student.badges.length}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-mint-400" />
                        <span className="font-medium text-sm">{student.streak} days</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/teacher/students/${student.id}`}
                        className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors text-sm font-medium"
                      >
                        View
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-8 text-center">
            <h3 className="font-medium text-text mb-2">No students found</h3>
            <p className="text-subtext text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeacherStudents;