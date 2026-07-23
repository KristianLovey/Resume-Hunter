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

// Dopusti samo http(s) poveznice — spriječi javascript:/data:/file: itd. (XSS preko href-a).
function sanitizeUrl(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^(javascript|data|vbscript|file|blob):/i.test(s)) return null;
  // bez sheme, ali izgleda kao domena → pretpostavi https
  if (/^[\w.-]+\.[a-z]{2,}(\/|$|\?|#)/i.test(s)) return `https://${s}`;
  return null;
}

const ALLOWED_STATUS = ["draft", "applied", "interview", "offer", "rejected"];
const ALLOWED_TEMPLATES = ["modern", "classic", "minimal", "elegant", "compact", "creative"];

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
      link: sanitizeUrl((formData.get("link") ?? "").toString()) ?? "",
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
    .map((l) => sanitizeUrl(l))
    .filter((l): l is string => !!l);

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

export async function setCvTemplate(formData: FormData) {
  const { supabase, user } = await authed();
  const t = formData.get("template")?.toString();
  if (!t || !ALLOWED_TEMPLATES.includes(t)) return;
  await supabase.from("profiles").update({ cv_template: t }).eq("id", user.id);
  revalidatePath("/dashboard/cv");
}

export async function updateApplicationStatus(formData: FormData) {
  const { supabase, user } = await authed();
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  // whitelist statusa — spriječi upis proizvoljne vrijednosti
  if (!id || !status || !ALLOWED_STATUS.includes(status)) return;

  await supabase.from("applications").update({ status }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

/* ===================== CV Editiranje ===================== */

type EditableCvData = {
  summary: string;
  experiences: { title: string; bullets: string[] }[];
};

export async function saveCvEdits(applicationId: string, data: EditableCvData) {
  const { supabase, user } = await authed();

  // Validiraj podatke — nisu prazni?
  if (!data.summary?.trim()) {
    return { success: false, error: "Profil ne smije biti prazan" };
  }

  // Spremi edited CV u tailored_cv_edited kolonu
  const { error } = await supabase
    .from("applications")
    .update({
      tailored_cv_edited: data,
      edited_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/cv");
  return { success: true };
}

export async function regenerateCv(
  applicationId: string,
  userEdits?: EditableCvData
): Promise<{ success: boolean; error?: string; data?: EditableCvData }> {
  const { supabase, user } = await authed();

  // Dohvati aplikaciju
  const { data: app, error: appError } = await supabase
    .from("applications")
    .select("job_description,tone,cover_letter")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (appError || !app) {
    return { success: false, error: "Aplikacija nije pronađena" };
  }

  // Regeneriraj kroz AI API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/hunter/regenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId,
        jobText: app.job_description,
        tone: app.tone,
        userEdits,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.error || "Greška pri regeneraciji" };
    }

    const result = await response.json();

    // Update DB s novim CV-om
    if (result.tailoredCv) {
      await supabase
        .from("applications")
        .update({
          tailored_cv: result.tailoredCv,
          tailored_cv_edited: null, // Resetiraj edite nakon regeneracije
          regenerated_at: new Date().toISOString(),
        })
        .eq("id", applicationId)
        .eq("user_id", user.id);

      revalidatePath("/dashboard/cv");
      return { success: true, data: result.tailoredCv };
    }

    return { success: false, error: "Nema rezultata regeneracije" };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Greška pri regeneraciji" };
  }
}
