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

  const ages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

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
    <div className="flex flex-col items-center justify-center h-full w-full">
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
        className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-3 sm:mb-4 font-fredoka text-center"
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
          itemHeight={48}
          className="max-w-[50%] mx-auto"
          data-testid="wheel-age"
          renderItem={(age, selected) => (
            <span
              className={`text-4xl  text-center font-bold ${
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

      <motion.p
        className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 font-quicksand text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Cette étape est cruciale pour construire une histoire qui reflète
        fidèlement l&apos;âge de ton personnage.
      </motion.p>

      <div className="flex flex-row justify-between gap-2 w-full max-w-md mt-6">
        <motion.button
          onClick={onBack}
          className="w-1/2 py-4 rounded-full mr-2 bg-white/20 backdrop-blur-md text-white text-base font-medium shadow-md hover:bg-white/30 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retour
        </motion.button>

        <motion.button
          onClick={handleAgeSelection}
          className="w-1/2 py-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-base font-bold shadow-md transition hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-testid="btn-next"
        >
          Continuer
        </motion.button>
      </div>

      <motion.p
        className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 font-quicksand text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="text-yellow-300">
          Tu n&apos;as pas besoin d&apos;être précis !
        </span>
      </motion.p>
    </div>
  );
}
