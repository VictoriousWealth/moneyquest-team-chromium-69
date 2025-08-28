// Mock data for episodes and learning content
export const episodes = [
  {
    id: "1",
    title: 'Budget Basics',
    status: 'Completed' as const,
    concepts: ['Income', 'Expenses', '50/30/20 Rule'],
    xpReward: 150,
    estimatedTime: '15 min',
    assigned: true,
    classStatus: 'Completed' as const,
    dueDate: '2024-02-15',
  },
  {
    id: "2",
    title: 'Saving Strategies',
    status: 'In progress' as const,
    concepts: ['Emergency Fund', 'High-Yield Savings', 'Compound Interest'],
    xpReward: 200,
    estimatedTime: '20 min',
    assigned: true,
    classStatus: 'In Progress' as const,
    dueDate: '2024-02-20',
  },
  {
    id: "3",
    title: 'Credit Card Fundamentals',
    status: 'Not started' as const,
    concepts: ['Credit Score', 'APR', 'Payment History'],
    xpReward: 180,
    estimatedTime: '18 min',
    assigned: false,
    classStatus: 'Not Started' as const,
  },
  {
    id: "4",
    title: 'Investment Basics',
    status: 'Not started' as const,
    concepts: ['Stocks', 'Bonds', 'Diversification'],
    xpReward: 250,
    estimatedTime: '25 min',
    assigned: false,
    classStatus: 'Not Started' as const,
  },
  {
    id: "5",
    title: 'Debt Management',
    status: 'Failed' as const,
    concepts: ['Debt Snowball', 'Debt Avalanche', 'Consolidation'],
    xpReward: 200,
    estimatedTime: '22 min',
    assigned: true,
    classStatus: 'In Progress' as const,
    dueDate: '2024-02-25',
  },
  {
    id: "6",
    title: 'Retirement Planning',
    status: 'Not started' as const,
    concepts: ['401k', 'IRA', 'Pension'],
    xpReward: 300,
    estimatedTime: '30 min',
    assigned: false,
    classStatus: 'Not Started' as const,
  },
];

export const students = [
  {
    id: "1",
    name: "Emily Chen",
    avatarUrl: "/api/placeholder/64/64",
    streak: 5,
    lastActivity: "2024-01-20",
    school: "Greenfield Elementary",
    badges: [
      { id: "1", name: "Budget Master", icon: "💰", type: "concept" as const },
      { id: "2", name: "Week Warrior", icon: "🔥", type: "streak" as const },
    ],
    masteryProgress: "85%",
  },
  {
    id: "2", 
    name: "Marcus Johnson",
    avatarUrl: "/api/placeholder/64/64",
    streak: 12,
    lastActivity: "2024-01-21",
    school: "Greenfield Elementary",
    badges: [
      { id: "3", name: "Saving Star", icon: "⭐", type: "concept" as const },
    ],
    masteryProgress: "92%",
  },
  {
    id: "3", 
    name: "Sarah Kim",
    avatarUrl: "/api/placeholder/64/64",
    streak: 3,
    lastActivity: "2024-01-19",
    school: "Oak Valley Middle School",
    badges: [
      { id: "4", name: "First Steps", icon: "🎯", type: "concept" as const },
    ],
    masteryProgress: "67%",
  },
  {
    id: "4", 
    name: "Alex Rodriguez",
    avatarUrl: "/api/placeholder/64/64",
    streak: 8,
    lastActivity: "2024-01-20",
    school: "Central High School",
    badges: [
      { id: "5", name: "Streak Master", icon: "🔥", type: "streak" as const },
      { id: "6", name: "Credit Champion", icon: "💳", type: "concept" as const },
    ],
    masteryProgress: "78%",
  },
];

export const attempts = [
  {
    id: "1",
    episodeTitle: "Budget Basics",
    date: "2024-01-15",
    summary: "Completed budgeting exercise with 50/30/20 rule",
    score: 85,
  },
  {
    id: "2",
    episodeTitle: "Saving Strategies", 
    date: "2024-01-18",
    summary: "Learned about emergency funds and compound interest",
    score: 78,
  },
];

export const mentorInteractions = [
  {
    id: "1",
    question: "What's the difference between needs and wants?",
    answer: "Great question! Needs are essential things like food, shelter, and transportation. Wants are things you'd like to have but can live without, like entertainment or luxury items.",
  },
  {
    id: "2",
    question: "How much should I save each month?",
    answer: "The 50/30/20 rule suggests saving 20% of your income. Start with what you can afford, even if it's just $10 a month - building the habit is most important!",
  },
];

export const achievements = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first episode',
    icon: '🎯',
    category: 'Progress',
    earned: true,
    earnedDate: new Date('2024-01-16'),
  },
  {
    id: 2,
    title: 'Week Warrior',
    description: 'Study for 7 consecutive days',
    icon: '🔥',
    category: 'Streak',
    earned: true,
    earnedDate: new Date('2024-01-22'),
  },
  {
    id: 3,
    title: 'Budget Master',
    description: 'Master all budgeting concepts',
    icon: '💰',
    category: 'Mastery',
    earned: false,
  },
];