import OpenAI from "openai";
import config from "../config/env.js";

// ── System prompt for ocean-domain expertise ────────────────────────────
const SYSTEM_PROMPT = `You are Ocean AI, an expert marine science assistant built into the OceanData platform. Your knowledge covers:

- Physical oceanography: currents, tides, waves, thermohaline circulation
- Marine biology: ecosystems, coral reefs, deep-sea life, biodiversity
- Ocean chemistry: salinity, pH, dissolved oxygen, carbon cycle
- Climate science: ocean warming, sea level rise, El Niño/La Niña, ice melt
- Argo float program: profiling floats, BGC sensors, data collection
- Ocean conservation: marine protected areas, pollution, sustainable fishing
- Ocean technology: remote sensing, autonomous vehicles, satellite altimetry

Guidelines:
- Be concise but informative (2-4 paragraphs max unless asked for more)
- Use scientific terminology but explain it simply
- Include relevant numbers, facts, and data when available
- If asked about real-time data, mention that the OceanData dashboard shows live metrics
- Be enthusiastic about ocean science — it's fascinating!
- Use ocean-related emoji occasionally for personality 🌊🐋🌡️`;

// ── Intelligent fallback responses (when no OpenAI key) ─────────────────
const FALLBACK_RESPONSES = [
  {
    keywords: ["temperature", "warm", "hot", "cold", "sst", "thermal"],
    response:
      "🌡️ Sea surface temperature (SST) in the Bay of Bengal typically ranges from 26°C to 30°C, making it one of the warmest oceanic regions. This warmth fuels tropical cyclones and drives the Indian monsoon system. The upper 200m of the ocean stores more heat than the entire atmosphere — that's the incredible thermal capacity of seawater! You can check our live SST readings on the dashboard.",
  },
  {
    keywords: ["wave", "swell", "surf"],
    response:
      "🌊 Waves in the Bay of Bengal are influenced by monsoon winds, with significant wave heights ranging from 0.5m (calm season) to 3-4m (monsoon). Swell waves originate from distant storms and travel thousands of kilometers. The wave energy reaching our coasts depends on wind speed, duration, and fetch (the distance over which wind blows). Our dashboard shows real-time wave height and swell period data!",
  },
  {
    keywords: ["current", "circulation", "flow"],
    response:
      "🌀 The Bay of Bengal has a complex current system. The East India Coastal Current (EICC) reverses seasonally — flowing northward during March-September and southward during October-February. These currents are crucial for nutrient transport, larval dispersal, and the distribution of marine organisms. Current speeds typically range from 0.1 to 0.5 m/s in this region.",
  },
  {
    keywords: ["salinity", "salt", "fresh"],
    response:
      "🧂 The Bay of Bengal is notably less saline than other ocean basins, with surface salinity as low as 28-33 PSU compared to the global average of ~35 PSU. This freshening comes from massive river discharge (Ganges, Brahmaputra, Irrawaddy) and heavy monsoon rainfall. This low-salinity layer creates a barrier that traps heat near the surface, intensifying tropical cyclones.",
  },
  {
    keywords: ["argo", "float", "profile", "sensor"],
    response:
      "🛰️ The Argo program maintains ~3,800 autonomous profiling floats worldwide. Each float cycles between the surface and 2,000m depth every 10 days, measuring temperature and salinity profiles. BGC-Argo floats also carry biogeochemical sensors for dissolved oxygen, pH, chlorophyll, and more. India's INCOIS contributes significantly to the Indian Ocean Argo array. The data is freely available and powers our analytics!",
  },
  {
    keywords: ["coral", "reef", "marine life", "biodiversity", "fish", "species"],
    response:
      "🐠 The Bay of Bengal hosts incredible marine biodiversity! The Andaman and Nicobar Islands have some of India's most pristine coral reefs, with over 500 species of reef-building corals. The bay is home to olive ridley sea turtles (the world's largest nesting site is at Gahirmatha), Irrawaddy dolphins, and whale sharks. However, ocean warming and acidification threaten these ecosystems — coral bleaching events have become more frequent since 2016.",
  },
  {
    keywords: ["climate", "warming", "sea level", "rise", "ice", "carbon"],
    response:
      "🌍 The oceans have absorbed about 90% of excess heat from climate change and ~30% of human-produced CO₂. Sea surface temperatures in the Bay of Bengal have risen by ~0.6°C since 1950. Sea level rise here averages 3.3mm/year but is accelerating. This warming intensifies cyclones (Amphan 2020, Yaas 2021 were Category 5 super cyclones) and disrupts monsoon patterns that 1.5 billion people depend on.",
  },
  {
    keywords: ["monsoon", "rain", "season", "weather", "cyclone", "storm"],
    response:
      "🌧️ The Bay of Bengal is the breeding ground for ~80% of cyclones in the North Indian Ocean. The monsoon cycle dominates: southwest monsoon (June-September) brings heavy rainfall, while the northeast monsoon (October-December) affects southeast India. Ocean-atmosphere coupling in the bay — warm SSTs, low salinity barrier layers, and moisture convergence — makes it one of the most cyclogenically active basins on Earth.",
  },
  {
    keywords: ["deep", "trench", "mariana", "abyss", "pressure"],
    response:
      "🌌 The deepest point in the Bay of Bengal is the Sunda Trench (formerly Java Trench) at about 7,450m. At those depths, pressure reaches over 700 atmospheres! The deep ocean below 1,000m remains one of Earth's least explored frontiers — we've mapped more of Mars than our own ocean floor. Deep-sea creatures have evolved extraordinary adaptations: bioluminescence, extreme pressure tolerance, and chemosynthetic metabolisms near hydrothermal vents.",
  },
];

const GENERIC_FALLBACK =
  "🌊 That's a great question about the ocean! The world's oceans cover 71% of Earth's surface and contain 97% of all water on the planet. The Bay of Bengal, where our sensors are focused, is one of the most dynamic oceanic regions — influenced by monsoons, river discharge, and tropical cyclones. Feel free to ask me about specific topics like water temperature, currents, marine life, or the Argo float program, and I'll share detailed insights!";

function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  for (const entry of FALLBACK_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }
  return GENERIC_FALLBACK;
}

// ── Main chat function ──────────────────────────────────────────────────
export async function chat(message, history = []) {
  // Fallback if no API key
  if (!config.openaiApiKey) {
    // Simulate slight delay for natural feel
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    return {
      reply: getFallbackResponse(message),
      model: "fallback",
    };
  }

  // Try real OpenAI call — gracefully fall back on errors
  try {
    const openai = new OpenAI({ apiKey: config.openaiApiKey });

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      // Include conversation history for context
      ...history.slice(-10).map((h) => ({
        role: h.role,
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return {
      reply: completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.",
      model: "gpt-4o-mini",
    };
  } catch (err) {
    // On rate limit, quota, or network errors — use smart fallback instead of failing
    const status = err?.status || err?.response?.status;
    if (status === 429 || status === 402 || status === 503) {
      console.warn(`⚠️  OpenAI API error (${status}), using fallback response`);
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
      return {
        reply: getFallbackResponse(message),
        model: "fallback (OpenAI quota exceeded)",
      };
    }
    // Re-throw other errors (auth, etc.) so the route handler catches them
    throw err;
  }
}
