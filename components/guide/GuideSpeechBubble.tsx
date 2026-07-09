"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGuideStore } from "@/store/guideStore";

/**
 * GuideSpeechBubble — an OPTIONAL standalone bubble that can be
 * positioned relative to a highlighted element (not the character).
 * Not used in the current layout (character carries its own bubble).
 * Kept for future use with spotlight-attached tooltips.
 */
export function GuideSpeechBubble() {
  const { speech, highlightRect, visible } = useGuideStore();

  if (!speech || !visible || !highlightRect) return null;

  // Position bubble below the spotlight target
  const top = highlightRect.top + highlightRect.height + 18;
  const left = highlightRect.left;
  const maxWidth = 260;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={speech.slice(0, 20)}
        style={{
          position: "fixed",
          top,
          left,
          maxWidth,
          zIndex: 110,
          pointerEvents: "none",
        }}
        initial={{ opacity: 0, y: -6, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 360, damping: 26 }}
      >
        <div className="bg-white dark:bg-[#16162a] rounded-2xl px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-[#e5e7eb] dark:border-[#27273f]">
          {/* Arrow pointing up toward highlight */}
          <div
            className="absolute -top-[9px] left-5"
            style={{
              width: 0, height: 0,
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderBottom: "9px solid #e5e7eb",
            }}
          />
          <div
            className="absolute -top-[8px] left-5"
            style={{
              width: 0, height: 0,
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderBottom: "9px solid white",
            }}
          />
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
            {speech}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
