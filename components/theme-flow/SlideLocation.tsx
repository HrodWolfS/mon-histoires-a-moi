import { useWizardStore } from "@/lib/stores/wizard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type SlideLocationProps = {
  onNext: () => void;
  onBack: () => void;
};

// Lieux disponibles
const locations = [
  {
    emoji: "🪐",
    title: "Espace",
    description: "Flotter parmi les étoiles et les planètes.",
  },
  {
    emoji: "🧚",
    title: "Forêt magique",
    description: "Fées, animaux qui parlent, et mystères enchantés.",
  },
  {
    emoji: "🌋",
    title: "Île volcanique",
    description: "Une terre dangereuse… et fascinante.",
  },
  {
    emoji: "🏙",
    title: "Ville futuriste",
    description: "Robots, voitures volantes et surprises !",
  },
  {
    emoji: "✨",
    title: "Crée ton lieu",
    description: "Tu inventes un endroit magique de A à Z.",
  },
  {
    emoji: "🌌",
    title: "Tu me laisses choisir ?",
    description: "Je vais inventer un monde magique rien que pour toi.",
  },
];

// Dictionnaire d'exemples de détails
const locationPlaceholders: Record<string, string> = {
  Espace: "une planète avec trois lunes roses",
  "Forêt magique": "où les arbres chantent la nuit",
  "Île volcanique": "avec un dragon qui dort dans le volcan",
  "Ville futuriste": "où les maisons peuvent voler",
  "Crée ton lieu": "un monde où tout est fait de bonbons",
  "Tu me laisses choisir ?": "quelque chose de vraiment spécial et unique",
};

// Composant d'étoile flottante
const FloatingStars = () => {
  const [stars, setStars] = useState<
    Array<{
      size: number;
      top: number;
      left: number;
      delay: number;
      duration: number;
      id: number;
    }>
  >([]);

  useEffect(() => {
    // Génération des étoiles uniquement côté client
    const starsArray = Array.from({ length: 15 }).map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      id: i,
    }));

    setStars(starsArray);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-yellow-300 text-opacity-70 z-0"
          style={{ top: `${star.top}%`, left: `${star.left}%` }}
          initial={{ opacity: 0.3, scale: 0.5 }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.7, 1, 0.7],
            rotate: ["0deg", "180deg", "360deg"],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0l2.245 6.91h7.255l-5.745 4.18 2.245 6.91-6-4.18-6 4.18 2.245-6.91-5.745-4.18h7.255z" />
          </svg>
        </motion.div>
      ))}
    </>
  );
};

export function SlideLocation({ onNext, onBack }: SlideLocationProps) {
  // Store pour gérer le choix de lieu
  const addLocation = useWizardStore((state) => state.addLocation);
  const currentLocation = useWizardStore((state) => state.location);
  const currentDetails = useWizardStore((state) => state.locationDetails);
  const mission = useWizardStore((state) => state.mission);

  // États locaux pour le lieu et les détails et options
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    currentLocation
  );
  const [locationDetails, setLocationDetails] = useState<string>(
    currentDetails || ""
  );
  const [useRandomLocation, setUseRandomLocation] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [suggestionTimeout, setSuggestionTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Déterminer si le lieu nécessite des détails ou permet le mode aléatoire
  const isCustomLocation = selectedLocation === "Crée ton lieu";
  const isRandomAllowed = selectedLocation === "Tu me laisses choisir ?";
  const isStandardLocation =
    selectedLocation && !isCustomLocation && !isRandomAllowed;

  // Sélectionner un lieu
  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
    setLocationDetails("");
    setError("");

    // Annuler tout suggestion timeout existant
    if (suggestionTimeout) {
      clearTimeout(suggestionTimeout);
      setSuggestionTimeout(null);
    }

    // Gérer l'option aléatoire automatiquement
    if (location === "Tu me laisses choisir ?") {
      setUseRandomLocation(true);
    } else {
      setUseRandomLocation(false);

      // Configurer un timeout pour suggérer un exemple si c'est un lieu personnalisé
      if (location === "Crée ton lieu") {
        const timeout = setTimeout(() => {
          if (!locationDetails.trim()) {
            setLocationDetails(locationPlaceholders[location] || "");
          }
        }, 5000);
        setSuggestionTimeout(timeout);
      }
    }
  };

  // Basculer l'option aléatoire (uniquement pour "Tu me laisses choisir ?")
  const handleToggleRandom = () => {
    if (isRandomAllowed) {
      setUseRandomLocation(!useRandomLocation);
      setError("");
    }
  };

  // Sélectionner un lieu aléatoire
  const selectRandomLocation = () => {
    // On exclut "Crée ton lieu" et "Tu me laisses choisir ?" pour le choix aléatoire
    const standardLocations = locations.filter(
      (loc) =>
        loc.title !== "Crée ton lieu" && loc.title !== "Tu me laisses choisir ?"
    );
    const randomIndex = Math.floor(Math.random() * standardLocations.length);
    setSelectedLocation(standardLocations[randomIndex].title);
    setLocationDetails("");
    setUseRandomLocation(false);
    setError("");
  };

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (suggestionTimeout) {
        clearTimeout(suggestionTimeout);
      }
    };
  }, [suggestionTimeout]);

  // Quand l'utilisateur continue vers l'étape suivante
  const handleContinue = () => {
    if (selectedLocation) {
      // Validation en fonction du type de lieu sélectionné
      if (isCustomLocation && !locationDetails.trim()) {
        setError("Décris ton lieu magique pour continuer ✨");
        return;
      }

      if (isRandomAllowed && !useRandomLocation) {
        setError("Confirme ton choix en cochant l'option 'Idée surprise' 🎲");
        return;
      }

      if (isStandardLocation && !locationDetails.trim() && !useRandomLocation) {
        setError("Ajoute des détails ou choisis l'option surprise 🎲");
        return;
      }

      // Sauvegarde dans le store
      addLocation(
        selectedLocation,
        useRandomLocation ? null : locationDetails.trim() || null
      );
      onNext();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingStars />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-8 px-4">
        {locations.map((location, index) => (
          <motion.div
            key={location.title}
            className={`cursor-pointer p-6 rounded-xl backdrop-blur-md transition-all transform ${
              selectedLocation === location.title
                ? "bg-cyan-500/40 border-2 border-white scale-105"
                : "bg-white/10 border border-white/20 hover:bg-white/20"
            }`}
            onClick={() => handleSelectLocation(location.title)}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 + 0.6 }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <span className="text-5xl mb-2">{location.emoji}</span>
              <h3 className="font-bold text-white text-xl">{location.title}</h3>
              <p className="text-white/80">{location.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedLocation && (
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-4 mt-4 w-full max-w-md mx-auto transition-all"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Affichage conditionnel du champ de détails */}
          {(isCustomLocation || isStandardLocation) && (
            <div className="mb-3">
              <label
                htmlFor="locationDetails"
                className="text-white text-sm mb-1 block"
              >
                {isCustomLocation
                  ? "Décris ce lieu magique :"
                  : "Ajoute des détails (facultatif) :"}
              </label>
              <input
                id="locationDetails"
                type="text"
                placeholder={`Exemple : ${
                  locationPlaceholders[selectedLocation] ||
                  "donne plus de détails"
                }`}
                value={locationDetails}
                onChange={(e) => {
                  setLocationDetails(e.target.value);
                  setError("");
                }}
                disabled={useRandomLocation && !isCustomLocation}
                className="rounded-md px-4 py-2 w-full text-white bg-white/10 placeholder:text-white/50 disabled:opacity-50 border border-white/20 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

          {/* Affichage conditionnel des options */}
          <div className="flex items-center justify-between">
            {!isCustomLocation && (
              <button
                onClick={selectRandomLocation}
                className="text-white/80 text-sm flex items-center gap-1 hover:text-white transition-colors"
              >
                <span>🎲</span> Lieu aléatoire
              </button>
            )}

            {(isRandomAllowed || isStandardLocation) && (
              <div
                className={`flex items-center ${
                  !isCustomLocation ? "ml-auto" : ""
                }`}
              >
                <label className="text-white/80 text-sm mr-2">
                  {isRandomAllowed ? "Je confirme mon choix" : "Idée surprise"}
                </label>
                <div
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                    useRandomLocation ? "bg-cyan-600" : "bg-white/20"
                  }`}
                  onClick={handleToggleRandom}
                >
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all ${
                      useRandomLocation ? "right-1" : "left-1"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex justify-between w-full max-w-md px-4 mt-8">
        <motion.button
          onClick={onBack}
          className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-lg font-medium shadow-md hover:bg-white/30 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retour
        </motion.button>

        <motion.button
          onClick={handleContinue}
          disabled={!selectedLocation}
          className={`px-6 py-3 rounded-full text-white text-lg font-bold shadow-md transition ${
            !selectedLocation
              ? "bg-gray-400/50 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105"
          }`}
          whileHover={selectedLocation ? { scale: 1.05 } : {}}
          whileTap={selectedLocation ? { scale: 0.95 } : {}}
        >
          Continuer
        </motion.button>
      </div>
    </div>
  );
}
