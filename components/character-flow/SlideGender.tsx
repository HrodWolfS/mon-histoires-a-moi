import { useCharacterStore } from "@/lib/stores/character";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type SlideGenderProps = {
  onNext: (gender: "boy" | "girl") => void;
};

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

export function SlideGender({ onNext }: SlideGenderProps) {
  // Utilisation du store pour gérer le genre
  const setGender = useCharacterStore((s) => s.setGender);
  const currentGender = useCharacterStore((s) => s.currentCharacter.gender);

  // Fonction pour gérer la sélection du genre
  const handleGenderSelect = (gender: "boy" | "girl") => {
    setGender(gender);
    onNext(gender);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* Étoiles flottantes */}
      <FloatingStars />

      <motion.p
        className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 font-quicksand text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Une aventure magique qui t'appartient
      </motion.p>

      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-4 sm:mb-6 font-fredoka text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Qui est le héros de ton histoire ?
      </motion.h2>

      <div className="flex flex-row gap-10">
        <motion.button
          onClick={() => handleGenderSelect("boy")}
          className="flex flex-col items-center hover:scale-105 transition-all relative cursor-pointer"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Aura animée derrière l'image */}
          <motion.div
            className={`absolute inset-0 rounded-3xl bg-blue-400/30 blur-md z-0 ${
              currentGender === "boy" ? "border-4 border-white" : ""
            }`}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <img
            src="/images/boy.png"
            alt="Garçon"
            className="w-40 h-40 md:w-48 md:h-48 rounded-3xl shadow-xl border-4 border-blue-400 relative z-10"
          />
          <span className="mt-2 text-xl font-bold text-blue-300 drop-shadow-md font-fredoka">
            Garçon
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleGenderSelect("girl")}
          className="flex flex-col items-center hover:scale-105 transition-all relative cursor-pointer"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* Aura animée derrière l'image */}
          <motion.div
            className={`absolute inset-0 rounded-3xl bg-pink-400/30 blur-md z-0 ${
              currentGender === "girl" ? "border-4 border-white" : ""
            }`}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <img
            src="/images/girl.png"
            alt="Fille"
            className="w-40 h-40 md:w-48 md:h-48 rounded-3xl shadow-xl border-4 border-pink-400 relative z-10"
          />
          <span className="mt-2 text-xl font-bold text-pink-300 drop-shadow-md font-fredoka">
            Fille
          </span>
        </motion.button>
      </div>
    </div>
  );
}
