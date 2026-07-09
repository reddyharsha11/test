"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MemoryState {
  // Saved user interaction history
  userName: string;
  hasRunPlayground: boolean;
  playgroundRunCount: number;
  recentMistakes: string[]; // List of questions or topics got wrong
  completedLessonIds: string[];
  retryQuizCount: Record<string, number>;
  conversationLog: string[]; // List of recent actions

  // Actions to mutate memory
  setUserName: (name: string) => void;
  recordPlaygroundRun: () => void;
  recordMistake: (topic: string) => void;
  recordLessonComplete: (lessonId: string) => void;
  recordQuizAttempt: (quizId: string, failed: boolean) => void;
  addConversationNode: (nodeText: string) => void;
  clearMemory: () => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      userName: "Learner",
      hasRunPlayground: false,
      playgroundRunCount: 0,
      recentMistakes: [],
      completedLessonIds: [],
      retryQuizCount: {},
      conversationLog: [],

      setUserName: (name) => set({ userName: name }),
      recordPlaygroundRun: () =>
        set((s) => ({
          hasRunPlayground: true,
          playgroundRunCount: s.playgroundRunCount + 1,
        })),
      recordMistake: (topic) =>
        set((s) => {
          const list = [...s.recentMistakes];
          if (!list.includes(topic)) {
            list.push(topic);
          }
          return { recentMistakes: list.slice(-5) }; // Keep last 5 mistakes
        }),
      recordLessonComplete: (lessonId) =>
        set((s) => {
          if (s.completedLessonIds.includes(lessonId)) return {};
          return { completedLessonIds: [...s.completedLessonIds, lessonId] };
        }),
      recordQuizAttempt: (quizId, failed) =>
        set((s) => {
          const attempts = s.retryQuizCount[quizId] ?? 0;
          return {
            retryQuizCount: {
              ...s.retryQuizCount,
              [quizId]: failed ? attempts + 1 : attempts,
            },
          };
        }),
      addConversationNode: (nodeText) =>
        set((s) => ({
          conversationLog: [...s.conversationLog, nodeText].slice(-10),
        })),
      clearMemory: () =>
        set({
          userName: "Learner",
          hasRunPlayground: false,
          playgroundRunCount: 0,
          recentMistakes: [],
          completedLessonIds: [],
          retryQuizCount: {},
          conversationLog: [],
        }),
    }),
    { name: "guide-memory-store" }
  )
);
