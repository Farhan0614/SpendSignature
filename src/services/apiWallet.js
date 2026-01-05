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

// 1. Get ONLY expense amounts (Super fast)
export async function getExpenseAmounts(user_id) {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount") // <--- MAGIC: We only ask for this 1 column
    .eq("user_id", user_id);

  if (error) throw new Error("Error loading expense totals");
  return data; // Returns array like: [{amount: 50}, {amount: 20}...]
}

// 2. Get ONLY income amounts
export async function getIncomeAmounts(user_id) {
  const { data, error } = await supabase
    .from("wallet")
    .select("income") // <--- Only fetch income column
    .eq("user_id", user_id);

  if (error) throw new Error("Error loading income totals");
  return data;
}
