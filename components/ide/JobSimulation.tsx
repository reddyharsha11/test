"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useGuideStore } from "@/store/guideStore";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { Sparkles, ArrowRight, Briefcase, GraduationCap, Star, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SimulationQuestion {
  title: string;
  subtitle: string;
  options: Array<{
    text: string;
    label: string;
    type: "frontend" | "backend" | "data" | "ai";
    icon: string;
    description: string;
  }>;
}

const QUESTIONS: SimulationQuestion[] = [
  {
    title: "How do you solve a bug?",
    subtitle: "AN ERROR CRASHES THE APP. WHAT IS YOUR GO-TO FIXING STYLE?",
    options: [
      { text: "Check browser errors, CSS, and how buttons look or react.", label: "Website UI", type: "frontend", icon: "🎨", description: "Focusing on browser layout and visual styling." },
      { text: "Look at API requests, backend servers, and database logs.", label: "Backend Server", type: "backend", icon: "💾", description: "Tracing requests, controllers, and routing servers." },
      { text: "Scan files, check SQL queries, and clean bad rows in data tables.", label: "Data & Tables", type: "data", icon: "📊", description: "Ensuring clean and optimized data streams." },
      { text: "Inspect AI prompts, API endpoints from LLMs, and model behaviors.", label: "AI Models", type: "ai", icon: "🤖", description: "Polishing agent memory, token flows, and prompt structures." }
    ]
  },
  {
    title: "What is your favorite type of task?",
    subtitle: "WHICH PART OF A NEW APP ARE YOU MOST EXCITED TO WORK ON?",
    options: [
      { text: "Building beautiful headers, layouts, buttons, and animations.", label: "Visual Interface", type: "frontend", icon: "✨", description: "Making the app look premium and feel smooth." },
      { text: "Writing user signup code, database saving, and secure routes.", label: "System Security", type: "backend", icon: "🔒", description: "Ensuring data is stored securely and runs fast." },
      { text: "Designing database structures and mapping data trends.", label: "Data Science", type: "data", icon: "📈", description: "Finding insights and trends hidden in the raw metrics." },
      { text: "Adding smart features, chatbot answers, and AI capabilities.", label: "Smart AI features", type: "ai", icon: "🧠", description: "Teaching the app to automate thinking tasks." }
    ]
  },
  {
    title: "Which tools do you want to learn most?",
    subtitle: "CHOOSE THE GROUP OF TECHNOLOGIES THAT SOUNDS MOST EXCITING.",
    options: [
      { text: "HTML, CSS, JavaScript, React, and styles.", label: "Frontend Web", type: "frontend", icon: "⚡", description: "Creating client-side browser logic and structures." },
      { text: "Node.js, Express APIs, databases, and servers.", label: "Backend Servers", type: "backend", icon: "⚙️", description: "Building background APIs and data storage loops." },
      { text: "Python, databases, spreadsheets, and chart libraries.", label: "Data Analysis", type: "data", icon: "🐍", description: "Managing data systems and pipeline analytics." },
      { text: "OpenAI APIs, ChatGPT integrations, and AI models.", label: "AI Engineering", type: "ai", icon: "🤖", description: "Powering smart logic and neural models." }
    ]
  }
];

interface RoleRecommendation {
  title: string;
  salary: string;
  description: string;
  skillsNeeded: string[];
}

const RECOMMENDATIONS: Record<string, RoleRecommendation[]> = {
  frontend: [
    { title: "Senior Frontend Engineer", salary: "12 - 24 LPA", description: "Own the visual layer. Develop responsive, highly animated layouts, design-system tokens, and optimized Single Page Applications.", skillsNeeded: ["React", "CSS layout", "TypeScript", "Performance Optimisation"] },
    { title: "UX Engineer / Motion Designer", salary: "8 - 15 LPA", description: "Merge visual engineering with design. Build premium web micro-interactions, responsive scroll animations, and interactive SVG graphics.", skillsNeeded: ["SVG", "Framer Motion", "Tailwind CSS", "Interaction Design"] }
  ],
  backend: [
    { title: "Systems Architect / API Developer", salary: "15 - 30 LPA", description: "Build scalable routing engines. Structure security middleware layers, database connections, caching levels, and system architectures.", skillsNeeded: ["Node.js", "Express", "REST APIs", "PostgreSQL", "System Scalability"] },
    { title: "Cloud Integration & DevOps Engineer", salary: "10 - 20 LPA", description: "Orchestrate deploy pipelines. Manage Docker containers, server scaling layers, API gateways, and automated pipelines.", skillsNeeded: ["Docker", "Github Actions", "AWS", "API Security"] }
  ],
  data: [
    { title: "Data Platform Architect", salary: "12 - 25 LPA", description: "Oversee data warehouses. Design ETL processing systems, databases, query structures, and map-reduce routines.", skillsNeeded: ["SQL", "Python", "ETL Systems", "Database Indexing"] },
    { title: "Business Data Analyst", salary: "6 - 12 LPA", description: "Extract intelligence from databases. Transform raw datasets into interactive visual dashboards and operational strategies.", skillsNeeded: ["Data Visualisation", "Python", "SQL queries", "Statistics"] }
  ],
  ai: [
    { title: "Machine Learning Engineer", salary: "15 - 35 LPA", description: "Train and integrate intelligent systems. Fine-tune local models, write custom embeddings pipelines, and deploy scaling inference tiers.", skillsNeeded: ["Python", "PyTorch", "Model Fine-tuning", "Neural Networks"] },
    { title: "AI Agent & Semantic Integrator", salary: "10 - 18 LPA", description: "Integrate Large Language Models into applications. Design system prompt scopes, semantic query routing, and vector DB setups.", skillsNeeded: ["OpenAI", "LangChain", "Vector Databases", "Prompt Architecture"] }
  ]
};

export function JobSimulation({ onComplete }: { onComplete: () => void }) {
  const user = useAuthStore((s) => s.user);
  const { characterType } = useGuideStore();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [step, setStep] = useState<"intro" | "questions" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [scores, setScores] = useState({ frontend: 0, backend: 0, data: 0, ai: 0 });
  const [winnerTrack, setWinnerTrack] = useState<string>("frontend");

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        if (data.success) {
          setPortfolio(data.portfolio);
        }
      } catch (e) {
        console.error("Simulation failed to fetch portfolio data:", e);
      }
    }
    loadPortfolio();
  }, []);

  const handleStart = () => {
    setStep("questions");
    setCurrentQ(0);
    setAnswers([]);
  };

  const handleAnswer = (type: string) => {
    const nextAnswers = [...answers, type];
    setAnswers(nextAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate scores dynamically
      calculateRoleMatch(nextAnswers);
    }
  };

  const calculateRoleMatch = (finalAnswers: string[]) => {
    const finalScores = { frontend: 0, backend: 0, data: 0, ai: 0 };

    // 1. Onboarding Persona Base Weight
    const onboardingPersona = user?.persona || "frontend";
    if (onboardingPersona in finalScores) {
      finalScores[onboardingPersona as keyof typeof finalScores] += 3;
    }

    // 2. Portfolio Skills keywords matching
    const skillsString = (portfolio?.skills || "").toLowerCase();
    if (skillsString.includes("react") || skillsString.includes("css") || skillsString.includes("html") || skillsString.includes("tailwind") || skillsString.includes("frontend")) {
      finalScores.frontend += 1;
    }
    if (skillsString.includes("node") || skillsString.includes("express") || skillsString.includes("api") || skillsString.includes("database") || skillsString.includes("backend") || skillsString.includes("mongodb") || skillsString.includes("mongoose")) {
      finalScores.backend += 1;
    }
    if (skillsString.includes("sql") || skillsString.includes("python") || skillsString.includes("pandas") || skillsString.includes("spark") || skillsString.includes("data")) {
      finalScores.data += 1;
    }
    if (skillsString.includes("pytorch") || skillsString.includes("tensorflow") || skillsString.includes("ai") || skillsString.includes("ml") || skillsString.includes("openai") || skillsString.includes("model")) {
      finalScores.ai += 1;
    }

    // 3. Question answers weights
    finalAnswers.forEach((ans) => {
      if (ans in finalScores) {
        finalScores[ans as keyof typeof finalScores] += 1.5;
      }
    });

    setScores(finalScores);

    // Determine highest score
    const winner = Object.keys(finalScores).reduce((a, b) =>
      finalScores[a as keyof typeof finalScores] > finalScores[b as keyof typeof finalScores] ? a : b
    );
    setWinnerTrack(winner);
    setStep("results");
  };

  // Convert raw scores into dynamic percentage mappings
  const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const percentages = {
    frontend: Math.round((scores.frontend / totalPoints) * 100),
    backend: Math.round((scores.backend / totalPoints) * 100),
    data: Math.round((scores.data / totalPoints) * 100),
    ai: Math.round((scores.ai / totalPoints) * 100),
  };

  const getGuideComment = () => {
    switch (winnerTrack) {
      case "frontend":
        return `Awesome! Your portfolio details and simulated answers highlight a keen aesthetic eye and micro-interaction focus. Creative Frontend roles match your style perfectly! 🎨`;
      case "backend":
        return `Exceptional! You prioritize structural stability, caching protocols, and secure routing. Backend Systems Architecture aligns seamlessly with your logic-focused workflow! 💾`;
      case "data":
        return `Incredible! Your skills analysis shows a preference for dataset cleansing, pipeline architectures, and database metrics. Data Platform engineering is your prime match! 📈`;
      case "ai":
        return `Astonishing! You excel in parameter allocation, embedding calculations, and context routing. Machine Learning and LLM integration roles hold massive opportunities for you! 🤖`;
      default:
        return `Great job completing the simulation! Explore the career paths we mapped below. 💼`;
    }
  };

  const currentQuestionData = QUESTIONS[currentQ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-white dark:bg-surface-dark-100 rounded-3xl border border-surface-200 dark:border-surface-dark-300 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: INTRO SCREEN */}
        {step === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex-1 flex flex-col justify-center items-center text-center py-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/25 flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">Module Three: Career Job Simulation</h1>
            <p className="text-gray-500 dark:text-gray-400 text-md leading-relaxed mb-8">
              We will evaluate your onboarding quiz sorting, scan your newly built portfolio, and present realistic workspace questions. Based on the calculated scores, we'll recommend optimal tech roles and expected salary packages.
            </p>
            <Button size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right" onClick={handleStart}>
              Start Simulation
            </Button>
          </motion.div>
        )}

        {/* STEP 2: SIMULATION WORK QUESTIONS */}
        {step === "questions" && (
          <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
            {/* Step count indicator */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black tracking-widest text-brand-500 uppercase">Question {currentQ + 1} of {QUESTIONS.length}</span>
              <div className="flex gap-1.5">
                {QUESTIONS.map((_, idx) => (
                  <div key={idx} className={`w-10 h-1.5 rounded-full transition-colors ${idx <= currentQ ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-800"}`} />
                ))}
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">{currentQuestionData.title}</h2>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-8 uppercase">{currentQuestionData.subtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {currentQuestionData.options.map((opt, optIdx) => (
                <motion.div
                  key={optIdx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(opt.type)}
                  className="group cursor-pointer p-5 bg-surface-50 dark:bg-surface-dark-50 border border-surface-200 dark:border-surface-dark-300 rounded-2xl hover:border-brand-500 transition-all flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-9 h-9 rounded-xl bg-white dark:bg-surface-dark-100 shadow-sm border border-surface-200 dark:border-surface-dark-300 flex items-center justify-center text-lg">{opt.icon}</span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">{opt.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-2">{opt.text}</p>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-auto">{opt.description}</span>
                </motion.div>
              ))}
            </div>

            {currentQ > 0 && (
              <button 
                onClick={() => {
                  setCurrentQ(currentQ - 1);
                  setAnswers(answers.slice(0, -1));
                }}
                className="mt-6 text-xs font-bold text-gray-400 hover:text-brand-500 transition-colors flex items-center gap-1.5 self-start"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to previous question
              </button>
            )}
          </motion.div>
        )}

        {/* STEP 3: ROLE RECOMMENDATIONS & SALARY PACKAGES */}
        {step === "results" && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            
            {/* Guide Bubble Feedback */}
            <div className="bg-surface-50 dark:bg-surface-dark-50 rounded-2xl p-5 border border-surface-200 dark:border-surface-dark-300 flex flex-col md:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-gradient flex items-center justify-center overflow-hidden shrink-0 border border-white dark:border-surface-dark-100 shadow-sm">
                <CharacterRenderer characterType={characterType} animation="happy" size="sm" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-black text-brand-500 text-xs tracking-wider uppercase mb-1">Your AI Guide Analysis</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{getGuideComment()}</p>
              </div>
            </div>

            {/* Grid display: Percentages + Custom parameters */}
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6">
              
              {/* Role Recommended Matches */}
              <div className="space-y-4">
                <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Career Role Matches
                </h3>
                
                {RECOMMENDATIONS[winnerTrack]?.map((rec, recIdx) => (
                  <div key={recIdx} className="bg-surface-50 dark:bg-surface-dark-50 border border-surface-200 dark:border-surface-dark-300 rounded-2xl p-5 space-y-4 hover:border-indigo-500 transition-colors shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h4 className="font-bold text-md text-indigo-500">{rec.title}</h4>
                      <span className="px-3 py-1 text-xs font-black bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center gap-1 shrink-0">
                        ₹ {rec.salary}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{rec.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.skillsNeeded.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 text-[9px] font-bold bg-white dark:bg-surface-dark-100 border border-surface-200 dark:border-surface-dark-300 text-gray-400 dark:text-gray-500 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bars matching breakdown */}
              <div className="space-y-4">
                <h3 className="font-black text-lg text-gray-900 dark:text-white">Matching Spectrum</h3>
                
                <div className="bg-surface-50 dark:bg-surface-dark-50 border border-surface-200 dark:border-surface-dark-300 rounded-2xl p-5 space-y-5 shadow-sm">
                  {[
                    { label: "Frontend", percent: percentages.frontend, color: "bg-amber-500" },
                    { label: "Backend", percent: percentages.backend, color: "bg-blue-500" },
                    { label: "Data Science", percent: percentages.data, color: "bg-green-500" },
                    { label: "Artificial Intelligence", percent: percentages.ai, color: "bg-purple-500" },
                  ].map((track, trackIdx) => (
                    <div key={trackIdx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-700 dark:text-gray-300">{track.label}</span>
                        <span className="text-gray-900 dark:text-white">{track.percent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${track.percent}%` }} 
                          transition={{ duration: 0.8, delay: 0.2 }} 
                          className={`h-full ${track.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 p-5 rounded-2xl flex items-start gap-3">
                  <GraduationCap className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-gray-900 dark:text-white mb-1">Onboarding Persona Sync</h5>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
                      Onboarding Quiz sorted you as <strong className="text-indigo-500 capitalize">{user?.persona || "frontend"}</strong>. Portfolio skills analysis and simulation answer patterns were factored in to find these final matches.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <Button size="lg" icon={<CheckCircle2 className="w-4 h-4" />} onClick={onComplete} className="w-full">
              Complete Career Simulation Module
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
