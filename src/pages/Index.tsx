import { useState } from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { StudentSidebar } from "@/components/Layout/StudentSidebar";
import { StudentDashboard } from "@/components/Student/StudentDashboard";
import { AIMentor } from "@/components/Student/AIMentor";
import { TeacherDashboard } from "@/components/Teacher/TeacherDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Award,
  BookOpen,
  MessageCircle,
  Target
} from "lucide-react";

const Index = () => {
  const [userRole, setUserRole] = useState<'guest' | 'student' | 'teacher'>('guest');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock student data
  const mockStudent = {
    name: "Alex Johnson",
    level: 5,
    xp: 1250,
    streakDays: 7,
    weeklyGoal: 5,
    weeklyProgress: 3,
    completedLessons: 23,
    totalLessons: 50,
    recentAchievements: [
      { id: '1', title: 'Budget Master', icon: '💰', tier: 'Gold' },
      { id: '2', title: 'Streak Hero', icon: '🔥', tier: 'Silver' },
      { id: '3', title: 'Quick Learner', icon: '⚡', tier: 'Bronze' }
    ]
  };

  const mockUser = {
    name: mockStudent.name,
    role: userRole as 'student' | 'teacher',
    level: mockStudent.level,
    xp: mockStudent.xp
  };

  if (userRole === 'guest') {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="gradient-hero min-h-screen flex items-center justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">MQ</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold">MoneyQuest</h1>
            </div>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Master financial literacy through gamified learning with AI-powered mentorship
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                variant="glass" 
                size="xl"
                onClick={() => setUserRole('student')}
                className="text-lg"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Start Learning
              </Button>
              <Button 
                variant="glass" 
                size="xl"
                onClick={() => setUserRole('teacher')}
                className="text-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                For Educators
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">AI Mentor</h3>
                  <p className="text-sm text-white/80">Personalized guidance 24/7</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Gamified Learning</h3>
                  <p className="text-sm text-white/80">Earn XP, levels, and achievements</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Track Progress</h3>
                  <p className="text-sm text-white/80">Monitor your learning journey</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'student') {
    return (
      <div className="flex h-screen bg-background">
        <StudentSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar 
            user={mockUser}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
          
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'dashboard' && <StudentDashboard student={mockStudent} />}
            {activeTab === 'mentor' && <AIMentor />}
            {activeTab === 'learn' && (
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="h-8 w-8" />
                  Learning Modules
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Budgeting Basics", progress: 100, lessons: 8, xp: 120 },
                    { title: "Saving Strategies", progress: 75, lessons: 6, xp: 90 },
                    { title: "Investment Fundamentals", progress: 30, lessons: 10, xp: 200 },
                    { title: "Credit & Debt", progress: 0, lessons: 7, xp: 140 },
                  ].map((course, index) => (
                    <Card key={index} className="hover:shadow-elegant transition-smooth">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{course.lessons} lessons • {course.xp} XP</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="gradient-primary h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                        <Button className="w-full mt-4" variant={course.progress === 0 ? "hero" : "default"}>
                          {course.progress === 0 ? "Start Course" : "Continue"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'achievements' && (
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                  <Award className="h-8 w-8" />
                  Achievements
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockStudent.recentAchievements.map((achievement) => (
                    <Card key={achievement.id} className="gradient-success text-white">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <h3 className="font-semibold mb-1">{achievement.title}</h3>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {achievement.tier}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'goals' && (
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                  <Target className="h-8 w-8" />
                  Learning Goals
                </h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">Goal tracking system coming soon! This will help you set and achieve your financial literacy objectives.</p>
                  </CardContent>
                </Card>
              </div>
            )}
            {activeTab === 'progress' && (
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-8 w-8" />
                  Progress Analytics
                </h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">Detailed analytics and insights about your learning journey will appear here!</p>
                  </CardContent>
                </Card>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Settings</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">Customize your MoneyQuest experience and preferences here!</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // Teacher Dashboard
  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={{ name: "Professor Smith", role: "teacher" }}
      />
      <main>
        <TeacherDashboard />
      </main>
    </div>
  );
};

export default Index;
