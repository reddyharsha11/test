"use client";

import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  X,
} from "lucide-react";
import { useGuideStore } from "@/store/guideStore";
import { cn } from "@/lib/utils";

export function GuideControls() {
  const {
    currentStep,
    totalSteps,
    paused,
    nextStep,
    prevStep,
    togglePause,
    skip,
    replay,
    close,
    speech,
  } = useGuideStore();

  // Keyboard shortcuts
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
      if (e.key === " ") {
        e.preventDefault();
        togglePause();
      }
      if (e.key === "Escape") close();
    },
    [nextStep, prevStep, togglePause, close]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[100]"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
    >
      {/* Progress bar */}
      <div className="h-0.5 bg-surface-200 dark:bg-surface-dark-300">
        <motion.div
          className="h-full bg-brand-gradient"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Control bar */}
      <div className="bg-white/95 dark:bg-surface-dark-50/95 backdrop-blur-xl border-t border-surface-200 dark:border-surface-dark-300 px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          {/* Step info */}
          <div className="flex-1 min-w-0">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300 truncate mt-0.5 hidden sm:block">
              {speech}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Back */}
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all",
                "bg-surface-100 dark:bg-surface-dark-200 text-gray-700 dark:text-gray-300",
                "hover:bg-surface-200 dark:hover:bg-surface-dark-300",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
              title="Back (←)"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {/* Pause / Play */}
            <button
              onClick={togglePause}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-surface-100 dark:bg-surface-dark-200 text-gray-700 dark:text-gray-300 hover:bg-surface-200 dark:hover:bg-surface-dark-300 transition-all"
              title="Pause/Play (Space)"
            >
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {paused ? "Resume" : "Pause"}
            </button>

            {/* Forward */}
            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-brand-gradient text-white shadow-glow-sm hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              title="Forward (→)"
            >
              Forward
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Replay */}
            <button
              onClick={replay}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-surface-dark-200 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
              title="Replay tour"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip */}
            <button
              onClick={skip}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-surface-dark-200 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
              title="Skip tour"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Exit */}
            <button
              onClick={close}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
              title="Exit tour (Esc)"
            >
              <X className="w-4 h-4" />
              Exit Tour
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
