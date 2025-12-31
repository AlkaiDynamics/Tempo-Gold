
import { GoogleGenAI, Type } from "@google/genai";
import { ForensicAuditReport } from "../types";

export const generateForensicReport = async (
  query: string,
  context: { uls: string; date: string; debt: string; offset: number }
): Promise<ForensicAuditReport> => {
  // Always initialize GoogleGenAI inside the function to use the most recent process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Perform a Temporal Forensic Audit for the following request: "${query}".
  Context Data:
  - ULS Coordinate: ${context.uls}
  - Institutional Date (Beta): ${context.date}
  - Inherited Debt: ${context.debt}
  - Celestial Offset (Precession): ${context.offset.toFixed(4)} degrees.
  
  Please analyze the "Chronological Contamination" and provide a structured report. Focus on how institutional layers (Beta) distort the original astronomical intent (Alpha).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.NUMBER },
          ulsCoordinate: { type: Type.STRING },
          betaDate: { type: Type.STRING },
          alphaCalculation: { type: Type.STRING },
          inheritedDebt: { type: Type.STRING },
          contaminationFactors: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          celestialOffset: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          sources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                uri: { type: Type.STRING }
              },
              required: ["title", "uri"]
            }
          }
        },
        required: ["timestamp", "ulsCoordinate", "betaDate", "alphaCalculation", "inheritedDebt", "contaminationFactors", "celestialOffset", "summary", "sources"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Empty response from AI engine");
  }

  return JSON.parse(response.text);
};
