"use client";

import { AudioButton } from "@/components/ui/AudioButton";
import { Button } from "@/components/ui/button";
import FeedbackModal from "@/components/ui/FeedbackModal";
import { useStoryStore } from "@/lib/stores/story";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StoryReaderPage() {
  const router = useRouter();
  const { story, currentPage, nextPage, prevPage, resetStory } =
    useStoryStore();
  const [showFeedback, setShowFeedback] = useState(false);

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

  const handleNewStory = () => {
    setShowFeedback(true);
  };

  const handleCloseModal = () => {
    setShowFeedback(false);
  };

  const handleNoThanks = () => {
    setShowFeedback(false);
    handleReset();
  };

  return (
    <>
      <div
        className="min-h-dvh overflow-hidden flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: "url(/images/background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="w-full max-w-[1000px] mx-auto px-4 md:px-8 xl:px-12 py-6 md:py-10"
          data-testid="reader-root"
        >
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
              <div className="w-full mt-8 sm:mt-10 flex items-center">
                {/* ← Précédent */}
                <Button
                  onClick={prevPage}
                  disabled={isFirstPage}
                  variant={isFirstPage ? "ghost" : "kids"}
                  size="icon"
                  className={cn(
                    "md:px-6 md:py-3 md:w-auto md:h-auto md:rounded-full",
                    isFirstPage && "opacity-0 cursor-default"
                  )}
                  data-testid="arrow-prev"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">Page précédente</span>
                </Button>

                {/* 🔊 Audio */}
                <div className="flex-1 flex justify-center items-center">
                  <AudioButton text={current.content} data-testid="btn-audio" />
                </div>

                {/* → Suivant / Nouvelle histoire */}
                {isLastPage ? (
                  <Button
                    onClick={handleNewStory}
                    data-testid="btn-new-story"
                    variant="success"
                    size="icon"
                    className="md:px-6 md:py-3 md:w-auto md:h-auto md:rounded-full"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden md:inline ml-2">
                      Nouvelle histoire
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={nextPage}
                    variant="kids"
                    size="icon"
                    className="md:px-6 md:py-3 md:w-auto md:h-auto md:rounded-full"
                    data-testid="arrow-next"
                  >
                    <span className="hidden md:inline mr-2">Page suivante</span>
                    <ArrowRight className="w-4 h-4" />
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

          {/* Lien discret pour donner un avis */}
          {isLastPage && (
            <div className="text-center mt-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFeedback(true);
                }}
                className="text-sm text-white/70 underline hover:text-white"
              >
                Donner mon avis
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Modal de remerciement et feedback */}
      <FeedbackModal
        open={showFeedback}
        onClose={handleCloseModal}
        onNoThanks={handleNoThanks}
      />
    </>
  );
}
