import { useCharacterStore } from "@/lib/stores/character";

/**
 * Hook qui vérifie si le personnage actuel est complet
 * @returns boolean indiquant si tous les champs (gender, name, age, emotion) sont remplis
 */
export function useCharacterComplete() {
  const currentCharacter = useCharacterStore((s) => s.currentCharacter);

  return (
    !!currentCharacter.gender &&
    !!currentCharacter.name &&
    typeof currentCharacter.age === "number" &&
    !!currentCharacter.emotion
  );
}

/**
 * Hook qui vérifie si au moins un personnage existe dans le store
 * @returns boolean indiquant si au moins un personnage a été créé
 */
export function useHasCharacters() {
  const characters = useCharacterStore((s) => s.characters);
  return characters.length > 0;
}
