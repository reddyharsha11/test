import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserSettings } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  settings: UserSettings;
  theme: string; // selected theme key
  selectedClubs: string[]; // chosen clubs/cards
  onboardingCompleted: boolean; // flag

  setUser: (user: User, token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  logout: () => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  setTheme: (theme: string) => void;
  setSelectedClubs: (clubs: string[]) => void;
  completeOnboarding: () => void;
}

const defaultSettings: UserSettings = {
  theme: "system",
  characterType: "male",
  guideSpeed: "normal",
  speechBubbleSize: "medium",
  enableNarration: true,
  reduceMotion: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      settings: defaultSettings,
      theme: "system",
      selectedClubs: [],
      onboardingCompleted: false,

      setUser: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        }),

      updateUser: (partial) =>
        set((s) => ({
          user: s.user ? { ...s.user, ...partial } : null,
        })),

      updateSettings: (partial) =>
        set((s) => ({
          settings: { ...s.settings, ...partial },
        })),

      setTheme: (theme) => set({ theme }),
      setSelectedClubs: (clubs) => set({ selectedClubs: clubs }),
      completeOnboarding: () => set({ onboardingCompleted: true }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        }),

      setLoading: (v) => set({ isLoading: v }),
      setError: (msg) => set({ error: msg }),
    }),
    {
      name: "auth-store",
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
        settings: s.settings,
      }),
    }
  )
);
