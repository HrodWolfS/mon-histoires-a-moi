"use client";
import { useRef, useState } from "react";
import { useAIClient } from "./useAIClient";

export function useTextToSpeech() {
  const { request } = useAIClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playText = async (text: string, voice: "nova" | "shimmer" = "nova") => {
    if (isLoading || isPlaying) return;

    setIsLoading(true);
    setError(null);
    const cacheKey = `audio-cache:${text}:${voice}`;

    try {
      let audioSrc: string | null = null;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        audioSrc = cached;
      } else {
        const blob = await request<Blob>("audio/speech", {
          model: "tts-1",
          input: text,
          voice,
          response_format: "mp3",
        });

        if (!blob || blob.size === 0) {
          throw new Error(
            "Le service audio n'a pas retourné de données valides."
          );
        }

        audioSrc = URL.createObjectURL(blob);
        try {
          localStorage.setItem(cacheKey, audioSrc);
        } catch (e) {
          console.warn("Impossible de mettre en cache l'audio:", e);
        }
      }

      const audio = new Audio();
      audioRef.current = audio;

      await new Promise((resolve, reject) => {
        audio.oncanplaythrough = resolve;
        audio.onerror = reject;
        audio.src = audioSrc!;
      });

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        console.error("Erreur audio:", e);
        setError("Erreur de lecture audio");
        setIsPlaying(false);
        audioRef.current = null;
      };

      setIsPlaying(true);
      await audio.play();
    } catch (e: any) {
      console.error("Erreur:", e);
      setError(e.message || "Erreur lors de la lecture");
      setIsPlaying(false);
      audioRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  return { playText, isPlaying, isLoading, error };
}
