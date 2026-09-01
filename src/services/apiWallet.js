import supabase from "./supabase";

export async function addIncome(income) {
  const { data, error } = await supabase
    .from("wallet")
    .insert([income])
    .select();

  if (error) {
    throw new Error("There was an error creating expense.");
  }

  return data;
}

export async function getIncomes({ user_id, month, year, limit }) {
  let query = supabase
    .from("wallet")
    .select("*")
    .eq("user_id", user_id)
    .order("date", { ascending: false }) // Sort by the actual transaction date
    .order("created_at", { ascending: false }); // Fallback sort

  // USE THE EXACT SAME LOGIC AS EXPENSES NOW!
  if (month) {
    const [yearStr, monthStr] = month.split("-");
    const startDate = `${month}-01`;
    const daysInMonth = new Date(yearStr, monthStr, 0).getDate();
    const endDate = `${month}-${daysInMonth}`;
    query = query.gte("date", startDate).lte("date", endDate);
  } else if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte("date", startDate).lte("date", endDate);
  }

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error("Error loading income");
  return data;
}

export async function deleteIncome(id) {
  const { data, error } = await supabase.from("wallet").delete().eq("id", id);
  if (error) throw new Error("Income could not be deleted");
  return data;
}

export async function editIncome({ id, ...obj }) {
  const updates = {
    income: parseFloat(obj.income),
    date: obj.date,
    source: obj.source,
  };

  const { data, error } = await supabase
    .from("wallet")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw new Error("Income could not be updated");
  return data;
}

export async function getIncomeAmounts(user_id) {
  const { data, error } = await supabase
    .from("wallet")
    .select("income") // Only fetch amount column
    .eq("user_id", user_id);

  if (error) throw new Error("Error loading income totals");
  return data;
}

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
    .select("income, date, source") // Select new columns
    .eq("user_id", user_id)
    .gte("date", startDate) // Range uses the new date column
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) throw new Error("Error loading chart income");
  return data;
}

export async function getBalanceView(user_id) {
  const { data, error } = await supabase
    .from("user_balances")
    .select("total_income, total_expense, current_balance")
    .eq("user_id", user_id)
    .single();

  if (error) throw new Error("Could not load balance from server");
  return data;
}
