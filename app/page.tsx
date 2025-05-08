"use client";

import { ApiKeyModal } from "@/components/ui/ApiKeyModal";
import { useApiKeyStore } from "@/lib/stores/apiKey";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { hasApiKey } = useApiKeyStore();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleStart = () => {
    if (hasApiKey()) {
      router.push("/create/step-1");
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center px-6 py-12 text-center text-white"
      style={{
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg mb-4">
        Bienvenue dans le monde des histoires magiques
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-xl drop-shadow-sm">
        Crée une aventure unique avec ton héros préféré, choisis son nom, son
        caractère, et laisse la magie opérer ✨
      </p>
      <button
        onClick={handleStart}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold shadow-md hover:scale-105 transition"
      >
        Créer une histoire
      </button>
      <ApiKeyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
