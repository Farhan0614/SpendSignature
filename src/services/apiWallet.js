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
