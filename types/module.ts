// ─── Module & Lesson Types ───────────────────────────────────────────────────

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface CodeExample {
  language: string;
  code: string;
  label?: string;
}

export interface LessonStep {
  id: string;
  title: string;
  type: "explanation" | "example" | "exercise" | "video" | "quiz-mini" | "builder" | "simulation";
  content: string;
  image?: string;
  codeExample?: CodeExample;
  animation?: string;
  exercise?: {
    prompt: string;
    hint?: string;
    solution?: string;
  };
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  description: string;
  duration: number; // minutes
  order: number;
  steps: LessonStep[];
  videoUrl?: string;
  thumbnail?: string;
  type: "video" | "interactive" | "reading";
  xpReward: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CheatSheetEntry {
  id: string;
  title: string;
  description: string;
  code?: CodeExample;
  tags: string[];
  bookmarked?: boolean;
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  color: string;
  icon: string;
  difficulty: DifficultyLevel;
  totalLessons: number;
  estimatedHours: number;
  xpReward: number;
  lessons: Lesson[];
  quiz: QuizQuestion[];
  cheatSheet: CheatSheetEntry[];
  prerequisites: string[];
  tags: string[];
  order: number;
}
