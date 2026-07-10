import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GuideState,
  GuideSequence,
  GuideStep,
  AnimationState,
  Emotion,
  CharacterType,
  SpeechBubblePosition,
} from "@/types/guide";

function getStepValues(step: GuideStep) {
  return {
    animation: step.animation,
    emotion: step.emotion,
    speech: step.message,
    targetSelector: step.target ?? null,
    speechBubblePosition: step.position ?? "top-right",
    overlayVisible: !!step.target,
  };
}

export const useGuideStore = create<GuideState>()(
  persist(
    (set, get) => ({
      // Sequence
      currentRoute: null,
      currentStep: 0,
      currentSequence: [],
      totalSteps: 0,

      // Playback
      paused: false,
      playing: false,
      visible: true,
      direction: "forward",

      // Character
      animation: "idle" as AnimationState,
      emotion: "neutral" as Emotion,
      speech: "",
      characterType: "male" as CharacterType,

      // Spotlight
      overlayVisible: false,
      targetSelector: null,
      highlightRect: null,
      speechBubblePosition: "top-right" as SpeechBubblePosition,

      initSequence: (sequence: GuideSequence) => {
        const { steps } = sequence;
        if (!steps.length) return;
        const first = steps[0];
        set({
          currentRoute: sequence.routeKey,
          currentSequence: steps,
          currentStep: 0,
          totalSteps: steps.length,
          playing: true,
          paused: false,
          visible: true,
          ...getStepValues(first),
        });
      },

      nextStep: () => {
        const { currentStep, currentSequence } = get();
        const next = currentStep + 1;
        if (next >= currentSequence.length) {
          set({
            playing: false,
            overlayVisible: false,
            targetSelector: null,
            animation: "happy",
            speech: "Great! You've seen everything on this page! 🎉",
          });
          
          setTimeout(() => {
            set({ speech: "", animation: "idle" });
          }, 3500);
          
          return;
        }
        const step = currentSequence[next];
        set({
          currentStep: next,
          direction: "forward",
          ...getStepValues(step),
        });
      },

      prevStep: () => {
        const { currentStep, currentSequence } = get();
        const prev = Math.max(0, currentStep - 1);
        const step = currentSequence[prev];
        set({
          currentStep: prev,
          direction: "backward",
          ...getStepValues(step),
        });
      },

      togglePause: () => {
        set((s) => ({
          paused: !s.paused,
          animation: s.paused ? "talk" : "idle",
        }));
      },

      skip: () => {
        const { currentSequence } = get();
        set({
          currentStep: currentSequence.length - 1,
          playing: false,
          overlayVisible: false,
          speech: "",
          animation: "idle",
          targetSelector: null,
        });
      },

      replay: () => {
        const { currentSequence } = get();
        if (!currentSequence.length) return;
        const first = currentSequence[0];
        set({
          currentStep: 0,
          playing: true,
          paused: false,
          ...getStepValues(first),
        });
      },

      close: () => {
        set({
          visible: false,
          overlayVisible: false,
          playing: false,
          targetSelector: null,
          speech: "",
        });
      },

      setCharacterType: (type: CharacterType) => {
        set({ characterType: type });
      },

      setStep: (step: number) => {
        const { currentSequence } = get();
        if (step < 0 || step >= currentSequence.length) return;
        set({
          currentStep: step,
          ...getStepValues(currentSequence[step]),
        });
      },

      updateHighlightRect: (rect: DOMRect | null) => {
        set({ highlightRect: rect });
      },
    }),
    {
      name: "guide-store",
      partialize: (state) => ({
        characterType: state.characterType,
        visible: state.visible,
      }),
    }
  )
);
