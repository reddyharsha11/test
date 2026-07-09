"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

const QUESTIONS = [
  {
    title: "Dawn or Dusk?",
    subtitle: "CHOOSE ONE TO CONTINUE",
    options: [
      { text: "Dawn", label: "Dawn", type: "frontend", image: "/dawn.png" },
      { text: "Dusk", label: "Dusk", type: "backend", image: "/dusk.png" }
    ]
  },
  {
    title: "Logic or Magic?",
    subtitle: "CHOOSE YOUR PATH",
    options: [
      { text: "Logic", label: "Logic", type: "data", image: "/dusk.png" },
      { text: "Magic", label: "Magic", type: "ai", image: "/dawn.png" }
    ]
  },
  {
    title: "Structure or Fluidity?",
    subtitle: "HOW DO YOU BUILD?",
    options: [
      { text: "Structure", label: "Structure", type: "backend", image: "/dusk.png" },
      { text: "Fluidity", label: "Fluidity", type: "frontend", image: "/dawn.png" }
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
      <div className="min-h-screen bg-[#0d0e15] text-white flex flex-col items-center justify-center text-center p-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <h1 className="text-5xl font-serif font-bold text-[#d4af37] mb-4">You belong to {result.toUpperCase()}</h1>
          <p className="text-xl text-gray-400 mb-12">The sorting is complete. Your path is set.</p>
          <button onClick={() => router.push('/dashboard')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-full transition shadow-lg">Enter Dashboard</button>
        </motion.div>
      </div>
    );
  }

  const q = QUESTIONS[step];

  return (
    <div className="min-h-screen bg-[#0d0e15] text-white flex flex-col items-center justify-center p-8 overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <motion.div key={step} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center w-full max-w-5xl">
        <h1 className="text-4xl font-serif font-bold mb-2 drop-shadow-md text-center">{q.title}</h1>
        <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-16 text-center">{q.subtitle}</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full">
          <div className="flex flex-col md:flex-row items-center gap-8 group cursor-pointer" onClick={() => handleNext(q.options[0].type)}>
            <div className="text-2xl font-serif opacity-50 group-hover:opacity-100 transition hidden md:block">{q.options[0].label}</div>
            <div className="w-64 h-96 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-[#d4af37] group-hover:scale-105 transition duration-300 shadow-2xl relative">
              <img src={q.options[0].image} alt={q.options[0].label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition"></div>
            </div>
            <div className="text-2xl font-serif opacity-50 group-hover:opacity-100 transition md:hidden">{q.options[0].label}</div>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 group cursor-pointer" onClick={() => handleNext(q.options[1].type)}>
            <div className="text-2xl font-serif opacity-50 group-hover:opacity-100 transition hidden md:block">{q.options[1].label}</div>
            <div className="w-64 h-96 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-purple-500 group-hover:scale-105 transition duration-300 shadow-2xl relative">
              <img src={q.options[1].image} alt={q.options[1].label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition"></div>
            </div>
            <div className="text-2xl font-serif opacity-50 group-hover:opacity-100 transition md:hidden">{q.options[1].label}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
