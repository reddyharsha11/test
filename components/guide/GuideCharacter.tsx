"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGuideStore } from "@/store/guideStore";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { useUIStore } from "@/store/uiStore";
import { useMemoryStore } from "@/store/memoryStore";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CloudRain, Trash2 } from "lucide-react";



export function GuideCharacter() {
  const { animation: storeAnim, characterType, visible, speech: storeSpeech } = useGuideStore();
  const { sidebarCollapsed } = useUIStore();
  const memory = useMemoryStore();
  const pathname = usePathname();

  const [surpriseSpeech, setSurpriseSpeech] = useState<string | null>(null);

  // Keep character position adjusted outside of the Sidebar
  const leftOffset = sidebarCollapsed ? 68 : 208;
  const currentBottom = visible ? 72 : 24;
  const currentLeft = visible ? leftOffset : leftOffset + 24;
  const currentScale = visible ? 1 : 0.6;
  const currentOpacity = visible ? 1 : 0.7;

  // Render surprise Speech or fallback to store speech
  const activeSpeech = storeSpeech || surpriseSpeech;
  const activeAnim = storeAnim;

  // React to page navigation changes by recalling memories or suggesting actions
  useEffect(() => {
    if (storeSpeech) return; // Don't interrupt active tours

    const routeTriggers = () => {
      // 25% chance to talk upon page navigation
      if (Math.random() > 0.3) return;

      if (pathname === "/playground") {
        if (memory.playgroundRunCount > 5) {
          setSurpriseSpeech("Wow! You've compiled a lot of codes in the Sandbox! Keep building! 💻🚀");
        } else {
          setSurpriseSpeech("Welcome to the Playground! Let's write some clean files together! 📂");
        }
      } else if (pathname === "/quizzes") {
        if (memory.recentMistakes.length > 0) {
          const lastMistake = memory.recentMistakes[memory.recentMistakes.length - 1];
          setSurpriseSpeech(`Don't worry about the quiz errors in ${lastMistake}. We will master it! 🎯`);
        } else {
          setSurpriseSpeech("Ready to test your coding limits? You've got this! 🏆");
        }
      } else if (pathname === "/achievements") {
        setSurpriseSpeech("Look at all these achievements! I'm proud of your progress! 🌟");
      } else if (pathname === "/settings") {
        setSurpriseSpeech("Need to change my look, adjust the speed, or swap themes? 🎨");
      } else if (pathname === "/dashboard") {
        setSurpriseSpeech(`Hey! Ready for another study session today? Let's check the roadmap! 🗺️`);
      }
      
      // Clear idle surprise speeches after 5 seconds
      setTimeout(() => setSurpriseSpeech(null), 5500);
    };

    const tid = setTimeout(routeTriggers, 800);
    return () => clearTimeout(tid);
  }, [pathname, storeSpeech, memory.playgroundRunCount, memory.recentMistakes]);



  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <>

      <motion.div
        className="fixed z-[95] flex items-end gap-0 pointer-events-none origin-bottom-left"
        animate={{ 
          bottom: currentBottom, 
          left: currentLeft, 
          scale: currentScale,
          opacity: currentOpacity
        }}
        initial={{ x: -120, opacity: 0 }}
        exit={{ x: -120, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {/* Character element (clickable) */}
        <motion.div className="relative pointer-events-auto">

          <CharacterRenderer
            characterType={characterType}
            animation={activeAnim}
            size="lg"
            className="drop-shadow-2xl"
          />
        </motion.div>

        {/* Dynamic speech bubbles */}
        <AnimatePresence mode="wait">
          {activeSpeech && (
            <motion.div
              key={activeSpeech.slice(0, 20)}
              className="mb-16 ml-3 max-w-[220px] pointer-events-auto"
              initial={{ opacity: 0, scale: 0.85, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: -10 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              <div className="relative bg-white dark:bg-[#16162a] rounded-2xl px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#e5e7eb] dark:border-[#27273f]">
                {/* Step indicator metadata dot */}
                <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        "bg-[#6172f9]",
                        "animate-pulse"
                      )}
                    />
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {characterType}
                    </span>
                </div>

                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                  {activeSpeech}
                </p>

                {/* Left tail */}
                <div
                  className="absolute top-6 -left-[9px]"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "9px solid transparent",
                    borderBottom: "9px solid transparent",
                    borderRight: "9px solid #e5e7eb",
                  }}
                />
                <div
                  className="absolute top-6 -left-[8px]"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "9px solid transparent",
                    borderBottom: "9px solid transparent",
                    borderRight: "9px solid white",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </>
  );
}
