"use client";

import { Bell, Flame, Zap, Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useUIStore } from "@/store/uiStore";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { getInitials } from "@/lib/utils";

export function TopBar() {
  const { user } = useAuthStore();
  const { totalXP, streak } = useProgressStore();
  const { toggleMobileSidebar } = useUIStore();

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-16 bg-white/90 dark:bg-surface-dark-50/90 backdrop-blur-xl border-b border-surface-200 dark:border-surface-dark-300 flex items-center px-3 sm:px-4 gap-2 sm:gap-4">
      {/* Mobile menu */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-dark-200 text-gray-600 dark:text-gray-400"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      {/* Stats */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Streak */}
        <div
          id="daily-streak"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {streak} Day Streak
          </span>
        </div>

        {/* XP */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
          <Zap className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
            {totalXP.toLocaleString()} XP
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-dark-200 text-gray-600 dark:text-gray-400 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
        </button>

        {/* Theme */}
        <ThemeSwitcher compact />

        {/* Avatar */}
        <button className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-sm font-bold shadow-glow-sm hover:shadow-glow transition-shadow">
          {user ? getInitials(user.name) : "G"}
        </button>
      </div>
    </header>
  );
}
