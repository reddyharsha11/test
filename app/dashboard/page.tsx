"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import {
  WelcomeSection,
  StatsRow,
  ContinueLearning,
  UpcomingLessons,
  ModuleGrid,
  RecentActivity,
  AchievementsSection,
} from "@/components/dashboard/DashboardSections";
import { useGuideStore } from "@/store/guideStore";
import { dashboardGuide } from "@/data/guide-sequences/dashboard";

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export default function DashboardPage() {
  const { initSequence, visible } = useGuideStore();

  useEffect(() => {
    // Auto-start guide tour on first visit
    const timer = setTimeout(() => {
      initSequence(dashboardGuide);
    }, 800);
    return () => clearTimeout(timer);
  }, [initSequence]);

  return (
    <GuideEngine>
      <AppShell>
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="show"
          className="max-w-screen-xl mx-auto"
        >
          <WelcomeSection />
          <StatsRow />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ContinueLearning />
            </div>
            <div>
              <UpcomingLessons />
            </div>
          </div>

          <ModuleGrid />
          <RecentActivity />
          <AchievementsSection />
        </motion.div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
