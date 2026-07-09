"use client";

import { motion } from "framer-motion";
import { useGuideStore } from "@/store/guideStore";

const PADDING = 10;

export function GuideOverlay() {
  const { highlightRect } = useGuideStore();

  if (!highlightRect) {
    // No target — full dark screen
    return (
      <motion.div
        key="overlay-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 80,
          pointerEvents: "none",
        }}
      />
    );
  }

  const r = highlightRect;
  const pad = PADDING;

  const hTop    = r.top - pad;
  const hLeft   = r.left - pad;
  const hRight  = r.left + r.width + pad;
  const hBottom = r.top + r.height + pad;
  const hWidth  = hRight - hLeft;
  const hHeight = hBottom - hTop;

  const bg = "rgba(0,0,0,0.65)";

  return (
    <motion.div
      key="overlay-spotlight"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: "none" }}
    >
      {/* ── Four surrounding dark rectangles ───────────────────────────────── */}

      {/* TOP strip */}
      <motion.div
        style={{ position: "fixed", background: bg, top: 0, left: 0, right: 0, height: Math.max(0, hTop) }}
        animate={{ height: Math.max(0, hTop) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* BOTTOM strip */}
      <motion.div
        style={{ position: "fixed", background: bg, left: 0, right: 0, bottom: 0, top: hBottom }}
        animate={{ top: hBottom }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* LEFT strip (between top and bottom) */}
      <motion.div
        style={{ position: "fixed", background: bg, top: hTop, height: hHeight, left: 0, width: Math.max(0, hLeft) }}
        animate={{ top: hTop, height: hHeight, width: Math.max(0, hLeft) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* RIGHT strip (between top and bottom) */}
      <motion.div
        style={{ position: "fixed", background: bg, top: hTop, height: hHeight, left: hRight, right: 0 }}
        animate={{ top: hTop, height: hHeight, left: hRight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* ── Glowing highlight border around the element ────────────────────── */}
      <motion.div
        style={{
          position: "fixed",
          top: hTop,
          left: hLeft,
          width: hWidth,
          height: hHeight,
          borderRadius: 14,
          border: "2px solid rgba(97, 114, 249, 0.9)",
          boxShadow:
            "0 0 0 4px rgba(97, 114, 249, 0.15), 0 0 24px rgba(97, 114, 249, 0.5)",
          pointerEvents: "none",
        }}
        animate={{ top: hTop, left: hLeft, width: hWidth, height: hHeight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
}
