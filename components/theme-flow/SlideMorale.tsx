import { useWizardStore } from "@/lib/stores/wizard";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { WheelSelector } from "../ui/WheelSelector";

const defaultMorals = [
  "Il ne faut pas mentir",
  "Le courage triomphe toujours",
  "On apprend de ses erreurs",
  "L'amitié est une force",
  "La gentillesse change tout",
  "Il ne faut pas juger trop vite",
  "On est plus forts ensemble",
  "Il faut croire en soi",
];

type SlideMoraleProps = {
  onNext: () => void;
  onBack: () => void;
};

export function SlideMorale({ onNext, onBack }: SlideMoraleProps) {
  const setMorale = useWizardStore((s) => s.setMorale);
  const currentMorale = useWizardStore((s) => s.morale);

  // Détermination de l'index initial basé sur la morale actuelle
  const [selectedIndex, setSelectedIndex] = useState(
    currentMorale && defaultMorals.includes(currentMorale)
      ? defaultMorals.indexOf(currentMorale)
      : 0
  );

  const [custom, setCustom] = useState<string>(
    currentMorale && !defaultMorals.includes(currentMorale) ? currentMorale : ""
  );
  const [showInput, setShowInput] = useState(
    currentMorale &&
      !defaultMorals.includes(currentMorale) &&
      currentMorale !== null
  );
  const [noMorale, setNoMorale] = useState(currentMorale === null);

  const handleSelect = (idx: number) => {
    setShowInput(false);
    setNoMorale(false);
    setSelectedIndex(idx);
    setMorale(defaultMorals[idx]);
  };

  const handleCustom = () => {
    setShowInput(true);
    setNoMorale(false);
    setMorale(custom);
  };

  const handleNoMorale = () => {
    setNoMorale(true);
    setShowInput(false);
    setMorale(null);
  };

  const handleContinue = () => {
    if (noMorale) setMorale(null);
    else if (showInput) setMorale(custom);
    else setMorale(defaultMorals[selectedIndex]);
    onNext();
  };

  const disabledButton = !!(showInput && !custom && !noMorale);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-[95vw] mx-auto">
      <div className="mb-8 w-full max-w-md max-w-[95vw] mx-auto">
        <WheelSelector
          items={defaultMorals}
          selectedIndex={selectedIndex}
          onChange={handleSelect}
          itemHeight={48}
          className="max-w-[95vw] w-full mx-auto"
          renderItem={(moral, selected) => (
            <p
              className={`text-xl text-center font-fredoka transition-all ${
                selected ? "text-white font-bold scale-105" : "text-white/50"
              }`}
              data-testid={
                moral === "Le courage triomphe toujours"
                  ? "morale-courage"
                  : undefined
              }
            >
              {moral}
            </p>
          )}
        />
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md max-w-[95vw] mx-auto">
        <button
          className="px-3 py-2 rounded-full bg-white/20 text-white font-medium text-base hover:bg-white/30 transition"
          onClick={handleCustom}
        >
          Choisir moi-même
        </button>
        <AnimatePresence>
          {showInput && (
            <motion.input
              key="input"
              className="w-full px-3 py-2 rounded-full bg-white/20 text-white placeholder:text-white/60 focus:outline-none mt-2 text-base"
              placeholder="Écris ta propre morale..."
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            />
          )}
        </AnimatePresence>
        <button
          className={`px-3 py-2 rounded-full font-medium text-base transition ${
            noMorale
              ? "bg-cyan-500/80 text-white"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
          onClick={handleNoMorale}
        >
          Pas de message
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-6 w-full max-w-md mt-8">
        <motion.button
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-lg font-medium shadow-md hover:bg-white/30 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retour
        </motion.button>
        <motion.button
          onClick={handleContinue}
          data-testid="btn-next"
          className={`w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-bold shadow-md transition ${
            disabledButton && "opacity-50 cursor-not-allowed"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={disabledButton}
        >
          Continuer
        </motion.button>
      </div>
    </div>
  );
}
