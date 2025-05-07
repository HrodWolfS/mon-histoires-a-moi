"use client";

import { CreateThemeFlow } from "@/components/theme-flow/CreateThemeFlow";
import { useHasCharacters } from "@/lib/hooks/useCharacterComplete";
import { useCharacterStore } from "@/lib/stores/character";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StepTwo() {
  const router = useRouter();
  const hasCharacters = useHasCharacters();
  const hasSelectedCharacter = useCharacterStore((state) =>
    state.hasSelectedCharacter()
  );

  // Rediriger vers la création de personnage si aucun n'existe
  useEffect(() => {
    if (!hasCharacters) {
      router.push("/create/step-1");
    } else if (!hasSelectedCharacter) {
      // Si des personnages existent mais aucun n'est sélectionné
      router.push("/create/step-1");
    }
  }, [hasCharacters, hasSelectedCharacter, router]);

  const handleComplete = () => {
    // Passer à l'étape de génération d'histoire
    router.push("/create/summary");
  };

  // Ne rien afficher pendant les redirections
  if (!hasCharacters || !hasSelectedCharacter) {
    return null;
  }

  return <CreateThemeFlow onComplete={handleComplete} />;
}
