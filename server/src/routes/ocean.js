import { Router } from "express";
import { fetchOceanData } from "../services/stormglass.js";

const router = Router();

/**
 * GET /api/ocean
 * Query params: lat, lng (optional, defaults to Bay of Bengal)
 */
router.get("/", async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    const data = await fetchOceanData(
      lat ? parseFloat(lat) : undefined,
      lng ? parseFloat(lng) : undefined
    );
    res.json(data);
  } catch (err) {
    // Handle StormGlass-specific errors
    if (err.response) {
      const status = err.response.status;
      const msg = err.response.data?.errors?.[0]?.message || "StormGlass API error";
      console.error(`StormGlass API [${status}]: ${msg}`);
      return res.status(status === 402 ? 429 : status).json({
        error: status === 402 ? "StormGlass API quota exceeded (free tier: 10 requests/day)" : msg,
        status: status === 402 ? 429 : status,
      });
    }
    next(err);
  }
});

export default router;
