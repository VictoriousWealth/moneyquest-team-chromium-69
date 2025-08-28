
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataTable, { FilterConfig } from '../../../components/tables/DataTable';
import { students } from '../../../lib/mockData';
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

  const filters: FilterConfig[] = [
    {
      id: 'school',
      label: 'Filter by School',
      options: schoolOptions,
      value: schoolFilter,
      onChange: setSchoolFilter,
    },
    {
      id: 'mastery',
      label: 'Filter by Mastery',
      options: masteryOptions,
      value: masteryFilter,
      onChange: setMasteryFilter,
    },
  ];

  return (
    <div>
      <h1 className="h1 mb-6">Students</h1>
      <DataTable 
        columns={columns} 
        data={data}
        filters={filters}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
    </div>
  );
};

export default TeacherStudents;