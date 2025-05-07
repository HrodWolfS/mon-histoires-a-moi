import { useCharacterStore } from "@/lib/stores/character";
import { motion } from "framer-motion";
import { useState } from "react";
import { WheelSelector } from "../ui/WheelSelector";

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

  const ages = [3, 4, 5, 6, 7, 8, 9, 10];

  // Détermination de l'index initial basé sur l'âge actuel
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (currentAge) {
      const index = ages.indexOf(currentAge);
      return index !== -1 ? index : 0;
    }
    return 0;
  });

  // Fonction pour gérer la sélection de l'âge
  const handleAgeSelection = () => {
    const selectedAge = ages[selectedIndex];
    setAge(selectedAge);
    onNext(selectedAge);
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <WheelSelector
          items={ages}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
          itemHeight={70}
          renderItem={(age, selected) => (
            <span
              className={`text-4xl font-bold ${
                selected ? "text-white" : "text-white/70"
              }`}
            >
              {age}
            </span>
          )}
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: 1.1,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="flex flex-col items-center justify-center mt-6"
      >
        <div className="text-2xl font-bold text-white mb-2">
          {ages[selectedIndex]} ans
        </div>
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
          className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg font-bold shadow-md transition hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continuer
        </motion.button>
      </div>
    </div>
  );
}
