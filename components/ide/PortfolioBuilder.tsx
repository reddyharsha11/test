"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { useGuideStore } from "@/store/guideStore";
import { Send, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Portfolio Themes
const THEMES = {
  minimalist: { bg: "bg-white text-gray-900", card: "bg-gray-50 border border-gray-100", accent: "text-gray-900", font: "font-sans" },
  cyberpunk: { bg: "bg-black text-[#00ff41]", card: "bg-[#0d0d0d] border border-[#00ff41]", accent: "text-[#ff003c]", font: "font-mono" },
  neoBrutalism: { bg: "bg-[#f4e04d] text-black", card: "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]", accent: "text-blue-600", font: "font-sans font-black" },
  elegant: { bg: "bg-stone-900 text-stone-100", card: "bg-stone-800 border border-stone-700", accent: "text-amber-500", font: "font-serif" },
  developer: { bg: "bg-[#1e1e1e] text-[#d4d4d4]", card: "bg-[#2d2d2d] border border-[#404040]", accent: "text-[#569cd6]", font: "font-mono" },
};

type ThemeKey = keyof typeof THEMES;

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

export function PortfolioBuilder({ onComplete }: { onComplete: () => void }) {
  const { characterType } = useGuideStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-1", sender: "bot", text: "Hi! I'm ready to build your portfolio. What's your primary skill or stack? (e.g., React, Python, Data Science)" }
  ]);
  const [input, setInput] = useState("");
  const [portfolioData, setPortfolioData] = useState({
    name: "Alex Developer",
    skill: "Frontend Developer",
    bio: "I build things for the web.",
    theme: "minimalist" as ThemeKey,
  });
  const [step, setStep] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userMsg }]);
    setInput("");

    // Simulate AI thinking and replying based on step
    setTimeout(() => {
      if (step === 1) {
        setPortfolioData(prev => ({ ...prev, skill: userMsg }));
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: `Awesome! ${userMsg} is a great focus. Let's pick a color theme. Do you prefer Minimalist, Cyberpunk, NeoBrutalism, Elegant, or Developer?` }]);
        setStep(2);
      } else if (step === 2) {
        let selectedTheme: ThemeKey = "minimalist";
        const lowerInput = userMsg.toLowerCase();
        if (lowerInput.includes("cyber")) selectedTheme = "cyberpunk";
        if (lowerInput.includes("neo") || lowerInput.includes("brutal")) selectedTheme = "neoBrutalism";
        if (lowerInput.includes("elegant")) selectedTheme = "elegant";
        if (lowerInput.includes("dev")) selectedTheme = "developer";
        
        setPortfolioData(prev => ({ ...prev, theme: selectedTheme }));
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: `Got it! I applied the ${selectedTheme} theme. Finally, tell me a short bio about yourself.` }]);
        setStep(3);
      } else if (step === 3) {
        setPortfolioData(prev => ({ ...prev, bio: userMsg }));
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: "Perfect! Your portfolio looks amazing. You can click 'Complete Lesson' to finish." }]);
        setStep(4);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: "Your portfolio is ready! Click 'Complete Lesson'." }]);
      }
    }, 1000);
  };

  const themeClasses = THEMES[portfolioData.theme];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      
      {/* Chat Builder Interface */}
      <div className="bg-surface-50 dark:bg-surface-dark-100 rounded-2xl border border-surface-200 dark:border-surface-dark-300 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-surface-200 dark:border-surface-dark-300 flex items-center gap-3 bg-white dark:bg-surface-dark-50">
          <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center overflow-hidden border-2 border-white dark:border-surface-dark-50 shadow-sm">
             <CharacterRenderer characterType={characterType} animation="idle" size="sm" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Portfolio Guide</h3>
            <p className="text-xs text-brand-500 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Assistant
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-brand-500 text-white rounded-br-none" : "bg-white dark:bg-surface-dark-50 border border-surface-200 dark:border-surface-dark-300 text-gray-800 dark:text-gray-200 rounded-bl-none"}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-surface-dark-50 border-t border-surface-200 dark:border-surface-dark-300 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..."
            className="flex-1 bg-surface-100 dark:bg-surface-dark-200 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            disabled={step === 4}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || step === 4}
            className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white disabled:opacity-50 transition-colors hover:bg-brand-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className={`rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200 dark:border-gray-800 transition-all duration-500 ${themeClasses.bg} ${themeClasses.font}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-black/10">
            <h1 className="text-2xl font-bold">{portfolioData.name}</h1>
            <p className={`mt-1 ${themeClasses.accent}`}>{portfolioData.skill}</p>
          </div>
          
          {/* Body */}
          <div className="p-6 flex-1 flex flex-col gap-6">
            <section>
              <h2 className="text-xl mb-3 font-semibold">About Me</h2>
              <p className="opacity-80">{portfolioData.bio}</p>
            </section>
            
            <section>
              <h2 className="text-xl mb-3 font-semibold">Featured Projects</h2>
              <div className="grid gap-4">
                <div className={`p-4 rounded-xl ${themeClasses.card}`}>
                  <h3 className="font-bold">E-Commerce Platform</h3>
                  <p className="text-sm opacity-70 mt-1">Built with React and Node.js</p>
                </div>
                <div className={`p-4 rounded-xl ${themeClasses.card}`}>
                  <h3 className="font-bold">AI Chat Interface</h3>
                  <p className="text-sm opacity-70 mt-1">Using OpenAI and Next.js</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Complete Button when done */}
      {step === 4 && (
        <div className="col-span-1 lg:col-span-2 flex justify-center mt-4">
          <Button icon={<CheckCircle2 className="w-4 h-4" />} onClick={onComplete} size="lg">
            Finalize Portfolio
          </Button>
        </div>
      )}
    </div>
  );
}
