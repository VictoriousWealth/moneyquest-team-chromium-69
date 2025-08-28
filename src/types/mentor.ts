// Enhanced types for consent-gated mentor system
export type DialogueMode = 'idle' | 'awaiting_confirm' | 'running_quiz' | 'planning';

export type MoodType = 'cheer' | 'thinking' | 'proud' | 'curious' | 'gentle' | 'idle';

export interface MentorProposal {
  type: 'quiz' | 'plan' | 'recap';
  topic?: string;
  size?: number;
  id: string;
  confirmChip: string;
  description: string;
}

export interface MentorResponse {
  mode: 'dialog' | 'proposal' | 'final';
  mood: MoodType;
  text: string;
  chips: string[];
  proposal?: MentorProposal;
  cards: Card[];
}

export interface QuizCard {
  type: 'quiz';
  id: string;
  title: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctOptionId: string;
  explanation: string;
  optionHints?: Record<string, string>;
}

export interface PlanCard {
  type: 'plan';
  id: string;
  title: string;
  steps: string[];
  summary?: string;
  actions: string[];
}

export interface RecapCard {
  type: 'recap';
  id: string;
  bullets: string[];
  suggestedNext?: string;
}

export interface FixCard {
  type: 'fix';
  id: string;
  title: string;
  mistake: string;
  correctRule: string;
  oneExample: string;
  cta: string;
}

export type Card = QuizCard | PlanCard | RecapCard | FixCard;

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  cards?: Card[];
  proposal?: MentorProposal;
  mode?: 'dialog' | 'proposal' | 'final';
  timestamp: Date;
}

export interface MentorState {
  mode: DialogueMode;
  pendingProposal?: MentorProposal;
  currentActivity?: {
    type: 'quiz' | 'plan' | 'recap';
    id: string;
  };
}