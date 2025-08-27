// Demo data for MoneyQuest
export const demoStudent = {
  id: 1,
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  level: 8,
  xp: 2340,
  streakDays: 12,
  profileCompleteness: 85,
  joinedDate: new Date('2024-01-15'),
};

export const demoPrefs = {
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  theme: 'light' as const,
  notifications: true,
  language: 'en',
};

export const demoClassActivity = {
  totalStudents: 24,
  activeToday: 18,
  averageProgress: 76,
  completionRate: 82,
};

// Demo daily activity data (last 30 days)
export const dailyActivity = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  
  return {
    date: date.toISOString().split('T')[0],
    pass: Math.floor(Math.random() * 3), // lessons completed
    time: Math.floor(Math.random() * 120) + 30, // minutes spent
    attempts: Math.floor(Math.random() * 5), // number of attempts
    xpEarned: Math.floor(Math.random() * 200) + 50, // XP earned
  };
});