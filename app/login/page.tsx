"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Trophy, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { useAuthStore } from "@/store/authStore";
import { useGuideStore } from "@/store/guideStore";
import { useUIStore } from "@/store/uiStore";

export default function GetStartedPage() {
  const router = useRouter();
  const { setUser, isLoading, setLoading } = useAuthStore();
  const { setCharacterType } = useGuideStore();
  const { addToast } = useUIStore();

  async function handleGetStarted() {
    setLoading(true);
    try {
      // Simulate quick initialization
      await new Promise((r) => setTimeout(r, 600));
      setUser(
        {
          _id: "user-1",
          name: "Learner",
          email: "learner@guidelearn.com",
          characterType: "male",
          xp: 100,
          streak: 1,
          lastLoginDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          role: "student",
        },
        "mock-jwt-token"
      );
      setCharacterType("male");
      addToast({ 
        type: "success", 
        title: "Welcome to GuideLearn! 👋", 
        message: "Let's begin our interactive coding session!" 
      });
      router.push("/onboarding/theme");
    } catch {
      addToast({ 
        type: "error", 
        title: "Failed to initialize session", 
        message: "Please reload the page and try again." 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Get Started Content Card */}
      <motion.div
        className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 bg-white dark:bg-surface-dark-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-[0_4px_12px_rgba(168,85,247,0.25)]">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              GuideLearn
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              Master coding <br />
              with an <span style={{ background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>AI Guide</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Step into a gamified study environment. Build real developer portfolios with compiling sandbox workspaces, answer scenario questions, and simulate real tech jobs.
            </p>
          </div>

          {/* Quick Value Props */}
          <div className="space-y-3.5">
            {[
              { text: "Personalized AI Tutor Guides", icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
              { text: "Instant Compiler Sandbox Tools", icon: <Zap className="w-4 h-4 text-amber-500" /> },
              { text: "Gamified Simulated Work Tasks", icon: <Trophy className="w-4 h-4 text-emerald-500" /> },
            ].map((prop, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                <span className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-dark-100">{prop.icon}</span>
                <span>{prop.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button
              onClick={handleGetStarted}
              fullWidth
              size="lg"
              loading={isLoading}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              className="py-4 font-black shadow-[0_8px_25px_rgba(168,85,247,0.3)] hover:shadow-[0_12px_30px_rgba(168,85,247,0.4)]"
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Right — Animated Guide Rendering */}
      <motion.div
        className="hidden lg:flex flex-1 flex-col items-center justify-center relative bg-gradient-to-br from-brand-500 to-brand-700 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background ambient lighting */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 filter blur-3xl" />
          <div className="absolute bottom-0 -left-10 w-80 h-80 rounded-full bg-white/5 filter blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 filter blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-8 text-center px-12">
          {/* Character wave */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <CharacterRenderer
              characterType="male"
              animation="wave"
              size="xl"
              className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            />
          </motion.div>

          {/* Guide dialogue bubble */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 max-w-xs shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <p className="text-white text-lg font-black leading-snug">
              Hi there! 👋<br />
              I&apos;m your custom study guide.
            </p>
            <p className="text-white/80 text-xs mt-2 font-medium">
              Click Get Started and let&apos;s build awesome code projects together!
            </p>
          </motion.div>

          {/* Quick metric stats */}
          <div className="flex gap-8 mt-4 bg-black/15 backdrop-blur-sm border border-white/5 px-6 py-3 rounded-2xl">
            {[
              { label: "Learners", value: "50K+" },
              { label: "Lessons", value: "500+" },
              { label: "Modules", value: "3+" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
