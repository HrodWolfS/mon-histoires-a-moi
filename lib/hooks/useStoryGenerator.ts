"use client";
import { useAIClient } from "@/lib/hooks/useAIClient";
import { useCharacterStore } from "@/lib/stores/character";
import { useWizardStore } from "@/lib/stores/wizard";
import { useCallback, useState } from "react";

export type StorySection = {
  title: string;
  content: string;
};

export function useStoryGenerator() {
  const { request } = useAIClient();
  const character = useCharacterStore((s) => s.currentCharacter);
  const wizard = useWizardStore((s) => s);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStory = useCallback(async (): Promise<
    StorySection[] | null
  > => {
    setLoading(true);
    setError(null);

    const characterName = character.name;
    const characterAge = character.age;
    const characterGender = character.gender;
    const mission = wizard.mission;
    const location = wizard.location;
    const morale = wizard.morale;

    const prompt = `
Tu es un auteur d'histoires pour enfants. Crée une histoire captivante et immersive adaptée à un enfant de ${characterAge} ans.

PERSONNAGE PRINCIPAL :
- Nom : ${characterName}
- Âge : ${characterAge} ans
- Genre : ${characterGender === "boy" ? "garçon" : "fille"}

ÉLÉMENTS DE L'HISTOIRE :
- Mission principale : ${mission}
- Lieu de l'aventure : ${location}
${
  morale
    ? `- Morale/leçon à inclure : ${morale}`
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

    try {
      const response = await request("chat/completions", {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 1500,
      });

      const text = response.choices?.[0]?.message?.content || "";
      try {
        const parsed = JSON.parse(text);
        return parsed;
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        setError(
          "Le format de l'histoire n'est pas valide. Veuillez réessayer."
        );
        return null;
      }
    } catch (e: any) {
      console.error("Erreur lors de la génération:", e);
      setError(e.message || "Erreur de génération de l'histoire");
      return null;
    } finally {
      setLoading(false);
    }
  }, [request, character, wizard]);

  return { generateStory, loading, error };
}
