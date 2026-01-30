import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";
// services/apiExpense.js

export async function createExpense(expense) {
  const { data, error } = await supabase
    .from("expenses")
    .insert([expense])
    .select();

  if (error) {
    console.log(error);
    throw new Error("There was an error creating expense.");
  }

  return data;
}

export async function getExpenses({ user_id, month, year, limit }) {
  let query = supabase
    .from("expenses")
    .select("*, categories(name, icon_name)")
    .eq("user_id", user_id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  // SCENARIO 1: Monthly View (e.g., month = "2026-02")
  if (month) {
    const [yearStr, monthStr] = month.split("-");

    // 1. Start Date: "2026-02-01"
    const startDate = `${month}-01`;

    // 2. Get number of days in this month (e.g., 28, 30, 31)
    const daysInMonth = new Date(yearStr, monthStr, 0).getDate();

    // 3. End Date: Force the very last millisecond of the day
    const endDate = `${month}-${daysInMonth}`;

    query = query.gte("date", startDate).lte("date", endDate);
  }
  // SCENARIO 2: Yearly View (e.g., year = 2026)
  else if (year) {
    const startDate = `${year}-01-01`;

    const endDate = `${year}-12-31`;

    query = query.gte("date", startDate).lte("date", endDate);
  }

  // LIMIT (For Dashboard)
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Expenses could not be loaded");
  }

  return data;
}

// export async function getExpensesByCategory(user_id, categoryName) {
//   const { data, error } = await supabase
//     .from("expenses")
//     .select("*, categories!inner(name, icon_name)") // 👈 force INNER JOIN
//     .eq("user_id", user_id)
//     .eq("categories.name", categoryName) // now filters before returning
//     .order("date", { ascending: false });

//   if (error) {
//     console.error(error);
//     throw new Error("Error loading category expenses");
//   }

//   return data;
// }

// 1. THE PAGINATED LIST QUERY
export async function getExpensesByCategory({
  user_id,
  categoryName,
  view,
  month,
  year,
  page = 1,
}) {
  let query = supabase
    .from("expenses")
    .select("*, categories!inner(name, icon_name)", { count: "exact" }) // Request count!
    .eq("user_id", user_id)
    .eq("categories.name", categoryName)
    .order("date", { ascending: false });

  // A. Apply Date Filters (Reuse logic from getExpenses)
  if (view === "monthly" && month) {
    const startDate = `${month}-01`;
    const daysInMonth = new Date(
      month.split("-")[0],
      month.split("-")[1],
      0,
    ).getDate();
    const endDate = `${month}-${daysInMonth}`;
    query = query.gte("date", startDate).lte("date", endDate);
  } else if (view === "yearly" && year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte("date", startDate).lte("date", endDate);
  }

  // B. Apply Pagination (Range)
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) throw new Error("Error loading category expenses");

  return { data, count };
}

// 2. THE STATS QUERY (Lightweight aggregation)
export async function getCategoryStats({
  user_id,
  categoryName,
  view,
  month,
  year,
}) {
  // A. Fetch View Total
  let viewQuery = supabase
    .from("expenses")
    .select("amount, categories!inner(name)", { count: "exact" }) // Fetch ONLY amount
    .eq("user_id", user_id)
    .eq("categories.name", categoryName);

  if (view === "monthly" && month) {
    const startDate = `${month}-01`;
    const daysInMonth = new Date(
      month.split("-")[0],
      month.split("-")[1],
      0,
    ).getDate();
    const endDate = `${month}-${daysInMonth}`;
    viewQuery = viewQuery.gte("date", startDate).lte("date", endDate);
  } else if (view === "yearly" && year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    viewQuery = viewQuery.gte("date", startDate).lte("date", endDate);
  }

  // B. Fetch Global Total (All Time)
  const globalQuery = supabase
    .from("expenses")
    .select("amount, categories!inner(name)")
    .eq("user_id", user_id)
    .eq("categories.name", categoryName);

  const [viewRes, globalRes] = await Promise.all([viewQuery, globalQuery]);

  if (viewRes.error || globalRes.error) throw new Error("Error loading stats");

  // Client-side sum (but only iterating numbers, not full objects)
  const viewTotal = viewRes.data.reduce((sum, item) => sum + item.amount, 0);
  const globalTotal = globalRes.data.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return { viewTotal, globalTotal };
}

export async function getMonthAmount(startDate, endDate, user_id) {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount, category_id")
    .eq("user_id", user_id)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    throw new Error("Error loading category expenses");
  }

  return data;
}

export async function getExpensesInRange(user_id, startDate, endDate) {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount, date")
    .eq("user_id", user_id)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });
  if (error) throw new Error("Error loading chart data");
  return data;
}
