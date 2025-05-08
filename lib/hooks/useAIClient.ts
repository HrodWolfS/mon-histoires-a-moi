import { useCallback } from "react";

export function useAIClient() {
  const request = useCallback(
    async <T = any>(
      path: string,
      body: Record<string, any>,
      method: "POST" | "GET" = "POST"
    ): Promise<T> => {
      const apiKey = localStorage.getItem("openai-api-key");

      if (!apiKey) {
        throw new Error("Clé API OpenAI non fournie");
      }

      const response = await fetch(`https://api.openai.com/v1/${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: method === "POST" ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const status = response.status;

        if (status === 401) {
          throw new Error("Clé API invalide (401)");
        } else if (status === 429) {
          throw new Error("Trop de requêtes – limite atteinte (429)");
        } else {
          throw new Error(error?.error?.message || `Erreur API (${status})`);
        }
      }

      return response.json();
    },
    []
  );

  return { request };
}
