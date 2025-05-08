"use client";

import { useCharacterStore } from "@/lib/stores/character";
import { useEffect, useState } from "react";

export default function ClientInit() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Vérifier si l'application a déjà été initialisée
    if (!initialized) {
      try {
        console.log("Initialisation de l'application...");

        // Appeler hydrate pour charger les personnages
        useCharacterStore.getState().hydrate();

        // Vérifier si ça a fonctionné
        const state = useCharacterStore.getState();
        console.log("État après hydrate:", {
          characters: state.characters.length,
          currentCharacter: state.currentCharacter,
          selectedId: state.selectedCharacterId,
          hydrated: state.hydrated,
        });

        setInitialized(true);
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
      }
    }
  }, [initialized]);

  return null;
}
