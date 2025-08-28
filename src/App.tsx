import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth
import AuthPage from './app/(auth)/page';

// Student pages
import StudentLayout from './app/(student)/layout';
import StudentDashboard from './app/(student)/dashboard/page';
import StudentPlay from './app/(student)/play/page';
import StudentAchievements from './app/(student)/achievements/page';
import StudentJournal from './app/(student)/journal/page';
import StudentMentor from './app/(student)/mentor/page';

// Teacher pages
import TeacherLayout from './app/(teacher)/layout';
import TeacherDashboard from './app/(teacher)/dashboard/page';
import TeacherStudents from './app/(teacher)/students/page';
import TeacherStudentDetail from './app/(teacher)/students/[id]/page';
import TeacherAssignments from './app/(teacher)/assignments/page';
import TeacherInsights from './app/(teacher)/insights/page';
import TeacherSettings from './app/(teacher)/settings/page';

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-subtext">Loading MoneyQuest...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="play" element={<StudentPlay />} />
          <Route path="achievements" element={<StudentAchievements />} />
          <Route path="journal" element={<StudentJournal />} />
          <Route path="mentor" element={<StudentMentor />} />
        </Route>

        {/* Protected Teacher Routes */}
        <Route path="/teacher" element={
          <ProtectedRoute>
            <TeacherLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="students/:id" element={<TeacherStudentDetail />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="insights" element={<TeacherInsights />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;