"use client";
import { create } from "zustand";

type ApiKeyStore = {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  hasApiKey: () => boolean;
};

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
  apiKey:
    typeof window !== "undefined"
      ? localStorage.getItem("openai-api-key")
      : null,
  setApiKey: (key: string) => {
    localStorage.setItem("openai-api-key", key);
    set({ apiKey: key });
  },
  hasApiKey: () => {
    return !!get().apiKey;
  },
}));
