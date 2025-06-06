import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Fonction de vérification si on est côté client
const isClient = () => typeof window !== "undefined";

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
  hydrated: boolean;

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
  setHydrated: (value: boolean) => void;
  hydrate: () => void;

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
      hydrated: false,

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
            hydrated: true,
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
        if (!isClient()) {
          set({ hydrated: true });
          return;
        }

        const stored = localStorage.getItem("character-storage");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            set({ ...parsed.state, hydrated: true });
          } catch (error) {
            console.error("Failed to parse stored characters:", error);
            set({ hydrated: true }); // Même en cas d'erreur, considérer comme hydraté
          }
        } else {
          set({ hydrated: true }); // Pas de données stockées, mais hydratation terminée
        }
      },

      hydrate: () => {
        if (!isClient()) {
          set({ hydrated: true });
          return;
        }

        const local = localStorage.getItem("character-storage");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (parsed && parsed.state) {
              const { characters, selectedCharacterId } = parsed.state;

              // Si on a des personnages
              if (Array.isArray(characters) && characters.length > 0) {
                // Trouver le personnage sélectionné ou prendre le premier
                const selectedCharacter = selectedCharacterId
                  ? characters.find((c) => c.id === selectedCharacterId)
                  : characters[0];

                set({
                  characters,
                  selectedCharacterId:
                    selectedCharacterId || characters[0]?.id || null,
                  currentCharacter: selectedCharacter || characters[0] || {},
                  hydrated: true,
                });
              } else {
                set({ hydrated: true });
              }
            } else {
              set({ hydrated: true });
            }
          } catch (error) {
            console.error("Erreur lors de l'hydratation:", error);
            set({ hydrated: true });
          }
        } else {
          set({ hydrated: true });
        }
      },

      setHydrated: (value) => set({ hydrated: value }),

      selectCharacter: (id) => {
        const character = get().characters.find((c) => c.id === id);
        if (character) {
          set({
            selectedCharacterId: id,
            // Met à jour currentCharacter avec les données du personnage sélectionné
            currentCharacter: { ...character },
            hydrated: true,
          });
        }
      },

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
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
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
