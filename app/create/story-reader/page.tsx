"use client";

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
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 text-white"
      style={{
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-3xl">
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
                className="text-3xl font-fredoka text-center text-yellow-300 drop-shadow-sm mb-6"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {current.title}
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
            <div className="flex justify-between mt-10">
              <Button
                variant={isFirstPage ? "ghost" : "kids"}
                onClick={prevPage}
                disabled={isFirstPage}
                className={isFirstPage ? "opacity-0 cursor-default" : ""}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Page précédente
              </Button>
              {isLastPage ? (
                <Button
                  variant="success"
                  onClick={handleReset}
                  className="ml-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Nouvelle histoire
                </Button>
              ) : (
                <Button variant="kids" onClick={nextPage}>
                  Page suivante
                  <ArrowRight className="w-4 h-4 ml-2" />
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
