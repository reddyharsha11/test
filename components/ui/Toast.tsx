"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, XCircle, Trophy, Bell, Info } from "lucide-react";
import { useUIStore, type Toast } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const iconMap = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  achievement: <Trophy className="w-5 h-5 text-amber-500" />,
  reminder: <Bell className="w-5 h-5 text-brand-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const borderMap = {
  success: "border-emerald-200 dark:border-emerald-800",
  error: "border-red-200 dark:border-red-800",
  achievement: "border-amber-200 dark:border-amber-800",
  reminder: "border-brand-200 dark:border-brand-800",
  info: "border-blue-200 dark:border-blue-800",
};

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useUIStore((s) => s.removeToast);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "flex items-start gap-3 min-w-[300px] max-w-sm w-full",
        "bg-white dark:bg-surface-dark-100 rounded-2xl border shadow-card-hover",
        "p-4 pr-3",
        borderMap[toast.type]
      )}
    >
      <div className="shrink-0 mt-0.5">{iconMap[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={() => remove(toast.id)}
        className="shrink-0 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-dark-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div
      className="fixed bottom-24 right-4 z-[200] flex flex-col gap-2 items-end pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
