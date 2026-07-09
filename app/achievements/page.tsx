"use client";

import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { useProgressStore } from "@/store/progressStore";

const ACHIEVEMENTS = [
  { key: "first-step", emoji: "🚀", title: "First Step", description: "Complete your first lesson", xp: 50, category: "learning", unlocked: true },
  { key: "streak-5", emoji: "🔥", title: "5-Day Streak", description: "Learn for 5 days in a row", xp: 100, category: "streak", unlocked: true },
  { key: "speed-learner", emoji: "⚡", title: "Speed Learner", description: "Complete 3 lessons in one day", xp: 75, category: "speed", unlocked: true },
  { key: "quiz-ace", emoji: "🎯", title: "Quiz Ace", description: "Score 100% on any quiz", xp: 100, category: "learning", unlocked: false },
  { key: "module-complete", emoji: "💎", title: "Module Master", description: "Complete an entire module", xp: 250, category: "completion", unlocked: false },
  { key: "streak-30", emoji: "🌋", title: "30-Day Streak", description: "30 days of consistent learning", xp: 500, category: "streak", unlocked: false },
  { key: "cheatsheet-bookmark", emoji: "📌", title: "Bookworm", description: "Bookmark 10 cheat sheets", xp: 50, category: "learning", unlocked: false },
  { key: "all-quizzes", emoji: "🏆", title: "Quiz Champion", description: "Pass all module quizzes", xp: 300, category: "completion", unlocked: false },
  { key: "top-student", emoji: "🌟", title: "Top Student", description: "Reach 5000 XP", xp: 500, category: "learning", unlocked: false },
  { key: "night-learner", emoji: "🌙", title: "Night Owl", description: "Study after 10 PM", xp: 50, category: "social", unlocked: false },
  { key: "first-quiz", emoji: "📝", title: "Quiz Taker", description: "Complete your first quiz", xp: 30, category: "learning", unlocked: true },
  { key: "referral", emoji: "🤝", title: "Team Player", description: "Invite a friend to GuideLearn", xp: 100, category: "social", unlocked: false },
];

const categories = ["all", "learning", "streak", "completion", "speed", "social"] as const;

export default function AchievementsPage() {
  const { totalXP } = useProgressStore();
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <GuideEngine>
      <AppShell>
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Achievements 🏆
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {unlockedCount}/{ACHIEVEMENTS.length} unlocked · {totalXP.toLocaleString()} total XP
            </p>
          </motion.div>

          {/* XP summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Earned Badges", value: unlockedCount, emoji: "🏅" },
              { label: "Total Badges", value: ACHIEVEMENTS.length, emoji: "🎖️" },
              { label: "Total XP", value: totalXP.toLocaleString(), emoji: "⚡" },
              { label: "Completion", value: `${Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%`, emoji: "📈" },
            ].map((s) => (
              <Card key={s.label} padding="md" className="text-center">
                <p className="text-3xl mb-1">{s.emoji}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={ach.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: "spring" }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                <Card
                  padding="md"
                  className={`text-center h-full ${
                    ach.unlocked
                      ? "border-brand-200 dark:border-brand-800 shadow-glow-sm"
                      : "opacity-50"
                  }`}
                >
                  <div
                    className={`text-5xl mb-3 transition-all ${
                      ach.unlocked ? "" : "grayscale"
                    }`}
                  >
                    {ach.emoji}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    {ach.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug mb-2">
                    {ach.description}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      ach.unlocked
                        ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                        : "bg-surface-100 dark:bg-surface-dark-200 text-gray-400"
                    }`}
                  >
                    ⚡ {ach.xp} XP
                  </span>
                  {ach.unlocked && (
                    <div className="mt-2">
                      <span className="text-[10px] font-bold text-emerald-500">
                        ✓ Unlocked
                      </span>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
