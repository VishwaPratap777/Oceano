import { GoogleGenAI } from "@google/genai";
import config from "../config/env.js";
import { chat as groqChat } from "./groq.js";

// ── Build System Prompt with real-time data ─────────────────────────────────
function buildSystemPrompt(oceanData) {
  let prompt = `You are Ocean AI, an expert marine science assistant built into the OceanData platform. Your knowledge covers:
- Physical oceanography: currents, tides, waves, thermohaline circulation
- Marine biology, Ocean chemistry, Climate science, Ocean conservation

*CRITICAL IMPORTANCE*: You must use extreme precision because you are providing advice based on REAL-TIME metrics from the Indian coast.

Here are the CURRENT oceanic conditions:
`;

  if (oceanData?.data) {
    const { waveHeight, windSpeed, waterTemperature, airTemperature, currentSpeed } = oceanData.data;
    prompt += `
- Wave Height: ${waveHeight?.value || "N/A"} ${waveHeight?.unit || ""}
- Wind Speed: ${windSpeed?.value || "N/A"} ${windSpeed?.unit || ""}
- Water Temperature: ${waterTemperature?.value || "N/A"} ${waterTemperature?.unit || ""}
- Air Temperature: ${airTemperature?.value || "N/A"} ${airTemperature?.unit || ""}
- Current Speed: ${currentSpeed?.value || "N/A"} ${currentSpeed?.unit || ""}
`;
    // Apply behavior rules
    prompt += `
Behavior Rules:
- If wave height is > 1.5m, emphasize safety warnings about rough seas, surfing caution, swimming risks.
- If wind speed is > 10m/s, mention risks associated with high winds.
- Provide practical, safety-focused, context-aware answers. Do NOT provide generic explanations if the current metrics indicate unsafe conditions. 
- ALWAYS refer to the provided real-time ocean conditions in your response to demonstrate you are context-aware.
- Keep answers concise and strictly actionable.
`;
  } else {
    prompt += "Unfortunately, real-time data is currently unavailable. Base answers on general oceanography knowledge.\n";
  }

  prompt += `
Additional Guidelines:
- Be concise but informative (2-4 paragraphs max unless asked for more).
- Use scientific terminology but explain it simply.
- Be enthusiastic about ocean science!
- Use ocean-related emoji occasionally.`;

  return prompt;
}

// ── Main chat function utilizing Gemini ──────────────────────────────────────
export async function chat(message, history = [], oceanData = null) {
  // If no Gemini key, fallback to Groq
  if (!config.geminiApiKey) {
    console.warn("⚠️  No Gemini API key found. Falling back to Groq service.");
    return groqChat(message, history);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    const systemInstruction = buildSystemPrompt(oceanData);

    // Format history for Gemini (@google/genai structure)
    // Map roles: 'assistant' -> 'model', 'system' -> ignore (handled via systemInstruction)
    const contents = history
      .filter((h) => h.role !== "system")
      .map((h) => ({
        role: h.role === "assistant" ? "model" : (h.role || "user"),
        parts: [{ text: h.content }],
      }));

    // Add exactly the user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return {
      reply: response.text || "I couldn't generate a response. Please try again.",
      model: "gemini-2.5-flash (Context Aware)",
    };
  } catch (err) {
    console.warn(`⚠️  Gemini API error. Falling back to Groq. Details: ${err.message}`);
    // Graceful fallback to groq service
    return groqChat(message, history);
  }
}
