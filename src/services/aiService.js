// src/services/aiService.js
import supabase from "./supabase";

export async function checkAnomaly(amount, categoryId, userId) {
  try {
    // 1. Fetch History from Supabase (Last 50 items for this category & user)
    // We need this data to teach the AI what is "normal" for this specific context
    const { data: historyData } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .order("date", { ascending: false })
      .limit(50);

    // Extract just the numbers: [500, 1200, 400...]
    const historyValues = historyData ? historyData.map((h) => h.amount) : [];
    console.log(historyData);

    // 2. Determine URL (Smart Switching between Localhost and Vercel)
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // IF LOCAL: Use the full Python URL (Port 5328)
    // IF VERCEL: Use the relative path (Vercel rewrites handle it)
    const API_URL = isLocal
      ? "http://127.0.0.1:5328/api/predict"
      : "/api/predict";

    // 3. Call the Python AI
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        history: historyValues,
      }),
    });

    if (!response.ok) throw new Error("AI Server Error");

    const result = await response.json();
    console.log(result, response);
    return result; // Returns { alert: true, message: "..." }
  } catch (error) {
    console.error("AI Check Failed:", error);
    // FAIL SAFE: If AI is offline, return false so user can still save
    return { alert: false };
  }
}
