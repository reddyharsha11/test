"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Rewind, FastForward } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  src: string;
  onComplete?: () => void;
  poster?: string;
}

export function CustomVideoPlayer({ src, onComplete, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Hide controls when playing after a few seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 2000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setShowControls(true); // Show controls briefly when skipping
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
    if (onComplete) onComplete();
  };

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onEnded={handleEnded}
        onClick={togglePlay}
      />

      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"
      >
        <div className="flex items-center gap-6 pointer-events-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); skip(-10); }}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all transform hover:scale-105"
          >
            <Rewind className="w-5 h-5" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="w-16 h-16 rounded-full bg-brand-500 hover:bg-brand-400 shadow-glow-md flex items-center justify-center text-white transition-all transform hover:scale-105"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); skip(10); }}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all transform hover:scale-105"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
