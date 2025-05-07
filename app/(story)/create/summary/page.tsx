"use client";
import { useCharacterStore } from "@/lib/stores/character";
import { useWizardStore } from "@/lib/stores/wizard";
import { useRouter } from "next/navigation";

export default function SummaryPage() {
  const router = useRouter();
  const getSelectedCharacter = useCharacterStore((s) => s.getSelectedCharacter);
  const character = getSelectedCharacter();
  const { mission, missionDetails, location, locationDetails, morale } =
    useWizardStore();

  if (!character) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-blue-900 to-purple-700 relative">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/background.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[-9]" />
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl max-w-lg w-full flex flex-col items-center mt-16">
        <h1 className="text-4xl font-bold text-white mb-6 font-fredoka text-center">
          Résumé de ton histoire
        </h1>
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={`/images/${character.gender}.png`}
            alt={character.name}
            className="w-20 h-20 rounded-full border-2 border-white"
          />
          <div className="text-white text-xl font-bold">{character.name}</div>
          <div className="text-white/80">
            {character.age} ans • {character.emotion}
          </div>
        </div>
        <div className="w-full text-white/90 mb-4">
          <div className="mb-2">
            <span className="font-bold">Mission :</span> {mission}
            {missionDetails ? ` ${missionDetails}` : ""}
          </div>
          <div className="mb-2">
            <span className="font-bold">Lieu :</span> {location}
            {locationDetails ? `, ${locationDetails}` : ""}
          </div>
          <div className="mb-2">
            <span className="font-bold">Morale :</span>{" "}
            {morale ? (
              morale
            ) : (
              <span className="italic text-white/60">Aucune</span>
            )}
          </div>
        </div>
        <button
          className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-bold shadow-md hover:scale-105 transition"
          onClick={() => router.push("/create/story")}
        >
          Générer mon histoire
        </button>
      </div>
    </div>
  );
}
