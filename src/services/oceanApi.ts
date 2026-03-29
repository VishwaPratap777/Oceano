import { apiFetch } from "./api";

export interface OceanMetric {
  value: number | null;
  unit: string;
}

export interface OceanData {
  location: { lat: number; lng: number };
  timestamp: string;
  source: "stormglass" | "mock";
  data: {
    waveHeight: OceanMetric;
    waterTemperature: OceanMetric;
    windSpeed: OceanMetric;
    windDirection: OceanMetric;
    swellHeight: OceanMetric;
    swellPeriod: OceanMetric;
    currentSpeed: OceanMetric;
    currentDirection: OceanMetric;
    seaLevel: OceanMetric;
    airTemperature: OceanMetric;
    humidity: OceanMetric;
  };
}

export async function fetchOceanData(lat?: number, lng?: number): Promise<OceanData> {
  const params = new URLSearchParams();
  if (lat !== undefined) params.set("lat", lat.toString());
  if (lng !== undefined) params.set("lng", lng.toString());

  const query = params.toString();
  return apiFetch<OceanData>(`/ocean${query ? `?${query}` : ""}`);
}
