import { motion } from "framer-motion";
import { useRef } from "react";

export interface WheelSelectorProps<T> {
  items: T[]; // Éléments à afficher dans la roue
  selectedIndex: number; // Index actuellement sélectionné
  onChange: (index: number) => void; // Callback quand on sélectionne un élément
  renderItem: (item: T, selected: boolean) => React.ReactNode; // Comment afficher chaque élément
  itemHeight?: number; // Hauteur d'un élément (par défaut : 70px)
  className?: string; // Classes utilitaires externes
}

export function WheelSelector<T>({
  items,
  selectedIndex,
  onChange,
  renderItem,
  itemHeight = 70,
  className = "",
}: WheelSelectorProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleItems = 3; // Nombre d'éléments visibles à la fois
  const containerHeight = itemHeight * visibleItems;

  // Calculer le décalage pour centrer l'élément sélectionné
  const calculateOffset = () => {
    // Décalage pour centrer l'élément sélectionné
    const centerOffset = (containerHeight - itemHeight) / 2;
    // Position basée sur l'index sélectionné
    const positionOffset = selectedIndex * itemHeight;

    return centerOffset - positionOffset;
  };

  // Fonction pour déplacer la sélection vers le haut ou le bas
  const handleWheel = (direction: "up" | "down") => {
    if (direction === "up" && selectedIndex > 0) {
      onChange(selectedIndex - 1);
    } else if (direction === "down" && selectedIndex < items.length - 1) {
      onChange(selectedIndex + 1);
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-full space-x-6 ${className}`}
    >
      <motion.button
        onClick={() => handleWheel("up")}
        className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-md"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.4)" }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </motion.button>

      <div
        className="relative overflow-hidden bg-white/20 backdrop-blur-md rounded-xl shadow-xl"
        ref={containerRef}
        style={{
          height: containerHeight,
          width: "90vw",
          maxWidth: 400,
        }}
      >
        <div
          className="absolute left-0 w-full transition-transform duration-300"
          style={{
            transform: `translateY(${calculateOffset()}px)`,
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              data-testid={typeof item === "number" ? `age-${item}` : undefined}
              className="flex items-center justify-center w-full transition-all cursor-pointer px-4"
              style={{
                height: itemHeight,
                opacity: selectedIndex === index ? 1 : 0.5,
                transform:
                  selectedIndex === index ? "scale(1.1)" : "scale(0.9)",
              }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
              onClick={() => onChange(index)}
            >
              {renderItem(item, selectedIndex === index)}
            </motion.div>
          ))}
        </div>

        {/* Indicateur visuel pour l'élément sélectionné */}
        <div
          className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 pointer-events-none z-10 bg-gradient-to-r from-white/5 via-white/20 to-white/5"
          style={{ height: itemHeight }}
        />

        {/* Effet d'ombrage en haut et en bas pour créer un effet de profondeur */}
        <div className="absolute inset-x-0 top-0 h-[40px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[40px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <motion.button
        onClick={() => handleWheel("down")}
        className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-md"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.4)" }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.button>
    </div>
  );
}
