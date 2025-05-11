"use client";

import { useRef, useState } from "react";
import { useAIClient } from "./useAIClient";

// Fonction de vérification si on est côté client
const isClient = () => typeof window !== "undefined";

export function useTextToSpeech() {
  const client = useAIClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playText = async (text: string, voice: "nova" | "shimmer" = "nova") => {
    if (isLoading || isPlaying || !isClient()) return;

    setIsLoading(true);
    setError(null);
    const cacheKey = `audio-cache:${text}:${voice}`;

    try {
      let audioSrc: string | null = null;
      const cached = isClient() ? localStorage.getItem(cacheKey) : null;

      if (cached) {
        audioSrc = cached;
      } else {
        if (!client) {
          throw new Error("Clé API OpenAI manquante ou invalide");
        }

        const blob = await client.generateSpeech(text);
        if (!blob) {
          throw new Error("Échec de la génération audio");
        }

        audioSrc = URL.createObjectURL(blob);
        try {
          if (isClient()) {
            localStorage.setItem(cacheKey, audioSrc);
          }
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
    } catch (e: unknown) {
      let errorMessage = "Erreur inconnue lors de la génération audio.";
      if (typeof e === "string") {
        errorMessage = e;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      console.error("Error generating speech:", e);
      setIsPlaying(false);
      audioRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  return { playText, isPlaying, isLoading, error };
}
