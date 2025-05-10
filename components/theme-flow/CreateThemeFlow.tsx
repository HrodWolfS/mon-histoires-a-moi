import { Button } from "@/components/ui/button";
import { useCharacterStore } from "@/lib/stores/character";
import { useWizardStore } from "@/lib/stores/wizard";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SlideLocation } from "./SlideLocation";
import { SlideMission } from "./SlideMission";
import { SlideMorale } from "./SlideMorale";

// Liste des émotions pour l'affichage
const emotions: Record<string, { label: string; icon: string }> = {
  brave: { label: "Courageux", icon: "👑" },
  shy: { label: "Timide", icon: "🙈" },
  scared: { label: "Effrayé", icon: "😨" },
  curious: { label: "Curieux", icon: "🧐" },
  happy: { label: "Joyeux", icon: "😄" },
  sad: { label: "Triste", icon: "😢" },
};

type CreateThemeFlowProps = {
  onComplete: () => void;
};

export function CreateThemeFlow({ onComplete }: CreateThemeFlowProps) {
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Récupérer les informations du store
  const mission = useWizardStore((state) => state.mission);
  const missionDetails = useWizardStore((state) => state.missionDetails);
  const location = useWizardStore((state) => state.location);
  const locationDetails = useWizardStore((state) => state.locationDetails);
  const morale = useWizardStore((state) => state.morale);

  // Récupérer le personnage sélectionné
  const getSelectedCharacter = useCharacterStore(
    (state) => state.getSelectedCharacter
  );
  const hasSelectedCharacter = useCharacterStore((state) =>
    state.hasSelectedCharacter()
  );
  const selectedCharacter = getSelectedCharacter();

  // Vérifier qu'un personnage est sélectionné
  useEffect(() => {
    if (!hasSelectedCharacter) {
      // Rediriger vers la page de création/sélection de personnage
      router.push("/create/step-1");
    }
  }, [hasSelectedCharacter, router]);

  // Handlers pour chaque étape
  const handleMissionNext = () => {
    setCurrentStep(1);
  };

  const handleLocationNext = () => {
    setCurrentStep(2);
  };

  const handleMoraleNext = () => {
    // Redirection vers la page de résumé
    router.push("/create/summary");
  };

  // Gestionnaires de retours en arrière
  const handleBackToMission = () => setCurrentStep(0);
  const handleBackToLocation = () => setCurrentStep(1);
  const handleBackToStart = () => router.push("/create/step-1");

  // Si pas de personnage sélectionné, ne rien afficher pendant la redirection
  if (!selectedCharacter) {
    return null;
  }

  // Nouveau bloc header compact fusionné
  const CharacterHeaderCompact = () => (
    <div className="relative bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-md w-[95%] sm:max-w-xl mx-auto my-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <img
            src={`/images/${selectedCharacter.gender}.png`}
            alt={selectedCharacter.name}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div className="text-sm leading-tight">
            <p className="font-bold">{selectedCharacter.name}</p>
            <p className="text-xs text-white/60">
              {selectedCharacter.age} ans •{" "}
              {emotions[selectedCharacter.emotion]?.icon || "👦"}{" "}
              {emotions[selectedCharacter.emotion]?.label ||
                selectedCharacter.emotion}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleBackToStart}>
          Changer &rarr;
        </Button>
      </div>
      {isExpanded && (
        <div className="mt-3 text-sm space-y-1">
          <p>🎯 Mission : {mission || "non défini"}</p>
          <p>📍 Lieu : {location || "non défini"}</p>
        </div>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/20 rounded-full text-white text-xs flex items-center justify-center shadow"
        tabIndex={-1}
        aria-label={isExpanded ? "Réduire le résumé" : "Afficher le résumé"}
      >
        {isExpanded ? "˄" : "˅"}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      {/* Fond d'écran magique */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/background.png)" }}
      />
      {/* Overlay doux pour améliorer lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[-9]" />
      {/* Header compact fusionné */}
      <CharacterHeaderCompact />
      {/* Structure fixe avec header en haut et contenu scrollable */}
      <div className="flex flex-col flex-1 min-h-0 justify-center items-center">
        {/* Contenu principal scrollable */}
        <div className="flex-1 w-full overflow-y-auto flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="mission-slide"
                className="flex flex-col items-center px-4 md:px-8 xl:px-12 py-2 sm:py-4"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "tween", duration: 0.5 }}
              >
                <div className="w-full max-w-5xl mt-30 mx-auto px-2">
                  <motion.div
                    className="mb-6 text-center px-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-2 font-fredoka">
                      Quelle mission pour ton héros ?
                    </h2>
                    <p className="text-sm sm:text-base leading-snug text-white/90 max-w-md mx-auto">
                      Choisis la quête que ton personnage va accomplir dans
                      cette aventure
                    </p>
                  </motion.div>

                  <SlideMission
                    onNext={handleMissionNext}
                    onBack={handleBackToStart}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 1 && mission && (
              <motion.div
                key="location-slide"
                className="flex flex-col items-center px-4 md:px-8 xl:px-12 py-2 sm:py-4"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "tween", duration: 0.5 }}
              >
                <div className="w-full max-w-5xl mt-12 sm:mt-24 md:mt-32 lg:mt-40 mx-auto px-2">
                  <motion.div
                    className="mb-6 text-center px-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-2 font-fredoka">
                      Où se déroule l&apos;aventure ?
                    </h2>
                    <p className="text-sm sm:text-base leading-snug text-white/90 max-w-md mx-auto">
                      Choisis un monde merveilleux pour cette histoire
                    </p>
                  </motion.div>

                  <SlideLocation
                    onNext={handleLocationNext}
                    onBack={handleBackToMission}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && mission && location && (
              <motion.div
                key="morale-slide"
                className="flex flex-col items-center px-4 md:px-8 xl:px-12 py-2 sm:py-4"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "tween", duration: 0.5 }}
              >
                <div className="w-full max-w-5xl mt-12 sm:mt-24 md:mt-32 lg:mt-40 mx-auto px-2">
                  <motion.div
                    className="mb-6 text-center px-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-2 font-fredoka">
                      Un message à transmettre ?
                    </h2>
                    <p className="text-sm sm:text-base leading-snug text-white/90 max-w-sm mx-auto">
                      Choisis un message à transmettre, ou laisse vide pour une
                      histoire sans morale !
                    </p>
                  </motion.div>
                  <SlideMorale
                    onNext={handleMoraleNext}
                    onBack={handleBackToLocation}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Indicateur d'étape */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-2 z-10 pointer-events-none">
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
