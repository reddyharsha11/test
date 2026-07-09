"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Clock,
  Zap,
  Trophy,
  TrendingUp,
  ArrowRight,
  Calendar,
  Flame,
  BookOpen,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgressStore } from "@/store/progressStore";
import { useAuthStore } from "@/store/authStore";
import { modules } from "@/data/modules";
import { formatMinutes, progressPercent } from "@/lib/utils";

import type { Variants } from "framer-motion";

const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 320, damping: 28 } },
};

// ─── Welcome Section ─────────────────────────────────────────────────────────
export function WelcomeSection() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] ?? "Learner";

  return (
    <motion.div
      id="dashboard-welcome"
      variants={fadeUp}
      className="mb-6"
    >
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
        Welcome back, {firstName}! 👋
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        Let&apos;s continue your learning journey. You&apos;ve got this!
      </p>
    </motion.div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
export function StatsRow() {
  const { totalXP, totalLessonsCompleted, totalTimeMinutes } = useProgressStore();

  const stats = [
    {
      id: "stat-progress",
      label: "Overall Progress",
      value: `${progressPercent(totalLessonsCompleted, 47)}%`,
      sub: `${totalLessonsCompleted} / 47 Lessons`,
      icon: <TrendingUp className="w-5 h-5 text-brand-500" />,
      color: "brand" as const,
      link: "/progress",
      linkLabel: "View Progress →",
    },
    {
      id: "stat-xp",
      label: "XP Earned",
      value: totalXP.toLocaleString(),
      sub: "Next Reward in 300 XP",
      icon: <Zap className="w-5 h-5 text-brand-500" />,
      color: "brand" as const,
      progress: ((totalXP % 300) / 300) * 100,
    },
    {
      id: "stat-achievements",
      label: "Achievements",
      value: "8/24",
      sub: "Keep going!",
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      color: "orange" as const,
      link: "/achievements",
      linkLabel: "Keep going!",
    },
    {
      id: "stat-time",
      label: "Time Learned",
      value: formatMinutes(totalTimeMinutes),
      sub: "This month ↗ 8h 20m",
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      color: "green" as const,
    },
  ];

  return (
    <motion.div
      id="dashboard-stats"
      variants={stagger}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {stats.map((s) => (
        <motion.div key={s.id} variants={fadeUp}>
          <Card className="h-full" padding="md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {s.label}
              </span>
              <div className="p-2 rounded-xl bg-surface-100 dark:bg-surface-dark-200">
                {s.icon}
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {s.value}
            </p>
            {s.progress !== undefined && (
              <ProgressBar
                value={s.progress}
                size="xs"
                color={s.color}
                className="mt-2"
              />
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {s.link ? (
                <Link href={s.link} className="text-brand-500 hover:underline">
                  {(s as { linkLabel?: string; sub: string }).linkLabel ?? (s as { sub: string }).sub}
                </Link>
              ) : (
                (s as { sub: string }).sub
              )}
            </p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Continue Learning ─────────────────────────────────────────────────────
export function ContinueLearning() {
  const { moduleProgress } = useProgressStore();
  const currentModule = modules[1]; // React & Next.js
  const completedCount =
    moduleProgress[currentModule.id]?.completedLessons?.length ?? 9;
  const percent = progressPercent(completedCount, currentModule.totalLessons);

  return (
    <motion.div variants={fadeUp}>
      <Card id="continue-learning" className="mb-4" padding="md">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">
            Continue Learning
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Thumbnail */}
          <div className="w-full sm:w-[120px] h-[80px] rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 relative overflow-hidden">
            <span className="text-4xl">⚛️</span>
            <Badge variant="info" className="absolute top-2 left-2" size="sm">
              In Progress
            </Badge>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">Module 2</p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {currentModule.title}
            </h3>
            <ProgressBar
              value={percent}
              size="sm"
              className="my-2 max-w-full sm:max-w-[240px]"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {percent}% Complete
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Next Lesson:{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {currentModule.lessons[2]?.title ?? "Components and Props"}
              </span>
            </p>
            <Link
              href={`/modules/${currentModule.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gradient text-white text-sm font-bold hover:shadow-glow-sm transition-all"
            >
              Continue Lesson
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Upcoming Lessons ─────────────────────────────────────────────────────
export function UpcomingLessons() {
  const upcoming = [
    { title: "State Management in React", lesson: "Lesson 8", duration: "20 min", icon: "⚛️" },
    { title: "React Router Basics", lesson: "Lesson 9", duration: "25 min", icon: "🔀" },
    { title: "Custom Hooks", lesson: "Lesson 10", duration: "30 min", icon: "🪝" },
  ];

  return (
    <motion.div variants={fadeUp}>
      <Card id="upcoming-lessons" padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">
            Upcoming Lessons
          </h2>
          <Link
            href="/modules"
            className="text-xs font-semibold text-brand-500 hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {upcoming.map((lesson, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-dark-200 transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-dark-200 flex items-center justify-center text-lg shrink-0">
                {lesson.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {lesson.title}
                </p>
                <p className="text-xs text-gray-400">
                  {lesson.lesson} · {lesson.duration}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Module Grid ─────────────────────────────────────────────────────────────
export function ModuleGrid() {
  const { moduleProgress } = useProgressStore();

  return (
    <motion.div variants={fadeUp} className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="your-modules"
          className="text-lg font-bold text-gray-800 dark:text-gray-200"
        >
          Your Modules
        </h2>
        <Link
          href="/modules"
          className="text-sm font-semibold text-brand-500 hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod, i) => {
          const completed =
            moduleProgress[mod.id]?.completedLessons?.length ?? 0;
          const defaultCompleted = [67, 60, 43][i] ?? 0;
          const percent = completed
            ? progressPercent(completed, mod.totalLessons)
            : defaultCompleted;

          return (
            <motion.div
              key={mod.id}
              id={`module-card-${i}`}
              variants={fadeUp}
              whileHover={{ y: -2 }}
            >
              <Link href={`/modules/${mod.slug}`}>
                <Card hover padding="md" className="h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: `${mod.color}20` }}
                    >
                      {mod.icon}
                    </div>
                    <div className="min-w-0">
                      <Badge
                        variant={mod.difficulty as "beginner" | "intermediate" | "advanced"}
                        size="sm"
                      >
                        {mod.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 leading-snug">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {completed || [12, 9, 6][i]}/{mod.totalLessons} Lessons
                  </p>
                  <ProgressBar
                    value={percent}
                    size="xs"
                    className="mb-1"
                  />
                  <p className="text-xs font-bold text-right" style={{ color: mod.color }}>
                    {percent}%
                  </p>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Recent Activity ─────────────────────────────────────────────────────
export function RecentActivity() {
  const activities = [
    { label: "Completed: CSS Flexbox lesson", time: "2h ago", icon: "✅" },
    { label: "Earned: 'First Step' badge", time: "Yesterday", icon: "🏅" },
    { label: "Quiz: JavaScript Basics — 90%", time: "2 days ago", icon: "📝" },
    { label: "Started: React & Next.js module", time: "3 days ago", icon: "🚀" },
  ];

  return (
    <motion.div variants={fadeUp} className="mt-6">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
        Recent Activity
      </h2>
      <Card padding="md">
        <div className="space-y-3">
          {activities.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-surface-100 dark:border-surface-dark-200 last:border-0"
            >
              <span className="text-lg">{a.icon}</span>
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                {a.label}
              </span>
              <span className="text-xs text-gray-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Achievements Section ─────────────────────────────────────────────────
export function AchievementsSection() {
  const badges = [
    { emoji: "🚀", label: "First Step", unlocked: true },
    { emoji: "🔥", label: "5-Day Streak", unlocked: true },
    { emoji: "⚡", label: "Speed Learner", unlocked: true },
    { emoji: "💎", label: "Module Master", unlocked: false },
    { emoji: "🏆", label: "Quiz Champion", unlocked: false },
    { emoji: "🌟", label: "Top Student", unlocked: false },
  ];

  return (
    <motion.div
      id="achievements-section"
      variants={fadeUp}
      className="mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Achievements
        </h2>
        <Link
          href="/achievements"
          className="text-sm font-semibold text-brand-500 hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.08 }}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
              badge.unlocked
                ? "bg-white dark:bg-surface-dark-100 border-brand-200 dark:border-brand-800 shadow-glow-sm"
                : "bg-surface-100 dark:bg-surface-dark-200 border-surface-200 dark:border-surface-dark-300 opacity-50"
            }`}
          >
            <span className="text-3xl">{badge.emoji}</span>
            <span className="text-[10px] font-semibold text-center text-gray-600 dark:text-gray-400 leading-tight">
              {badge.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
