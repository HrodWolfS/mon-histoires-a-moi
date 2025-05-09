import { useApiKeyStore } from "@/lib/stores/apiKey";
import { useCallback } from "react";

export function useAIClient() {
  const { apiKey } = useApiKeyStore();

  const request = useCallback(
    async <T = any>(
      endpoint: string,
      body: Record<string, any>,
      method: "POST" | "GET" = "POST"
    ): Promise<T> => {
      if (!apiKey) {
        throw new Error("Clé API OpenAI non fournie");
      }

      const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: method === "POST" ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let errorPayload: any = {};
        try {
          errorPayload = await response.json();
        } catch (e) {
          const errorText = await response.text();
          errorPayload = { error: { message: errorText } };
        }

        const status = response.status;

        if (status === 401) {
          throw new Error("Clé API invalide ou manquante (401)");
        } else if (status === 429) {
          throw new Error("Trop de requêtes – limite atteinte (429)");
        } else {
          throw new Error(
            errorPayload?.error?.message || `Erreur API (${status})`
          );
        }
      }

      if (endpoint === "audio/speech") {
        const blob = await response.blob();
        return blob as T;
      }

      return response.json();
    },
    [apiKey]
  );

  return { request };
}
