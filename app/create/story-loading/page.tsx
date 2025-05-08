"use client";

import { useStoryGenerator } from "@/lib/hooks/useStoryGenerator";
import { useStoryStore } from "@/lib/stores/story";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function StoryLoadingPage() {
  const router = useRouter();
  const { generateStory, loading, error, hydrated, character } =
    useStoryGenerator();
  const setStory = useStoryStore((s) => s.setStory);
  const [dots, setDots] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [isWaitingForHydration, setIsWaitingForHydration] = useState(true);
  const generationStarted = useRef(false);
  const generationSuccess = useRef(false);

  // Vérification de l'hydratation
  useEffect(() => {
    if (hydrated) {
      setIsWaitingForHydration(false);
    }
  }, [hydrated]);

  // Animation des points de chargement
  useEffect(() => {
    if (loading || isWaitingForHydration) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading, isWaitingForHydration]);

  // Génération de l'histoire
  useEffect(() => {
    // Fonction pour générer l'histoire
    const load = async () => {
      // Ne rien faire si on attend l'hydratation
      if (isWaitingForHydration) return;

      // Ne pas générer à nouveau si déjà réussi
      if (generationSuccess.current) return;

      // Ne pas lancer plusieurs générations simultanées
      if (generationStarted.current) return;

      // Vérifier que le personnage est bien chargé
      if (!character) {
        console.log("Personnage non disponible, attente...");
        return;
      }

      console.log("Démarrage de la génération de l'histoire");
      generationStarted.current = true;

      try {
        const story = await generateStory();

        if (story) {
          console.log("Histoire générée avec succès");
          generationSuccess.current = true;
          setStory(story);
          router.push("/create/story-reader");
        } else {
          console.log("Pas d'histoire générée");
          generationStarted.current = false;
        }
      } catch (e) {
        console.error("Erreur lors de la génération de l'histoire:", e);
        generationStarted.current = false;
      }
    };

    load();
  }, [
    generateStory,
    router,
    setStory,
    isRetrying,
    isWaitingForHydration,
    character,
  ]);

  const handleRetry = () => {
    generationStarted.current = false;
    generationSuccess.current = false;
    setIsRetrying((prev) => !prev);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-white"
      style={{
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-xl w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 flex flex-col items-center">
          {error ? (
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-400 mb-4 text-xl font-bold"
              >
                Oups, il y a eu un problème !
              </motion.div>
              <p className="text-white/90 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <>
              <div className="w-24 h-24 mb-6 relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 blur-md"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  >
                    <span className="text-3xl">✨</span>
                  </motion.div>
                </div>
              </div>

              <motion.h2
                className="text-2xl font-fredoka text-center mb-4"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                {isWaitingForHydration
                  ? "Préparation de ton aventure"
                  : "Création de ton histoire magique"}
              </motion.h2>

              <p className="text-white/80 text-center mb-2">
                {isWaitingForHydration
                  ? `Chargement des informations${dots}`
                  : `Notre équipe de fées et lutins est au travail${dots}`}
              </p>
              <p className="text-white/60 text-sm text-center">
                Cela peut prendre quelques instants
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
