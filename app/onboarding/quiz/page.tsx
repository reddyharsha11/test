"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    title: "What catches your eye first on a website?",
    subtitle: "SELECT WHAT MATTERS MOST TO YOU",
    options: [
      { text: "Colors, animations, layout styles, and visual beauty.", label: "The Design", type: "frontend", icon: "🎨", description: "How the website looks and feels to interact with." },
      { text: "Loading speed, secure checkout, and backend actions.", label: "The Engine", type: "backend", icon: "⚙️", description: "How the website stores data and runs securely." }
    ]
  },
  {
    title: "How do you prefer to work with data?",
    subtitle: "CHOOSE YOUR IDEAL LOGIC STYLE",
    options: [
      { text: "Analyzing numbers, building charts, and finding database trends.", label: "Data Analysis", type: "data", icon: "📐", description: "Finding secrets hidden inside large database tables." },
      { text: "Training chatbots, working with AI engines, and cognitive tools.", label: "AI Intelligence", type: "ai", icon: "🤖", description: "Teaching computer systems to think and reason like humans." }
    ]
  },
  {
    title: "Which project would you rather build?",
    subtitle: "CHOOSE A FUN PROJECT TO UNDERTAKE",
    options: [
      { text: "A beautiful landing page for a fashion brand with smooth animations.", label: "Visual Interface", type: "frontend", icon: "🌊", description: "Interactive frontend design using modern CSS & HTML." },
      { text: "A login API that supports millions of secure concurrent connections.", label: "Backend Architecture", type: "backend", icon: "🏛️", description: "Robust backend system architecture with Express and databases." }
    ]
  },
  {
    title: "Which developer path sounds most exciting to you?",
    subtitle: "CHOOSE THE ULTIMATE CAREER FOCUS",
    options: [
      { text: "Creative Developer (Frontend & UI design)", label: "Frontend Dev", type: "frontend", icon: "🎨", description: "Crafting client-side interactions in modern browsers." },
      { text: "Backend Architect (API design, databases, security)", label: "Backend Dev", type: "backend", icon: "💾", description: "Structuring servers and building robust systems." },
      { text: "Data Platform Analyst (Cleansing, trends, databases)", label: "Data Analyst", type: "data", icon: "📈", description: "Processing big data pipelines for business intelligence." },
      { text: "Machine Learning Engineer (AI models, neural nets, prompts)", label: "AI Engineer", type: "ai", icon: "🧠", description: "Training models and integrating semantic AI kernels." }
    ]
  }
];

export default function Quiz() {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);
  const user = useAuthStore(s => s.user);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ frontend: 0, backend: 0, data: 0, ai: 0 });
  const [result, setResult] = useState<string | null>(null);

  const handleNext = (type: string) => {
    const newScores = { ...scores, [type as keyof typeof scores]: scores[type as keyof typeof scores] + 1 };
    setScores(newScores);
    
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Calculate winner
      const winner = Object.keys(newScores).reduce((a, b) => 
        newScores[a as keyof typeof scores] > newScores[b as keyof typeof scores] ? a : b
      );
      
      setResult(winner);
      
      // Update user persona if they are logged in (mock update in store)
      if (user) {
        setUser({ ...user, persona: winner }, "mock-jwt-token");
      }
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-dark-0 text-gray-900 dark:text-white flex flex-col items-center justify-center text-center p-8 transition-colors duration-500">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl">
          <div className="w-32 h-32 rounded-full bg-brand-gradient mx-auto mb-8 flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.4)]">
            <span className="text-6xl">🎉</span>
          </div>
          <h1 className="text-5xl font-black mb-4">You belong to <span className="text-brand-500">{result.toUpperCase()}</span></h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-12">The sorting is complete. Your learning path is ready.</p>
          <button onClick={() => router.push('/modules/portfolio-builder')} className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-glow-md transform hover:scale-105">
            Start Module Two
          </button>
        </motion.div>
      </div>
    );
  }

  const q = QUESTIONS[step];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-dark-0 text-gray-900 dark:text-white flex flex-col items-center justify-center p-8 overflow-hidden relative transition-colors duration-500">
      
      <div className="absolute top-10 flex gap-2">
        {QUESTIONS.map((_, i) => (
          <div key={i} className={`w-12 h-1.5 rounded-full transition-colors duration-300 ${i <= step ? 'bg-brand-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-gray-300 dark:bg-gray-800'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="relative z-10 flex flex-col items-center w-full max-w-4xl mt-12"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-sm text-center">{q.title}</h1>
          <p className="text-sm font-bold text-brand-500 uppercase tracking-widest mb-16 text-center">{q.subtitle}</p>
          
          <div className={`grid grid-cols-1 ${q.options.length > 2 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'} gap-6 w-full`}>
            {q.options.map((opt, optIdx) => (
              <motion.div 
                key={optIdx}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer rounded-3xl p-6 bg-white dark:bg-surface-dark-100 border-2 border-surface-200 dark:border-surface-dark-300 hover:border-brand-500 shadow-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all duration-300 flex flex-col items-center text-center"
                onClick={() => handleNext(opt.type)}
              >
                <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-dark-200 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {opt.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{opt.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{opt.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
