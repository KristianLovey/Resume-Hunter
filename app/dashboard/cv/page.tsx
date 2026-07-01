// app/dashboard/cv/page.tsx — print-optimizirani CV (Spremi kao PDF)
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CvDocument, { CvData } from "./CvDocument";

export default async function CvPage({
  searchParams,
}: {
  searchParams: Promise<{ app?: string; embed?: string }>;
}) {
  const { app, embed } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: experiences }, { data: education }, { data: projects }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("experiences").select("*").eq("user_id", user.id).order("sort_order", { ascending: true }),
      supabase.from("education").select("*").eq("user_id", user.id).order("sort_order", { ascending: true }),
      supabase.from("projects").select("*").eq("user_id", user.id).order("sort_order", { ascending: true }),
    ]);

  // Prilagođeni CV iz konkretne prijave (kad se otvara iz Hunter rezultata)
  let tailored: CvData["tailored"] = null;
  if (app) {
    const { data: appRow } = await supabase
      .from("applications")
      .select("company,role_title,tailored_cv")
      .eq("id", app)
      .eq("user_id", user.id)
      .maybeSingle();
    if (appRow) {
      const tc = appRow.tailored_cv as { summary?: string; experiences?: { title: string; bullets: string[] }[] } | null;
      tailored = {
        company: appRow.company ?? "",
        role: appRow.role_title ?? "",
        summary: tc?.summary ?? "",
        experiences: Array.isArray(tc?.experiences) ? tc!.experiences : [],
      };
    }
  }

  // skills jsonb -> { categories: [{ name, items }] }; izdvoji jezike u zaseban blok
  const cats: { name: string; items: string[] }[] =
    profile?.skills && Array.isArray(profile.skills.categories)
      ? profile.skills.categories.map((c: { name?: string; items?: string[] }) => ({
          name: c.name ?? "",
          items: Array.isArray(c.items) ? c.items : [],
        }))
      : [];
  const langCat = cats.find((c) => /jezik/i.test(c.name));
  const skills = cats.filter((c) => c !== langCat && c.items.length > 0);
  const languages = langCat ? langCat.items : [];

  const dob = profile?.date_of_birth
    ? `${String(profile.date_of_birth).split("-").reverse().join(".")}.`
    : "";
  const name = (profile?.full_name || (user.email ?? "").split("@")[0] || "").trim() || "Korisnik";

  const data: CvData = {
    name,
    headline: experiences?.[0]?.position ?? "",
    email: user.email ?? "",
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    dob,
    bio: profile?.bio ?? "",
    skills,
    languages,
    interests: Array.isArray(profile?.hobbies) ? profile.hobbies : [],
    certificates: Array.isArray(profile?.certificates) ? profile.certificates : [],
    strengths: Array.isArray(profile?.strengths) ? profile.strengths : [],
    experiences: (experiences ?? [])
      .map((e) => ({ company: e.company ?? "", position: e.position ?? "", period: e.period ?? "", description: e.description ?? "" }))
      .filter((e) => e.company || e.position || e.description),
    projects: (projects ?? [])
      .map((p) => ({ name: p.name ?? "", period: p.period ?? "", description: p.description ?? "", links: Array.isArray(p.links) ? p.links : [] }))
      .filter((p) => p.name || p.description),
    education: (education ?? [])
      .map((e) => ({ institution: e.institution ?? "", title: e.title ?? "", period: e.period ?? "" }))
      .filter((e) => e.institution || e.title),
    tailored,
  };

  return <CvDocument data={data} embed={embed === "1"} />;
}
