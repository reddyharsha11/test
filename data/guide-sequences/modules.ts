import type { GuideSequence } from "@/types/guide";

export const modulesGuide: GuideSequence = {
  routeKey: "modules",
  steps: [
    {
      id: "intro",
      target: "#modules-header",
      message:
        "Welcome to your Modules library! 📖 Each module is a complete learning journey from beginner to pro.",
      animation: "wave",
      emotion: "happy",
      position: "bottom-right",
    },
    {
      id: "search",
      target: "#modules-search",
      message:
        "Use the search bar to find specific topics instantly. Try searching 'React' or 'API'!",
      animation: "point-left",
      emotion: "neutral",
      position: "bottom-right",
    },
    {
      id: "module-card",
      target: "#module-card-0",
      message:
        "Each card shows your progress, difficulty level, estimated time, and XP reward. Pick one to start!",
      animation: "talk",
      emotion: "excited",
      position: "top-right",
    },
    {
      id: "difficulty",
      target: "#module-filters",
      message:
        "Filter by difficulty — Beginner, Intermediate, or Advanced. Start where you feel comfortable!",
      animation: "point-right",
      emotion: "neutral",
      position: "bottom-left",
    },
    {
      id: "done",
      target: undefined,
      message:
        "Go ahead and pick a module to begin! I'll guide you through every step. 💪",
      animation: "celebrate",
      emotion: "celebrating",
      position: "top-right",
    },
  ],
};

export const lessonGuide: GuideSequence = {
  routeKey: "lesson",
  steps: [
    {
      id: "intro",
      target: "#lesson-header",
      message:
        "Great choice! Let's dive into this lesson together. I'll explain everything step by step. 🎯",
      animation: "wave",
      emotion: "happy",
      position: "bottom-right",
    },
    {
      id: "content",
      target: "#lesson-content",
      message:
        "Read through the content carefully. Take your time — there's no rush! 📖",
      animation: "reading",
      emotion: "neutral",
      position: "top-right",
    },
    {
      id: "code",
      target: "#lesson-code",
      message:
        "Here's a real code example! Try to understand it before moving on. You can copy it to experiment.",
      animation: "point-left",
      emotion: "excited",
      position: "top-right",
    },
    {
      id: "exercise",
      target: "#lesson-exercise",
      message:
        "Time to practice! Try the mini-exercise. Don't worry if you don't get it right — that's how we learn!",
      animation: "thinking",
      emotion: "thinking",
      position: "top-right",
    },
    {
      id: "done",
      target: undefined,
      message:
        "Lesson complete! Amazing work! 🎉 You earned XP for finishing this. Keep going!",
      animation: "celebrate",
      emotion: "celebrating",
      position: "top-right",
    },
  ],
};
