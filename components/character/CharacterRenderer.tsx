"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationState, CharacterType } from "@/types/guide";
import { cn } from "@/lib/utils";

interface CharacterRendererProps {
  characterType: CharacterType;
  animation: AnimationState;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  loop?: boolean;
  onAnimationComplete?: () => void;
}

const SIZE_MAP = {
  sm: 80,
  md: 150,
  lg: 220,
  xl: 300,
};

export function CharacterRenderer({
  characterType,
  animation,
  size = "lg",
  className,
}: CharacterRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTalking, setIsTalking] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Sync talking animation state
  useEffect(() => {
    if (animation !== "talk") {
      setIsTalking(false);
      return;
    }
    setIsTalking(true);
  }, [animation]);



  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
  };

  const px = SIZE_MAP[size];

  // If neutral robot, render cosmic orb SVG
  if (characterType === "neutral") {
    return (
      <div
        ref={containerRef}
        onClick={handleClick}
        style={{
          width: px,
          height: px,
        }}
        className={cn(
          "relative select-none",
          className
        )}
      >
        <CoreAIOrb size={px} isTalking={isTalking} />
      </div>
    );
  }

  // If female, render the beautiful volumetric SVG Breton stripe-shirt girl
  if (characterType === "female") {
    return (
      <div
        ref={containerRef}
        onClick={handleClick}
        style={{
          width: px,
          height: px,
        }}
        className={cn(
          "relative select-none bg-transparent",
          className
        )}
      >
        <StripeShirtGirl
          size={px}
          animation={animation}
          isTalking={isTalking}
        />
      </div>
    );
  }

  // Male -> Renders user's custom Bitmojis based on reaction states
  let bitmojiSrc = "/characters/male.png"; // default squatting idle
  if (animation === "wave") {
    bitmojiSrc = "/characters/male_hi.png";
  } else if (animation === "celebrate" || animation === "happy" || animation === "reading" || animation === "walk") {
    bitmojiSrc = "/characters/male_laptop.png"; // Use laptop instead of cool
  } else if (animation === "thinking") {
    bitmojiSrc = "/characters/male_why.png"; // "why" pose
  } else if (animation === "listening") {
    bitmojiSrc = "/characters/male_quiz.png"; // yes or no signs
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        width: px,
        height: px,
      }}
      className={cn(
        "relative select-none overflow-visible flex items-end justify-center",
        className
      )}
    >
      {/* 3D Holographic Card Glow Shadow */}
      <div className="absolute inset-x-4 bottom-2 h-1/4 bg-brand-500/10 rounded-full blur-lg -z-10" />

      {/* Seamless Bitmoji Sprite Render */}
      <img
        src={bitmojiSrc}
        alt="Male Bitmoji companion"
        className={cn(
          "w-full h-full object-contain transition-all duration-300 drop-shadow-md",
          isTalking && "scale-[1.05]"
        )}
      />

      {/* Voice Soundwave Waveform Overlay (when talking) */}
      {isTalking && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-black/75 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10 z-20 shadow-lg">
          <span className="w-1.5 h-3 bg-brand-400 rounded-full animate-[soundwave_0.4s_ease-in-out_infinite]" />
          <span className="w-1.5 h-5 bg-brand-400 rounded-full animate-[soundwave_0.4s_ease-in-out_infinite_0.1s]" />
          <span className="w-1.5 h-2 bg-brand-400 rounded-full animate-[soundwave_0.4s_ease-in-out_infinite_0.2s]" />
          <span className="w-1.5 h-4 bg-brand-400 rounded-full animate-[soundwave_0.4s_ease-in-out_infinite_0.05s]" />
          <span className="w-1.5 h-2 bg-brand-400 rounded-full animate-[soundwave_0.4s_ease-in-out_infinite_0.15s]" />
        </div>
      )}

      {/* Keyframe Styles for animations */}
      <style>{`
        @keyframes soundwave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2.2); }
        }
      `}</style>
    </div>
  );
}

// ─── Volumetric Stripe-shirt Girl (replaces female) ─────────────────────────
function StripeShirtGirl({
  size,
  animation,
  isTalking,
}: {
  size: number;
  animation: AnimationState;
  isTalking: boolean;
}) {
  const isThinking = animation === "thinking";
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - window.innerWidth / 2;
      const dy = e.clientY - window.innerHeight / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxLimit = 4.5;
      if (dist === 0) {
        setPupilOffset({ x: 0, y: 0 });
      } else {
        const scale = Math.min(maxLimit, dist * 0.025);
        setPupilOffset({
          x: (dx / dist) * scale,
          y: (dy / dist) * scale,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg w-full h-full"
    >
      <defs>
        <linearGradient id="faceGradFemale" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffeedd" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <linearGradient id="hairGradFemale" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="100%" stopColor="#0c0a09" />
        </linearGradient>
        <linearGradient id="goldEarring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      <g className="breathe-group">
        <path d="M55 80 C32 120, 38 210, 60 220 C50 170, 48 120, 55 80 Z" fill="url(#hairGradFemale)" />
        <path d="M145 80 C168 120, 162 210, 140 220 C150 170, 152 120, 145 80 Z" fill="url(#hairGradFemale)" />

        <path d="M55 140 C80 130, 120 130, 145 140 L145 200 L55 200 Z" fill="#ffffff" />
        <rect x="55" y="146" width="90" height="4.5" fill="#1e3a8a" />
        <rect x="55" y="156" width="90" height="4.5" fill="#1e3a8a" />
        <rect x="55" y="166" width="90" height="4.5" fill="#1e3a8a" />
        <rect x="55" y="176" width="90" height="4.5" fill="#1e3a8a" />
        <rect x="55" y="186" width="90" height="4.5" fill="#1e3a8a" />
        <rect x="55" y="196" width="90" height="4.5" fill="#1e3a8a" />

        <rect x="62" y="196" width="30" height="60" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="108" y="196" width="30" height="60" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />

        <ellipse cx="77" cy="260" rx="16" ry="6" fill="#0c0a09" />
        <ellipse cx="123" cy="260" rx="16" ry="6" fill="#0c0a09" />

        <path d="M55 140 L30 175 L41 182 L60 152 Z" fill="#ffffff" />
        <rect x="31" y="148" width="8" height="4" fill="#1e3a8a" transform="rotate(-55 31 148)" />
        <rect x="37" y="157" width="8" height="4" fill="#1e3a8a" transform="rotate(-55 37 157)" />
        <rect x="43" y="166" width="8" height="4" fill="#1e3a8a" transform="rotate(-55 43 166)" />

        <path d="M145 140 L170 175 L159 182 L140 152 Z" fill="#ffffff" />
        <rect x="158" y="148" width="8" height="4" fill="#1e3a8a" transform="rotate(55 158 148)" />
        <rect x="152" y="157" width="8" height="4" fill="#1e3a8a" transform="rotate(55 152 157)" />
        <rect x="146" y="166" width="8" height="4" fill="#1e3a8a" transform="rotate(55 146 166)" />

        <path d="M44 178 Q100 196 156 178" stroke="#fed7aa" strokeWidth="9.5" strokeLinecap="round" fill="none" />

        <rect x="88" y="112" width="24" height="20" rx="3" fill="#fed7aa" />

        <ellipse cx="59" cy="98" rx="3" ry="10" stroke="url(#goldEarring)" strokeWidth="2.2" fill="none" />
        <ellipse cx="141" cy="98" rx="3" ry="10" stroke="url(#goldEarring)" strokeWidth="2.2" fill="none" />

        <ellipse cx="100" cy="94" rx="34" ry="36" fill="url(#faceGradFemale)" />

        {isBlinking ? (
          <>
            <path d="M78 92 Q85 95 92 92" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M108 92 Q115 95 122 92" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <ellipse cx="85" cy="91" rx="5.5" ry="6.5" fill="white" />
            <ellipse cx="115" cy="91" rx="5.5" ry="6.5" fill="white" />
            <circle cx="85 + pupilOffset.x" cy="91 + pupilOffset.y" r="3.8" fill="#1c1917" />
            <circle cx="115 + pupilOffset.x" cy="91 + pupilOffset.y" r="3.8" fill="#1c1917" />
            <circle cx="87 + pupilOffset.x" cy="89 + pupilOffset.y" r="1" fill="white" />
            <circle cx="117 + pupilOffset.x" cy="89 + pupilOffset.y" r="1" fill="white" />
          </>
        )}

        <path d="M98 99 L100 102 L102 99 Z" fill="#f87171" opacity="0.6" />
        {isTalking ? (
          <ellipse cx="100" cy="110" rx="5" ry="3.8" fill="#be123c" />
        ) : (
          <path d="M91 108 Q100 115 109 108" stroke="#be123c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        )}

        <path d="M65 72 C55 92, 63 135, 70 160 C65 135, 59 92, 68 78 Z" fill="url(#hairGradFemale)" />
        <path d="M135 72 C145 92, 137 135, 130 160 C135 135, 141 92, 132 78 Z" fill="url(#hairGradFemale)" />
        <path d="M63 72 C72 52, 128 52, 137 72 C124 62, 76 62, 63 72 Z" fill="url(#hairGradFemale)" />

        <circle cx="68" cy="104" r="3.5" fill="#f43f5e" opacity="0.35" />
        <circle cx="132" cy="104" r="3.5" fill="#f43f5e" opacity="0.35" />

        {isThinking && (
          <>
            <circle cx="130" cy="70" r="3" fill="#fda4af" opacity="0.6" />
            <circle cx="140" cy="58" r="5" fill="#fda4af" opacity="0.7" />
            <circle cx="152" cy="46" r="8" fill="#fda4af" opacity="0.8" />
            <text x="152" y="49" fontSize="8" fontWeight="bold" fill="#e11d48" textAnchor="middle">?</text>
          </>
        )}
      </g>

      <style>{`
        .breathe-group {
          animation: female-breathe 2.8s ease-in-out infinite;
          transform-origin: center bottom;
        }
        @keyframes female-breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.015) translateY(-1px); }
        }
      `}</style>
    </svg>
  );
}

// ─── Core: The Cosmic AI Orb (neutral) ───────────────────────────────────────
function CoreAIOrb({
  size,
  isTalking,
}: {
  size: number;
  isTalking: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <ellipse cx="100" cy="225" rx="30" ry="6" fill="#000000" opacity="0.35" className="shadow-anim" />

      <circle
        cx="100"
        cy="115"
        r="54"
        className="outer-ring"
        stroke="#06b6d4"
        strokeWidth="1.5"
        strokeDasharray="8, 6"
        style={{ transformOrigin: "100px 115px" }}
      />

      <circle
        cx="100"
        cy="115"
        r="44"
        className="inner-ring"
        stroke="#818cf8"
        strokeWidth="1"
        strokeDasharray="4, 4"
        style={{ transformOrigin: "100px 115px" }}
      />

      <circle cx="100" cy="115" r="32" fill="#0f172a" stroke="#818cf8" strokeWidth="2.5" />
      <circle cx="100" cy="115" r="30" fill="url(#coreGrad)" />

      <ellipse cx="88" cy="110" rx="4.5" ry="6" fill="#06b6d4" />
      <ellipse cx="112" cy="110" rx="4.5" ry="6" fill="#06b6d4" />

      {isTalking ? (
        <path d="M86 123 Q100 134 114 123" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" fill="none" className="voice-wave" />
      ) : (
        <line x1="88" y1="123" x2="112" y2="123" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
      )}

      <circle cx="50" cy="75" r="3" fill="#22d3ee" className="satellite-float" />
      <circle cx="150" cy="155" r="4.5" fill="#818cf8" className="satellite-float-reverse" />

      <defs>
        <radialGradient id="coreGrad" cx="50%" cy="40%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#303b57" />
          <stop offset="70%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#030712" />
        </radialGradient>
      </defs>

      <style>{`
        .outer-ring {
          animation: spin-clockwise 14s linear infinite;
        }
        @keyframes spin-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .inner-ring {
          animation: spin-counter 8s linear infinite;
        }
        @keyframes spin-counter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .satellite-float {
          animation: sat-float 4s ease-in-out infinite alternate;
        }
        @keyframes sat-float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(5px, -8px); }
        }
        .satellite-float-reverse {
          animation: sat-float-rev 4s ease-in-out infinite alternate;
        }
        @keyframes sat-float-rev {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-5px, 8px); }
        }
        .voice-wave {
          animation: voice-flash 0.15s ease-in-out infinite alternate;
        }
        @keyframes voice-flash {
          0% { stroke-width: 1.5; }
          100% { stroke-width: 3.5; filter: drop-shadow(0 0 2px #22d3ee); }
        }
      `}</style>
    </svg>
  );
}
