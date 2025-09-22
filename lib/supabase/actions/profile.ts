import { v4 as uuidv4 } from "uuid";
import { Profile } from "@/types/profile";
import { createClient } from "@/lib/supabase/client";

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    console.error("Erro ao obter usuário:", authError);
    return null;
  }

  const { data, error } = await supabase
    .from("users_public")
    .select("*")
    .eq("id_user", authData.user.id)
    .single();


  if (error) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }

  return data as Profile;
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getPublisherById(
  publisher_id: string
): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", publisher_id)
    .maybeSingle();

  if (error || !data) {
    console.error("Erro ao buscar perfil:", error);
    console.log(publisher_id);
    return null;
  }

  return data as Profile;
}

export async function getProfileByUsername(
  username: string
): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error || !data) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }

  return data as Profile;
}

export async function updateProfile(updates: Partial<Profile>) {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    console.error("Usuário não autenticado", authError);
    throw new Error("Usuário não autenticado");
  }

  const userId = authData.user.id;

  const { error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function uploadAvatar(file: File): Promise<string> {
  const supabase = createClient();

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Usuário não autenticado");

  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Erro ao buscar perfil:", profileError);
    throw new Error("Erro ao buscar perfil");
  }

  if (profile?.avatar_url) {
    const previousPath = profile.avatar_url.split("/").slice(-2).join("/");
    await supabase.storage.from("bkt-avatars").remove([previousPath]);
  }

  const { error: uploadError } = await supabase.storage
    .from("bkt-avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  console.log("Tentando subir:", filePath, file);

  if (uploadError) {
    console.error(
      "Erro ao subir arquivo:",
      uploadError?.message ?? uploadError
    );
    throw new Error("Erro ao subir novo avatar");
  }

  const { data: urlData } = supabase.storage
    .from("bkt-avatars")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function uploadBanner(file:File): Promise<string> {
  const supabase = createClient();

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Usuário não autenticado");

  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("banner_url")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Erro ao buscar perfil:", profileError);
    throw new Error("Erro ao buscar perfil");
  }

  if (profile?.banner_url) {
    const previousPath = profile.banner_url.split("/").slice(-2).join("/");
    await supabase.storage.from("bkt-avatars").remove([previousPath]);
  }

  const { error: uploadError } = await supabase.storage
    .from("bkt-avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  console.log("Tentando subir:", filePath, file);

  if (uploadError) {
    console.error(
      "Erro ao subir arquivo:",
      uploadError?.message ?? uploadError
    );
    throw new Error("Erro ao subir novo banner");
  }

  const { data: urlData } = supabase.storage
    .from("bkt-avatars")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function deleteAvatar() {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    console.error("Usuário não autenticado", authError);
    throw new Error("Usuário não autenticado");
  }

  const userId = authData.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Erro ao buscar perfil:", profileError);
    throw new Error("Erro ao buscar perfil");
  }

  if (profile?.avatar_url) {
    const path = profile.avatar_url.split("/").slice(-2).join("/");

    const { error: deleteError } = await supabase.storage
      .from("bkt-avatars")
      .remove([path]);

    if (deleteError) {
      console.error("Erro ao deletar avatar:", deleteError);
      throw new Error("Erro ao deletar avatar");
    }
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: null, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (updateError) {
    console.error("Erro ao limpar avatar_url:", updateError);
    throw new Error("Erro ao atualizar perfil");
  }
}