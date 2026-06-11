import { ChatGroq } from "@langchain/groq";

export const createModel = (apiKey: string) => {
  return new ChatGroq({
    apiKey,
    model: "llama-3.3-70b-versatile",
  });
};
