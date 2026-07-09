"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { useGuideStore } from "@/store/guideStore";
import { Send, Sparkles, CheckCircle2, Globe, Home, FolderKanban, Mail, GraduationCap, Code2, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Portfolio Themes
const THEMES = {
  minimalist: { bg: "bg-white text-gray-900", card: "bg-gray-50 border border-gray-100", accent: "text-gray-900", font: "font-sans", nav: "bg-white/80" },
  cyberpunk: { bg: "bg-black text-[#00ff41]", card: "bg-[#0d0d0d] border border-[#00ff41]", accent: "text-[#ff003c]", font: "font-mono", nav: "bg-black/80 border-b border-[#00ff41]" },
  neoBrutalism: { bg: "bg-[#f4e04d] text-black", card: "bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", accent: "text-blue-600", font: "font-sans font-black", nav: "bg-[#f4e04d] border-b-4 border-black" },
  elegant: { bg: "bg-stone-900 text-stone-100", card: "bg-stone-800 border border-stone-700", accent: "text-amber-500", font: "font-serif", nav: "bg-stone-900/80 border-b border-stone-800" },
  developer: { bg: "bg-[#1e1e1e] text-[#d4d4d4]", card: "bg-[#2d2d2d] border border-[#404040]", accent: "text-[#569cd6]", font: "font-mono", nav: "bg-[#1e1e1e]/90 border-b border-[#333]" },
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
    { id: "msg-1", sender: "bot", text: "Hi! I'm ready to build your multi-page portfolio. What is your full name?" }
  ]);
  const [input, setInput] = useState("");
  const [portfolioData, setPortfolioData] = useState({
    name: "Your Name",
    college: "Your University",
    skills: "Your Skills",
    contact: "hello@example.com",
    theme: "minimalist" as ThemeKey,
    projects: [
      { title: "E-Commerce Platform", description: "Built a fully functional e-commerce platform with React, Node.js, and MongoDB. Includes Stripe payment integration and user authentication." },
      { title: "AI Chat Interface", description: "Developed an AI chat interface using OpenAI's API and Next.js. Features real-time streaming responses and conversation history." }
    ]
  });
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"home" | "projects" | "contact">("home");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userMsg }]);
    setInput("");

    // Step sequence
    setTimeout(() => {
      if (step === 1) { // Got Name
        setPortfolioData(prev => ({ ...prev, name: userMsg }));
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: `Nice to meet you, ${userMsg}! Which college or university are you attending?` }]);
        setStep(2);
      } else if (step === 2) { // Got College
        setPortfolioData(prev => ({ ...prev, college: userMsg }));
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: `Great! Next, what are your primary skills? (e.g. React, Python, UI Design)` }]);
        setStep(3);
      } else if (step === 3) { // Got Skills
        setPortfolioData(prev => ({ ...prev, skills: userMsg }));
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: `Awesome skills! What's your contact number or email address?` }]);
        setStep(4);
      } else if (step === 4) { // Got Contact
        setPortfolioData(prev => ({ ...prev, contact: userMsg }));
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: `Got it! Finally, let's pick a theme. Which do you prefer: Minimalist, Cyberpunk, NeoBrutalism, Elegant, or Developer?` }]);
        setStep(5);
      } else if (step === 5) { // Got Theme
        let selectedTheme: ThemeKey = "minimalist";
        const lowerInput = userMsg.toLowerCase();
        if (lowerInput.includes("cyber")) selectedTheme = "cyberpunk";
        if (lowerInput.includes("neo") || lowerInput.includes("brutal")) selectedTheme = "neoBrutalism";
        if (lowerInput.includes("elegant")) selectedTheme = "elegant";
        if (lowerInput.includes("dev")) selectedTheme = "developer";
        
        setPortfolioData(prev => ({ ...prev, theme: selectedTheme }));
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text: `Applied the ${selectedTheme} theme! Your portfolio is 100% ready. Check out the Home, Projects, and Contact tabs in the preview, then click 'Publish Portfolio' below!` }]);
        setStep(6);
      }
    }, 800);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...portfolioData, isPublished: true })
      });
      const data = await res.json();
      if (data.success) {
        // Build the full URL based on the current origin
        const fullUrl = `${window.location.origin}/p/${data.portfolio.userId}`;
        setPublishedUrl(fullUrl);
      }
    } catch (e) {
      console.error(e);
    }
    setIsPublishing(false);
  };

  const copyToClipboard = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      alert("Link copied to clipboard!");
    }
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
            disabled={step === 6 || !!publishedUrl}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || step === 6 || !!publishedUrl}
            className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white disabled:opacity-50 transition-colors hover:bg-brand-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Preview (Multi-page) */}
      <div className={`rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200 dark:border-gray-800 transition-all duration-500 ${themeClasses.bg} ${themeClasses.font} flex flex-col relative`}>
        
        {/* If Published, show a huge overlay or prominent link in the preview area too! */}
        {publishedUrl && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center text-white">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface-dark-100 border border-surface-dark-300 p-8 rounded-2xl max-w-sm w-full">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Portfolio Published!</h2>
              <p className="text-gray-400 mb-6 text-sm">Your new portfolio is live on the internet.</p>
              
              <div className="bg-black p-3 rounded-lg flex items-center justify-between mb-4 border border-surface-dark-300">
                <span className="text-xs truncate text-brand-400 font-mono mr-2">{publishedUrl}</span>
                <button onClick={copyToClipboard} className="text-gray-400 hover:text-white transition">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <a href={publishedUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition">
                <ExternalLink className="w-4 h-4" /> Visit Live Site
              </a>
            </motion.div>
          </div>
        )}

        {/* Navigation Bar */}
        <div className={`p-4 flex items-center justify-center gap-6 backdrop-blur-md sticky top-0 z-10 ${themeClasses.nav}`}>
          <button onClick={() => setActiveTab("home")} className={`flex items-center gap-2 text-sm font-bold transition-opacity ${activeTab === "home" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
            <Home className="w-4 h-4" /> Home
          </button>
          <button onClick={() => setActiveTab("projects")} className={`flex items-center gap-2 text-sm font-bold transition-opacity ${activeTab === "projects" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
            <FolderKanban className="w-4 h-4" /> Projects
          </button>
          <button onClick={() => setActiveTab("contact")} className={`flex items-center gap-2 text-sm font-bold transition-opacity ${activeTab === "contact" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
            <Mail className="w-4 h-4" /> Contact
          </button>
        </div>
        
        {/* Page Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col justify-center h-full max-w-md mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">{portfolioData.name}</h1>
                <p className={`text-xl mb-4 ${themeClasses.accent}`}>{portfolioData.skills}</p>
                <div className="flex items-center justify-center gap-2 text-sm opacity-80 mb-6">
                  <GraduationCap className="w-4 h-4" /> Student at {portfolioData.college}
                </div>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setActiveTab("projects")} className={`px-4 py-2 rounded-full font-bold text-sm ${themeClasses.card} transition-transform hover:-translate-y-1`}>View Projects</button>
                  <button onClick={() => setActiveTab("contact")} className={`px-4 py-2 rounded-full font-bold text-sm border-2 border-current transition-transform hover:-translate-y-1`}>Contact Me</button>
                </div>
              </motion.div>
            )}
            
            {activeTab === "projects" && (
              <motion.div key="projects" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-2xl font-bold mb-6 text-center">Featured Work</h2>
                <div className="grid gap-4">
                  {portfolioData.projects.map((proj, i) => (
                    <div key={i} className={`p-5 rounded-xl ${themeClasses.card} transition-transform hover:-translate-y-1`}>
                      <div className={`w-10 h-10 rounded-full mb-3 flex items-center justify-center ${themeClasses.bg} opacity-80`}>
                        <Code2 className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg leading-tight">{proj.title}</h3>
                      <p className="opacity-70 mt-2 text-sm">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div key="contact" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col justify-center h-full max-w-sm mx-auto text-center">
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <p className="opacity-80 mb-8 text-sm">I'm currently looking for new opportunities. My inbox is always open!</p>
                <div className={`p-6 rounded-xl ${themeClasses.card}`}>
                  <p className={`font-bold text-lg ${themeClasses.accent}`}>{portfolioData.contact}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Complete Button when done */}
      {step === 6 && (
        <div className="col-span-1 lg:col-span-2 flex justify-center gap-4 mt-4">
          <Button 
            icon={<Globe className="w-4 h-4" />} 
            onClick={handlePublish} 
            size="lg" 
            disabled={isPublishing || !!publishedUrl}
          >
            {isPublishing ? "Publishing..." : publishedUrl ? "Published!" : "Publish Portfolio"}
          </Button>
          
          {publishedUrl && (
            <Button variant="secondary" icon={<CheckCircle2 className="w-4 h-4" />} onClick={onComplete} size="lg">
              Complete Lesson
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
