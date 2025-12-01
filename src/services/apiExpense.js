import supabase from "./supabase";

export async function getExpense(user_id) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, categories(name,icon_name)")
    .eq("user_id", user_id)
    .order("date", { ascending: false });

  if (error) {
    throw new Error("error loading expense");
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

// export async function getMonthlyExpense(user_id, month, year) {
//   const { data, error } = await supabase
//     .from("expenses")
//     .select("amount, categories(name,icon_name)")
//     .eq("user_id", user_id)
//     .gte("date", `${year}-${month}-01`)
//     .lte("date", `${year}-${month}-31`);

//   if (error) throw new Error("Error loading monthly balance");

//   return data;
// }

export async function getMonthlyExpense(user_id, month, year) {
  // Ensure month has leading zero (e.g., 09)
  const formattedMonth = String(month).padStart(2, "0");

  // Dynamically calculate the last valid day of the month
  const lastDay = new Date(year, month, 0).getDate();

  const { data, error } = await supabase
    .from("expenses")
    .select("amount, categories(name,icon_name)")
    .eq("user_id", user_id)
    .gte("date", `${year}-${formattedMonth}-01`)
    .lte("date", `${year}-${formattedMonth}-${lastDay}`);

  if (error) {
    console.error(error);
    throw new Error("Error loading monthly expenses");
  }

  // const total = data.reduce((sum, item) => sum + item.amount, 0);

  return data;
}
