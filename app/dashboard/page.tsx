// app/dashboard/page.tsx
// Server Component: provjeri auth, dohvati profil + iskustva + obrazovanje, pa renderaj klijentsku aplikaciju.
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardApp from "./DashboardApp";

const DEFAULT_SKILLS = {
  categories: [
    { name: "Languages", items: [] as string[] },
    { name: "IT & technology", items: [] as string[] },
    { name: "Business & finance", items: [] as string[] },
    { name: "Other", items: [] as string[] },
  ],
};

// Profiles created before the UI moved to English still hold Croatian category
// names. Rename them on read so nothing shows up in the old language. The user's
// own items are untouched, and the rename persists the next time they save.
const LEGACY_SKILL_CATEGORIES: Record<string, string> = {
  Jezici: "Languages",
  "IT & tehnologije": "IT & technology",
  "Ekonomija & poslovanje": "Business & finance",
  Dizajn: "Design",
  Menadžment: "Management",
  Ostalo: "Other",
};

function normalizeSkills(skills: { categories: { name: string; items: string[] }[] }) {
  return {
    ...skills,
    categories: skills.categories.map((c) => ({
      ...c,
      name: LEGACY_SKILL_CATEGORIES[c.name] ?? c.name,
    })),
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nije prijavljen → na login
  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { data: experiences },
    { data: education },
    { data: projects },
    { data: applications },
  ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase
        .from("experiences")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("education")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("applications")
        .select(
          "id,company,role_title,tone,match_score,match_gaps,match_breakdown,cover_letter,cv_suggestions,parsed_job,status,created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const profileData = {
    full_name: profile?.full_name ?? "",
    date_of_birth: profile?.date_of_birth ?? "",
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    bio: profile?.bio ?? "",
    default_tone: profile?.default_tone ?? "Professional",
    skills:
      profile?.skills && Array.isArray(profile.skills.categories)
        ? normalizeSkills(profile.skills)
        : DEFAULT_SKILLS,
    hobbies: Array.isArray(profile?.hobbies) ? profile.hobbies : [],
    certificates: Array.isArray(profile?.certificates) ? profile.certificates : [],
    strengths: Array.isArray(profile?.strengths) ? profile.strengths : [],
  };

  return (
    <DashboardApp
      email={user.email ?? ""}
      profile={profileData}
      experiences={experiences ?? []}
      education={education ?? []}
      projects={projects ?? []}
      applications={applications ?? []}
    />
  );
}
