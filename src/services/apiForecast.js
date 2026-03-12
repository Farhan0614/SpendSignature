// src/services/apiForecast.js
export async function generateForecast(userId) {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const API_URL = isLocal
    ? "http://127.0.0.1:5328/api/forecast"
    : "/api/forecast";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to generate report");
  }
  return data;
}
