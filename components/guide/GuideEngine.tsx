"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useGuideStore } from "@/store/guideStore";
import { getElementRect } from "@/lib/spotlight";
import { GuideOverlay } from "./GuideOverlay";
import { GuideControls } from "./GuideControls";
import { GuideCharacter } from "./GuideCharacter";

/**
 * GuideEngine — wraps the full app.
 * Syncs spotlight rect on every animation frame when a target is active.
 */
export function GuideEngine({ children }: { children: React.ReactNode }) {
  const {
    targetSelector,
    overlayVisible,
    visible,
    playing,
    updateHighlightRect,
  } = useGuideStore();

  useEffect(() => {
    if (!targetSelector) {
      updateHighlightRect(null);
      return;
    }

    let rafId: number;

    const sync = () => {
      const rect = getElementRect(targetSelector);
      updateHighlightRect(rect);
      rafId = requestAnimationFrame(sync);
    };

    // Brief delay for DOM paint before first measurement
    const tid = setTimeout(() => {
      sync();
    }, 150);

    const startTime = Date.now();
    const tryScroll = () => {
      const el = document.querySelector(targetSelector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (Date.now() - startTime < 2000) {
        setTimeout(tryScroll, 100);
      }
    };
    tryScroll();

    return () => {
      clearTimeout(tid);
      cancelAnimationFrame(rafId);
    };
  }, [targetSelector, updateHighlightRect]);

  return (
    <>
      {children}

      {/* Spotlight overlay — only when a target element is active */}
      <AnimatePresence>
        {visible && overlayVisible && <GuideOverlay key="overlay" />}
      </AnimatePresence>

      {/* Persistent guide character + speech bubble */}
      <GuideCharacter key="character" />

      {/* Bottom guide controls bar */}
      <AnimatePresence>
        {visible && playing && <GuideControls key="controls" />}
      </AnimatePresence>
    </>
  );
}
