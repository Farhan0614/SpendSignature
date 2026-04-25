import supabase from "./supabase";

export async function getSubscriptions(user_id) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, categories(name, icon_name)")
    .eq("user_id", user_id)
    .order("status", { ascending: true })
    .order("next_due_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error("Subscriptions could not be loaded");
  return data;
}

export async function createSubscription(subscription) {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert([subscription])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSubscription({ id, ...updates }) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSubscription(id) {
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function syncDueSubscriptions() {
  const { data, error } = await supabase.rpc("sync_my_subscriptions");

  if (error) throw new Error(error.message);
  return data ?? 0;
}
