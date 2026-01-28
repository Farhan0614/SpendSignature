import supabase from "./supabase";
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

export async function getExpensesByCategory(user_id, categoryName) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, categories!inner(name, icon_name)") // 👈 force INNER JOIN
    .eq("user_id", user_id)
    .eq("categories.name", categoryName) // now filters before returning
    .order("date", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Error loading category expenses");
  }

  return data;
}

export async function getMonthAmount(startDate, endDate, user_id) {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount, category_id")
    .eq("user_id", user_id)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error(error);
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
