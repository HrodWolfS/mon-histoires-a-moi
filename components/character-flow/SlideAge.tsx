import { useCharacterStore } from "@/lib/stores/character";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type SlideAgeProps = {
  onNext: (age: number) => void;
  onBack: () => void;
  gender: "boy" | "girl";
  name: string;
};

export function SlideAge({ onNext, onBack, gender, name }: SlideAgeProps) {
  // Utilisation du store pour gérer l'âge
  const setAge = useCharacterStore((state) => state.setAge);
  const currentAge = useCharacterStore((state) => state.currentCharacter.age);

  const [selectedAge, setSelectedAge] = useState<number | null>(
    currentAge || null
  );
  const [wheelPosition, setWheelPosition] = useState(() => {
    const ages = [3, 4, 5, 6, 7, 8, 9, 10];
    // Si l'âge est déjà défini, déterminer sa position dans la roue
    if (currentAge) {
      const index = ages.indexOf(currentAge);
      return index !== -1 ? index : 0;
    }
    return 0;
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const ages = [3, 4, 5, 6, 7, 8, 9, 10];
  const itemHeight = 70; // hauteur de chaque élément d'âge

  // Gestion du défilement de la roue
  const handleWheel = (direction: "up" | "down") => {
    if (direction === "up" && wheelPosition > 0) {
      setWheelPosition((prev) => Math.max(prev - 1, 0));
    } else if (direction === "down" && wheelPosition < ages.length - 1) {
      setWheelPosition((prev) => Math.min(prev + 1, ages.length - 1));
    }
  };

  // Mettre à jour l'âge sélectionné en fonction de la position de la roue
  useEffect(() => {
    setSelectedAge(ages[wheelPosition]);
  }, [wheelPosition, ages]);

  // Fonction pour gérer la sélection de l'âge
  const handleAgeSelection = () => {
    if (selectedAge) {
      setAge(selectedAge);
      onNext(selectedAge);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] font-fredoka mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Mon Histoire à Moi
      </motion.h1>

      <motion.div
        className="flex flex-col items-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-2">
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
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
              className="relative z-10 w-16 h-16 rounded-xl shadow-xl"
            />
          </motion.div>
          <div className="text-white text-xl font-bold">{name}</div>
        </div>
      </motion.div>

      <motion.h2
        className="text-3xl font-bold text-white drop-shadow-md mb-8 font-fredoka"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Quel âge a ton personnage ?
      </motion.h2>

      <motion.div
        className="flex items-center justify-center w-full max-w-md space-x-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.button
          onClick={() => handleWheel("up")}
          className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </motion.button>

        <div
          className="relative h-[210px] w-24 overflow-hidden bg-white/20 backdrop-blur-md rounded-2xl shadow-xl"
          ref={containerRef}
        >
          <div
            className="absolute left-0 w-full transition-transform duration-300"
            style={{
              transform: `translateY(${70 - wheelPosition * itemHeight}px)`,
            }}
          >
            {ages.map((age, index) => (
              <motion.div
                key={age}
                className={`flex items-center justify-center h-[70px] text-4xl font-bold transition-all ${
                  wheelPosition === index
                    ? "text-white scale-110"
                    : "text-white/70 opacity-50"
                }`}
                whileHover={{ scale: 1.1 }}
                onClick={() => setWheelPosition(index)}
              >
                {age}
              </motion.div>
            ))}
          </div>

          {/* Indicateur de sélection */}
          <div className="absolute top-1/2 left-0 right-0 h-[70px] transform -translate-y-1/2 border-2 border-white/50 rounded-lg pointer-events-none" />
        </div>

        <motion.button
          onClick={() => handleWheel("down")}
          className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.button>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: selectedAge ? 1.1 : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="flex flex-col items-center justify-center mt-6"
      >
        {selectedAge && (
          <div className="text-2xl font-bold text-white mb-2">
            {selectedAge} ans
          </div>
        )}
      </motion.div>

      <div className="flex justify-between space-x-4 w-full max-w-md mt-8">
        <motion.button
          onClick={onBack}
          className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-lg font-medium shadow-md hover:bg-white/30 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retour
        </motion.button>

        <motion.button
          onClick={handleAgeSelection}
          disabled={!selectedAge}
          className={`px-6 py-3 rounded-full text-white text-lg font-bold shadow-md transition ${
            !selectedAge
              ? "bg-white/10 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-teal-500 hover:scale-105"
          }`}
          whileHover={selectedAge ? { scale: 1.05 } : {}}
          whileTap={selectedAge ? { scale: 0.95 } : {}}
        >
          Continuer
        </motion.button>
      </div>
    </div>
  );
}
