"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useUIStore } from "@/store/uiStore";
import { useProgressStore } from "@/store/progressStore";
import { useMemoryStore } from "@/store/memoryStore";
import { modules } from "@/data/modules";
import { progressPercent } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function QuizPage({ params }: Props) {
  const { slug } = use(params);
  const { addToast, triggerConfetti } = useUIStore();
  const { addXP } = useProgressStore();

  const mod = modules.find((m) => m.slug === slug);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    mod ? new Array(mod.quiz.length).fill(null) : []
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!mod) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <p className="text-gray-500">Quiz not found</p>
        </div>
      </AppShell>
    );
  }

  const question = mod.quiz[currentQ];
  const isLast = currentQ === mod.quiz.length - 1;
  const isCorrect = selectedIdx === question.correctIndex;
  const score = answers.filter((a, i) => a === mod.quiz[i].correctIndex).length;
  const percent = progressPercent(score, mod.quiz.length);

  function handleSelect(idx: number) {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
      addXP(percent >= 80 ? 100 : 50);
      if (percent >= 80) triggerConfetti();
      addToast({
        type: percent >= 80 ? "achievement" : "info",
        title: `Quiz Complete! ${percent >= 80 ? "🎉" : "📝"}`,
        message: `You scored ${score}/${mod!.quiz.length} (${percent}%)`,
      });
      
      const failed = percent < 80;
      useMemoryStore.getState().recordQuizAttempt(mod!.id, failed);
      if (failed) {
        useMemoryStore.getState().recordMistake(mod!.title);
      }
    } else {
      setCurrentQ((p) => p + 1);
      setSelectedIdx(null);
      setShowExplanation(false);
    }
  }

  function handleRetry() {
    setCurrentQ(0);
    setSelectedIdx(null);
    setShowExplanation(false);
    setFinished(false);
    setAnswers(new Array(mod!.quiz.length).fill(null));
  }

  if (finished) {
    return (
      <GuideEngine>
        <AppShell>
          <div className="max-w-lg mx-auto text-center py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="text-7xl mb-6"
            >
              {percent >= 80 ? "🏆" : percent >= 60 ? "👍" : "📚"}
            </motion.div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Quiz Complete!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              You scored{" "}
              <span className="text-brand-500 font-black text-2xl">
                {score}/{mod.quiz.length}
              </span>
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {percent >= 80 ? "+100 XP (Bonus!)" : "+50 XP"}
              </span>
            </div>

            {/* Result breakdown */}
            <Card padding="md" className="text-left mb-6">
              <div className="space-y-2">
                {mod.quiz.map((q, i) => {
                  const correct = answers[i] === q.correctIndex;
                  return (
                    <div key={q.id} className="flex items-center gap-2 text-sm">
                      {correct ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span className="text-gray-700 dark:text-gray-300 truncate">{q.question}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button
                variant="secondary"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={handleRetry}
              >
                Retry
              </Button>
              <Link href={`/modules/${mod.slug}`}>
                <Button>Back to Module</Button>
              </Link>
            </div>
          </div>
        </AppShell>
        <ToastContainer />
      </GuideEngine>
    );
  }

  return (
    <GuideEngine>
      <AppShell>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <Link
            href={`/modules/${mod.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {mod.title}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                Module Quiz 📝
              </h1>
              <span className="text-sm font-semibold text-gray-500">
                {currentQ + 1} / {mod.quiz.length}
              </span>
            </div>
            <ProgressBar
              value={progressPercent(currentQ + 1, mod.quiz.length)}
              size="sm"
            />
          </motion.div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <Card padding="lg" className="mb-4">
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-3">
                  Question {currentQ + 1}
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, i) => {
                    let optStyle =
                      "border-surface-200 dark:border-surface-dark-300 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/10";

                    if (selectedIdx !== null) {
                      if (i === question.correctIndex) {
                        optStyle =
                          "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
                      } else if (i === selectedIdx && selectedIdx !== question.correctIndex) {
                        optStyle =
                          "border-red-400 bg-red-50 dark:bg-red-900/20";
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={selectedIdx !== null}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${optStyle} ${
                          selectedIdx !== null ? "cursor-default" : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {option}
                          </span>
                          {selectedIdx !== null && i === question.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                          )}
                          {selectedIdx === i && i !== question.correctIndex && (
                            <XCircle className="w-4 h-4 text-red-500 ml-auto shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card
                      padding="md"
                      className={`mb-4 ${
                        isCorrect
                          ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                          : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span
                          className={`font-bold text-sm ${
                            isCorrect
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {isCorrect ? "Correct! ✨" : "Not quite right"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {question.explanation}
                      </p>
                    </Card>

                    <Button fullWidth onClick={handleNext} size="lg">
                      {isLast ? "Finish Quiz" : "Next Question"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
