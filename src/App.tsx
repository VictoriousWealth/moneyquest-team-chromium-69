import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Role } from './lib/roles';
import { supabase } from './integrations/supabase/client';
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
import JuiceQuestPage from './pages/JuiceQuestPage';
import PancakeQuestPage from './pages/PancakeQuestPage';
import MomoQuestPage from './pages/MomoQuestPage';

const ProtectedRoute: React.FC<{ allowedRole: Role }> = ({ allowedRole }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Determine role based on email
  const isStudent = user.email?.includes('student.demo') || user.email?.includes('alex.johnson');
  const isTeacher = user.email?.includes('teacher.demo') || user.email?.includes('sarah.chen');
  
  const userRole = isStudent ? Role.STUDENT : isTeacher ? Role.TEACHER : null;

  if (!userRole || userRole !== allowedRole) {
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
          {/* Quest Routes */}
          <Route path="quest/juice-shrinkflation" element={<JuiceQuestPage />} />
          <Route path="quest/pancake-price-storm" element={<PancakeQuestPage />} />
          <Route path="quest/momo-summer-job-dilemma" element={<MomoQuestPage />} />
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Determine role based on email
  const isStudent = user.email?.includes('student.demo') || user.email?.includes('alex.johnson');
  
  if (isStudent) {
    return <Navigate to="/student" replace />;
  } else {
    return <Navigate to="/teacher" replace />;
  }
}