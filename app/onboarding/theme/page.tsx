"use client";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

export default function ThemeSelection() {
  const router = useRouter();
  const setTheme = useAuthStore((s) => s.setTheme);

  const handleSelect = (themeId: string) => {
    setTheme(themeId);
    
    // Apply theme
    if (themeId === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    router.push('/onboarding/gender');
  };

  return (
    <div className="min-h-screen bg-[#0d0e15] text-white flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Decorative stars/particles background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-serif font-bold mb-2 drop-shadow-md">Dawn or Dusk</h1>
        <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-16">CHOOSE ONE TO CONTINUE</p>
        
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          {/* Dawn (Light) */}
          <div className="flex items-center gap-8 group cursor-pointer" onClick={() => handleSelect('light')}>
            <div className="text-3xl font-serif opacity-50 group-hover:opacity-100 transition">Dawn</div>
            <div className="w-64 h-96 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-[#d4af37] group-hover:scale-105 transition duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] relative">
              {/* Replace with actual image later, using gradient placeholder for now */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-orange-400"></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition"></div>
            </div>
          </div>
          
          {/* Dusk (Dark) */}
          <div className="flex items-center gap-8 group cursor-pointer flex-row-reverse md:flex-row" onClick={() => handleSelect('dark')}>
            <div className="w-64 h-96 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-purple-500 group-hover:scale-105 transition duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-slate-900"></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition"></div>
            </div>
            <div className="text-3xl font-serif opacity-50 group-hover:opacity-100 transition">Dusk</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
