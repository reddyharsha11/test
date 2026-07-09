"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GuideEngine } from "@/components/guide/GuideEngine";
import { ToastContainer } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CodePlayground } from "@/components/ide/CodePlayground";
import { useGuideStore } from "@/store/guideStore";
import { useProgressStore } from "@/store/progressStore";
import { useUIStore } from "@/store/uiStore";
import { useMemoryStore } from "@/store/memoryStore";
import { modules } from "@/data/modules";
import { lessonGuide } from "@/data/guide-sequences/modules";
import { progressPercent } from "@/lib/utils";
import type { LessonStep } from "@/types/module";

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

const typeIcons = {
  explanation: <BookOpen className="w-4 h-4" />,
  example: <Code2 className="w-4 h-4" />,
  exercise: <Lightbulb className="w-4 h-4" />,
  video: <CheckCircle2 className="w-4 h-4" />,
  "quiz-mini": <CheckCircle2 className="w-4 h-4" />,
};

export default function LessonPage({ params }: Props) {
  const { slug, id } = use(params);
  const router = useRouter();
  const { initSequence } = useGuideStore();
  const { markLessonComplete } = useProgressStore();
  const { addToast, triggerConfetti } = useUIStore();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const mod = modules.find((m) => m.slug === slug);
  const lesson = mod?.lessons.find((l) => l.id === id);

  useEffect(() => {
    if (lesson) {
      initSequence(lessonGuide);
    }
  }, [lesson, initSequence]);

  if (!mod || !lesson) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-gray-500">Lesson not found</p>
          <Link href="/modules" className="text-brand-500 hover:underline block mt-2">
            ← Back to Modules
          </Link>
        </div>
      </AppShell>
    );
  }

  const step = lesson.steps[currentStepIdx];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === lesson.steps.length - 1;
  const stepPercent = progressPercent(currentStepIdx + 1, lesson.steps.length);

  function handleNext() {
    if (!isLast) {
      setCurrentStepIdx((p) => p + 1);
      setShowHint(false);
    } else {
      handleComplete();
    }
  }

  function handleComplete() {
    setCompleted(true);
    markLessonComplete(mod!.id, lesson!.id, lesson!.xpReward);
    triggerConfetti();
    addToast({
      type: "achievement",
      title: "Lesson Complete! 🎉",
      message: `+${lesson!.xpReward} XP earned`,
    });
    useMemoryStore.getState().recordLessonComplete(lesson!.id);
  }

  if (completed) {
    return (
      <GuideEngine>
        <AppShell>
          <div className="max-w-lg mx-auto text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Lesson Complete!
            </h1>
            <p className="text-gray-500 mb-6">
              You finished <strong>{lesson.title}</strong> and earned{" "}
              <span className="text-brand-500 font-bold">{lesson.xpReward} XP</span>!
            </p>
            <div className="flex gap-3 justify-center">
              <Link href={`/modules/${mod.slug}`}>
                <Button variant="secondary">Back to Module</Button>
              </Link>
              <Link href={`/modules/${mod.slug}`}>
                <Button icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                  Next Lesson
                </Button>
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
          {/* Breadcrumb */}
          <Link
            href={`/modules/${mod.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {mod.title}
          </Link>

          {/* Header */}
          <motion.div
            id="lesson-header"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-1">
              Lesson {lesson.order}
            </p>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
              {lesson.title}
            </h1>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>
                Step {currentStepIdx + 1} of {lesson.steps.length}
              </span>
              <span>{stepPercent}% complete</span>
            </div>
            <ProgressBar value={stepPercent} size="sm" />
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <Card padding="lg" id="lesson-content" className="mb-4">
                {/* Step type badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-500">
                    {typeIcons[step.type]}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-500 capitalize">
                    {step.type}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.content}
                </p>
              </Card>

              {/* Code block */}
              {step.codeExample && (
                <div id="lesson-code" className="mb-4">
                  <CodeBlock
                    code={step.codeExample.code}
                    language={step.codeExample.language}
                    label={step.codeExample.label}
                    showLineNumbers
                  />
                </div>
              )}

              {/* Exercise */}
              {step.exercise && (
                <Card
                  id="lesson-exercise"
                  padding="none"
                  className="mb-4 overflow-hidden border-brand-200 dark:border-brand-800"
                >
                  <div className="p-4 bg-brand-50/50 dark:bg-brand-900/10 border-b border-brand-200 dark:border-brand-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span className="text-sm font-bold text-brand-700 dark:text-brand-300">
                        Interactive Exercise
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {step.exercise.prompt}
                    </p>
                    {step.exercise.hint && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowHint((p) => !p)}
                          className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                        >
                          {showHint ? "Hide hint" : "💡 Show hint"}
                        </button>
                        <AnimatePresence>
                          {showHint && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-gray-600 dark:text-gray-300 mt-2 bg-white dark:bg-surface-dark-200 p-3 rounded-xl border border-surface-200 dark:border-surface-dark-300"
                            >
                              💡 {step.exercise.hint}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  {/* IDE Playground */}
                  <div className="bg-surface-50 dark:bg-surface-dark-0">
                    <CodePlayground
                      template="react"
                      options={{
                        showConsole: false,
                        showFileExplorer: false,
                        editorHeight: 300,
                      }}
                      files={{
                        "App.js": `export default function App() {\n  return (\n    <div>\n      <h1>Hello GuideLearn!</h1>\n      <p>Edit this code to see it update live.</p>\n    </div>\n  );\n}`,
                      }}
                    />
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 mt-6">
            <Button
              variant="secondary"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
              disabled={isFirst}
              className="sm:w-auto"
            >
              Back
            </Button>
            <div className="hidden sm:block flex-1" />
            <Button
              icon={
                isLast ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
              iconPosition="right"
              onClick={handleNext}
            >
              {isLast ? "Complete Lesson" : "Next Step"}
            </Button>
          </div>
        </div>
      </AppShell>
      <ToastContainer />
    </GuideEngine>
  );
}
