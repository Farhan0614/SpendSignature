import supabase from "./supabase";
import { getToday } from "../utils/helpers"; // Assuming you have this, or use new Date()

// 1. Get ONLY the last 5 expenses (Fast)
export async function getRecentExpenses(user_id) {
  const { data, error } = await supabase
    .from("expenses")
    .select("id, title, amount, date, categories(name)")
    .eq("user_id", user_id)
    .order("date", { ascending: false }) // Primary: Latest Day
    .order("created_at", { ascending: false }) // Secondary: Latest Time inside that day <--- ADD THIS
    .limit(5);

  if (error) throw new Error("Error loading recent expenses");
  return data;
}

// 2. Get ONLY the last 5 incomes (Fast)
export async function getRecentIncomes(user_id) {
  const { data, error } = await supabase
    .from("wallet")
    .select("id, income, created_at, month, year")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(5); // <--- THE MAGIC: Only download 5 rows

  if (error) throw new Error("Error loading recent income");
  return data;
}

// 3. Get expenses for THIS MONTH ONLY (For Pie Chart & Progress Bar)
export async function getCurrentMonthExpenses(user_id) {
  const date = new Date();
  const firstDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  ).toISOString();
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).toISOString();

  const { data, error } = await supabase
    .from("expenses")
    .select("id, title, amount, date, categories(name, icon_name)")
    .eq("user_id", user_id)
    .gte("date", firstDay) // Greater than 1st of month
    .lte("date", lastDay); // Less than last of month

  if (error) throw new Error("Error loading month expenses");
  return data;
}

// 4. Get income for THIS MONTH ONLY (For Monthly Balance)
export async function getCurrentMonthIncome(user_id) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data, error } = await supabase
    .from("wallet")
    .select("income")
    .eq("user_id", user_id)
    .eq("month", currentMonth)
    .eq("year", currentYear);

  if (error) throw new Error("Error loading month income");
  return data;
}
