"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

type Theme = "light" | "dark" | "system";

const themes: { key: Theme; icon: React.ReactNode; label: string }[] = [
  { key: "light", icon: <Sun className="w-4 h-4" />, label: "Light" },
  { key: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark" },
  { key: "system", icon: <Monitor className="w-4 h-4" />, label: "System" },
];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
  localStorage.setItem("theme", theme);
}

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { settings, updateSettings } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("theme") as Theme) ?? "system";
    updateSettings({ theme: saved });
    applyTheme(saved);
  }, []);

  const current = settings.theme;

  function handleChange(theme: Theme) {
    updateSettings({ theme });
    applyTheme(theme);
  }

  if (!mounted) return null;

  if (compact) {
    const next = current === "light" ? "dark" : current === "dark" ? "system" : "light";
    const CurrentIcon = themes.find((t) => t.key === current)?.icon;
    return (
      <button
        onClick={() => handleChange(next)}
        className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-dark-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
        title={`Theme: ${current}`}
      >
        {CurrentIcon}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-dark-200 rounded-xl">
      {themes.map((t) => (
        <button
          key={t.key}
          onClick={() => handleChange(t.key)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
            current === t.key
              ? "bg-white dark:bg-surface-dark-100 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          )}
          title={t.label}
        >
          {t.icon}
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
