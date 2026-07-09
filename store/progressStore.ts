import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProgress, Achievement } from "@/types/user";

interface ProgressState {
  moduleProgress: Record<string, UserProgress>;
  achievements: Achievement[];
  totalXP: number;
  streak: number;
  totalLessonsCompleted: number;
  totalTimeMinutes: number;

  updateProgress: (moduleId: string, data: Partial<UserProgress>) => void;
  markLessonComplete: (moduleId: string, lessonId: string, xp: number) => void;
  unlockAchievement: (achievement: Achievement) => void;
  addXP: (amount: number) => void;
  setAchievements: (achievements: Achievement[]) => void;
  incrementStreak: () => void;
  addTime: (minutes: number) => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      moduleProgress: {},
      achievements: [],
      totalXP: 1200,
      streak: 5,
      totalLessonsCompleted: 15,
      totalTimeMinutes: 765, // 12h 45m

      updateProgress: (moduleId, data) =>
        set((s) => ({
          moduleProgress: {
            ...s.moduleProgress,
            [moduleId]: {
              ...s.moduleProgress[moduleId],
              userId: s.moduleProgress[moduleId]?.userId ?? "",
              moduleId,
              completedLessons:
                s.moduleProgress[moduleId]?.completedLessons ?? [],
              currentStepIndex:
                s.moduleProgress[moduleId]?.currentStepIndex ?? 0,
              videoPosition: s.moduleProgress[moduleId]?.videoPosition ?? 0,
              guideStepIndex:
                s.moduleProgress[moduleId]?.guideStepIndex ?? 0,
              lastRoute: s.moduleProgress[moduleId]?.lastRoute ?? "",
              updatedAt: new Date().toISOString(),
              ...data,
            },
          },
        })),

      markLessonComplete: (moduleId, lessonId, xp) => {
        const { moduleProgress } = get();
        const prog = moduleProgress[moduleId];
        const already = prog?.completedLessons?.includes(lessonId);
        if (already) return;
        set((s) => ({
          totalXP: s.totalXP + xp,
          totalLessonsCompleted: s.totalLessonsCompleted + 1,
          moduleProgress: {
            ...s.moduleProgress,
            [moduleId]: {
              ...s.moduleProgress[moduleId],
              userId: s.moduleProgress[moduleId]?.userId ?? "",
              moduleId,
              completedLessons: [
                ...(s.moduleProgress[moduleId]?.completedLessons ?? []),
                lessonId,
              ],
              currentStepIndex:
                s.moduleProgress[moduleId]?.currentStepIndex ?? 0,
              videoPosition: s.moduleProgress[moduleId]?.videoPosition ?? 0,
              guideStepIndex:
                s.moduleProgress[moduleId]?.guideStepIndex ?? 0,
              lastRoute: s.moduleProgress[moduleId]?.lastRoute ?? "",
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      unlockAchievement: (achievement) =>
        set((s) => {
          const already = s.achievements.find((a) => a.key === achievement.key);
          if (already?.unlocked) return {};
          return {
            achievements: s.achievements.map((a) =>
              a.key === achievement.key
                ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
                : a
            ),
            totalXP: s.totalXP + achievement.xpReward,
          };
        }),

      unlockAchievementByKey: (key: string) => {
        const { achievements } = get();
        const achievement = achievements.find((a) => a.key === key);
        if (achievement) get().unlockAchievement(achievement);
      },

      addXP: (amount) => set((s) => ({ totalXP: s.totalXP + amount })),

      setAchievements: (achievements) => set({ achievements }),

      incrementStreak: () => set((s) => ({ streak: s.streak + 1 })),

      addTime: (minutes) =>
        set((s) => ({ totalTimeMinutes: s.totalTimeMinutes + minutes })),

      reset: () =>
        set({
          moduleProgress: {},
          achievements: [],
          totalXP: 0,
          streak: 0,
          totalLessonsCompleted: 0,
          totalTimeMinutes: 0,
        }),
    }),
    { name: "progress-store" }
  )
);
