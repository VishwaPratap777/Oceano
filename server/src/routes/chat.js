import { Router } from "express";
import { chat } from "../services/openai.js";

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
    // Handle OpenAI-specific errors
    if (err?.status === 401) {
      return res.status(401).json({
        error: "Invalid OpenAI API key",
        status: 401,
      });
    }
    if (err?.status === 429) {
      return res.status(429).json({
        error: "OpenAI rate limit exceeded. Please try again in a moment.",
        status: 429,
      });
    }
    next(err);
  }
});

export default router;
