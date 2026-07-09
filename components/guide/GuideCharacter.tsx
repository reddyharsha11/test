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

// Rain droplets generator overlay
function RainOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[85] overflow-hidden">
      <div className="absolute inset-0">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-400/20 dark:bg-brand-500/25"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * -20}%`,
              width: "1.2px",
              height: `${20 + Math.random() * 15}px`,
              animation: `rainFall ${0.8 + Math.random() * 0.7}s linear infinite`,
              animationDelay: `${Math.random() * 1.5}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes rainFall {
          0% { transform: translateY(-50px) rotate(15deg); }
          100% { transform: translateY(105vh) rotate(15deg); }
        }
      `}</style>
    </div>
  );
}

// Micro SVG umbrella to float over the character's head
function UmbrellaSVG({ isDark }: { isDark: boolean }) {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -top-14 -left-6 z-30 origin-bottom animate-[umbrellaFloat_2.5s_ease-in-out_infinite]"
    >
      {/* Umbrella Canopy */}
      <path
        d="M10 60 C10 20, 90 20, 90 60 C80 52, 70 52, 60 60 C50 52, 40 52, 30 60 C20 52, 10 52, 10 60 Z"
        fill={isDark ? "#818cf8" : "#4f46e5"}
      />
      {/* Handle / Shaft */}
      <rect x="49" y="58" width="2.5" height="30" fill="#4b5563" />
      <path d="M50 88 C50 92, 42 92, 42 88" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Tip */}
      <path d="M50 20 L50 14" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
      <style>{`
        @keyframes umbrellaFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(3deg); }
        }
      `}</style>
    </svg>
  );
}

export function GuideCharacter() {
  const { animation: storeAnim, characterType, visible, speech: storeSpeech } = useGuideStore();
  const { sidebarCollapsed } = useUIStore();
  const memory = useMemoryStore();
  const pathname = usePathname();

  // Surprise animations states
  const [surpriseSpeech, setSurpriseSpeech] = useState<string | null>(null);
  const [activeOverrideAnim, setActiveOverrideAnim] = useState<any>(null);
  
  const [isTripping, setIsTripping] = useState(false);
  const [isSneezing, setIsSneezing] = useState(false);
  const [isLaughing, setIsLaughing] = useState(false);
  const [isRaining, setIsRaining] = useState(false);

  // Keep character position adjusted outside of the Sidebar
  const leftOffset = sidebarCollapsed ? 68 : 208;
  const currentBottom = visible ? 72 : 24;
  const currentLeft = visible ? leftOffset : leftOffset + 24;
  const currentScale = visible ? 1 : 0.6;
  const currentOpacity = visible ? 1 : 0.7;

  // Render surprise Speech or fallback to store speech
  const activeSpeech = storeSpeech || surpriseSpeech;
  const activeAnim = activeOverrideAnim || storeAnim;

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

  // Periodic random idle surprises (tripping, sneezing, laughing, rain)
  useEffect(() => {
    const triggerSurprise = () => {
      if (storeSpeech) return; // Don't disrupt active tours

      const events = ["trip", "sneeze", "laugh", "rain"];
      const chosen = events[Math.floor(Math.random() * events.length)];

      if (chosen === "trip") {
        setIsTripping(true);
        setActiveOverrideAnim("thinking");
        setSurpriseSpeech(
          characterType === "neutral"
            ? "Balance sensors recalibrating! Trip hazard detected! 🤖⚠️"
            : "Whoops! 😅 Tripped over an unclosed div tag!"
        );
        setTimeout(() => {
          setIsTripping(false);
          setActiveOverrideAnim(null);
          setSurpriseSpeech(null);
        }, 4500);
      } else if (chosen === "sneeze") {
        setIsSneezing(true);
        setActiveOverrideAnim("thinking");
        setSurpriseSpeech("Achoo! 🤧 Excuse me...Legacy code must be triggering my allergies!");
        setTimeout(() => {
          setIsSneezing(false);
          setActiveOverrideAnim(null);
          setSurpriseSpeech(null);
        }, 4000);
      } else if (chosen === "laugh") {
        setIsLaughing(true);
        setActiveOverrideAnim("happy");
        setSurpriseSpeech(
          characterType === "neutral"
            ? "Binary joke: There are 10 types of people... Haha! 🤖😆"
            : "Why do programmers wear glasses? Because they can't C#! 😂"
        );
        setTimeout(() => {
          setIsLaughing(false);
          setActiveOverrideAnim(null);
          setSurpriseSpeech(null);
        }, 5000);
      } else if (chosen === "rain") {
        setIsRaining(true);
        setActiveOverrideAnim("reading");
        setSurpriseSpeech("Uh oh, it's raining bugs! 🌧️ Good thing I brought my debug umbrella! ☂️");
        setTimeout(() => {
          setIsRaining(false);
          setActiveOverrideAnim(null);
          setSurpriseSpeech(null);
        }, 10000); // Rain lasts 10s
      }
    };

    // Run trigger checks every 22 seconds
    const interval = setInterval(() => {
      if (Math.random() < 0.35) {
        triggerSurprise();
      }
    }, 22000);

    return () => clearInterval(interval);
  }, [storeSpeech, characterType]);

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <>
      {isRaining && <RainOverlay />}

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
        {/* Character element (trippable / clickable) */}
        <motion.div
          animate={{
            y: activeAnim === "idle" ? [0, -5, 0] : 0,
          }}
          transition={{ y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }}
          className={cn(
            "relative pointer-events-auto",
            isTripping && "char-trip",
            isSneezing && "char-sneeze",
            isLaughing && "animate-bounce"
          )}
        >
          {isRaining && <UmbrellaSVG isDark={!!isDark} />}

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
                      isRaining ? "bg-blue-500" : isTripping ? "bg-amber-500" : "bg-[#6172f9]",
                      "animate-pulse"
                    )}
                  />
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {isRaining ? "Weather alert" : isTripping ? "Oops" : characterType}
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

      {/* Tripping and Sneezing custom keyframe helpers */}
      <style>{`
        .char-trip {
          animation: tripAnim 0.7s cubic-bezier(.36,.07,.19,.97) both;
          transform-origin: center bottom;
        }
        @keyframes tripAnim {
          15%, 85% { transform: rotate(-8deg) translateX(-4px); }
          30%, 70% { transform: rotate(14deg) translateX(6px) translateY(-8px); }
          45%, 55% { transform: rotate(-18deg) translateX(-8px) translateY(-14px); }
        }

        .char-sneeze {
          animation: sneezeAnim 0.6s ease-out both;
          transform-origin: center bottom;
        }
        @keyframes sneezeAnim {
          0% { transform: translateY(0); }
          35% { transform: translateY(-10px) scale(1.05); }
          50% { transform: translateY(12px) rotate(6deg) scale(0.92); }
          75% { transform: translateY(-3px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
