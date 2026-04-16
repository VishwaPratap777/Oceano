import { Router } from "express";
import { chat } from "../services/gemini.js";
import { fetchOceanData } from "../services/stormglass.js";

const router = Router();

/**
 * POST /api/chat
 * Body: { message: string, history?: Array<{ role: string, content: string }>, lat?: number, lng?: number }
 */
router.post("/", async (req, res, next) => {
  try {
    const { message, history, lat, lng } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
        status: 400,
      });
    }

    // Attempt to fetch real-time ocean data for context
    let oceanData = null;
    try {
      oceanData = await fetchOceanData(lat, lng);
    } catch (err) {
      console.warn("⚠️  Could not fetch real-time ocean data for chatbot context:", err.message);
    }

    const result = await chat(message.trim(), history || [], oceanData);

    res.json({
      reply: result.reply,
      model: result.model,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
