export const getOpenAIApiKey = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("openai-api-key");
};
