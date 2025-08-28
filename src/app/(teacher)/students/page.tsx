
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { students } from '../../../lib/mockData';
import type { Student } from '../../../types';
import { Search, Filter, Users, TrendingUp, Award, Calendar, ChevronRight, AlertTriangle, Target, Activity } from 'lucide-react';

const TeacherStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [masteryFilter, setMasteryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const schoolOptions = useMemo(() => {
    const schools = new Set(students.map(s => s.school).filter((s): s is string => !!s));
    return [{ value: 'all', label: 'All Schools' }, ...Array.from(schools).sort().map(s => ({ value: s, label: s }))];
  }, []);
  
  const masteryOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'struggling', label: 'Struggling' },
    { value: 'developing', label: 'Developing' },
    { value: 'mastered', label: 'Mastered' },
  ];

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const schoolMatch = schoolFilter === 'all' || student.school === schoolFilter;
      
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

      return nameMatch && schoolMatch && masteryMatch;
    });
  }, [searchTerm, schoolFilter, masteryFilter]);

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

  const classStats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.streak > 0).length;
    const avgProgress = Math.round(students.reduce((sum, s) => sum + parseInt(s.masteryProgress, 10), 0) / total);
    const totalBadges = students.reduce((sum, s) => sum + s.badges.length, 0);
    
    return { total, active, avgProgress, totalBadges };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="h1">Students</h1>
          <p className="small mt-1">Monitor progress and engagement across your class</p>
        </div>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-blue-500" />
            <span className="font-medium text-sm">Total Students</span>
          </div>
          <p className="text-xl font-bold">{classStats.total}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={20} className="text-mint-400" />
            <span className="font-medium text-sm">Active Today</span>
          </div>
          <p className="text-xl font-bold">{classStats.active}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-teal-400" />
            <span className="font-medium text-sm">Avg Progress</span>
          </div>
          <p className="text-xl font-bold">{classStats.avgProgress}%</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Award size={20} className="text-blue-500" />
            <span className="font-medium text-sm">Total Badges</span>
          </div>
          <p className="text-xl font-bold">{classStats.totalBadges}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtext" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--ring)] rounded-lg bg-surface text-text placeholder:text-subtext focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--ring)] rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {schoolOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={masteryFilter}
              onChange={(e) => setMasteryFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--ring)] rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {masteryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => {
          const MasteryIcon = getMasteryIcon(student.masteryProgress);
          const progress = parseInt(student.masteryProgress, 10);
          
          return (
            <Link key={student.id} to={`/teacher/students/${student.id}`}>
              <Card className="p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={student.avatarUrl} 
                      alt={student.name} 
                      className="w-12 h-12 rounded-full ring-2 ring-surface shadow-sm" 
                    />
                    <div>
                      <h3 className="font-medium text-text group-hover:text-blue-500 transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-xs text-subtext">{student.school}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-subtext group-hover:text-blue-500 transition-colors" />
                </div>

                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-subtext">Mastery Progress</span>
                      <Badge variant={getMasteryColor(student.masteryProgress)} icon={<MasteryIcon size={12} />}>
                        {student.masteryProgress}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          progress >= 80 ? 'bg-mint-400' : 
                          progress >= 40 ? 'bg-teal-400' : 'bg-subtext'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Award size={14} className="text-blue-500" />
                        <span className="font-medium text-sm">{student.badges.length}</span>
                      </div>
                      <p className="text-xs text-subtext">Badges</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calendar size={14} className="text-mint-400" />
                        <span className="font-medium text-sm">{student.streak}</span>
                      </div>
                      <p className="text-xs text-subtext">Day streak</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="p-8 text-center">
          <Users size={48} className="mx-auto text-subtext mb-4" />
          <h3 className="font-medium text-text mb-2">No students found</h3>
          <p className="text-subtext text-sm">Try adjusting your search or filter criteria</p>
        </Card>
      )}
    </div>
  );
};

export default TeacherStudents;