export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  level: number;
  xp: number;
  streakDays: number;
  achievements: Achievement[];
  progress: LearningProgress;
}

export interface Teacher extends User {
  role: 'teacher';
  students: Student[];
  courses: Course[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'milestone' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  earned: boolean;
  earnedAt?: Date;
  xpReward: number;
}

export interface LearningProgress {
  totalXP: number;
  level: number;
  completedLessons: number;
  totalLessons: number;
  weeklyGoal: number;
  weeklyProgress: number;
  streakDays: number;
  lastActiveDate: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  xpReward: number;
  completed: boolean;
  type: 'theory' | 'quiz' | 'interactive';
}

export interface MentorMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'mentor';
  type?: 'text' | 'card' | 'tip' | 'quiz';
  cardData?: MentorCardData;
}

export interface MentorCardData {
  type: 'plan' | 'quiz' | 'tip' | 'achievement';
  title: string;
  content: string;
  actions?: MentorAction[];
}

export interface MentorAction {
  text: string;
  action: string;
  primary?: boolean;
}

export interface ActivityData {
  date: string;
  xp: number;
  lessons: number;
  streakDay?: boolean;
}