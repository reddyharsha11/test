"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, FolderKanban, Mail, GraduationCap, Code2 } from "lucide-react";

interface PortfolioData {
  name: string;
  college: string;
  skills: string;
  contact: string;
  theme: string;
  projects: any[];
}

export function PublicPortfolioViewer({ portfolio, themes }: { portfolio: PortfolioData, themes: any }) {
  const [activeTab, setActiveTab] = useState<"home" | "projects" | "contact">("home");
  
  const themeClasses = themes[portfolio.theme as keyof typeof themes] || themes.minimalist;

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses.bg} ${themeClasses.font}`}>
      <div className="h-screen flex flex-col relative max-w-5xl mx-auto">
        
        {/* Navigation Bar */}
        <div className={`p-6 flex items-center justify-center gap-8 backdrop-blur-md sticky top-0 z-10 ${themeClasses.nav}`}>
          <button onClick={() => setActiveTab("home")} className={`flex items-center gap-2 font-bold transition-opacity ${activeTab === "home" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
            <Home className="w-5 h-5" /> Home
          </button>
          <button onClick={() => setActiveTab("projects")} className={`flex items-center gap-2 font-bold transition-opacity ${activeTab === "projects" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
            <FolderKanban className="w-5 h-5" /> Projects
          </button>
          <button onClick={() => setActiveTab("contact")} className={`flex items-center gap-2 font-bold transition-opacity ${activeTab === "contact" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
            <Mail className="w-5 h-5" /> Contact
          </button>
        </div>
        
        {/* Page Content */}
        <div className="p-8 md:p-16 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col justify-center h-full max-w-2xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">{portfolio.name}</h1>
                <p className={`text-2xl md:text-3xl mb-6 ${themeClasses.accent}`}>{portfolio.skills}</p>
                <div className="flex items-center justify-center gap-2 text-lg md:text-xl opacity-80 mb-8">
                  <GraduationCap className="w-6 h-6" />
                  <span>Student at {portfolio.college}</span>
                </div>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setActiveTab("projects")} className={`px-6 py-3 rounded-full font-bold ${themeClasses.card} transition-transform hover:-translate-y-1`}>View Projects</button>
                  <button onClick={() => setActiveTab("contact")} className={`px-6 py-3 rounded-full font-bold border-2 border-current transition-transform hover:-translate-y-1`}>Contact Me</button>
                </div>
              </motion.div>
            )}
            
            {activeTab === "projects" && (
              <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto py-12">
                <h2 className="text-4xl font-bold mb-12 text-center">Featured Work</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {portfolio.projects.map((proj, i) => (
                    <div key={i} className={`p-8 rounded-2xl ${themeClasses.card} transition-transform hover:-translate-y-2`}>
                      <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${themeClasses.bg} opacity-80`}>
                        <Code2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-2xl mb-3">{proj.title}</h3>
                      <p className="opacity-70 text-lg leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col justify-center h-full max-w-xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>
                <p className="text-xl opacity-80 mb-12">I'm currently looking for new opportunities and collaborations. Feel free to reach out!</p>
                <div className={`p-8 rounded-2xl ${themeClasses.card}`}>
                  <p className={`text-2xl font-bold ${themeClasses.accent}`}>
                    {portfolio.contact}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 text-center opacity-50 text-sm">
          Built with GuideLearn AI
        </div>
      </div>
    </div>
  );
}
