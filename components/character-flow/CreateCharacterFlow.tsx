import { useCharacterStore } from "@/lib/stores/character";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CharactersList } from "../CharactersList";
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
  const [currentStep, setCurrentStep] = useState<"list" | 0 | 1 | 2 | 3>(
    "list"
  );
  const [showingList, setShowingList] = useState(false);

  // Utilisation du store Zustand
  const characters = useCharacterStore((state) => state.characters);
  const currentCharacter = useCharacterStore((state) => state.currentCharacter);
  const setGender = useCharacterStore((state) => state.setGender);
  const resetCurrentCharacter = useCharacterStore(
    (state) => state.resetCurrentCharacter
  );
  const hasSelectedCharacter = useCharacterStore((state) =>
    state.hasSelectedCharacter()
  );

  // Vérifier s'il y a des personnages existants
  const hasCharacters = characters.length > 0;

  // Déterminer l'état initial du flux
  useEffect(() => {
    if (initialGender) {
      // Si un genre est spécifié, on démarre directement le flow
      setCurrentStep(1);
      setShowingList(false);
    } else if (hasCharacters) {
      // Si des personnages existent, afficher la liste
      setCurrentStep("list");
      setShowingList(true);
    } else {
      // Sinon, commencer par le choix du genre
      setCurrentStep(0);
      setShowingList(false);
    }
  }, [initialGender, hasCharacters]);

  // Effet pour gérer l'initialisation du gender
  useEffect(() => {
    if (initialGender && currentCharacter.gender !== initialGender) {
      setGender(initialGender);
    }
  }, [initialGender, currentCharacter.gender, setGender]);

  // Démarrer le flow de création
  const startCreationFlow = () => {
    resetCurrentCharacter();
    setCurrentStep(0);
    setShowingList(false);
  };

  // Revenir à la liste des personnages
  const backToList = () => {
    setCurrentStep("list");
    setShowingList(true);
  };

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
    // Après avoir complété le personnage
    if (
      currentCharacter.gender &&
      currentCharacter.name &&
      currentCharacter.age !== undefined &&
      currentCharacter.emotion
    ) {
      // Si on a créé un nouveau personnage et qu'il y en avait déjà, montrer la liste
      if (hasCharacters) {
        setCurrentStep("list");
        setShowingList(true);
      } else {
        // Sinon, juste compléter
        onComplete(currentCharacter as CharacterDraft);
      }
    }
  };

  // Gestionnaires de retours en arrière
  const handleBackToGender = () => setCurrentStep(0);
  const handleBackToName = () => setCurrentStep(1);
  const handleBackToAge = () => setCurrentStep(2);

  // Gestionnaire de sélection de personnage
  const handleCharacterSelect = () => {
    // Vérifier si un personnage est sélectionné
    if (hasSelectedCharacter) {
      onComplete({} as CharacterDraft); // On n'a pas besoin du draft, on utilise le personnage sélectionné
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Fond d'écran magique */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/background.png)" }}
      />

      {/* Overlay doux pour améliorer lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[-9]" />

      <div className="relative w-full h-full overflow-y-auto px-4 md:px-8 xl:px-12 py-6 md:py-10">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-center text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] font-fredoka md:mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mon Histoire à Moi
        </motion.h1>

        {showingList ? (
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-4 sm:mb-6 font-fredoka text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Choisis ton personnage
            </motion.h2>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
              <CharactersList selectable showDelete />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <motion.button
                onClick={startCreationFlow}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-bold shadow-lg hover:shadow-xl transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Créer un nouveau personnage
              </motion.button>

              <motion.button
                onClick={handleCharacterSelect}
                disabled={!hasSelectedCharacter}
                className={`px-6 py-3 rounded-full text-white text-lg font-bold shadow-md transition ${
                  !hasSelectedCharacter
                    ? "bg-gray-400/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-xl"
                }`}
                whileHover={hasSelectedCharacter ? { scale: 1.05 } : {}}
                whileTap={hasSelectedCharacter ? { scale: 0.95 } : {}}
              >
                Continuer avec ce personnage
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="relative w-full h-[calc(100vh-8rem)] overflow-hidden">
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

            {/* Bouton pour revenir à la liste si on était en train de créer */}
            {hasCharacters && (
              <motion.button
                onClick={backToList}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Utiliser un personnage existant
              </motion.button>
            )}

            {/* Indicateur d'étape */}
            <div className="fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-2 z-10 pointer-events-none">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentStep === step
                      ? "bg-white w-6"
                      : step < (currentStep as number)
                      ? "bg-white/70"
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
