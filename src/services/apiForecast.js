import supabase from "./supabase";

const FORECAST_API_URL = import.meta.env.DEV
  ? "http://127.0.0.1:5328/api/forecast"
  : "/api/forecast";

export async function generateForecast() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) throw new Error("Authentication required");

  const response = await fetch(FORECAST_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to generate report");
  }

  return data;
}
