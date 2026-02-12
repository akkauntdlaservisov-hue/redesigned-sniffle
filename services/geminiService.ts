
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateSiteIdeas = async (businessType: string) => {
  if (!API_KEY) return "AI services are currently offline. Please contact me directly on Telegram.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 unique website project ideas for a business in the ${businessType} industry. Return in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "techStack"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
