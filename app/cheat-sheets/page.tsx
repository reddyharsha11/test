"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bookmark, BookmarkCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { modules } from "@/data/modules";
import type { CheatSheetEntry } from "@/types/module";

// Flatten all cheat sheet entries from all modules
const allEntries: (CheatSheetEntry & { moduleTitle: string; moduleColor: string })[] =
  modules.flatMap((mod) =>
    mod.cheatSheet.map((entry) => ({
      ...entry,
      moduleTitle: mod.title,
      moduleColor: mod.color,
    }))
  );

const allTags = Array.from(new Set(allEntries.flatMap((e) => e.tags)));

export default function CheatSheetsPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const filtered = allEntries.filter((entry) => {
    const matchSearch =
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchTag = !activeTag || entry.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  function toggleBookmark(id: string) {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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
              Cheat Sheets 📄
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Quick reference cards for every concept you&apos;ve learned
            </p>
          </motion.div>

          {/* Search + Tags */}
          <div className="flex flex-col gap-3 mb-6">
            <Input
              placeholder="Search cheat sheets..."
              icon={<Search className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  !activeTag
                    ? "bg-brand-500 text-white"
                    : "bg-surface-100 dark:bg-surface-dark-200 text-gray-600 dark:text-gray-400 hover:bg-surface-200 dark:hover:bg-surface-dark-300"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeTag === tag
                      ? "bg-brand-500 text-white"
                      : "bg-surface-100 dark:bg-surface-dark-200 text-gray-600 dark:text-gray-400 hover:bg-surface-200 dark:hover:bg-surface-dark-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card padding="none" className="overflow-hidden h-full">
                  {/* Card header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-dark-300"
                    style={{ borderLeftColor: entry.moduleColor, borderLeftWidth: 3 }}
                  >
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {entry.title}
                      </h3>
                      <p className="text-[10px] text-gray-400">{entry.moduleTitle}</p>
                    </div>
                    <button
                      onClick={() => toggleBookmark(entry.id)}
                      className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-dark-200 transition-colors"
                    >
                      {bookmarks.has(entry.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-brand-500" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
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
                        <button
                          key={tag}
                          onClick={() => setActiveTag(tag)}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-surface-100 dark:bg-surface-dark-200 text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📄</p>
              <p className="text-gray-500">No cheat sheets found</p>
            </div>
          )}
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
