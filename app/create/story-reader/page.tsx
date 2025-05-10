"use client";

import { AudioButton } from "@/components/ui/AudioButton";
import { Button } from "@/components/ui/button";
import { useStoryStore } from "@/lib/stores/story";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StoryReaderPage() {
  const router = useRouter();
  const { story, currentPage, nextPage, prevPage, resetStory } =
    useStoryStore();

  // Redirection si pas d'histoire disponible
  useEffect(() => {
    if (!story || story.length === 0) {
      router.push("/");
    }
  }, [story, router]);

  if (!story || story.length === 0) {
    return null;
  }

  const current = story[currentPage];
  const isLastPage = currentPage === story.length - 1;
  const isFirstPage = currentPage === 0;

  const handleReset = () => {
    resetStory();
    router.push("/");
  };

  return (
    <div
      className="min-h-dvh overflow-hidden flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 xl:px-12 py-6 md:py-10">
        {/* Pagination et progression */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-white/70">
            Page {currentPage + 1} sur {story.length}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-white/70 hover:text-white"
            >
              <Home className="w-4 h-4 mr-1" />
              Accueil
            </Button>
          </div>
        </div>

        {/* Contenu principal avec animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 mb-6"
          >
            <div className="mb-8">
              <motion.h2
                className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-fredoka text-center font-bold text-yellow-300 drop-shadow-sm mb-4 sm:mb-6"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {current.title.replace(/^Partie \d+\s*:\s*/, "")}
              </motion.h2>

              <motion.div
                className="text-lg leading-relaxed text-white space-y-4"
                initial={{ y: 10, opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {current.content.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-3">
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            </div>

            {/* Navigation entre pages */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-8 sm:mt-10 gap-3 sm:gap-0 relative">
              <Button
                variant={isFirstPage ? "ghost" : "kids"}
                onClick={prevPage}
                disabled={isFirstPage}
                className={`w-full sm:w-auto ${
                  isFirstPage ? "opacity-0 cursor-default" : ""
                }`}
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="hidden sm:inline">Page précédente</span>
              </Button>

              {/* Centrage absolu pour le bouton audio, ajuster pour mobile si nécessaire */}
              <div className="order-first sm:order-none sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                <AudioButton text={current.content} />
              </div>

              {isLastPage ? (
                <Button
                  variant="success"
                  onClick={handleReset}
                  className="w-full sm:w-auto sm:ml-auto"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="hidden sm:inline">Nouvelle histoire</span>
                </Button>
              ) : (
                <Button
                  variant="kids"
                  onClick={nextPage}
                  className="w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Page suivante</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicateurs de page */}
        <div className="flex justify-center gap-2 mt-6">
          {story.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Aller à la page ${idx + 1}`}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentPage
                  ? "bg-yellow-300 scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => useStoryStore.getState().setCurrentPage(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
