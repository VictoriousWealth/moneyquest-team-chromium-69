import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/shared/Header';
import NavTabs from '../../components/shared/NavTabs';
import { Role } from '../../lib/roles';
import { Home, Trophy, Gamepad2, MessageSquare } from 'lucide-react';

const studentNavItems = [
  { path: '/student/play', label: 'Play', icon: <Gamepad2 className="h-4 w-4" /> },
  { path: '/student/achievements', label: 'Achievements', icon: <Trophy className="h-4 w-4" /> },
  { path: '/student/dashboard', label: 'Overview', icon: <Home className="h-4 w-4" /> },
  { path: '/student/mentor', label: 'AI Mentor', icon: <MessageSquare className="h-4 w-4" /> },
];

const StudentLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/student/dashboard';
  const isMentor = location.pathname === '/student/mentor';
  
  return (
    <div className={`flex flex-col ${isDashboard || isMentor ? 'h-dvh' : 'min-h-dvh'} overflow-hidden`}>
      <Header role={Role.STUDENT} />
      <NavTabs tabs={studentNavItems} />
      <main className={`mx-auto w-full max-w-[1400px] px-4 md:px-8 ${
        isDashboard 
          ? 'py-4 flex-1 min-h-0 overflow-hidden' 
          : isMentor 
            ? 'flex-1 min-h-0 overflow-hidden'
            : 'py-4 overflow-y-auto'
      }`}>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;