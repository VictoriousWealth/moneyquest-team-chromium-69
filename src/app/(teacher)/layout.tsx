import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/shared/Header';
import { Role } from '../../lib/roles';

const TeacherLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header userType="teacher" />
      <main className="mx-auto w-full max-w-[1400px] px-4 py-4 md:px-8 flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;