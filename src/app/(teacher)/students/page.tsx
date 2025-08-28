
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { students } from '../../../lib/mockData';
import { supabase } from '../../../integrations/supabase/client';
import type { Student } from '../../../types';
import { Search, Award, Calendar, ChevronRight, ChevronDown, AlertTriangle, Target, Activity } from 'lucide-react';

const TeacherStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [masteryFilter, setMasteryFilter] = useState('all');
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allQuests, setAllQuests] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all quests first
        const { data: questsData } = await supabase
          .from('quests')
          .select('*')
          .order('order_in_section');

        setAllQuests(questsData || []);

        // Fetch Alex Johnson's real data from database
        const { data: alexProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', 'Alex Johnson')
          .maybeSingle();

        let alexJohnsonData = null;
        
        if (alexProfile) {
          const { data: alexProgress } = await supabase
            .from('student_progress')
            .select('*')
            .eq('user_id', alexProfile.user_id)
            .maybeSingle();

          const { data: alexStreaks } = await supabase
            .from('streaks')
            .select('*')
            .eq('user_id', alexProfile.user_id)
            .maybeSingle();

          const { data: alexAchievements } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', alexProfile.user_id);

          // Fetch Alex's quest progress
          const { data: alexQuestProgress } = await supabase
            .from('user_quest_progress')
            .select('*')
            .eq('user_id', alexProfile.user_id)
            .eq('status', 'completed');

          const completedQuests = alexQuestProgress?.length || 0;
          const totalQuests = questsData?.length || 1;
          const masteryPercentage = Math.round((completedQuests / totalQuests) * 100);

          alexJohnsonData = {
            id: alexProfile.user_id,
            name: alexProfile.username,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${alexProfile.username}`,
            streak: alexStreaks?.current_count || 0,
            lastActivity: new Date().toISOString().split('T')[0],
            school: alexProfile.school || "Unknown School",
            badges: (alexAchievements || []).map(achievement => ({
              id: achievement.id,
              name: achievement.title || "Achievement",
              icon: "🏆",
              type: "achievement" as const
            })),
            masteryProgress: `${masteryPercentage}%`,
            completedQuests,
            totalQuests,
            questProgress: alexQuestProgress || [],
          };
        }

        // Combine real Alex Johnson data with mock data for others
        const otherMockStudents = students.filter(student => student.name !== "Alex Johnson");
        const combinedStudents = alexJohnsonData 
          ? [alexJohnsonData, ...otherMockStudents]
          : students;

        setAllStudents(combinedStudents);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAllStudents(students);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const masteryOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'struggling', label: 'Struggling' },
    { value: 'developing', label: 'Developing' },
    { value: 'mastered', label: 'Mastered' },
  ];

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
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
  }, [searchTerm, masteryFilter, allStudents]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-text">Loading students...</div>
      </div>
    );
  }

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
          <div className="relative">
            <select
              value={masteryFilter}
              onChange={(e) => setMasteryFilter(e.target.value)}
              className="appearance-none px-3 pr-10 py-2 border border-[var(--ring)] rounded-full bg-surface text-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {masteryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-subtext" />
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
                <th className="text-left p-4 font-medium text-sm text-text">Quests Completed</th>
                <th className="text-left p-4 font-medium text-sm text-text">Badges</th>
                <th className="text-left p-4 font-medium text-sm text-text">Streak</th>
                <th className="text-right p-4 font-medium text-sm text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const progress = parseInt(student.masteryProgress, 10);
                const totalQuests = allQuests.length || 37;
                // Calculate completed quests based on the same data source
                const completedQuests = (student as any).completedQuests !== undefined
                  ? (student as any).completedQuests
                  : Math.round((progress / 100) * totalQuests);
                const derivedProgress = Math.round((completedQuests / totalQuests) * 100);
                
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
                          <div className="text-sm font-medium text-text">{student.name}</div>
                          <div className="text-xs text-subtext">Year 9 Set 1</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-text font-mono">RA{String(index + 91).padStart(3, '0')}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              derivedProgress >= 80 ? 'bg-mint-400' : 
                              derivedProgress >= 40 ? 'bg-teal-400' : 'bg-subtext'
                            }`}
                            style={{ width: `${derivedProgress}%` }}
                          />
                          </div>
                          <div className="text-xs text-subtext mt-1">
                            {completedQuests} of {totalQuests} quests
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Award size={12} className="text-blue-500" />
                        <span className="text-xs font-medium">{student.badges.length}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-mint-400" />
                        <span className="text-xs font-medium">{student.streak} days</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/teacher/students/${student.id}`}
                        className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors text-xs font-medium"
                      >
                        View
                        <ChevronRight size={12} />
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