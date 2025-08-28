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
import TeacherInsights from './app/(teacher)/insights/page';
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
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRole={Role.STUDENT} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/play" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="play" element={<StudentPlay />} />
            <Route path="achievements" element={<StudentAchievements />} />
            <Route path="journal" element={<StudentJournal />} />
            <Route path="mentor" element={<StudentMentor />} />
          </Route>
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute allowedRole={Role.TEACHER} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="students/:id" element={<TeacherStudentDetail />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="insights" element={<TeacherInsights />} />
          </Route>
        </Route>

        {/* Redirect based on role or to login */}
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

function RoleBasedRedirect() {
  const role = getRole();
  if (role === Role.STUDENT) {
    return <Navigate to="/student" replace />;
  } else if (role === Role.TEACHER) {
    return <Navigate to="/teacher" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}