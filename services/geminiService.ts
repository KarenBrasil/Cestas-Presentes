import { GoogleGenAI } from "@google/genai";

export const generateGiftMessage = async (
  recipient: string,
  occasion: string,
  tone: string,
  extraDetails: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return "Erro: Chave de API não configurada. Por favor, escreva sua mensagem manualmente.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Escreva uma mensagem curta e emocionante para um cartão de presente.
    Destinatário: ${recipient}
    Ocasião: ${occasion}
    Tom da mensagem: ${tone}
    Detalhes extras: ${extraDetails}
    
    A mensagem deve ter no máximo 300 caracteres. Seja criativo e toque o coração.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Não foi possível gerar a mensagem.";
  } catch (error) {
    console.error("Error generating message:", error);
    return "Ocorreu um erro ao gerar a mensagem. Tente novamente.";
  }
};
