// app/dashboard/page.tsx
// Server Component: provjeri auth, dohvati profil + iskustva + obrazovanje, pa renderaj klijentsku aplikaciju.
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardApp from "./DashboardApp";

const DEFAULT_SKILLS = {
  categories: [
    { name: "Jezici", items: [] as string[] },
    { name: "IT & tehnologije", items: [] as string[] },
    { name: "Ekonomija & poslovanje", items: [] as string[] },
    { name: "Ostalo", items: [] as string[] },
  ],
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nije prijavljen → na login
  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: experiences }, { data: education }] =
    await Promise.all([
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
    ]);

  const profileData = {
    full_name: profile?.full_name ?? "",
    date_of_birth: profile?.date_of_birth ?? "",
    bio: profile?.bio ?? "",
    default_tone: profile?.default_tone ?? "Profesionalan",
    skills:
      profile?.skills && Array.isArray(profile.skills.categories)
        ? profile.skills
        : DEFAULT_SKILLS,
    hobbies: Array.isArray(profile?.hobbies) ? profile.hobbies : [],
  };

  return (
    <DashboardApp
      email={user.email ?? ""}
      profile={profileData}
      experiences={experiences ?? []}
      education={education ?? []}
    />
  );
}
