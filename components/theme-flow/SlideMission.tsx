import { useWizardStore } from "@/lib/stores/wizard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type SlideMissionProps = {
  onNext: () => void;
  onBack: () => void;
};

// Missions disponibles
const missions = [
  {
    emoji: "🦄",
    title: "Sauver quelqu'un",
    description: "Un héros n'abandonne jamais ses amis.",
  },
  {
    emoji: "🕵️‍♂️",
    title: "Résoudre un mystère",
    description: "Des indices, une énigme… à toi de jouer !",
  },
  {
    emoji: "💎",
    title: "Trouver un trésor",
    description: "Un secret caché attend d'être découvert.",
  },
  {
    emoji: "👽",
    title: "Explorer l'inconnu",
    description: "Par-delà les frontières du connu…",
  },
  {
    emoji: "🧪",
    title: "Faire une découverte",
    description: "Tu vas changer le monde !",
  },
  {
    emoji: "🛠️",
    title: "Créer quelque chose",
    description: "Ton imagination devient réalité.",
  },
  {
    emoji: "🫶",
    title: "Aider un ami",
    description: "Parfois, un simple geste peut tout changer.",
  },
  {
    emoji: "🧟‍♂️",
    title: "Affronter une peur",
    description: "Tu es plus courageux que tu ne le crois.",
  },
];

// Dictionnaire d'exemples de détails
const missionPlaceholders: Record<string, string> = {
  "Sauver quelqu'un": "sauver ma meilleure amie",
  "Résoudre un mystère": "retrouver le collier disparu",
  "Trouver un trésor": "un trésor caché dans les ruines",
  "Explorer l'inconnu": "une planète jamais vue",
  "Faire une découverte": "une plante qui parle",
  "Créer quelque chose": "un robot super intelligent",
  "Aider un ami": "un copain qui a perdu son chien",
  "Affronter une peur": "montrer que les monstres n'existent pas",
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
    // Génération des étoiles uniquement côté client
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

export function SlideMission({ onNext, onBack }: SlideMissionProps) {
  // Store pour gérer le choix de mission
  const addMission = useWizardStore((state) => state.addMission);
  const currentMission = useWizardStore((state) => state.mission);
  const currentDetails = useWizardStore((state) => state.missionDetails);

  // États locaux pour la mission, les détails et options
  const [selectedMission, setSelectedMission] = useState<string | null>(
    currentMission
  );
  const [missionDetails, setMissionDetails] = useState<string>(
    currentDetails || ""
  );
  const [useRandom, setUseRandom] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Sélectionner une mission
  const handleSelectMission = (mission: string) => {
    setSelectedMission(mission);
    setMissionDetails("");
    setUseRandom(false);
    setError("");
  };

  // Basculer l'option aléatoire
  const handleToggleRandom = () => {
    setUseRandom(!useRandom);
    if (!useRandom) {
      setMissionDetails("");
    } else {
      setError("");
    }
  };

  // Sélectionner une mission aléatoire
  const selectRandomMission = () => {
    const randomIndex = Math.floor(Math.random() * missions.length);
    setSelectedMission(missions[randomIndex].title);
    setUseRandom(true);
    setMissionDetails("");
    setError("");
  };

  // Quand l'utilisateur continue vers l'étape suivante
  const handleContinue = () => {
    if (selectedMission) {
      if (!missionDetails && !useRandom) {
        setError(
          "Ajoute des détails à ta mission ou choisis l'option surprise 🎲"
        );
        return;
      }

      addMission(selectedMission, useRandom ? null : missionDetails || null);
      onNext();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingStars />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-8 px-4">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.title}
            className={`cursor-pointer rounded-xl p-2 sm:p-3 md:p-4 backdrop-blur-md transition-all transform text-sm sm:text-base md:text-lg ${
              selectedMission === mission.title
                ? "bg-purple-500/40 border-2 border-white scale-105"
                : "bg-white/10 border border-white/20 hover:bg-white/20"
            }`}
            onClick={() => handleSelectMission(mission.title)}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 + 0.6 }}
          >
            <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
              <span className="text-2xl sm:text-3xl md:text-3xl mb-1">
                {mission.emoji}
              </span>
              <h3 className="font-bold text-white text-sm sm:text-base md:text-base">
                {mission.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-xs md:text-sm">
                {mission.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedMission && (
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-4 mt-4 w-full max-w-md mx-auto transition-all"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-3">
            <label
              htmlFor="missionDetails"
              className="text-white text-sm mb-1 block"
            >
              Précise cette mission :
            </label>
            <input
              id="missionDetails"
              type="text"
              placeholder={`Exemple : ${
                missionPlaceholders[selectedMission] || "donne plus de détails"
              }`}
              value={missionDetails}
              onChange={(e) => {
                setMissionDetails(e.target.value);
                setError("");
              }}
              disabled={useRandom}
              className="rounded-md px-4 py-2 w-full text-white bg-white/10 placeholder:text-white/50 disabled:opacity-50 border border-white/20 focus:outline-none focus:border-purple-400"
            />

            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={selectRandomMission}
              className="text-white/80 text-sm flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>🎲</span> Mission aléatoire
            </button>

            <div className="flex items-center">
              <label className="text-white/80 text-sm mr-2">
                Idée surprise
              </label>
              <div
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                  useRandom ? "bg-purple-600" : "bg-white/20"
                }`}
                onClick={handleToggleRandom}
              >
                <div
                  className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all ${
                    useRandom ? "right-1" : "left-1"
                  }`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 w-full max-w-md mt-8">
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
          disabled={!selectedMission}
          className={`w-full sm:w-auto px-6 py-3 rounded-full text-white text-lg font-bold shadow-md transition ${
            !selectedMission
              ? "bg-gray-400/50 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
          }`}
          whileHover={selectedMission ? { scale: 1.05 } : {}}
          whileTap={selectedMission ? { scale: 0.95 } : {}}
        >
          Continuer
        </motion.button>
      </div>
    </div>
  );
}
