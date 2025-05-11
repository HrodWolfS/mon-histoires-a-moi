"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApiKeyStore } from "@/lib/stores/apiKey";
import { HelpCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ApiKeyModal = ({ open, onClose }: Props) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setApiKey } = useApiKeyStore();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!input.startsWith("sk-")) return;
    setApiKey(input);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-none bg-gradient-to-b from-indigo-500/90 to-purple-600/90 backdrop-blur-xl shadow-[0_0_15px_5px_rgba(150,120,255,0.3)] rounded-2xl text-white">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-3xl font-fredoka text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            Clé API OpenAI
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </DialogTitle>
        </DialogHeader>
        <p className="text-md text-white/90 mb-4 font-quicksand text-center">
          Cette clé magique permet de générer les histoires.
          <br />
          Elle est stockée <span className="font-bold">localement</span> et{" "}
          <span className="font-bold">n&apos;est envoyée à personne.</span>
        </p>

        <div className="relative flex items-center">
          <Input
            ref={inputRef}
            type="text"
            placeholder="sk-..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            className="pr-10 bg-white/20 border-white/30 placeholder:text-white/60 text-white font-medium rounded-xl h-12 text-lg shadow-inner"
          />
          <button
            onClick={() => window.open("/aide/cle-api", "_blank")}
            className="absolute right-3 text-white hover:text-yellow-300 transition-colors"
            title="Comment obtenir ma clé API ?"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm opacity-80 mb-4">
          Tu n&apos;as besoin de le faire qu&apos;une fois.
        </p>
        <Button
          variant="success"
          size="lg"
          className="mt-6 w-full"
          onClick={handleSubmit}
        >
          Valider
        </Button>
      </DialogContent>
    </Dialog>
  );
};
