"use client";

import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { modules } from "@/data/modules";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function QuizzesPage() {
  return (
    <GuideEngine>
      <AppShell>
        <div className="max-w-screen-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Quizzes 📝</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Test your knowledge across all modules</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {modules.map((mod, i) => (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/modules/${mod.slug}/quiz`}>
                  <Card hover padding="md" className="text-center h-full">
                    <div className="text-5xl mb-3">{mod.icon}</div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{mod.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{mod.quiz.length} questions</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gradient text-white text-xs font-bold">
                      <BookOpen className="w-3.5 h-3.5" /> Take Quiz
                    </span>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
