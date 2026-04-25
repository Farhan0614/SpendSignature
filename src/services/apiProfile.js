import supabase, { supabaseUrl } from "./supabase";

export async function getProfile(user_id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) throw new Error("Profile not found");
  return data;
}

export async function updateProfile({
  id,
  full_name,
  avatarFile,
  currency,
  old_avatar_url,
}) {
  let imagePath = old_avatar_url;

  if (avatarFile) {
    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${id}-${Math.random()}.${fileExt}`;

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatarFile);

    if (storageError) throw new Error("Image upload failed");

    imagePath = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
  }

  const updates = {};

  if (full_name !== undefined) updates.full_name = full_name;
  if (currency) updates.currency = currency;
  if (imagePath) updates.avatar_url = imagePath;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
