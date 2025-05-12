"use client";
import { useCharacterStore } from "@/lib/stores/character";
import { useWizardStore } from "@/lib/stores/wizard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SummaryPage() {
  const router = useRouter();
  const getSelectedCharacter = useCharacterStore((s) => s.getSelectedCharacter);
  const hydrated = useCharacterStore((s) => s.hydrated);
  const character = getSelectedCharacter();
  const { mission, missionDetails, location, locationDetails, morale } =
    useWizardStore();
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'hydratation au chargement
  useEffect(() => {
    if (hydrated) {
      setIsLoading(false);
    }
  }, [hydrated]);

  // Rediriger si aucun personnage n'est sélectionné après hydratation
  useEffect(() => {
    if (hydrated && !character) {
      router.push("/create/step-1");
    }
  }, [hydrated, character, router]);

  if (isLoading) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background.png')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-8 rounded-3xl backdrop-blur-xl bg-white/10 text-white text-center">
          <div className="animate-pulse">
            <h2 className="text-2xl font-bold mb-4">Chargement...</h2>
            <p>Préparation de ton aventure</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-dvh overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      {/* Overlay sombre doux pour lisibilité */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenu centré */}
      <div className="relative z-10 flex items-center justify-center min-h-dvh px-4 md:px-8 xl:px-12 py-6 md:py-10">
        <div className="rounded-3xl backdrop-blur-xl bg-white/10 p-6 md:p-8 max-w-md sm:max-w-lg w-full text-white shadow-lg space-y-6 border border-white/20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 font-fredoka text-center">
            Résumé de ton histoire
          </h1>

          {/* Avatar + Nom */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={`/images/${character?.gender || "boy"}.png`}
              alt={character?.name || "Personnage"}
              className="w-20 h-20 rounded-full border-2 border-white shadow-md"
            />
            <div className="text-xl font-bold">{character?.name}</div>
            <div className="text-sm text-white/80">
              {character?.age} ans • {character?.emotion}
            </div>
          </div>

          {/* Infos */}
          <div className="space-y-5 text-left text-base leading-relaxed w-full">
            <p>
              🎯 <span className="font-semibold">Mission</span> : {mission}
              {missionDetails && (
                <span className="block text-white/70 ml-6">
                  Détails : {missionDetails}
                </span>
              )}
            </p>

            <p>
              📍 <span className="font-semibold">Lieu</span> : {location}
              {locationDetails && (
                <span className="block text-white/70 ml-6">
                  Détails : {locationDetails}
                </span>
              )}
            </p>

            <p>
              💡 <span className="font-semibold">Morale</span> :{" "}
              {morale ? (
                morale
              ) : (
                <span className="italic text-white/60">Aucune</span>
              )}
            </p>
          </div>

          {/* Bouton */}
          <div className="text-center pt-4">
            <button
              className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-xl hover:scale-105 transition"
              onClick={() => router.push("/create/story-loading")}
              data-testid="btn-generate-story"
            >
              Générer mon histoire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
