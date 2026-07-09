import type { GuideSequence } from "@/types/guide";

export const dashboardGuide: GuideSequence = {
  routeKey: "dashboard",
  steps: [
    {
      id: "welcome",
      target: "#dashboard-welcome",
      message:
        "Hi there! 👋 I'm Alex, your personal guide. This is your Dashboard — your command center for everything learning!",
      animation: "wave",
      emotion: "happy",
      position: "top-right",
    },
    {
      id: "stats",
      target: "#dashboard-stats",
      message:
        "Here you can see your XP, Achievements, and total time learned. You're doing amazing — keep it up! 🌟",
      animation: "point-right",
      emotion: "excited",
      position: "bottom-right",
    },
    {
      id: "continue-learning",
      target: "#continue-learning",
      message:
        "Pick up right where you left off anytime. Your progress is auto-saved! 💾",
      animation: "talk",
      emotion: "neutral",
      position: "top-right",
    },
    {
      id: "modules",
      target: "#your-modules",
      message:
        "These are your learning modules. Let's complete them one by one! Each has lessons, videos, and a quiz. 📚",
      animation: "point-right",
      emotion: "excited",
      position: "top-left",
    },
    {
      id: "streak",
      target: "#daily-streak",
      message:
        "Your daily streak keeps you motivated! Come back every day to keep the fire burning. 🔥",
      animation: "celebrate",
      emotion: "celebrating",
      position: "bottom-right",
    },
    {
      id: "achievements",
      target: "#achievements-section",
      message:
        "Earn badges as you complete lessons and reach milestones. Collect them all! 🏆",
      animation: "happy",
      emotion: "excited",
      position: "top-right",
    },
    {
      id: "upcoming",
      target: "#upcoming-lessons",
      message:
        "Your upcoming lessons are queued up and ready. Tap any one to jump in! ▶️",
      animation: "point-left",
      emotion: "neutral",
      position: "top-left",
    },
    {
      id: "done",
      target: undefined,
      message:
        "That's the full tour! You're all set to start learning. Let's go build something amazing! 🚀",
      animation: "celebrate",
      emotion: "celebrating",
      position: "top-right",
    },
  ],
};
