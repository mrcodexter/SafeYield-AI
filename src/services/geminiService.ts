import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface StrategyRecommendation {
  name: string;
  type: string;
  expectedApy: number;
  riskScore: number;
  reasoning: string;
  action: string;
}

export interface RiskAnalysis {
  overallRiskScore: number;
  warnings: string[];
  recommendations: string[];
  marketSentiment: string;
}

export const analyzeStrategies = async (marketData: string): Promise<StrategyRecommendation[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following DeFi market data and recommend 3 optimal yield strategies for SafeYield AI on Pacifica. 
      Market Data: ${marketData}
      
      Return the response as a JSON array of objects with: name, type, expectedApy (number), riskScore (1-10), reasoning, action.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              expectedApy: { type: Type.NUMBER },
              riskScore: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              action: { type: Type.STRING }
            },
            required: ["name", "type", "expectedApy", "riskScore", "reasoning", "action"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Strategy Analysis Error:", error);
    return [];
  }
};

export const getRiskAnalysis = async (positions: any): Promise<RiskAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a deep risk analysis for these DeFi positions: ${JSON.stringify(positions)}.
      Consider liquidation risks, funding rate volatility, and liquidity conditions.
      
      Return JSON: { overallRiskScore (1-100), warnings (string[]), recommendations (string[]), marketSentiment (string) }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRiskScore: { type: Type.NUMBER },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketSentiment: { type: Type.STRING }
          },
          required: ["overallRiskScore", "warnings", "recommendations", "marketSentiment"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Risk Analysis Error:", error);
    return {
      overallRiskScore: 0,
      warnings: ["AI analysis unavailable"],
      recommendations: ["Manual review required"],
      marketSentiment: "Neutral"
    };
  }
};
