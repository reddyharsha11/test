"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Clock, Zap, BookOpen, Filter } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useGuideStore } from "@/store/guideStore";
import { useProgressStore } from "@/store/progressStore";
import { modulesGuide } from "@/data/guide-sequences/modules";
import { modules } from "@/data/modules";
import { progressPercent } from "@/lib/utils";
import type { DifficultyLevel } from "@/types/module";

const difficulties: (DifficultyLevel | "all")[] = [
  "all",
  "beginner",
  "intermediate",
  "advanced",
];

export default function ModulesPage() {
  const { initSequence } = useGuideStore();
  const { moduleProgress } = useProgressStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DifficultyLevel | "all">("all");

  useEffect(() => {
    const t = setTimeout(() => initSequence(modulesGuide), 600);
    return () => clearTimeout(t);
  }, [initSequence]);

  const filtered = modules.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "all" || m.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <GuideEngine>
      <AppShell>
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <motion.div
            id="modules-header"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Learning Modules 📚
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Structured learning paths from beginner to pro
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div id="modules-search" className="flex-1">
              <Input
                placeholder="Search modules or topics..."
                icon={<Search className="w-4 h-4" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div
              id="module-filters"
              className="flex items-center gap-2 p-1 bg-surface-100 dark:bg-surface-dark-200 rounded-xl"
            >
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filter === d
                      ? "bg-white dark:bg-surface-dark-100 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Module grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((mod, i) => {
              const completed =
                moduleProgress[mod.id]?.completedLessons?.length ?? 0;
              const defaults = [12, 9, 6];
              const shownCompleted = completed || defaults[i] || 0;
              const percent = progressPercent(shownCompleted, mod.totalLessons);

              return (
                <motion.div
                  key={mod.id}
                  id={`module-card-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                >
                  <Link href={`/modules/${mod.slug}`}>
                    <Card hover padding="none" className="overflow-hidden h-full">
                      {/* Thumbnail */}
                      <div
                        className="h-36 flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${mod.color}dd, ${mod.color}88)`,
                        }}
                      >
                        <span className="text-6xl">{mod.icon}</span>
                        <div className="absolute top-3 left-3">
                          <Badge variant={mod.difficulty as "beginner" | "intermediate" | "advanced"}>
                            {mod.difficulty}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="text-xs font-bold text-white/80 bg-black/20 px-2 py-1 rounded-lg">
                            {mod.estimatedHours}h
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                          {mod.title}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                          {mod.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {mod.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-100 dark:bg-surface-dark-200 text-gray-600 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {shownCompleted}/{mod.totalLessons} Lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            {mod.xpReward} XP
                          </span>
                        </div>

                        <ProgressBar value={percent} size="xs" />
                        <p className="text-right text-xs font-bold mt-1" style={{ color: mod.color }}>
                          {percent}%
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-500 dark:text-gray-400">
                No modules found for &quot;{search}&quot;
              </p>
            </div>
          )}
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
