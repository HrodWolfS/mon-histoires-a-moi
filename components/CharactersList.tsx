import { useCharacterStore } from "@/lib/stores/character";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Emotion = "brave" | "shy" | "scared" | "curious" | "happy" | "sad";
type CharacterListProps = {
  selectable?: boolean;
  onSelect?: (id: string) => void;
  showDelete?: boolean;
  selectedId?: string | null;
};

const emotions: Record<Emotion, { label: string; icon: string }> = {
  brave: { label: "Courageux", icon: "👑" },
  shy: { label: "Timide", icon: "🙈" },
  scared: { label: "Effrayé", icon: "😨" },
  curious: { label: "Curieux", icon: "🧐" },
  happy: { label: "Joyeux", icon: "😄" },
  sad: { label: "Triste", icon: "😢" },
};

export function CharactersList({
  selectable = false,
  onSelect,
  showDelete = true,
  selectedId = null,
}: CharacterListProps) {
  const router = useRouter();
  const characters = useCharacterStore((state) => state.characters);
  const removeCharacter = useCharacterStore((state) => state.removeCharacter);
  const selectCharacter = useCharacterStore((state) => state.selectCharacter);
  const storeSelectedId = useCharacterStore(
    (state) => state.selectedCharacterId
  );

  // Utiliser le selectedId passé en props ou celui du store
  const effectiveSelectedId =
    selectedId !== null ? selectedId : storeSelectedId;

  // Gestionnaire pour la sélection d'un personnage
  const handleSelect = (id: string) => {
    if (!selectable) return;

    // Mettre à jour la sélection dans le store
    selectCharacter(id);

    // Appeler le callback si fourni
    if (onSelect) {
      onSelect(id);
    } else {
      // Navigation par défaut si pas de callback
      router.push("/create/step-2");
    }
  };

  if (characters.length === 0) {
    return (
      <div className="text-center text-white/70 py-4">
        Aucun personnage créé pour l&apos;instant
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
            className={`flex items-center justify-between gap-3 py-2 border-b border-white/20 last:border-0 ${
              selectable
                ? "cursor-pointer hover:bg-white/10 rounded-lg transition-colors px-2"
                : ""
            } ${
              effectiveSelectedId === char.id
                ? "bg-white/20 rounded-lg border-l-4 border-l-purple-500 pl-2"
                : ""
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onClick={selectable ? () => handleSelect(char.id) : undefined}
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
                  className={`w-10 h-10 rounded-full relative z-10 ${
                    effectiveSelectedId === char.id
                      ? "ring-2 ring-purple-500"
                      : ""
                  }`}
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

            {showDelete && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  removeCharacter(char.id);
                }}
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
            )}

            {selectable && effectiveSelectedId === char.id && (
              <div className="text-green-400 text-xs font-medium ml-2 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Sélectionné
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {!characters.length && (
        <div className="text-center py-8 text-white/80">
          <p>Tu n&apos;as pas encore créé de personnage.</p>
        </div>
      )}
    </div>
  );
}
