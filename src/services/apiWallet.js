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

export async function getIncome(user_id) {
  const { data, error } = await supabase
    .from("wallet")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("error loading income");
  }

  return data;
}

export async function getTotalBalance(user_id) {
  const { data, error } = await supabase
    .from("wallet")
    .select("income")
    .eq("user_id", user_id);

  if (error) throw new Error("Error loading total balance");

  const total = data.reduce((sum, item) => sum + item.income, 0);
  return total;
}

export async function getMonthlyBalance(user_id, month, year) {
  const { data, error } = await supabase
    .from("wallet")
    .select("income")
    .eq("user_id", user_id)
    .eq("month", month)
    .eq("year", year);

  if (error) throw new Error("Error loading monthly balance");

  const total = data.reduce((sum, item) => sum + item.income, 0);
  return total;
}
