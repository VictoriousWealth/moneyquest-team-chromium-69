
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { students, attempts, mentorInteractions } from '../../../../lib/mockData';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import { ArrowLeft, MessageSquare, ListChecks } from 'lucide-react';

const TeacherStudentDetail: React.FC = () => {
  const { id } = useParams();
  const student = students.find(s => s.id === id);

  if (!student) {
    return <div>Student not found.</div>;
  }

  // Filter mock data for this specific student (in a real app, this would be an API call)
  const studentAttempts = attempts; 
  const studentMentorInteractions = mentorInteractions;

  return (
    <div>
      <Link to="/teacher/students" className="inline-flex items-center gap-2 text-sm font-medium text-subtext hover:text-text mb-4">
        <ArrowLeft size={16} />
        Back to All Students
      </Link>
      <div className="flex items-center gap-4 mb-6">
        <img src={student.avatarUrl} alt={student.name} className="w-16 h-16 rounded-full ring-2 ring-blue-500" />
        <div>
            <h1 className="h1">{student.name}</h1>
            <div className="flex items-center gap-4 mt-1">
                <span className="small">Streak: <strong>{student.streak} days</strong></span>
                <span className="small">Badges: <strong>{student.badges.length}</strong></span>
                <span className="small">Mastery: <strong>{student.masteryProgress}</strong></span>
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
              <h2 className="h2 mb-4 flex items-center gap-2"><ListChecks size={24}/> Attempt Timeline</h2>
              <div className="space-y-4">
                  {studentAttempts.map(attempt => (
                      <div key={attempt.id} className="rounded-md bg-muted p-3">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-semibold text-text">{attempt.episodeTitle}</h3>
                          <span className="small">{attempt.date}</span>
                        </div>
                        <p className="small mt-1">{attempt.summary}</p>
                        <Badge variant={attempt.score && attempt.score >= 70 ? 'mint' : 'muted'} className="mt-2">
                          Score: {attempt.score}%
                        </Badge>
                      </div>
                  ))}
              </div>
          </Card>
           <Card className="p-6">
              <h2 className="h2 mb-4 flex items-center gap-2"><MessageSquare size={24}/> Mentor Q&A Highlights</h2>
               <div className="space-y-4">
                  {studentMentorInteractions.map(interaction => (
                      <div key={interaction.id} className="text-sm">
                          <p className="p-2 rounded-md bg-blue-500/10 text-right font-medium">"{interaction.question}"</p>
                          <p className="mt-2 p-2 rounded-md bg-muted text-subtext">{interaction.answer}</p>
                      </div>
                  ))}
              </div>
          </Card>
      </div>
    </div>
  );
};

export default TeacherStudentDetail;