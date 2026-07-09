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
    <div className="min-h-screen bg-surface-50 dark:bg-surface-dark-0 text-gray-900 dark:text-white flex flex-col items-center justify-center p-8 overflow-hidden relative transition-colors duration-500">
      {/* Decorative stars/particles background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-2 drop-shadow-md">Select your Form</h1>
        <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-16">WHO SHALL ENTER THE CEREMONY?</p>
        
          <div className="flex flex-col items-center gap-6 group cursor-pointer" onClick={() => handleSelect('male')}>
            <div className="w-64 h-64 rounded-full bg-surface-100 dark:bg-surface-dark-200 border-4 border-transparent group-hover:border-brand-500 group-hover:scale-105 transition flex items-center justify-center relative overflow-hidden shadow-2xl">
              <CharacterRenderer characterType="male" animation="wave" size="lg" />
            </div>
            <div className="text-2xl font-black text-gray-400 group-hover:text-brand-500 transition">Continue as Male Avatar</div>
          </div>
      </motion.div>
    </div>
  );
}
