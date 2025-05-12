import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function FeedbackModal({
  open,
  onClose,
  onNoThanks,
}: {
  open: boolean;
  onClose: () => void;
  onNoThanks: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative mx-4 max-w-sm rounded-3xl bg-white/10 p-8 text-center text-white backdrop-blur-lg shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-white/70 hover:text-white"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-4 text-2xl font-bold">
              💛 Merci d&apos;avoir lu l&apos;histoire !
            </h2>
            <p className="mb-6">
              Ton avis nous aide à améliorer l&apos;aventure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={process.env.NEXT_PUBLIC_FEEDBACK_URL}
                target="_blank"
                rel="noreferrer"
                className=" rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 font-semibold transform hover:scale-105 transition-all duration-300"
              >
                Donner mon avis
              </a>

              <a
                onClick={onNoThanks}
                data-testid="btn-no-thanks"
                className="text-white hover:text-white/40 px-2 py-2 underline cursor-pointer"
              >
                Non merci
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
