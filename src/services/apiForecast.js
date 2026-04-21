// src/services/apiForecast.js
import supabase from "./supabase"; // <-- 1. Import Supabase

export async function generateForecast(userId) {
  // 2. Grab the secure JWT token from the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) throw new Error("Authentication required");

  // 3. Environment check
  const isLocal = import.meta.env.DEV;
  const API_URL = isLocal
    ? "http://127.0.0.1:5328/api/forecast"
    : "/api/forecast";

  // 4. Send the request WITH the secure Authorization header
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // <-- THE BADGE
    },
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to generate report");
  }
  return data;
}
