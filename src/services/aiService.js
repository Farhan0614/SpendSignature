import supabase from "./supabase";

const ANOMALY_API_URL = import.meta.env.DEV
  ? "http://127.0.0.1:5328/api/predict"
  : "/api/predict";

export async function checkAnomaly(amount, categoryId) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;
    if (!token) return { alert: false };

    const response = await fetch(ANOMALY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: Number(amount),
        category_id: Number(categoryId),
      }),
    });

    const result = await response.json().catch(() => ({ alert: false }));

    if (!response.ok) {
      throw new Error(result?.error || "AI Server Error");
    }

    return result;
  } catch (error) {
    console.error("AI Check Failed:", error);
    return { alert: false };
  }
}
