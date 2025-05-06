import { useCharacterStore } from "@/lib/stores/character";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Emotion = "brave" | "shy" | "scared" | "curious" | "happy" | "sad";

type SlideEmotionProps = {
  onNext: (emotion: string) => void;
  onBack: () => void;
  gender: "boy" | "girl";
  name: string;
  age: number;
};

export function SlideEmotion({
  onNext,
  onBack,
  gender,
  name,
  age,
}: SlideEmotionProps) {
  const router = useRouter();

  // Utilisation du store pour gérer l'émotion
  const setEmotion = useCharacterStore((state) => state.setEmotion);
  const saveCharacter = useCharacterStore((state) => state.saveCharacter);
  const resetCurrentCharacter = useCharacterStore(
    (state) => state.resetCurrentCharacter
  );
  const currentEmotion = useCharacterStore(
    (state) => state.currentCharacter.emotion
  );
  const characters = useCharacterStore((state) => state.characters);

  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(
    (currentEmotion as Emotion) || null
  );
  const [isCompleted, setIsCompleted] = useState(false);
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

  const emotions = [
    {
      id: "brave" as Emotion,
      label: "Courageux",
      color: "bg-orange-400/70 border-orange-300 text-white",
      icon: "👑",
    },
    {
      id: "shy" as Emotion,
      label: "Timide",
      color: "bg-purple-400/70 border-purple-300 text-white",
      icon: "🙈",
    },
    {
      id: "scared" as Emotion,
      label: "Effrayé",
      color: "bg-blue-400/70 border-blue-300 text-white",
      icon: "😨",
    },
    {
      id: "curious" as Emotion,
      label: "Curieux",
      color: "bg-yellow-400/70 border-yellow-300 text-white",
      icon: "🧐",
    },
    {
      id: "happy" as Emotion,
      label: "Joyeux",
      color: "bg-green-400/70 border-green-300 text-white",
      icon: "😄",
    },
    {
      id: "sad" as Emotion,
      label: "Triste",
      color: "bg-red-400/70 border-red-300 text-white",
      icon: "😢",
    },
  ];

  // Fonction pour gérer la complétion du personnage
  const handleComplete = () => {
    if (selectedEmotion) {
      // Mettre à jour l'émotion dans le store
      setEmotion(selectedEmotion);

      // Lancer les confettis
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Sauvegarder le personnage
      saveCharacter();

      // Marquer comme complété
      setIsCompleted(true);

      // Appeler la fonction de complétion
      onNext(selectedEmotion);
    }
  };

  // Fonction pour créer un autre personnage
  const handleCreateAnother = () => {
    resetCurrentCharacter();
    // Revenir à l'étape initiale (gender)
    router.push("/create/step-1");
  };

  // Fonction pour continuer vers l'étape suivante
  const handleContinueToNextStep = () => {
    router.push("/create/step-2");
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      {/* Étoiles flottantes */}
      <div className="absolute inset-0 pointer-events-none">
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
      </div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] font-fredoka mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Mon Histoire à Moi
      </motion.h1>

      {!isCompleted ? (
        <>
          <motion.div
            className="flex flex-col items-center mb-4"
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
              <div className="text-white">
                <div className="text-xl font-bold">{name}</div>
                <div className="text-sm">{age} ans</div>
              </div>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl font-bold text-white drop-shadow-md mb-4 font-fredoka"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Comment se sent ton personnage ?
          </motion.h2>

          <motion.p
            className="text-lg text-white/90 mb-8 font-quicksand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Choisis un trait de personnalité
          </motion.p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xl md:grid-cols-3 mb-8">
            {emotions.map((emotion, index) => (
              <motion.div
                key={emotion.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer p-4 rounded-2xl shadow-xl border-2 backdrop-blur-md transition-all ${
                  selectedEmotion === emotion.id
                    ? `${emotion.color} border-4 scale-105`
                    : `${emotion.color} opacity-80`
                }`}
                onClick={() => setSelectedEmotion(emotion.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-4xl">{emotion.icon}</span>
                  </div>
                  <span className="font-bold text-center text-lg">
                    {emotion.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between space-x-4 w-full max-w-md">
            <motion.button
              onClick={onBack}
              className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-lg font-medium shadow-md hover:bg-white/30 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retour
            </motion.button>

            <motion.button
              onClick={handleComplete}
              disabled={!selectedEmotion}
              className={`px-6 py-3 rounded-full text-white text-lg font-bold shadow-md transition ${
                !selectedEmotion
                  ? "bg-white/10 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
              }`}
              whileHover={selectedEmotion ? { scale: 1.05 } : {}}
              whileTap={selectedEmotion ? { scale: 0.95 } : {}}
            >
              Terminer
            </motion.button>
          </div>
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-5xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ✨
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-4 font-fredoka">
            Personnage créé avec succès!
          </h2>

          <div className="flex flex-col md:flex-row gap-4 items-center bg-white/10 backdrop-blur-md p-6 rounded-xl mb-6">
            <img
              src={`/images/${gender}.png`}
              alt={name}
              className="w-20 h-20 rounded-xl"
            />
            <div className="text-white">
              <div className="text-xl font-bold">{name}</div>
              <div className="flex items-center gap-2">
                <span>{age} ans</span>
                <span>•</span>
                <span>
                  {emotions.find((e) => e.id === selectedEmotion)?.label || ""}
                </span>
              </div>
            </div>
          </div>

          {/* Affichage de tous les personnages créés */}
          {characters.length > 1 && (
            <div className="w-full max-w-md mb-6">
              <h3 className="text-xl font-bold text-white mb-3">
                Personnages créés ({characters.length})
              </h3>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-h-40 overflow-y-auto">
                {characters.map((char) => (
                  <div
                    key={char.id}
                    className="flex items-center gap-3 py-2 border-b border-white/20 last:border-0"
                  >
                    <img
                      src={`/images/${char.gender}.png`}
                      alt={char.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-white">
                      <div className="font-medium">{char.name}</div>
                      <div className="text-xs opacity-80">
                        {char.age} ans •{" "}
                        {emotions.find((e) => e.id === char.emotion)?.label ||
                          ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
            <motion.button
              onClick={handleCreateAnother}
              className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-lg font-medium shadow-md hover:bg-white/30 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Créer un autre personnage
            </motion.button>

            <motion.button
              onClick={handleContinueToNextStep}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg font-bold shadow-md hover:scale-105 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continuer l'histoire
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
