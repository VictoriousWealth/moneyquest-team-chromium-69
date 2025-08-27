import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  BookOpen,
  Target,
  Flame,
  Calendar,
  TrendingUp,
  MessageCircle,
  Star,
  Award,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentDashboardProps {
  student: {
    name: string;
    level: number;
    xp: number;
    streakDays: number;
    weeklyGoal: number;
    weeklyProgress: number;
    completedLessons: number;
    totalLessons: number;
    recentAchievements: Array<{
      id: string;
      title: string;
      icon: string;
      tier: string;
    }>;
  };
}

export const StudentDashboard = ({ student }: StudentDashboardProps) => {
  const progressPercentage = (student.weeklyProgress / student.weeklyGoal) * 100;
  const lessonProgress = (student.completedLessons / student.totalLessons) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="gradient-hero rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {student.name}! 👋</h1>
            <p className="text-white/90">Ready to continue your financial literacy journey?</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{student.level}</div>
              <div className="text-sm text-white/80">Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-smooth hover:shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 gradient-primary rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{student.xp}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 gradient-warm rounded-lg">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{student.streakDays}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 gradient-success rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{student.completedLessons}</p>
                <p className="text-sm text-muted-foreground">Lessons Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-smooth hover:shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{student.recentAchievements.length}</p>
                <p className="text-sm text-muted-foreground">New Badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progress: {student.weeklyProgress} / {student.weeklyGoal} lessons</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Keep going! You're doing great this week.
              </p>
              <Button variant="hero" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Mentor Quick Access */}
        <Card className="gradient-primary text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageCircle className="h-5 w-5" />
              AI Mentor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/90 text-sm">
              Need help with financial concepts? Your AI mentor is ready to assist!
            </p>
            <Button variant="glass" className="w-full">
              Chat with Mentor
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements & Learning Path */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {student.recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <Badge variant="secondary" className="mt-1">
                      {achievement.tier}
                    </Badge>
                  </div>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
              ))}
              {student.recentAchievements.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Complete lessons to earn achievements!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Course Progress</span>
                <span>{Math.round(lessonProgress)}%</span>
              </div>
              <Progress value={lessonProgress} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Calendar className="h-6 w-6 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">This Week</p>
                <p className="text-xs text-muted-foreground">{student.weeklyProgress} lessons</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Trophy className="h-6 w-6 mx-auto mb-1 text-secondary" />
                <p className="text-sm font-medium">Next Level</p>
                <p className="text-xs text-muted-foreground">250 XP to go</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};