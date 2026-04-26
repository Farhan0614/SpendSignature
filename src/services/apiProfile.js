import supabase, { supabaseUrl } from "./supabase";

function getStoragePathFromUrl(url) {
  if (!url) return null;

  const marker = "/storage/v1/object/public/avatars/";
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) return null;

  return url.slice(markerIndex + marker.length);
}

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
  let imagePath = old_avatar_url || null;
  let newStoragePath = null;
  const oldStoragePath = getStoragePathFromUrl(old_avatar_url);

  if (avatarFile) {
    const fileExt = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatarFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) throw new Error("Image upload failed");

    newStoragePath = fileName;
    imagePath = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
  }

  const updates = {};

  if (full_name !== undefined) updates.full_name = full_name;
  if (currency) updates.currency = currency;
  if (imagePath) {
    updates.avatar_url = imagePath;
    updates.avatar_path = newStoragePath || oldStoragePath || null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (newStoragePath) {
      await supabase.storage.from("avatars").remove([newStoragePath]);
    }

    throw new Error(error.message);
  }

  if (newStoragePath && oldStoragePath && oldStoragePath !== newStoragePath) {
    await supabase.storage.from("avatars").remove([oldStoragePath]);
  }

  return data;
}
