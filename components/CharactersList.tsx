import { useCharacterStore } from "@/lib/stores/character";
import { motion } from "framer-motion";

type Emotion = "brave" | "shy" | "scared" | "curious" | "happy" | "sad";

const emotions: Record<Emotion, { label: string; icon: string }> = {
  brave: { label: "Courageux", icon: "👑" },
  shy: { label: "Timide", icon: "🙈" },
  scared: { label: "Effrayé", icon: "😨" },
  curious: { label: "Curieux", icon: "🧐" },
  happy: { label: "Joyeux", icon: "😄" },
  sad: { label: "Triste", icon: "😢" },
};

export function CharactersList() {
  const characters = useCharacterStore((state) => state.characters);
  const removeCharacter = useCharacterStore((state) => state.removeCharacter);

  if (characters.length === 0) {
    return (
      <div className="text-center text-white/70 py-4">
        Aucun personnage créé pour l'instant
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-white mb-3 font-fredoka">
        Personnages créés ({characters.length})
      </h3>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-h-60 overflow-y-auto">
        {characters.map((char) => (
          <motion.div
            key={char.id}
            className="flex items-center justify-between gap-3 py-2 border-b border-white/20 last:border-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
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
                  src={`/images/${char.gender}.png`}
                  alt={char.name}
                  className="w-10 h-10 rounded-full relative z-10"
                />
              </div>

              <div className="text-white">
                <div className="font-medium">{char.name}</div>
                <div className="text-xs opacity-80 flex items-center gap-1">
                  <span>{char.age} ans</span>
                  <span className="opacity-50">•</span>
                  <span className="flex items-center">
                    <span className="mr-1">
                      {emotions[char.emotion as Emotion]?.icon || ""}
                    </span>
                    {emotions[char.emotion as Emotion]?.label || char.emotion}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => removeCharacter(char.id)}
              className="text-white/60 hover:text-white/90 transition-colors p-1 rounded-full hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
