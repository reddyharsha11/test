"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Palette, Volume2, Monitor, Trash2, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { useAuthStore } from "@/store/authStore";
import { useGuideStore } from "@/store/guideStore";
import { useProgressStore } from "@/store/progressStore";
import { useUIStore } from "@/store/uiStore";
import type { CharacterType } from "@/types/guide";

const characters: { type: CharacterType; name: string; emoji: string }[] = [
  { type: "male", name: "Alex", emoji: "🧑🏻" },
  { type: "female", name: "Maya", emoji: "👩🏻" },
  { type: "neutral", name: "Zeno", emoji: "🤖" },
];

export default function SettingsPage() {
  const { settings, updateSettings, user } = useAuthStore();
  const { characterType, setCharacterType } = useGuideStore();
  const { reset: resetProgress } = useProgressStore();
  const { addToast } = useUIStore();
  const [confirmReset, setConfirmReset] = useState(false);

  function handleCharacterChange(type: CharacterType) {
    setCharacterType(type);
    updateSettings({ characterType: type });
    addToast({ type: "success", title: `Guide changed to ${characters.find((c) => c.type === type)?.name}!` });
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    setConfirmReset(false);
    addToast({ type: "info", title: "Progress reset", message: "All progress has been cleared." });
  }

  return (
    <GuideEngine>
      <AppShell>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Settings ⚙️</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Customize your GuideLearn experience
            </p>
          </motion.div>

          <div className="space-y-5">
            {/* Account */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-brand-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Account</h2>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-50 dark:bg-surface-dark-200">
                <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.[0] ?? "G"}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{user?.name ?? "Guest"}</p>
                  <p className="text-sm text-gray-500">{user?.email ?? "guest@example.com"}</p>
                </div>
              </div>
            </Card>

            {/* Appearance */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-brand-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Appearance</h2>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-300">Theme</p>
                <ThemeSwitcher />
              </div>
            </Card>

            {/* Guide Character */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-4 h-4 text-brand-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Guide Character</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {characters.map((char) => (
                  <button
                    key={char.type}
                    onClick={() => handleCharacterChange(char.type)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                      characterType === char.type
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                        : "border-surface-200 dark:border-surface-dark-300 hover:border-brand-300"
                    }`}
                  >
                    <CharacterRenderer
                      characterType={char.type}
                      animation={characterType === char.type ? "wave" : "idle"}
                      size="sm"
                    />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {char.name}
                    </span>
                    {characterType === char.type && (
                      <span className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Guide Speed */}
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-4 h-4 text-brand-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Guide Settings</h2>
              </div>

              {[
                { label: "Guide Speed", key: "guideSpeed", options: ["slow", "normal", "fast"] },
                { label: "Speech Bubble Size", key: "speechBubbleSize", options: ["small", "medium", "large"] },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between py-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{setting.label}</p>
                  <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-dark-200 rounded-lg">
                    {setting.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateSettings({ [setting.key]: opt } as Parameters<typeof updateSettings>[0])}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                          settings[setting.key as keyof typeof settings] === opt
                            ? "bg-white dark:bg-surface-dark-100 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {[
                { label: "Enable Narration", key: "enableNarration" },
                { label: "Reduce Motion", key: "reduceMotion" },
              ].map((toggle) => (
                <div key={toggle.key} className="flex items-center justify-between py-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{toggle.label}</p>
                  <button
                    onClick={() =>
                      updateSettings({
                        [toggle.key]: !settings[toggle.key as keyof typeof settings],
                      } as Parameters<typeof updateSettings>[0])
                    }
                    className={`w-10 h-5.5 rounded-full transition-colors ${
                      settings[toggle.key as keyof typeof settings]
                        ? "bg-brand-500"
                        : "bg-surface-300 dark:bg-surface-dark-300"
                    }`}
                    style={{ height: "22px" }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${
                        settings[toggle.key as keyof typeof settings] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </Card>

            {/* Danger zone */}
            <Card padding="md" className="border-red-200 dark:border-red-900">
              <h2 className="text-sm font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Danger Zone
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Reset All Progress
                  </p>
                  <p className="text-xs text-gray-500">This cannot be undone</p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleReset}
                >
                  {confirmReset ? "Confirm Reset" : "Reset Progress"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
