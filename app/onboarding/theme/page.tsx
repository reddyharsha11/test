"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";

export default function ThemeSelection() {
  const router = useRouter();
  const setTheme = useAuthStore((s) => s.setTheme);
  const [hoveredTheme, setHoveredTheme] = useState<"light" | "dark" | null>(null);

  const handleSelect = (themeId: string) => {
    setTheme(themeId);
    
    // Apply theme
    if (themeId === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    router.push("/onboarding/gender");
  };

  return (
    <div className="min-h-screen bg-[#07080e] text-white flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative transition-colors duration-700">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence mode="wait">
          {hoveredTheme === "light" && (
            <motion.div
              key="light-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-[10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-amber-400 filter blur-[120px]"
            />
          )}
          {hoveredTheme === "dark" && (
            <motion.div
              key="dark-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600 filter blur-[120px]"
            />
          )}
        </AnimatePresence>
        
        {/* Starry Grid Background overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{ 
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", 
            backgroundSize: "40px 40px" 
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full"
      >
        <span className="text-xs font-black text-brand-500 tracking-[0.2em] uppercase mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Workspace Setting
        </span>
        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
          Choose Your Interface
        </h1>
        <p className="text-sm text-gray-400 max-w-md mb-16 leading-relaxed">
          Select a default environment theme. You can always change this in your profile settings later.
        </p>

        {/* Themes Grid */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full justify-center">
          
          {/* Dawn (Light) */}
          <motion.div 
            whileHover={{ scale: 1.04, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredTheme("light")}
            onMouseLeave={() => setHoveredTheme(null)}
            onClick={() => handleSelect("light")}
            className="w-full max-w-[280px] h-[400px] rounded-3xl overflow-hidden border-2 border-white/5 hover:border-amber-400/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.25)] transition-all duration-300 relative cursor-pointer group bg-[#10111a]"
          >
            {/* Mockup Dashboard UI (Light Mode) */}
            <div className="absolute inset-0 bg-[#f8fafc] p-5 flex flex-col justify-between text-left text-slate-800 transition duration-300 group-hover:brightness-[1.03]">
              <div className="space-y-4">
                {/* Header Mockup */}
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                  <div className="w-16 h-3 bg-slate-200 rounded-md" />
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                </div>
                {/* Dashboard Card */}
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <div className="w-20 h-2 bg-slate-300 rounded" />
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-amber-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>Module 2 Progress</span>
                    <span>65%</span>
                  </div>
                </div>
                {/* Tutor Chat Bubble */}
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-inner" />
                    <div className="w-14 h-2 bg-slate-200 rounded" />
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                    <div className="w-full h-1.5 bg-slate-200 rounded" />
                    <div className="w-4/5 h-1.5 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Theme Option 1</span>
                <span className="font-black text-xl text-slate-900 flex items-center gap-1.5">
                  🌅 Dawn <span className="text-[10px] font-bold text-slate-400 lowercase ml-auto">(light mode)</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Dusk (Dark) */}
          <motion.div 
            whileHover={{ scale: 1.04, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredTheme("dark")}
            onMouseLeave={() => setHoveredTheme(null)}
            onClick={() => handleSelect("dark")}
            className="w-full max-w-[280px] h-[400px] rounded-3xl overflow-hidden border-2 border-white/5 hover:border-indigo-500/60 shadow-[0_4px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_45px_rgba(99,102,241,0.3)] transition-all duration-300 relative cursor-pointer group bg-[#090b10]"
          >
            {/* Mockup Dashboard UI (Dark Mode) */}
            <div className="absolute inset-0 bg-[#0f172a] p-5 flex flex-col justify-between text-left text-slate-300 transition duration-300 group-hover:brightness-[1.05]">
              <div className="space-y-4">
                {/* Header Mockup */}
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                  <div className="w-16 h-3 bg-slate-700 rounded-md" />
                  <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                </div>
                {/* Dashboard Card */}
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-sm space-y-2">
                  <div className="w-20 h-2 bg-slate-600 rounded" />
                  <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-indigo-500 rounded-full animate-pulse" />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                    <span>Module 2 Progress</span>
                    <span>75%</span>
                  </div>
                </div>
                {/* Tutor Chat Bubble */}
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-inner" />
                    <div className="w-14 h-2 bg-slate-600 rounded" />
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl space-y-1 border border-slate-800">
                    <div className="w-full h-1.5 bg-slate-700 rounded" />
                    <div className="w-4/5 h-1.5 bg-slate-700 rounded" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-850 flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Theme Option 2</span>
                <span className="font-black text-xl text-white flex items-center gap-1.5">
                  🌌 Dusk <span className="text-[10px] font-bold text-slate-500 lowercase ml-auto">(dark mode)</span>
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
