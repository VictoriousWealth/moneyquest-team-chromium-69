import type { Badge as BadgeSummary, Streak, Badge } from '../types';

// --- HELPERS FOR DYNAMIC DATES ---
const TODAY = new Date(2025, 7, 29); // Friday, Aug 29, 2025 is our new "today"

// Returns an ISO string for a date relative to our fixed "today"
const dateThisMonth = (daysAgo: number) => {
    const d = new Date(TODAY);
    d.setDate(TODAY.getDate() - daysAgo);
    return d.toISOString();
}

// Returns an ISO string for a date in the previous month relative to "today"
const dateLastMonth = (daysAgo: number) => {
    const d = new Date(TODAY);
    d.setMonth(TODAY.getMonth() - 1);
    // Adjust day to be "daysAgo" from a similar day in the last month
    d.setDate(TODAY.getDate() - daysAgo); 
    return d.toISOString();
}


export const demoStudent = { 
  name:'Alex Johnson', 
  year:'Year 9', 
  school:'Northwood High', 
  district:'Northwood', 
  id:'STU-001',
  house: '9B – Oak',
  topConcept: 'Inflation & Value',
  lastBadge: 'Inflation Explorer',
  weeklyGoal: {
    target: 3,
    completed: 2,
  },
  moneySaved: 125.50,
  rank: 12,
  socialActivity: {
      peerName: 'Maria',
      activity: 'The Stock Market Maze',
  },
};

export const demoPrefs = { 
  reading:'Normal', 
  difficulty:'Auto', 
  style:'Quests', 
  language:'English', 
  avatarUrl: 'https://picsum.photos/seed/student_main/144/144'
};

export const progressSummaryData = {
    currentStreak: 12,
    longestStreak: 21,
};

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  attempts: number;
  pass: number;
  fail: number;
  time: number; // minutes
  concepts: Record<string, number>;
  details: {
    episode: string;
    result: 'Pass' | 'Fail' | 'In progress';
    time: number;
    concepts: string[];
    reason?: string;
  }[];
}

export const dailyActivity: DailyActivity[] = (() => {
    const activities: DailyActivity[] = [];
    // Generate for a range around August 2025
    const startDate = new Date(2025, 6, 1); // Start from July 1st
    const endDate = new Date(2025, 8, 15); // End mid-September

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];

        // No activity for future dates
        if (d > TODAY) {
            activities.push({ date: dateString, attempts: 0, pass: 0, fail: 0, time: 0, concepts: {}, details: [] });
            continue;
        }

        let hasActivity = false;
        const daysFromToday = Math.round((TODAY.getTime() - d.getTime()) / (1000 * 3600 * 24));

        // Current 12-day streak up to and including TODAY
        if (daysFromToday >= 0 && daysFromToday < 12) {
            hasActivity = true;
        } else {
            // Sparse activity before the streak to make it feel earned
            hasActivity = Math.random() > 0.7; // ~30% chance of activity on other days
        }

        if (!hasActivity) {
            activities.push({ date: dateString, attempts: 0, pass: 0, fail: 0, time: 0, concepts: {}, details: [] });
            continue;
        }

        // Generate random activity details (adapted from original)
        const attempts = Math.floor(Math.random() * 3) + 1; // a bit less frantic
        const pass = Math.floor(Math.random() * (attempts + 1));
        const fail = attempts - pass;
        const time = attempts * (Math.floor(Math.random() * 10) + 5);

        const concepts = {
            'Budgeting': Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0,
            'Inflation': Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0,
            'Saving': Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0,
        };

        const details = Array.from({ length: attempts }, () => {
            const isFail = Math.random() > 0.4;
            const reasons = [
                'Forgot to account for taxes.',
                'Miscalculated profit margins.',
                'Overlooked variable costs.',
                'Ran out of stock too early.',
            ];
            return {
                episode: ['The Lemonade Stand Challenge', 'Saving for a Spaceship', 'Credit Score Superheroes'][Math.floor(Math.random() * 3)],
                result: isFail ? 'Fail' : 'Pass',
                time: Math.floor(Math.random() * 10) + 5,
                concepts: ['Budgeting', 'Profit', 'Saving'].slice(0, Math.floor(Math.random() * 2) + 1),
                reason: isFail && Math.random() > 0.7 ? reasons[Math.floor(Math.random() * reasons.length)] : undefined,
            };
        });

        activities.push({ date: dateString, attempts, pass, fail, time, concepts, details: details as any });
    }
    return activities;
})();


export const demoBadgesSummary: Pick<BadgeSummary, 'id' | 'name'>[] = [
  {id:'inflation-explorer', name:'Inflation Explorer'}
];

export const demoJournalTop3 = [
  { id:'a1', episode:'The Lemonade Stand Challenge', result:'Pass', summary:'Successfully balanced budget and made a small profit.', ts:'Today 16:02' },
  { id:'a2', episode:'Saving for a Spaceship', result:'Fail', summary:'Failed this attempt by overspending on rocket fuel. Next time, I need to adjust my savings plan first.', ts:'Today 15:10' },
  { id:'a3', episode:'The Lemonade Stand Challenge', result:'Fail', summary:'Failed because I ran out of lemons too early. This taught me a lesson about supply management.', ts:'Yesterday' },
];

export const demoClassActivity = [
    { id: 'ca1', peerName: 'Maria', avatarUrl: 'https://picsum.photos/seed/maria/40/40', text: 'is learning "The Stock Market Maze"', link: '/student/play' },
    { id: 'ca2', peerName: 'Sam', avatarUrl: 'https://picsum.photos/seed/sam/40/40', text: 'just earned "Budget Boss"', link: '/student/achievements' },
    { id: 'ca3', peerName: 'Ava', avatarUrl: 'https://picsum.photos/seed/ava/40/40', text: 'continued a 10-day streak', link: '/student/dashboard' },
];


// --- NEW COMPREHENSIVE ACHIEVEMENTS DATA ---

export const allStreaks: Streak[] = [
    { id: 'daily_play', name: 'Daily Play Streak', description: 'Complete at least one episode attempt each day.', tiers: [3, 7, 14, 30, 100], currentCount: 12, bestCount: 21, currentTier: 'bronze', nextThreshold: 14, earnedAt: dateThisMonth(1) },
    { id: 'weekly_consistency', name: 'Weekly Consistency', description: 'Be active at least 3 days every week.', tiers: [2, 4, 8, 12], currentCount: 3, bestCount: 3, currentTier: 'none', nextThreshold: 4 },
    { id: 'savings_streak', name: 'Savings Streak', description: 'Finish episodes under budget consecutively.', tiers: [3, 5, 10], currentCount: 4, bestCount: 6, currentTier: 'bronze', nextThreshold: 5, earnedAt: dateThisMonth(2) },
    { id: 'bounce_back', name: 'Bounce-Back Streak', description: 'Pass an episode you failed within 48 hours.', tiers: [1, 3, 5], currentCount: 0, currentTier: 'none', nextThreshold: 1 },
];

export const allBadges: Badge[] = [
    // Milestones
    { id: 'first_pound', name: 'First Pound', category: 'Milestone', state: 'earned', earnedAt: dateLastMonth(15), unlockHint: 'Pass your first episode.', artKey: 'milestone' },
    { id: 'level_up', name: 'Level-Up Learner', category: 'Milestone', state: 'locked', unlockHint: 'Pass 10 episodes.', artKey: 'milestone' }, // Previously earned, now locked for progression
    { id: 'marathon', name: 'Marathon Learner', category: 'Milestone', state: 'locked', unlockHint: 'Pass 25 episodes.', artKey: 'milestone' },
    // Skills
    { id: 'value_detective', name: 'Value Detective', category: 'Skill', state: 'earned', earnedAt: dateThisMonth(5), unlockHint: 'Choose the best unit price 5 times.', contextStat: 'You saved £14 by comparing!', artKey: 'skill' },
    { id: 'apr_unmasker', name: 'APR Unmasker', category: 'Skill', state: 'locked', unlockHint: 'Pick the cheaper loan plan 3 times.', artKey: 'skill' },
    // Quest-based achievements
    { id: 'pancake_pro', name: 'Pancake Pro', category: 'Quest', state: 'locked', unlockHint: 'Complete the Pancake Inflation quest.', artKey: 'quest' },
    { id: 'paycheck_pro', name: 'Paycheck Pro', category: 'Quest', state: 'locked', unlockHint: 'Complete the Payslip Master quest to decode NI and tax.', artKey: 'quest' },
    { id: 'payslip_pro', name: 'Payslip Pro', category: 'Quest', state: 'locked', unlockHint: 'Successfully completed Momo\'s Summer Job Dilemma.', artKey: 'quest' },
    { id: 'risk_ranger', name: 'Risk Ranger', category: 'Quest', state: 'earned', earnedAt: dateThisMonth(2), unlockHint: 'Complete the Stock Market Maze quest.', artKey: 'quest' },
    { id: 'lemonade_tycoon', name: 'Lemonade Tycoon', category: 'Quest', state: 'earned', earnedAt: dateLastMonth(5), unlockHint: 'Complete the Lemonade Stand quest with high profit.', isPrivate: true, artKey: 'quest' },
    // Habits
    { id: 'goal_setter', name: 'Goal Setter', category: 'Habit', state: 'earned', earnedAt: dateThisMonth(8), unlockHint: 'Set and meet a weekly goal.', artKey: 'habit' },
    { id: 'comeback_kid', name: 'Comeback Kid', category: 'Habit', state: 'locked', unlockHint: 'Pass an episode that you previously failed.', artKey: 'habit' },
    // Fun (Private by default)
    { id: 'latte_factor', name: 'Latte Factor', category: 'Fun', state: 'locked', unlockHint: 'Oops! Blew the budget on small purchases.', isPrivate: true, artKey: 'fun' }, // Previously earned, now locked
    { id: 'bogof_boss', name: 'BOGOF Boss', category: 'Fun', state: 'locked', unlockHint: 'Win big using multi-buy or unit-price logic.', isPrivate: true, artKey: 'fun' },
];

// For the overview panel, we need the 3 most recent PUBLIC badges
export const demoBadgesMonth = allBadges
    .filter(b => b.state === 'earned' && b.earnedAt && !b.isPrivate)
    .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
    .slice(0, 3)
    .map(b => ({
        id: b.id,
        name: b.name,
        earnedDate: b.earnedAt!
    }));