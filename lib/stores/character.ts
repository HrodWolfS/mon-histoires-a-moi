import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Character = {
  id: string;
  gender: "boy" | "girl";
  name: string;
  age: number;
  emotion: string;
};

type CharacterStore = {
  characters: Character[];
  currentCharacter: Partial<Character>;

  // Actions pour modifier currentCharacter
  setGender: (gender: "boy" | "girl") => void;
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setEmotion: (emotion: string) => void;

  // Actions sur le store
  saveCharacter: () => void;
  resetCurrentCharacter: () => void;
  removeCharacter: (id: string) => void;
  loadFromLocalStorage: () => void;
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],
      currentCharacter: {},

      setGender: (gender) =>
        set((state) => ({
          currentCharacter: { ...state.currentCharacter, gender },
        })),

      setName: (name) =>
        set((state) => ({
          currentCharacter: { ...state.currentCharacter, name },
        })),

      setAge: (age) =>
        set((state) => ({
          currentCharacter: { ...state.currentCharacter, age },
        })),

      setEmotion: (emotion) =>
        set((state) => ({
          currentCharacter: { ...state.currentCharacter, emotion },
        })),

      saveCharacter: () => {
        const current = get().currentCharacter;
        if (
          current.gender &&
          current.name &&
          current.age !== undefined &&
          current.emotion
        ) {
          const newCharacter: Character = {
            id: uuidv4(),
            gender: current.gender,
            name: current.name,
            age: current.age as number,
            emotion: current.emotion,
          };

          set((state) => ({
            characters: [...state.characters, newCharacter],
          }));

          return newCharacter;
        }
        return null;
      },

      resetCurrentCharacter: () => set({ currentCharacter: {} }),

      removeCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter(
            (character) => character.id !== id
          ),
        })),

      loadFromLocalStorage: () => {
        // Cette fonction est automatiquement gérée par persist
        // mais on peut l'utiliser pour forcer le rechargement
        const stored = localStorage.getItem("character-storage");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            set(parsed.state);
          } catch (error) {
            console.error("Failed to parse stored characters:", error);
          }
        }
      },
    }),
    {
      name: "character-storage",
    }
  )
);

// Helper pour vérifier si le personnage actuel est complet
export const useCharacterComplete = () => {
  const currentCharacter = useCharacterStore((s) => s.currentCharacter);

  return (
    !!currentCharacter.gender &&
    !!currentCharacter.name &&
    !!currentCharacter.age &&
    !!currentCharacter.emotion
  );
};
