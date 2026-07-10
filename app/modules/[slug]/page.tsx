"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Zap,
  BookOpen,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { useGuideStore } from "@/store/guideStore";
import { useProgressStore } from "@/store/progressStore";
import { modules } from "@/data/modules";
import { lessonGuide } from "@/data/guide-sequences/modules";
import { progressPercent, formatMinutes } from "@/lib/utils";
import type { Module } from "@/types/module";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ModuleDetailPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const { initSequence } = useGuideStore();
  const { moduleProgress } = useProgressStore();
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "cheatsheet">("overview");

  const mod = modules.find((m) => m.slug === slug);

  useEffect(() => {
    if (mod) {
      const t = setTimeout(() => initSequence(lessonGuide), 800);
      return () => clearTimeout(t);
    }
  }, [mod, initSequence]);

  if (!mod) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-gray-500">Module not found</p>
          <Link href="/modules" className="text-brand-500 hover:underline mt-2 block">
            ← Back to Modules
          </Link>
        </div>
      </AppShell>
    );
  }

  const progress = moduleProgress[mod.id];
  const completedLessons = progress?.completedLessons ?? [];
  const completedCount = completedLessons.length;
  const percent = progressPercent(completedCount, mod.totalLessons);

  return (
    <GuideEngine>
      <AppShell>
        <div className="max-w-screen-xl mx-auto">
          {/* Back */}
          <Link
            href="/modules"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modules
          </Link>

          {/* Hero */}
          <motion.div
            id="lesson-header"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden mb-6 relative"
            style={{
              background: `linear-gradient(135deg, ${mod.color}ee, ${mod.color}88)`,
            }}
          >
            <div className="p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <Badge variant={mod.difficulty as "beginner" | "intermediate" | "advanced"} className="mb-3">
                  {mod.difficulty}
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
                  {mod.title}
                </h1>
                <p className="text-white/80 text-base mb-4 max-w-lg">
                  {mod.longDescription}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {mod.totalLessons} Lessons
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {mod.estimatedHours}h estimated
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    {mod.xpReward} XP
                  </span>
                </div>

                <div className="mt-6">
                  <Link href={`/modules/${mod.slug}/lesson/${mod.lessons[Math.max(0, completedCount)]?.id ?? mod.lessons[0]?.id}`}>
                    <Button 
                      icon={<Play className="w-4 h-4" />} 
                      className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl font-bold px-8 transition-all"
                    >
                      {completedCount > 0 ? "Continue Module" : "Start Module"}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="text-8xl">{mod.icon}</div>
            </div>

            {/* Progress bar */}
            <div className="px-8 sm:px-12 pb-6">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>{completedCount}/{mod.totalLessons} lessons completed</span>
                <span className="font-bold">{percent}%</span>
              </div>
              <ProgressBar value={percent} size="sm" color="brand" className="opacity-90" />
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-dark-200 rounded-xl w-fit mb-6">
            {(["overview", "lessons", "cheatsheet"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-surface-dark-100 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab === "cheatsheet" ? "Cheat Sheet" : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-5"
            >
              <div className="lg:col-span-2 space-y-4">
                {/* Description */}
                <Card padding="md">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    What you&apos;ll learn
                  </h2>
                  <ul className="space-y-2">
                    {mod.tags.map((tag) => (
                      <li key={tag} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* First lesson CTA */}
                <Card padding="md" className="border-brand-200 dark:border-brand-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-1">
                        Continue Learning
                      </p>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {mod.lessons[Math.max(0, completedCount)]?.title ?? mod.lessons[0]?.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {mod.lessons[Math.max(0, completedCount)]?.duration ?? 20} min
                      </p>
                    </div>
                    <Link href={`/modules/${mod.slug}/lesson/${mod.lessons[Math.max(0, completedCount)]?.id ?? mod.lessons[0]?.id}`}>
                      <Button icon={<Play className="w-4 h-4" />}>
                        {completedCount > 0 ? "Continue" : "Start"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                {/* Stats */}
                <Card padding="md">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Module Stats
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Difficulty", value: mod.difficulty },
                      { label: "Total Lessons", value: mod.totalLessons },
                      { label: "Duration", value: `${mod.estimatedHours}h` },
                      { label: "XP Reward", value: `${mod.xpReward} XP` },
                    ].map((s) => (
                      <div key={s.label} className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{s.label}</span>
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quiz CTA */}
                <Card padding="md" className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
                  <div className="text-center">
                    <p className="text-2xl mb-2">📝</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      Module Quiz
                    </p>
                    <p className="text-xs text-gray-500 mt-1 mb-3">
                      Test your knowledge with {mod.quiz.length} questions
                    </p>
                    <Link href={`/modules/${mod.slug}/quiz`}>
                      <Button variant="secondary" size="sm" fullWidth>
                        Take Quiz
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === "lessons" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {mod.lessons.map((lesson, i) => {
                const isDone = completedLessons.includes(lesson.id);
                const isLocked = i > completedCount + 2;

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={isLocked ? "#" : `/modules/${mod.slug}/lesson/${lesson.id}`}
                      className={isLocked ? "pointer-events-none" : ""}
                    >
                      <Card
                        hover={!isLocked}
                        padding="md"
                        className={isDone ? "border-emerald-200 dark:border-emerald-800" : ""}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isDone
                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                : isLocked
                                ? "bg-surface-200 dark:bg-surface-dark-300"
                                : "bg-brand-100 dark:bg-brand-900/30"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : isLocked ? (
                              <Lock className="w-5 h-5 text-gray-400" />
                            ) : (
                              <Play className="w-5 h-5 text-brand-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-400">Lesson {lesson.order}</p>
                              {isDone && (
                                <Badge variant="success" size="sm">Completed</Badge>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                              {lesson.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">{lesson.duration} min</p>
                          </div>
                          {!isLocked && (
                            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                          )}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "cheatsheet" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {mod.cheatSheet.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card padding="md" className="h-full">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {entry.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {entry.description}
                    </p>
                    {entry.code && (
                      <CodeBlock
                        code={entry.code.code}
                        language={entry.code.language}
                        label={entry.title}
                      />
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
