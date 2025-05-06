import { useCharacterStore } from "@/lib/stores/character";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SlideAge } from "./SlideAge";
import { SlideEmotion } from "./SlideEmotion";
import { SlideGender } from "./SlideGender";
import { SlideName } from "./SlideName";

export type CharacterDraft = {
  gender: "boy" | "girl" | null;
  name: string;
  age: number | null;
  emotion: string;
};

type CreateCharacterFlowProps = {
  onComplete: (character: CharacterDraft) => void;
  initialGender?: "boy" | "girl" | null;
};

export function CreateCharacterFlow({
  onComplete,
  initialGender = null,
}: CreateCharacterFlowProps) {
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(
    initialGender ? 1 : 0
  );

  // Utilisation du store Zustand
  const currentCharacter = useCharacterStore((state) => state.currentCharacter);
  const setGender = useCharacterStore((state) => state.setGender);

  // Effet pour gérer l'initialisation du gender
  useEffect(() => {
    if (initialGender && currentCharacter.gender !== initialGender) {
      setGender(initialGender);
      setCurrentStep(1);
    }
  }, [initialGender, currentCharacter.gender, setGender]);

  // Handlers pour chaque étape
  const handleGenderNext = () => {
    setCurrentStep(1);
  };

  const handleNameNext = () => {
    setCurrentStep(2);
  };

  const handleAgeNext = () => {
    setCurrentStep(3);
  };

  const handleEmotionNext = () => {
    // Pas besoin de gérer currentCharacter ici, c'est le store qui s'en occupe
    if (
      currentCharacter.gender &&
      currentCharacter.name &&
      currentCharacter.age !== undefined &&
      currentCharacter.emotion
    ) {
      onComplete(currentCharacter as CharacterDraft);
    }
  };

  // Gestionnaires de retours en arrière
  const handleBackToGender = () => setCurrentStep(0);
  const handleBackToName = () => setCurrentStep(1);
  const handleBackToAge = () => setCurrentStep(2);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fond d'écran magique */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/background.png)" }}
      />

      {/* Overlay doux pour améliorer lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[-9]" />

      <div className="relative w-full h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="gender-slide"
              className="absolute inset-0"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.5 }}
            >
              <SlideGender onNext={handleGenderNext} />
            </motion.div>
          )}

          {currentStep === 1 && currentCharacter.gender && (
            <motion.div
              key="name-slide"
              className="absolute inset-0"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.5 }}
            >
              <SlideName
                gender={currentCharacter.gender}
                onNext={handleNameNext}
                onBack={handleBackToGender}
              />
            </motion.div>
          )}

          {currentStep === 2 &&
            currentCharacter.gender &&
            currentCharacter.name && (
              <motion.div
                key="age-slide"
                className="absolute inset-0"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.5 }}
              >
                <SlideAge
                  onNext={handleAgeNext}
                  onBack={handleBackToName}
                  gender={currentCharacter.gender}
                  name={currentCharacter.name}
                />
              </motion.div>
            )}

          {currentStep === 3 &&
            currentCharacter.gender &&
            currentCharacter.name &&
            currentCharacter.age !== undefined &&
            typeof currentCharacter.age === "number" && (
              <motion.div
                key="emotion-slide"
                className="absolute inset-0"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.5 }}
              >
                <SlideEmotion
                  onNext={handleEmotionNext}
                  onBack={handleBackToAge}
                  gender={currentCharacter.gender}
                  name={currentCharacter.name}
                  age={currentCharacter.age}
                />
              </motion.div>
            )}
        </AnimatePresence>

        {/* Indicateur d'étape */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-2 p-4">
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentStep === step
                  ? "bg-white w-6"
                  : step < currentStep
                  ? "bg-white/70"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
