
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Role } from './lib/roles';
import LoginPage from './app/(auth)/login/page';
import StudentLayout from './app/(student)/layout';
import TeacherLayout from './app/(teacher)/layout';
import StudentDashboard from './app/(student)/dashboard/page';
import TeacherDashboard from './app/(teacher)/dashboard/page';
import StudentAchievements from './app/(student)/achievements/page';
import StudentPlay from './app/(student)/play/page';
import StudentJournal from './app/(student)/journal/page';
import StudentMentor from './app/(student)/mentor/page';
import TeacherStudents from './app/(teacher)/students/page';
import TeacherStudentDetail from './app/(teacher)/students/[id]/page';
import TeacherAssignments from './app/(teacher)/assignments/page';
import TeacherSettings from './app/(teacher)/settings/page';

// Helper to get role from a simple cookie-like storage (using localStorage)
const getRole = (): Role | null => {
  const role = localStorage.getItem('userRole');
  if (role === Role.STUDENT || role === Role.TEACHER) {
    return role;
  }
  return null;
};

const ProtectedRoute: React.FC<{ allowedRole: Role }> = ({ allowedRole }) => {
  const currentRole = getRole();
  const location = useLocation();

  if (!currentRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentRole !== allowedRole) {
    // Or a dedicated "Access Denied" page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};


export default function App() {
  const [role, setRole] = useState<Role | null>(getRole());

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(getRole());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRole={Role.STUDENT} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="achievements" element={<StudentAchievements />} />
            <Route path="play" element={<StudentPlay />} />
            <Route path="journal" element={<StudentJournal />} />
            <Route path="mentor" element={<StudentMentor />} />
            <Route index element={<Navigate to="play" replace />} />
          </Route>
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRole={Role.TEACHER} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="students/:id" element={<TeacherStudentDetail />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="settings" element={<TeacherSettings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={role === Role.STUDENT ? '/student/play' : (role === Role.TEACHER ? '/teacher/dashboard' : '/login')} replace />} />
      </Routes>
    </HashRouter>
  );
}