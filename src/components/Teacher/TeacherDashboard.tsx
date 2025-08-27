import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const TeacherDashboard = () => {
  const mockStudents = [
    { id: 1, name: "Alex Johnson", level: 5, xp: 1250, progress: 85, status: "active" },
    { id: 2, name: "Sarah Chen", level: 3, xp: 780, progress: 65, status: "active" },
    { id: 3, name: "Mike Rodriguez", level: 7, xp: 2100, progress: 92, status: "active" },
    { id: 4, name: "Emma Wilson", level: 4, xp: 920, progress: 58, status: "inactive" },
  ];

  const stats = {
    totalStudents: 24,
    activeStudents: 18,
    avgProgress: 76,
    completedCourses: 156
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your students and track their progress</p>
        </div>
        <Button variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 gradient-primary rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 gradient-success rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeStudents}</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 gradient-warm rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgProgress}%</p>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedCourses}</p>
                <p className="text-sm text-muted-foreground">Courses Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Student Management</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">Level {student.level} • {student.xp} XP</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.progress}% Complete</p>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-primary transition-all"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};