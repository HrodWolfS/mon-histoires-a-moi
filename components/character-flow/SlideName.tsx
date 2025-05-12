import { useCharacterStore } from "@/lib/stores/character";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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

type SlideNameProps = {
  gender: "boy" | "girl";
  onNext: (name: string) => void;
  onBack: () => void;
};

export function SlideName({ gender, onNext, onBack }: SlideNameProps) {
  // Utilisation du store pour gérer le nom
  const setName = useCharacterStore((state) => state.setName);
  const currentName =
    useCharacterStore((state) => state.currentCharacter.name) || "";

  const [name, setLocalName] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus sur l'input avec un léger délai pour une meilleure UX
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim()) {
      const capitalized =
        name.trim().charAt(0).toUpperCase() + name.trim().slice(1);

      // Mettre à jour le store et passer à l'étape suivante
      setName(capitalized);
      onNext(capitalized);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* Étoiles flottantes */}
      <FloatingStars />

      <div className="flex flex-col items-center justify-center">
        <motion.div
          className="relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
        >
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/20 blur-md z-0"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <img
            src={`/images/${gender}.png`}
            alt="Personnage"
            className="relative z-10 w-16 md:w-24 rounded-xl shadow-xl"
          />
        </motion.div>

        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-3 sm:mb-4 font-fredoka text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Comment s&apos;appelle ton {gender === "boy" ? "héros" : "héroïne"} ?
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 font-quicksand text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Remplissez ce formulaire pour créer votre personnage.
        </motion.p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
          <motion.form
            className="w-full max-w-md flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onSubmit={handleSubmit}
          >
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Prénom"
              data-testid="input-name"
              className="w-full text-center py-3 px-3 rounded-full bg-white/80 backdrop-blur-md text-xl font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <div className="flex flex-row justify-between gap-2 w-full max-w-md mt-6">
              <motion.button
                type="button"
                onClick={onBack}
                className="w-1/2 py-4 mr-2 rounded-full bg-white/20 backdrop-blur-md text-white text-base font-medium shadow-md hover:bg-white/30 transition"
                whileHover={{ scale: 1.05 }}
              >
                Retour
              </motion.button>

              <motion.button
                type="submit"
                className="w-1/2 py-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-base font-bold shadow-md transition hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continuer
              </motion.button>
            </div>
          </motion.form>
        </div>

        <p className="text-white/90 text-sm text-center">
          Ce sera le héros de l&apos;histoire !
        </p>
      </div>
    </div>
  );
}
