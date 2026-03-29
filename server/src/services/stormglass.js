import axios from "axios";
import config from "../config/env.js";

// ── In-memory cache (1-hour TTL) ────────────────────────────────────────
const cache = new Map(); // key → { data, expiresAt }
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCacheKey(lat, lng) {
  return `${parseFloat(lat).toFixed(2)}_${parseFloat(lng).toFixed(2)}`;
}

// ── Mock data for when no API key is configured ─────────────────────────
function getMockData(lat, lng) {
  return {
    location: { lat: parseFloat(lat), lng: parseFloat(lng) },
    timestamp: new Date().toISOString(),
    source: "mock",
    data: {
      waveHeight: { value: 1.2, unit: "m" },
      waterTemperature: { value: 28.5, unit: "°C" },
      windSpeed: { value: 5.3, unit: "m/s" },
      windDirection: { value: 220, unit: "°" },
      swellHeight: { value: 0.8, unit: "m" },
      swellPeriod: { value: 8.2, unit: "s" },
      currentSpeed: { value: 0.3, unit: "m/s" },
      currentDirection: { value: 180, unit: "°" },
      seaLevel: { value: 0.4, unit: "m" },
      airTemperature: { value: 30.1, unit: "°C" },
      humidity: { value: 75, unit: "%" },
    },
  };
}

// ── Helper: safely extract a numeric value from StormGlass sources ──────
function pick(obj) {
  if (!obj || typeof obj !== "object") return null;
  // StormGlass returns { sg, noaa, icon, ... } — pick the first available
  for (const src of ["sg", "noaa", "icon", "meteo", "meto", "dwd", "smhi"]) {
    if (obj[src] !== undefined && obj[src] !== null) return obj[src];
  }
  return null;
}

// ── Main fetch function ─────────────────────────────────────────────────
export async function fetchOceanData(lat, lng) {
  lat = lat || config.defaultLat;
  lng = lng || config.defaultLng;

  // Return mock if no API key
  if (!config.stormglassApiKey) {
    return getMockData(lat, lng);
  }

  // Check cache
  const key = getCacheKey(lat, lng);
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    console.log(`🗂️  Cache hit for ${key}`);
    return cached.data;
  }

  // Fetch from StormGlass
  console.log(`🌊 Fetching StormGlass data for ${lat}, ${lng}...`);

  const params = [
    "waveHeight",
    "waterTemperature",
    "windSpeed",
    "windDirection",
    "swellHeight",
    "swellPeriod",
    "currentSpeed",
    "currentDirection",
    "seaLevel",
    "airTemperature",
    "humidity",
  ].join(",");

  const end = new Date();
  const start = new Date(end.getTime() - 3600 * 1000); // last 1 hour

  const response = await axios.get(
    "https://api.stormglass.io/v2/weather/point",
    {
      params: {
        lat,
        lng,
        params,
        start: start.toISOString(),
        end: end.toISOString(),
      },
      headers: {
        Authorization: config.stormglassApiKey,
      },
      timeout: 10000,
    }
  );

  const hours = response.data?.hours;
  if (!hours || hours.length === 0) {
    throw Object.assign(new Error("No data returned from StormGlass"), {
      status: 502,
    });
  }

  // Take the most recent data point
  const latest = hours[hours.length - 1];

  const result = {
    location: { lat: parseFloat(lat), lng: parseFloat(lng) },
    timestamp: latest.time,
    source: "stormglass",
    data: {
      waveHeight: { value: pick(latest.waveHeight), unit: "m" },
      waterTemperature: { value: pick(latest.waterTemperature), unit: "°C" },
      windSpeed: { value: pick(latest.windSpeed), unit: "m/s" },
      windDirection: { value: pick(latest.windDirection), unit: "°" },
      swellHeight: { value: pick(latest.swellHeight), unit: "m" },
      swellPeriod: { value: pick(latest.swellPeriod), unit: "s" },
      currentSpeed: { value: pick(latest.currentSpeed), unit: "m/s" },
      currentDirection: { value: pick(latest.currentDirection), unit: "°" },
      seaLevel: { value: pick(latest.seaLevel), unit: "m" },
      airTemperature: { value: pick(latest.airTemperature), unit: "°C" },
      humidity: { value: pick(latest.humidity), unit: "%" },
    },
  };

  // Cache it
  cache.set(key, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
  console.log(`✅ StormGlass data cached for ${key}`);

  return result;
}
