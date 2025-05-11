"use client";

import {
  CharacterDraft,
  CreateCharacterFlow,
} from "@/components/character-flow/CreateCharacterFlow";
import { useCharacterStore } from "@/lib/stores/character";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const resetCurrentCharacter = useCharacterStore(
    (state) => state.resetCurrentCharacter
  );

  useEffect(() => {
    // S'assurer que le store est réinitialisé lorsqu'on démarre à cette étape
    resetCurrentCharacter();
  }, []); // Pas de dépendances pour n'exécuter qu'une seule fois au montage

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleComplete = (character: CharacterDraft) => {
    // La navigation sera gérée dans le composant SlideEmotion
    // Le store s'occupe déjà de sauvegarder les données
    router.push("/create/step-2");
  };

  return <CreateCharacterFlow onComplete={handleComplete} />;
}
