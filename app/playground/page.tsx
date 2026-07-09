"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { CodePlayground } from "@/components/ide/CodePlayground";
import { PLAYGROUND_STARTERS, PLAYGROUND_STARTER_OPTIONS } from "@/data/playground-starters";

type PlaygroundStarterKey = keyof typeof PLAYGROUND_STARTERS;

export default function PlaygroundPage() {
  const [starterKey, setStarterKey] = useState<PlaygroundStarterKey>("ecommerce");

  const starter = PLAYGROUND_STARTERS[starterKey];

  return (
    <GuideEngine>
      <AppShell>
        {/* Full-bleed: cancel AppShell padding */}
        <div className="-m-4 sm:-m-6 flex flex-col h-[calc(100dvh-64px)]">
          {/* ── Compact Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-2.5 shrink-0 bg-white dark:bg-surface-dark-100 border-b border-surface-200 dark:border-surface-dark-300"
          >
            {/* Left: Title */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-brand-500" />
              </div>
              <div>
                <h1 className="text-sm font-black text-gray-900 dark:text-white leading-none">
                  Playground
                </h1>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-0.5 hidden sm:block">
                  Run, edit, preview, and swap starter boilerplates in one place
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-dark-200 border border-surface-200 dark:border-surface-dark-300">
                {starter.icon} {starter.label}
              </span>
              <span className="hidden md:inline">Use the starter chips next to Run to swap layouts</span>
            </div>
          </motion.div>

          {/* ── Full-Height IDE ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="flex-1 min-h-0 p-2 sm:p-3"
          >
            <CodePlayground
              template={starter.template}
              files={starter.files}
              starterOptions={PLAYGROUND_STARTER_OPTIONS}
              activeStarterId={starterKey}
              onStarterChange={(id) => setStarterKey(id as PlaygroundStarterKey)}
              options={{
                showConsole: false,
                showFileExplorer: true,
                editorHeight: "100%",
              }}
            />
          </motion.div>
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
