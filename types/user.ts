// ─── User Types ─────────────────────────────────────────────────────────────

import type { CharacterType } from "./guide";

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  characterType: CharacterType;
  xp: number;
  streak: number;
  lastLoginDate: string;
  createdAt: string;
  role: "student" | "admin";
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  characterType: CharacterType;
  guideSpeed: "slow" | "normal" | "fast";
  speechBubbleSize: "small" | "medium" | "large";
  enableNarration: boolean;
  reduceMotion: boolean;
}

export interface Achievement {
  _id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
  unlocked: boolean;
  category: "learning" | "streak" | "completion" | "speed" | "social";
}

export interface UserProgress {
  userId: string;
  moduleId: string;
  lessonId?: string;
  completedLessons: string[];
  currentLessonId?: string;
  currentStepIndex: number;
  videoPosition: number;
  quizScore?: number;
  guideStepIndex: number;
  lastRoute: string;
  completedAt?: string;
  updatedAt: string;
}
