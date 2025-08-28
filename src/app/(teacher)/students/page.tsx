import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
// Mock student data for teacher view
const students = [
  { id: '1', name: 'Alice Johnson', school: 'Westfield High', badges: [{}, {}, {}], streak: 5, masteryProgress: '85%', avatarUrl: 'https://via.placeholder.com/32' },
  { id: '2', name: 'Bob Smith', school: 'Eastside Academy', badges: [{}, {}], streak: 3, masteryProgress: '72%', avatarUrl: 'https://via.placeholder.com/32' },
];
import type { Student } from '../../../types';

const TeacherStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [masteryFilter, setMasteryFilter] = useState('all');

  const schoolOptions = useMemo(() => {
    const schools = new Set(students.map(s => s.school).filter((s): s is string => !!s));
    return [{ value: 'all', label: 'All Schools' }, ...Array.from(schools).sort().map(s => ({ value: s, label: s }))];
  }, []);

  const masteryOptions = [
    { value: 'all', label: 'All Mastery Levels' },
    { value: 'struggling', label: 'Struggling (<40%)' },
    { value: 'developing', label: 'Developing (40-79%)' },
    { value: 'mastered', label: 'Mastered (>=80%)' },
  ];

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search term filter (name)
      const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());

      // School filter
      const schoolMatch = schoolFilter === 'all' || student.school === schoolFilter;

      // Mastery Progress filter
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

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Student },
    { header: 'School', accessor: 'school' as keyof Student },
    { header: 'Badges', accessor: 'badges' as keyof Student },
    { header: 'Streak', accessor: 'streak' as keyof Student },
    { header: 'Mastery Progress', accessor: 'masteryProgress' as keyof Student },
  ];

  const data = filteredStudents.map(student => ({
    ...student,
    name: (
      <Link to={`/teacher/students/${student.id}`} className="flex items-center gap-3 group">
        <img src={student.avatarUrl} alt={student.name} className="w-8 h-8 rounded-full" />
        <span className="font-medium group-hover:underline">{student.name}</span>
      </Link>
    ),
    badges: <span className="font-medium">{student.badges.length}</span>,
    streak: <span className="font-medium">{student.streak} days</span>,
  }));

  return (
    <div>
      <h1 className="h1 mb-6">Students</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-muted rounded-lg bg-background text-text placeholder:text-muted-foreground"
        />
        <select
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
          className="px-3 py-2 border border-muted rounded-lg bg-background text-text"
        >
          {schoolOptions.map((option: any) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          value={masteryFilter}
          onChange={(e) => setMasteryFilter(e.target.value)}
          className="px-3 py-2 border border-muted rounded-lg bg-background text-text"
        >
          {masteryOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">School</th>
                <th className="text-left p-4 font-semibold">Badges</th>
                <th className="text-left p-4 font-semibold">Streak</th>
                <th className="text-left p-4 font-semibold">Mastery Progress</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                  <td className="p-4">
                    <Link to={`/teacher/students/${student.id}`} className="flex items-center gap-3 group">
                      <img src={student.avatarUrl} alt={student.name} className="w-8 h-8 rounded-full" />
                      <span className="font-medium group-hover:underline">{student.name}</span>
                    </Link>
                  </td>
                  <td className="p-4">{student.school}</td>
                  <td className="p-4">
                    <span className="font-medium">{student.badges.length}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{student.streak} days</span>
                  </td>
                  <td className="p-4">{student.masteryProgress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TeacherStudents;