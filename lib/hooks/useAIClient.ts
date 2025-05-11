import { OpenAI } from "openai";
import { useMemo } from "react";

// Helper function to make requests to OpenAI API
async function request<T = unknown>(
  endpoint: string,
  body: unknown,
  apiKey: string
): Promise<T> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  let response;
  if (endpoint === "chat.completions.create") {
    response = await openai.chat.completions.create(
      body as OpenAI.ChatCompletionCreateParamsNonStreaming
    );
  } else if (endpoint === "images.generate") {
    response = await openai.images.generate(body as OpenAI.ImageGenerateParams);
  } else if (endpoint === "audio.speech.create") {
    response = await openai.audio.speech.create(
      body as OpenAI.Audio.SpeechCreateParams
    );
  } else {
    throw new Error(`Unsupported OpenAI endpoint: ${endpoint}`);
  }
  return response as T;
}

// Fonction de vérification si on est côté client
const isClient = () => typeof window !== "undefined";

// Fonction sécurisée pour accéder à localStorage
const getApiKey = () => {
  if (!isClient()) return "";
  return localStorage.getItem("openai-api-key") || "";
};

export function useAIClient() {
  const apiKey = getApiKey();

  // Memoize the client to avoid re-creating it on every render
  const client = useMemo(() => {
    if (!isClient() || !apiKey) {
      return null; // No API key, no client
    }

    return {
      generateStory: async (prompt: string) => {
        try {
          const response =
            await request<OpenAI.Chat.Completions.ChatCompletion>(
              "chat.completions.create",
              {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
                max_tokens: 2000,
              },
              apiKey
            );
          return response.choices[0].message.content;
        } catch (_e: unknown) {
          console.error("Error generating story:", _e);
          // Handle specific error types if needed
          // if (e instanceof OpenAI.APIError) { ... }
          return null;
        }
      },

      generateImage: async (prompt: string) => {
        try {
          const response = await request<OpenAI.Images.ImagesResponse>(
            "images.generate",
            {
              model: "dall-e-3",
              prompt: prompt,
              n: 1,
              size: "1024x1024", // or "1024x1792", "1792x1024"
              quality: "standard", // or "hd"
              response_format: "url", // or "b64_json"
            },
            apiKey
          );
          return response.data?.[0]?.url || null;
        } catch (_e: unknown) {
          console.error("Error generating image:", _e);
          return null;
        }
      },

      generateSpeech: async (text: string) => {
        try {
          const response = await request<Response>(
            "audio.speech.create",
            {
              model: "tts-1",
              input: text,
              voice: "nova", // alloy, echo, fable, onyx, nova, shimmer
              response_format: "mp3", // default opus
            },
            apiKey
          );
          return response.blob(); // Returns a Blob
        } catch (_e: unknown) {
          console.error("Error generating speech:", _e);
          return null;
        }
      },
    };
  }, [apiKey]);

  return client;
}
