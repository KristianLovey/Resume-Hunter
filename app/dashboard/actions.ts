// app/dashboard/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

export type SaveProfileInput = {
  full_name: string;
  date_of_birth: string;
  phone: string;
  location: string;
  bio: string;
  default_tone: string;
  skills: { categories: { name: string; items: string[] }[] };
  hobbies: string[];
  certificates: string[];
  strengths: string[];
};

// Dohvati prijavljenog korisnika + klijent (RLS: sve ide kao taj korisnik).
async function authed() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Niste prijavljeni.");
  return { supabase, user };
}

// FK: experiences.user_id / education.user_id -> profiles.id.
// Zato prije inserta osiguraj da profil red postoji (bez gaženja postojećih polja).
async function ensureProfile(supabase: SupabaseServer, userId: string) {
  await supabase
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id", ignoreDuplicates: true });
}

/* ===================== Profil ===================== */
export async function saveProfile(input: SaveProfileInput) {
  const { supabase, user } = await authed();

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: input.full_name.trim() || null,
      date_of_birth: input.date_of_birth || null,
      phone: input.phone.trim() || null,
      location: input.location.trim() || null,
      bio: input.bio.trim() || null,
      default_tone: input.default_tone || null,
      skills: input.skills,
      hobbies: input.hobbies,
      certificates: input.certificates,
      strengths: input.strengths,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) return { ok: false as const, message: error.message };
  revalidatePath("/dashboard");
  return { ok: true as const, message: "Profil spremljen" };
}

/* ===================== Iskustvo ===================== */
export async function addExperience() {
  const { supabase, user } = await authed();
  await ensureProfile(supabase, user.id);

  const { count } = await supabase
    .from("experiences")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  await supabase.from("experiences").insert({
    user_id: user.id,
    company: "",
    company_url: "",
    position: "",
    period: "",
    description: "",
    sort_order: count ?? 0,
  });
  revalidatePath("/dashboard");
}

export async function updateExperience(formData: FormData) {
  const { supabase, user } = await authed();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await supabase
    .from("experiences")
    .update({
      company: (formData.get("company") ?? "").toString(),
      company_url: (formData.get("company_url") ?? "").toString(),
      position: (formData.get("position") ?? "").toString(),
      period: (formData.get("period") ?? "").toString(),
      description: (formData.get("description") ?? "").toString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function deleteExperience(formData: FormData) {
  const { supabase, user } = await authed();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await supabase.from("experiences").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

/* ===================== Obrazovanje ===================== */
export async function addEducation() {
  const { supabase, user } = await authed();
  await ensureProfile(supabase, user.id);

  const { count } = await supabase
    .from("education")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  await supabase.from("education").insert({
    user_id: user.id,
    institution: "",
    title: "",
    period: "",
    link: "",
    sort_order: count ?? 0,
  });
  revalidatePath("/dashboard");
}

export async function updateEducation(formData: FormData) {
  const { supabase, user } = await authed();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await supabase
    .from("education")
    .update({
      institution: (formData.get("institution") ?? "").toString(),
      title: (formData.get("title") ?? "").toString(),
      period: (formData.get("period") ?? "").toString(),
      link: (formData.get("link") ?? "").toString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function deleteEducation(formData: FormData) {
  const { supabase, user } = await authed();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await supabase.from("education").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

/* ===================== Projekti ===================== */
export async function addProject() {
  const { supabase, user } = await authed();
  await ensureProfile(supabase, user.id);

  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  await supabase.from("projects").insert({
    user_id: user.id,
    name: "",
    description: "",
    period: "",
    links: [],
    sort_order: count ?? 0,
  });
  revalidatePath("/dashboard");
}

export async function updateProject(formData: FormData) {
  const { supabase, user } = await authed();
  const id = formData.get("id")?.toString();
  if (!id) return;

  // poveznice: textarea, jedna po retku -> jsonb array
  const linksRaw = (formData.get("links") ?? "").toString();
  const links = linksRaw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  await supabase
    .from("projects")
    .update({
      name: (formData.get("name") ?? "").toString(),
      description: (formData.get("description") ?? "").toString(),
      period: (formData.get("period") ?? "").toString(),
      links,
    })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function deleteProject(formData: FormData) {
  const { supabase, user } = await authed();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await supabase.from("projects").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

/* ===================== Prijave (applications) ===================== */
export async function deleteApplication(formData: FormData) {
  const { supabase, user } = await authed();
  const id = formData.get("id")?.toString();
  if (!id) return;

  await supabase.from("applications").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function updateApplicationStatus(formData: FormData) {
  const { supabase, user } = await authed();
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  if (!id || !status) return;

  await supabase.from("applications").update({ status }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}
