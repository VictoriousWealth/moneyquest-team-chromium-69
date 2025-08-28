
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { students, attempts, mentorInteractions } from '../../../../lib/mockData';
import { supabase } from '../../../../integrations/supabase/client';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import { ArrowLeft, MessageSquare, ListChecks } from 'lucide-react';

const TeacherStudentDetail: React.FC = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [studentAttempts, setStudentAttempts] = useState<any[]>([]);
  const [studentMentorInteractions, setStudentMentorInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // First check if this is Alex Johnson by trying to find real data
        const { data: alexProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', id)
          .maybeSingle();

        if (alexProfile && alexProfile.username === 'Alex Johnson') {
          // Fetch real data for Alex Johnson
          const { data: alexProgress } = await supabase
            .from('student_progress')
            .select('*')
            .eq('user_id', id)
            .maybeSingle();

          const { data: alexStreaks } = await supabase
            .from('streaks')
            .select('*')
            .eq('user_id', id)
            .maybeSingle();

          const { data: alexAchievements } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', id);

          const { data: alexJournalEntries } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', id)
            .order('created_at', { ascending: false });

          const { data: alexQuestResponses } = await supabase
            .from('quest_responses')
            .select('*')
            .eq('user_id', id)
            .order('created_at', { ascending: false });

          // Build real student data
          const realStudent = {
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
            masteryProgress: `${Math.floor((alexProgress?.episodes_passed || 0) * 10)}%`,
          };

          // Convert journal entries to attempts format
          const realAttempts = (alexJournalEntries || []).map(entry => ({
            id: entry.id,
            episodeTitle: entry.episode_title,
            date: new Date(entry.created_at).toLocaleDateString(),
            summary: entry.summary,
            score: entry.result === 'pass' ? 85 : 45, // Mock score based on result
            result: entry.result
          }));

          // Convert quest responses to mentor interactions (mock format)
          const realMentorInteractions = (alexQuestResponses || []).slice(0, 3).map((response, index) => ({
            id: response.id,
            question: response.question_text || `Question about ${response.quest_id}`,
            answer: response.is_correct 
              ? "Great job! You understood the concept well."
              : "Let's review this concept together. Here's what to focus on..."
          }));

          setStudent(realStudent);
          setStudentAttempts(realAttempts);
          setStudentMentorInteractions(realMentorInteractions);
        } else {
          // Use mock data for other students
          const mockStudent = students.find(s => s.id === id);
          if (mockStudent) {
            setStudent(mockStudent);
            setStudentAttempts(attempts);
            setStudentMentorInteractions(mentorInteractions);
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        // Fallback to mock data
        const mockStudent = students.find(s => s.id === id);
        if (mockStudent) {
          setStudent(mockStudent);
          setStudentAttempts(attempts);
          setStudentMentorInteractions(mentorInteractions);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-text">Loading student details...</div>
      </div>
    );
  }

  if (!student) {
    return <div>Student not found.</div>;
  }

  return (
    <div>
      <Link to="/teacher/students" className="inline-flex items-center gap-2 text-sm font-medium text-subtext hover:text-text mb-4">
        <ArrowLeft size={16} />
        Back to All Students
      </Link>
      <div className="flex items-center gap-4 mb-6">
        <img src={student.avatarUrl} alt={student.name} className="w-16 h-16 rounded-full ring-2 ring-blue-500" />
        <div>
            <h1 className="text-lg font-semibold text-text">{student.name}</h1>
            <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-subtext">Streak: <strong>{student.streak} days</strong></span>
                <span className="text-xs text-subtext">Badges: <strong>{student.badges.length}</strong></span>
                <span className="text-xs text-subtext">Mastery: <strong>{student.masteryProgress}</strong></span>
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
              <h2 className="text-base font-semibold text-text mb-4 flex items-center gap-2"><ListChecks size={16}/> Attempt Timeline</h2>
              <div className="space-y-4">
                  {studentAttempts.map(attempt => (
                      <div key={attempt.id} className="rounded-md bg-muted p-3">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-medium text-text">{attempt.episodeTitle}</h3>
                          <span className="text-xs text-subtext">{attempt.date}</span>
                        </div>
                        <p className="text-xs text-subtext mt-1">{attempt.summary}</p>
                        <Badge variant={attempt.score && attempt.score >= 70 ? 'mint' : 'muted'} className="mt-2">
                          Score: {attempt.score}%
                        </Badge>
                      </div>
                  ))}
              </div>
          </Card>
           <Card className="p-6">
              <h2 className="text-base font-semibold text-text mb-4 flex items-center gap-2"><MessageSquare size={16}/> Mentor Q&A Highlights</h2>
               <div className="space-y-4">
                  {studentMentorInteractions.map(interaction => (
                      <div key={interaction.id} className="text-sm">
                          <p className="p-2 rounded-md bg-blue-500/10 text-right text-xs font-medium">"{interaction.question}"</p>
                          <p className="mt-2 p-2 rounded-md bg-muted text-subtext text-xs">{interaction.answer}</p>
                      </div>
                  ))}
              </div>
          </Card>
      </div>
    </div>
  );
};

export default TeacherStudentDetail;