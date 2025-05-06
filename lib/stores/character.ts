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
  selectedCharacterId: string | null;

  // Actions pour modifier currentCharacter
  setGender: (gender: "boy" | "girl") => void;
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setEmotion: (emotion: string) => void;

  // Actions sur le store
  saveCharacter: () => Character | null;
  resetCurrentCharacter: () => void;
  removeCharacter: (id: string) => void;
  loadFromLocalStorage: () => void;

  // Gestion du personnage sélectionné
  selectCharacter: (id: string) => void;
  getSelectedCharacter: () => Character | null;
  hasSelectedCharacter: () => boolean;
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],
      currentCharacter: {},
      selectedCharacterId: null,

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
            selectedCharacterId: newCharacter.id, // Sélectionner automatiquement le nouveau personnage
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
          // Réinitialiser le personnage sélectionné si c'était celui-ci
          selectedCharacterId:
            state.selectedCharacterId === id
              ? state.characters.length > 1
                ? state.characters.find((c) => c.id !== id)?.id || null
                : null
              : state.selectedCharacterId,
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

      // Nouvelles fonctions pour la gestion du personnage sélectionné
      selectCharacter: (id) => set({ selectedCharacterId: id }),

      getSelectedCharacter: () => {
        const { characters, selectedCharacterId } = get();
        if (!selectedCharacterId) return null;
        return characters.find((c) => c.id === selectedCharacterId) || null;
      },

      hasSelectedCharacter: () => {
        const { selectedCharacterId } = get();
        return selectedCharacterId !== null;
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
