
export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  streak: number;
  lastActivity: string;
  badges: BadgeSummary[];
}

// Summary for overview cards
export interface BadgeSummary {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'concept' | 'effort' | 'streak';
}

export interface Episode {
  id: string;
  title: string;
  concepts: string[];
  status: 'Not started' | 'In progress' | 'Completed' | 'Failed';
}

export interface Attempt {
  id: string;
  episodeTitle: string;
  date: string;
  summary: string;
}


// --- NEW ACHIEVEMENT SYSTEM TYPES ---

export type Tier = 'none' | 'bronze' | 'silver' | 'gold';
export type EarnState = 'earned' | 'locked';
export type BadgeCategory = 'Milestone' | 'Skill' | 'Habit' | 'Fun' | 'Quest';

export interface Streak {
  id: string;                // e.g., "daily_play"
  name: string;              // "Daily Play Streak"
  description: string;       // short, action-focused
  tiers: number[];           // thresholds (e.g., [3,7,14,30,100])
  currentCount: number;      // rolling count relevant to rule
  currentTier: Tier;         // computed from thresholds
  earnedAt?: string;         // ISO when tier upgraded
  nextThreshold?: number;    // for progress UI
  bestCount?: number;        // historic best
}

export interface Badge {
  id: string;                        // e.g., "value_detective"
  name: string;                      // "Value Detective"
  category: BadgeCategory;
  tier?: Tier;                       // if repeatable
  state: EarnState;                  // earned | locked
  earnedAt?: string;                 // ISO, if earned
  isPrivate?: boolean;               // default true for Fun
  unlockHint: string;                // "Choose the best unit price 5 times"
  contextStat?: string;              // optional: "You saved £14..."
  artKey: string;                    // 1:1 image key for icon mapping
}
