"use client";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useGuideStore } from '@/store/guideStore';
import { motion } from 'framer-motion';
import { CharacterRenderer } from '@/components/character/CharacterRenderer';
import { Button } from '@/components/ui/Button';

export default function GenderSelection() {
  const router = useRouter();
  const setCharacterType = useGuideStore((s) => s.setCharacterType);

  const handleSelect = (gender: 'male' | 'female') => {
    setCharacterType(gender);
    router.push('/onboarding/quiz');
  };

  return (
    <div className="min-h-screen bg-[#0d0e15] text-white flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Decorative stars/particles background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-2 drop-shadow-md">Select your Form</h1>
        <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-16">WHO SHALL ENTER THE CEREMONY?</p>
        
        <div className="flex flex-col md:flex-row items-center gap-12 w-full justify-center">
          
          <div className="flex flex-col items-center gap-6 group cursor-pointer" onClick={() => handleSelect('male')}>
            <div className="w-48 h-48 rounded-full bg-slate-800 border-2 border-transparent group-hover:border-accentViolet group-hover:scale-105 transition flex items-center justify-center relative overflow-hidden">
              <CharacterRenderer characterType="male" animation="wave" size="lg" />
            </div>
            <div className="text-xl font-serif text-gray-400 group-hover:text-white transition">Male</div>
          </div>
          
          <div className="flex flex-col items-center gap-6 group cursor-pointer" onClick={() => handleSelect('female')}>
            <div className="w-48 h-48 rounded-full bg-slate-800 border-2 border-transparent group-hover:border-accentAmber group-hover:scale-105 transition flex items-center justify-center relative overflow-hidden">
              <CharacterRenderer characterType="female" animation="wave" size="lg" />
            </div>
            <div className="text-xl font-serif text-gray-400 group-hover:text-white transition">Female</div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
