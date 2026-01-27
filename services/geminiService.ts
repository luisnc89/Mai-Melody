
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Helper function for exponential backoff retries.
 * Useful for handling "Quota Exceeded" (429) errors.
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 2000
): Promise<T> {
  let delay = initialDelay;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isQuotaError = error?.message?.includes('429') || error?.message?.includes('quota');
      if (isQuotaError && i < maxRetries - 1) {
        console.warn(`Quota exceeded. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

export const getGeminiChatResponse = async (userPrompt: string, language: string = 'es'): Promise<string> => {
  return retryWithBackoff(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Localized context strings for the prompt
    const langContext = {
      es: "Responde siempre en ESPAÑOL.",
      en: "Always respond in ENGLISH.",
      fr: "Répondez toujours en FRANÇAIS.",
      it: "Rispondi sempre in ITALIANO.",
      ca: "Respon sempre en CATALÀ."
    }[language] || "Responde en el idioma del usuario.";

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `Eres Mai, asistente de MaiMelody. ${langContext}
          REGLAS CRÍTICAS DE RESPUESTA:
          1. BREVEDAD EXTREMA: No escribas más de 2 o 3 frases cortas por respuesta.
          2. ESTRUCTURA: Usa saltos de línea dobles entre ideas. Usa viñetas (•) para listas.
          3. ESTILO: Cálida pero directa. Evita párrafos largos.
          4. SOBRE EL SERVICIO: 
             - Paso 1: Rellenas formulario y eliges pack.
             - Paso 2: Pagas de forma segura.
             - Paso 3: Revisas la letra que te enviamos.
             - Paso 4: Recibes canciones/vídeo.
             - Paso 5: ¡A regalar!
          5. PRECIOS: Básico (29€), Emoción (39€), Artístico (49€).`,
      }
    });
    return response.text || "Error.";
  });
};

export const transformImageToArt = async (base64Image: string): Promise<string | null> => {
  return retryWithBackoff(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: 'Transform this photo into a beautiful artistic illustration. Use a style like watercolor, digital painting, or soft pencil sketch.',
          },
        ],
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }
    return null;
  });
};
