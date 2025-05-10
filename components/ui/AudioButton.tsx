"use client";
import { useTextToSpeech } from "@/lib/hooks/useTextToSpeech";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AudioButtonProps {
  text: string;
  voice?: "nova" | "shimmer"; // Optionnel pour choisir la voix
  className?: string;
}

export function AudioButton({
  text,
  voice = "nova",
  className,
}: AudioButtonProps) {
  const { playText, isPlaying, isLoading, error } = useTextToSpeech();
  const [iconIndex, setIconIndex] = useState(0);
  const icons = ["🔈", "🔉", "🔊"];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setIconIndex((prev) => (prev + 1) % icons.length);
      }, 500);
    } else {
      setIconIndex(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleClick = async () => {
    if (isLoading || isPlaying) return;
    await playText(text, voice);
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <button
        onClick={handleClick}
        disabled={isLoading || isPlaying}
        className={cn(
          "transition-all duration-300 bg-white/10 backdrop-blur-sm text-white font-medium",
          "flex items-center justify-center gap-2 shadow-md rounded-full",
          "px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base md:px-5 md:py-2.5",
          "w-full sm:w-auto",
          (isLoading || isPlaying) && "cursor-not-allowed opacity-70",
          isPlaying && "bg-purple-500/30"
        )}
      >
        <span className="text-lg sm:text-xl">
          {isLoading ? "⏳" : icons[iconIndex]}
        </span>
      </button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
