import supabase from "./supabase";

export async function addIncome(income) {
  const { data, error } = await supabase
    .from("wallet")
    .insert([income])
    .select();

  if (error) {
    console.log(error);
    throw new Error("There was an error creating expense.");
  }

  return data;
}

export async function getIncomes({ user_id, month, year, limit }) {
  let query = supabase
    .from("wallet")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  // SCENARIO 1: Monthly View (e.g., month = "2026-02")
  if (month) {
    const [yearStr, monthStr] = month.split("-");
    query = query.eq("month", parseInt(monthStr)).eq("year", parseInt(yearStr));
  } else if (year) {
    query = query.eq("year", parseInt(year));
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw new Error("Error loading income");

  return data;
}

// 3. GET ALL INCOME AMOUNTS (CRITICAL: Keeps your Total Balance working)
export async function getIncomeAmounts(user_id) {
  const { data, error } = await supabase
    .from("wallet")
    .select("income") // Only fetch amount column
    .eq("user_id", user_id);

  if (error) throw new Error("Error loading income totals");
  return data;
}

// 4. GET ALL EXPENSE AMOUNTS (CRITICAL: Keeps your Total Balance working)
export async function getExpenseAmounts(user_id) {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount") // Only fetch amount column
    .eq("user_id", user_id);

  if (error) throw new Error("Error loading expense totals");
  return data;
}

export async function getIncomesInRange(user_id, startDate, endDate) {
  const { data, error } = await supabase
    .from("wallet")
    .select("income, created_at, month, year")
    .eq("user_id", user_id)
    .gte("created_at", startDate)
    .lte("created_at", endDate)
    .order("created_at", { ascending: true });

  if (error) throw new Error("Error loading chart income");
  return data;
}
