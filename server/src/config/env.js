import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load .env from server/ directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  stormglassApiKey: process.env.STORMGLASS_API_KEY || "",
  groqApiKey: process.env.GROQ_API_KEY || "",

  // Bay of Bengal (Chennai) defaults
  defaultLat: 13.0827,
  defaultLng: 80.2707,
};

// Warn about missing keys at startup (non-fatal)
if (!config.stormglassApiKey) {
  console.warn("⚠️  STORMGLASS_API_KEY not set — ocean endpoint will return mock data");
}
if (!config.groqApiKey) {
  console.warn("⚠️  GROQ_API_KEY not set — chatbot will use fallback responses");
}

export default config;
