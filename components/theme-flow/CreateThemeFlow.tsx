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
  const router = useRouter();

  // Récupérer les informations du store
  const mission = useWizardStore((state) => state.mission);
  const missionDetails = useWizardStore((state) => state.missionDetails);
  const location = useWizardStore((state) => state.location);
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
    onComplete();
  };

  // Gestionnaires de retours en arrière
  const handleBackToMission = () => setCurrentStep(0);
  const handleBackToLocation = () => setCurrentStep(1);
  const handleBackToStart = () => router.push("/create/step-1");

  // Si pas de personnage sélectionné, ne rien afficher pendant la redirection
  if (!selectedCharacter) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Fond d'écran magique */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/background.png)" }}
      />

      {/* Overlay doux pour améliorer lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[-9]" />

      {/* Structure fixe avec header en haut et contenu scrollable */}
      <div className="flex flex-col h-screen">
        {/* Header fixe - Titre et infos personnage */}
        <div className="px-4 py-3 flex flex-col items-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] font-fredoka mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Mon Histoire à Moi
          </motion.h1>

          {/* Information du personnage */}
          <motion.div
            className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-full px-5 py-3 shadow-lg mb-2 w-full max-w-lg justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20 blur-sm z-0"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <img
                src={`/images/${selectedCharacter.gender}.png`}
                alt={selectedCharacter.name}
                className="w-12 h-12 relative z-10 rounded-full border-2 border-white"
              />
            </div>

            <div className="text-white">
              <div className="font-bold text-xl">{selectedCharacter.name}</div>
              <div className="flex items-center gap-3 text-sm">
                <span>{selectedCharacter.age} ans</span>
                <span className="text-white/50">•</span>
                <span className="flex items-center">
                  <span className="mr-1">
                    {emotions[selectedCharacter.emotion]?.icon || "👦"}
                  </span>
                  {emotions[selectedCharacter.emotion]?.label ||
                    selectedCharacter.emotion}
                </span>
              </div>
            </div>

            <motion.button
              onClick={handleBackToStart}
              className="ml-auto text-white/80 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Changer
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </motion.div>

          {/* Afficher la mission et le lieu si déjà choisis */}
          {mission && location && (
            <motion.div
              className="flex flex-col items-center gap-2 bg-purple-500/20 backdrop-blur-md px-4 py-2 rounded-full mb-2 max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="text-white font-medium">
                {selectedCharacter.name} va {mission.toLowerCase()}
                {missionDetails ? ` ${missionDetails}` : ""}
                {location ? `, dans ${location.toLowerCase()}` : ""}
              </span>
            </motion.div>
          )}
        </div>

        {/* Contenu principal scrollable */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="mission-slide"
                className="flex flex-col items-center p-4"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "tween", duration: 0.5 }}
              >
                <div className="w-full max-w-5xl mx-auto">
                  <motion.div
                    className="mb-6 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2 font-fredoka">
                      Quelle mission pour ton héros ?
                    </h2>
                    <p className="text-lg text-white/90 max-w-md mx-auto">
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
                className="flex flex-col items-center p-4"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "tween", duration: 0.5 }}
              >
                <div className="w-full max-w-5xl mx-auto">
                  <motion.div
                    className="mb-6 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2 font-fredoka">
                      Où se déroule l&apos;aventure ?
                    </h2>
                    <p className="text-lg text-white/90 max-w-md mx-auto">
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
                className="flex flex-col items-center p-4"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "tween", duration: 0.5 }}
              >
                <motion.div
                  className="mb-6 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2 font-fredoka">
                    Quelle morale veux-tu pour l&apos;histoire ?
                  </h2>
                  <p className="text-lg text-white/90 max-w-md mx-auto">
                    Choisis un message à transmettre, ou laisse vide pour une
                    histoire sans morale !
                  </p>
                </motion.div>
                <SlideMorale
                  onNext={handleMoraleNext}
                  onBack={handleBackToLocation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Indicateur d'étape fixe en bas */}
        <div className="p-4 flex justify-center items-center space-x-2">
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
