// ─── Guide Types ────────────────────────────────────────────────────────────

export type CharacterType = "male" | "female" | "neutral";

export type AnimationState =
  | "idle"
  | "wave"
  | "talk"
  | "point-left"
  | "point-right"
  | "thinking"
  | "celebrate"
  | "happy"
  | "reading"
  | "listening"
  | "walk";

export type Emotion =
  | "neutral"
  | "happy"
  | "excited"
  | "thinking"
  | "celebrating"
  | "curious";

export type SpeechBubblePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export interface GuideStep {
  id: string;
  target?: string; // CSS selector for spotlight
  message: string;
  animation: AnimationState;
  emotion: Emotion;
  position?: SpeechBubblePosition;
  media?: {
    type: "image" | "video" | "lottie";
    src: string;
    alt?: string;
  };
  delay?: number;
  action?: () => void;
  highlightPadding?: number;
}

export interface GuideSequence {
  routeKey: string;
  steps: GuideStep[];
}

export interface GuideState {
  // Sequence
  currentRoute: string | null;
  currentStep: number;
  currentSequence: GuideStep[];
  totalSteps: number;

  // Playback
  paused: boolean;
  playing: boolean;
  direction: "forward" | "backward";
  visible: boolean;

  // Character
  animation: AnimationState;
  emotion: Emotion;
  speech: string;
  characterType: CharacterType;

  // Spotlight
  overlayVisible: boolean;
  targetSelector: string | null;
  highlightRect: DOMRect | null;
  speechBubblePosition: SpeechBubblePosition;

  // Actions
  initSequence: (sequence: GuideSequence) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePause: () => void;
  skip: () => void;
  replay: () => void;
  close: () => void;
  setCharacterType: (type: CharacterType) => void;
  setStep: (step: number) => void;
  updateHighlightRect: (rect: DOMRect | null) => void;
}
