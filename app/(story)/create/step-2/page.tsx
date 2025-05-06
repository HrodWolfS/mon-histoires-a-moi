"use client";

import { CharactersList } from "@/components/CharactersList";
import { useHasCharacters } from "@/lib/hooks/useCharacterComplete";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Composant d'étoile flottante
const FloatingStars = () => {
  const [stars, setStars] = useState<
    Array<{
      size: number;
      top: number;
      left: number;
      delay: number;
      duration: number;
      id: number;
    }>
  >([]);

  useEffect(() => {
    // Génération des étoiles uniquement côté client pour éviter le mismatch d'hydratation
    const starsArray = Array.from({ length: 15 }).map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      id: i,
    }));

    setStars(starsArray);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-yellow-300 text-opacity-70 z-0"
          style={{ top: `${star.top}%`, left: `${star.left}%` }}
          initial={{ opacity: 0.3, scale: 0.5 }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.7, 1, 0.7],
            rotate: ["0deg", "180deg", "360deg"],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0l2.245 6.91h7.255l-5.745 4.18 2.245 6.91-6-4.18-6 4.18 2.245-6.91-5.745-4.18h7.255z" />
          </svg>
        </motion.div>
      ))}
    </>
  );
};

// Thèmes disponibles pour les histoires
const themes = [
  {
    id: "fantasy",
    title: "Monde Fantastique",
    description: "Des dragons, des créatures magiques et des aventures épiques",
    image: "/images/themes/fantasy.jpg",
    color: "from-purple-500 to-blue-600",
  },
  {
    id: "space",
    title: "Voyage Spatial",
    description: "Explorer les étoiles, rencontrer des extraterrestres",
    image: "/images/themes/space.jpg",
    color: "from-blue-500 to-indigo-700",
  },
  {
    id: "ocean",
    title: "Aventure Sous-Marine",
    description: "Découvrir les profondeurs de l'océan et ses mystères",
    image: "/images/themes/ocean.jpg",
    color: "from-cyan-500 to-blue-700",
  },
  {
    id: "jungle",
    title: "Exploration de la Jungle",
    description:
      "S'aventurer dans la forêt tropicale avec ses animaux sauvages",
    image: "/images/themes/jungle.jpg",
    color: "from-green-500 to-emerald-700",
  },
];

export default function StepTwo() {
  const router = useRouter();
  const hasCharacters = useHasCharacters();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Rediriger vers la création de personnage si aucun n'existe
  useEffect(() => {
    if (!hasCharacters) {
      router.push("/create/step-1");
    }
  }, [hasCharacters, router]);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    // Stocke le thème sélectionné (à adapter avec Zustand ultérieurement)
    localStorage.setItem("story_theme", themeId);
  };

  const handleContinue = () => {
    if (selectedTheme) {
      // Redirection vers l'étape suivante
      router.push("/create/story-generation");
    }
  };

  if (!hasCharacters) {
    return null; // Ne rien rendre pendant la redirection
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-6">
      {/* Fond d'écran */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/background.png)" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[-9]" />

      {/* Étoiles */}
      <div className="absolute inset-0 pointer-events-none z-[-8]">
        <FloatingStars />
      </div>

      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] font-fredoka mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Mon Histoire à Moi
        </motion.h1>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 font-fredoka">
            Personnages de l'histoire
          </h2>

          <CharactersList />

          <div className="mt-4 flex justify-end">
            <motion.button
              onClick={() => router.push("/create/step-1")}
              className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Ajouter un personnage
            </motion.button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 font-fredoka">
            Choisis le thème de ton histoire
          </h2>

          <p className="text-xl text-white/90 mb-6">
            Quel univers magique veux-tu explorer ?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((theme) => (
              <motion.div
                key={theme.id}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all ${
                  selectedTheme === theme.id
                    ? "ring-4 ring-white scale-[1.02]"
                    : "hover:scale-[1.01]"
                }`}
                onClick={() => handleThemeSelect(theme.id)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-40 w-full">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${theme.color} opacity-60`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white font-fredoka drop-shadow-lg">
                      {theme.title}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-md">
                  <p className="text-white/90">{theme.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <motion.button
            onClick={() => router.push("/create/step-1")}
            className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-lg font-medium shadow-md hover:bg-white/30 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retour
          </motion.button>

          <motion.button
            onClick={handleContinue}
            disabled={!selectedTheme}
            className={`px-6 py-3 rounded-full text-white text-lg font-bold shadow-md transition ${
              !selectedTheme
                ? "bg-gray-400/50 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-teal-500 hover:scale-105"
            }`}
            whileHover={selectedTheme ? { scale: 1.05 } : {}}
            whileTap={selectedTheme ? { scale: 0.95 } : {}}
          >
            Générer l'histoire
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
