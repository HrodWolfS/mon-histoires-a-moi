"use client";
import { useAIClient } from "@/lib/hooks/useAIClient";
import { useCharacterStore } from "@/lib/stores/character";
import { useWizardStore } from "@/lib/stores/wizard";
import { useCallback, useEffect, useRef, useState } from "react";

// Fonction de vérification si on est côté client
const isClient = () => typeof window !== "undefined";

export type StorySection = {
  title: string;
  content: string;
};

export function useStoryGenerator() {
  const client = useAIClient();
  const getSelectedCharacter = useCharacterStore((s) => s.getSelectedCharacter);
  const hydrated = useCharacterStore((s) => s.hydrated);
  const resetTheme = useWizardStore((s) => s.resetTheme);
  const { mission, missionDetails, location, locationDetails, morale } =
    useWizardStore((s) => s);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<unknown>(null);
  const generationInProgress = useRef(false);

  useEffect(() => {
    if (!isClient()) return;

    if (hydrated) {
      const selectedCharacter = getSelectedCharacter();
      setCharacter(selectedCharacter);
    }
  }, [hydrated, getSelectedCharacter]);

  const missionRef = useRef(mission);
  const missionDetailsRef = useRef(missionDetails);
  const locationRef = useRef(location);
  const locationDetailsRef = useRef(locationDetails);
  const moraleRef = useRef(morale);

  useEffect(() => {
    missionRef.current = mission;
    missionDetailsRef.current = missionDetails;
    locationRef.current = location;
    locationDetailsRef.current = locationDetails;
    moraleRef.current = morale;
  }, [mission, missionDetails, location, locationDetails, morale]);

  const generateStory = useCallback(async (): Promise<
    StorySection[] | null
  > => {
    if (!isClient() || generationInProgress.current) {
      console.log("Génération déjà en cours ou environnement serveur, ignorée");
      return null;
    }

    setLoading(true);
    setError(null);
    generationInProgress.current = true;

    try {
      if (!hydrated) {
        setError(
          "Chargement des données du personnage en cours, veuillez patienter..."
        );
        setLoading(false);
        generationInProgress.current = false;
        return null;
      }

      if (!client) {
        setError("Clé API OpenAI manquante ou invalide");
        setLoading(false);
        generationInProgress.current = false;
        return null;
      }

      const currentCharacter = getSelectedCharacter();
      console.log("generateStory - Personnage utilisé:", currentCharacter);

      if (
        !currentCharacter ||
        typeof currentCharacter.name !== "string" ||
        typeof currentCharacter.age !== "number" ||
        !["boy", "girl"].includes(currentCharacter.gender as string)
      ) {
        setError("Les informations du personnage sont incomplètes.");
        console.log("Données du personnage invalides:", { currentCharacter });
        setLoading(false);
        generationInProgress.current = false;
        return null;
      }

      const characterName = currentCharacter.name;
      const characterAge = currentCharacter.age;
      const characterGender = currentCharacter.gender;

      const formattedLocation =
        locationRef.current === "Crée ton lieu"
          ? locationDetailsRef.current || "un lieu mystérieux"
          : `${locationRef.current}${
              locationDetailsRef.current
                ? `, ${locationDetailsRef.current}`
                : ""
            }`;

      const formattedMission =
        missionDetailsRef.current && missionDetailsRef.current !== "non précisé"
          ? `${missionRef.current} : ${missionDetailsRef.current}`
          : missionRef.current;

      const prompt = `
Tu es un auteur d'histoires pour enfants. Crée une histoire captivante et immersive adaptée à un enfant de ${characterAge} ans.

PERSONNAGE PRINCIPAL :
- Nom : ${characterName}
- Âge : ${characterAge} ans
- Genre : ${characterGender === "boy" ? "garçon" : "fille"}

ÉLÉMENTS DE L'HISTOIRE :
- Mission principale : ${formattedMission}
- Lieu de l'aventure : ${formattedLocation}
$${
        moraleRef.current
          ? `- Morale/leçon à inclure : ${moraleRef.current}`
          : "- Pas de morale spécifique requise"
      }

INSTRUCTIONS PRÉCISES :
1. L'histoire doit être divisée en exactement 5 parties, chacune avec un titre et un contenu
2. La narration doit être adaptée à l'âge de l'enfant (${characterAge} ans)
3. Utilise un langage vivant et des descriptions immersives
4. Chaque partie doit faire entre 4 et 6 phrases maximum
5. Crée une aventure magique et positive qui captivera l'imagination de l'enfant
6. Inclure des éléments de surprise et d'émerveillement

STRUCTURE OBLIGATOIRE DE LA RÉPONSE (format JSON uniquement) :
[
  {
    "title": "Titre de la partie 1",
    "content": "Contenu narratif de la partie 1"
  },
  {
    "title": "Titre de la partie 2",
    "content": "Contenu narratif de la partie 2"
  },
  ... jusqu'à la partie 5
]

IMPORTANT :
- Ta réponse DOIT être uniquement un tableau JSON valide sans autre texte
- N'ajoute pas de commentaires ou d'explications, seulement le JSON
- Chaque partie doit avoir une vraie progression narrative
- Assure-toi que le texte est approprié pour un enfant de ${characterAge} ans
`;

      const text = await client.generateStory(prompt);
      if (!text) {
        setError("Erreur lors de la génération de l'histoire");
        return null;
      }

      try {
        const parsed = JSON.parse(text);
        resetTheme();
        return parsed;
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        setError(
          "Le format de l'histoire n'est pas valide. Veuillez réessayer."
        );
        return null;
      }
    } catch (e: unknown) {
      console.error("Erreur lors de la génération:", e);
      setError(
        e instanceof Error ? e.message : "Erreur de génération de l'histoire"
      );
      return null;
    } finally {
      setLoading(false);
      generationInProgress.current = false;
    }
  }, [client, getSelectedCharacter, hydrated, resetTheme]);

  return { generateStory, loading, error, hydrated, character };
}
