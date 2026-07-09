"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Shuffle } from "lucide-react";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { Button } from "@/components/ui/Button";
import { useGuideStore } from "@/store/guideStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import type { CharacterType } from "@/types/guide";
import { cn } from "@/lib/utils";

const characters: {
  type: CharacterType;
  name: string;
  description: string;
  color: string;
  emoji: string;
}[] = [
  {
    type: "male",
    name: "Alex",
    description: "Committed developer wearing round glasses and a navy shirt",
    color: "#6172f9",
    emoji: "🧑🏻",
  },
  {
    type: "female",
    name: "Maya",
    description: "Warm specialist with hoop earrings and a striped shirt",
    color: "#e879f9",
    emoji: "👩🏻",
  },
  {
    type: "neutral",
    name: "Zeno",
    description: "Futuristic core AI with floating cosmic rings",
    color: "#0ea5e9",
    emoji: "🤖",
  },
];

export default function CharacterSelectPage() {
  const router = useRouter();
  const { setCharacterType } = useGuideStore();
  const { updateUser, updateSettings } = useAuthStore();
  const { addToast } = useUIStore();
  const [selected, setSelected] = useState<CharacterType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleRandom() {
    const types: CharacterType[] = ["male", "female", "neutral"];
    const r = types[Math.floor(Math.random() * types.length)];
    setSelected(r);
  }

  async function handleContinue() {
    const choice = selected ?? "male";
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setCharacterType(choice);
    updateUser({ characterType: choice });
    updateSettings({ characterType: choice });
    const guide = characters.find((c) => c.type === choice);
    addToast({
      type: "success",
      title: `${guide?.name} is ready! 🎉`,
      message: "Your guide will accompany you through every lesson.",
    });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-violet-50 dark:from-surface-dark-0 dark:via-surface-dark-50 dark:to-surface-dark-100 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
            <span>✨</span> One-time setup
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
            Choose your guide
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Pick the companion who will travel with you through every lesson
          </p>
        </div>

        {/* Characters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {characters.map((char) => (
            <motion.button
              key={char.type}
              onClick={() => setSelected(char.type)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-200 cursor-pointer text-left",
                selected === char.type
                  ? "border-brand-500 bg-white dark:bg-surface-dark-100 shadow-glow"
                  : "border-surface-200 dark:border-surface-dark-300 bg-white dark:bg-surface-dark-100 hover:border-brand-300 dark:hover:border-brand-700"
              )}
            >
              <div
                className="w-full flex items-center justify-center rounded-2xl py-4"
                style={{ backgroundColor: `${char.color}15` }}
              >
                <CharacterRenderer
                  characterType={char.type}
                  animation={selected === char.type ? "wave" : "idle"}
                  size="md"
                />
              </div>

              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {char.name}
                  </h3>
                  {selected === char.type && (
                    <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {char.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="secondary"
            icon={<Shuffle className="w-4 h-4" />}
            onClick={handleRandom}
          >
            Random
          </Button>

          <Button
            fullWidth
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            loading={isLoading}
            onClick={handleContinue}
          >
            {selected
              ? `Continue with ${characters.find((c) => c.type === selected)?.name}`
              : "Skip for now"}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          You can change your guide anytime in Settings
        </p>
      </motion.div>
    </div>
  );
}
