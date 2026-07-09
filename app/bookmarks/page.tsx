"use client";

import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { motion } from "framer-motion";

export default function BookmarksPage() {
  return (
    <GuideEngine>
      <AppShell>
        <div className="max-w-screen-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Bookmarks 🔖</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Your saved cheat sheets and lessons</p>
          </motion.div>
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔖</p>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">No bookmarks yet</p>
            <p className="text-gray-500 mt-2">Bookmark cheat sheets from the Cheat Sheets page to find them here.</p>
          </div>
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
