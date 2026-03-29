/**
 * Base API configuration for frontend → backend communication.
 * In dev, Vite proxy handles /api → localhost:3001.
 * In production, requests go to the same origin.
 */
const API_BASE = "/api";

interface ApiError {
  error: string;
  status: number;
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errData: ApiError;
    try {
      errData = await res.json();
    } catch {
      errData = { error: `HTTP ${res.status}: ${res.statusText}`, status: res.status };
    }
    throw new Error(errData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}
