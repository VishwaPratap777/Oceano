import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/env.js";
import errorHandler from "./middleware/errorHandler.js";
import oceanRouter from "./routes/ocean.js";
import chatRouter from "./routes/chat.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ── Health check ────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      stormglass: config.stormglassApiKey ? "configured" : "missing key",
      groq: config.groqApiKey ? "configured" : "fallback mode",
    },
  });
});

// ── Routes ──────────────────────────────────────────────────────────────
app.use("/api/ocean", oceanRouter);
app.use("/api/chat", chatRouter);

// ── Error handling ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Static assets (Production) ──────────────────────────────────────────
const DIST_PATH = path.join(__dirname, "../../dist");
app.use(express.static(DIST_PATH));

// Handle SPA routing: serve index.html for all non-API routes
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(DIST_PATH, "index.html"), (err) => {
      if (err) {
        // Fallback for cases where dist/index.html doesn't exist yet (e.g. initial dev setup)
        res.status(404).json({ error: "Frontend build not found. Run 'npm run build' first." });
      }
    });
  }
});

// ── Start server ────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`
  🌊 OceanData Server running on port ${config.port}
  ─────────────────────────────────────────────
  Health:  http://localhost:${config.port}/api/health
  Ocean:   http://localhost:${config.port}/api/ocean
  Chat:    http://localhost:${config.port}/api/chat (POST)
  ─────────────────────────────────────────────
  StormGlass: ${config.stormglassApiKey ? "✅ Key configured" : "⚠️  No key — mock data"}
  Groq:       ${config.groqApiKey ? "✅ Key configured" : "⚠️  No key — fallback mode"}
  `);
});
