"use client";

import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgressStore } from "@/store/progressStore";
import { modules } from "@/data/modules";
import { formatMinutes, progressPercent } from "@/lib/utils";

export default function ProgressPage() {
  const { totalXP, totalLessonsCompleted, totalTimeMinutes, streak, moduleProgress } =
    useProgressStore();

  return (
    <GuideEngine>
      <AppShell>
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              My Progress 📈
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track your learning journey across all modules
            </p>
          </motion.div>

          {/* Overview stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total XP", value: totalXP.toLocaleString(), emoji: "⚡", color: "text-brand-500" },
              { label: "Lessons Done", value: totalLessonsCompleted, emoji: "✅", color: "text-emerald-500" },
              { label: "Time Learned", value: formatMinutes(totalTimeMinutes), emoji: "⏱️", color: "text-blue-500" },
              { label: "Day Streak", value: streak, emoji: "🔥", color: "text-orange-500" },
            ].map((s) => (
              <Card key={s.label} padding="md" className="text-center">
                <p className="text-3xl mb-1">{s.emoji}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Per-module progress */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Module Progress
          </h2>
          <div className="space-y-4">
            {modules.map((mod, i) => {
              const prog = moduleProgress[mod.id];
              const completed = prog?.completedLessons?.length ?? [12, 9, 6][i] ?? 0;
              const percent = progressPercent(completed, mod.totalLessons);

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card padding="md">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ backgroundColor: `${mod.color}20` }}
                      >
                        {mod.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                            {mod.title}
                          </h3>
                          <span className="text-sm font-black" style={{ color: mod.color }}>
                            {percent}%
                          </span>
                        </div>
                        <ProgressBar
                          value={percent}
                          size="sm"
                          className="mb-1"
                        />
                        <p className="text-xs text-gray-400">
                          {completed}/{mod.totalLessons} lessons · {mod.xpReward} XP reward
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
