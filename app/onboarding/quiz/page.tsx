"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    title: "Dawn or Dusk?",
    subtitle: "CHOOSE ONE TO CONTINUE",
    options: [
      { text: "Dawn", label: "Dawn", type: "frontend", icon: "🌅", description: "The beginning of light. Perfect for visual thinkers." },
      { text: "Dusk", label: "Dusk", type: "backend", icon: "🌃", description: "The onset of night. For those who work behind the scenes." }
    ]
  },
  {
    title: "Logic or Magic?",
    subtitle: "CHOOSE YOUR PATH",
    options: [
      { text: "Logic", label: "Logic", type: "data", icon: "📐", description: "Structured, predictable, and measurable." },
      { text: "Magic", label: "Magic", type: "ai", icon: "✨", description: "Unpredictable, powerful, and mysterious." }
    ]
  },
  {
    title: "Structure or Fluidity?",
    subtitle: "HOW DO YOU BUILD?",
    options: [
      { text: "Structure", label: "Structure", type: "backend", icon: "🏛️", description: "Rigid foundations that support everything." },
      { text: "Fluidity", label: "Fluidity", type: "frontend", icon: "🌊", description: "Adaptable, flowing, and ever-changing." }
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
          <button onClick={() => router.push('/dashboard')} className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-glow-md transform hover:scale-105">
            Enter Dashboard
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            
            {/* Option 1 */}
            <motion.div 
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer rounded-3xl p-8 bg-white dark:bg-surface-dark-100 border-2 border-surface-200 dark:border-surface-dark-300 hover:border-brand-500 shadow-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all duration-300 flex flex-col items-center text-center"
              onClick={() => handleNext(q.options[0].type)}
            >
              <div className="w-24 h-24 rounded-2xl bg-surface-100 dark:bg-surface-dark-200 flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
                {q.options[0].icon}
              </div>
              <h3 className="text-3xl font-bold mb-3">{q.options[0].label}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{q.options[0].description}</p>
            </motion.div>
            
            {/* Option 2 */}
            <motion.div 
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer rounded-3xl p-8 bg-white dark:bg-surface-dark-100 border-2 border-surface-200 dark:border-surface-dark-300 hover:border-brand-500 shadow-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all duration-300 flex flex-col items-center text-center"
              onClick={() => handleNext(q.options[1].type)}
            >
              <div className="w-24 h-24 rounded-2xl bg-surface-100 dark:bg-surface-dark-200 flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
                {q.options[1].icon}
              </div>
              <h3 className="text-3xl font-bold mb-3">{q.options[1].label}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{q.options[1].description}</p>
            </motion.div>

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
