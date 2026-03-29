import { Router } from "express";
import { chat } from "../services/groq.js";

const router = Router();

/**
 * POST /api/chat
 * Body: { message: string, history?: Array<{ role: string, content: string }> }
 */
router.post("/", async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
        status: 400,
      });
    }

    const result = await chat(message.trim(), history || []);

    res.json({
      reply: result.reply,
      model: result.model,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Handle Groq-specific errors if necessary
    if (err?.status === 401 || err?.message?.includes("API key")) {
      return res.status(401).json({
        error: "Invalid Groq API key",
        status: 401,
      });
    }
    if (err?.status === 429 || err?.message?.includes("quota")) {
      return res.status(429).json({
        error: "Groq rate limit exceeded. Please try again in a moment.",
        status: 429,
      });
    }
    next(err);
  }
});

export default router;
