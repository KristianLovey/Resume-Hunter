// app/api/hunter/route.ts
// Hunter Agent — pokreće agenta s 4 alata: parseJob → analyzeMatch → generateApplication → saveApplication.
// Sav DB pristup ide preko server Supabase klijenta kao prijavljeni korisnik (RLS). Gemini ključ ostaje na serveru.
import { google } from "@ai-sdk/google";
import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const MODEL = "gemini-2.5-flash";

// ============================================================================
//  SYSTEM PROMPT
//  Zasad kratko. Struktura je namjerno odvojena da se lako proširi.
//
//  >>> PLACEHOLDER: OVDJE KASNIJE DODAJ DETALJNE SMJERNICE KVALITETE
//      I UPUTE PO TONU (per-tone instructions). Npr:
//      - pravila za dobar cover letter (struktura, dužina, bez klišeja)
//      - kako izvući mjerljive rezultate iz iskustva
//      - mapiranje tona -> stil (Profesionalan / Samouvjeren / Prijateljski / Kreativan / Formalan)
//  <<< KRAJ PLACEHOLDERA
// ============================================================================
const SYSTEM_PROMPT = `You are Hunter, an expert CV and cover-letter writer and job-application agent.
You help a candidate apply to a specific job by analyzing the posting, comparing it against the
candidate's real profile, and writing tailored materials.

Rules:
- Always ground your writing in the candidate's REAL data returned by analyzeMatch. Never invent
  jobs, employers, degrees, or skills the candidate does not have.
- Write in the language of the job posting when possible.
- Be concise, specific, and results-oriented.
`;

type Collected = {
  parsedJob: {
    position: string;
    company: string;
    requiredSkills: string[];
    seniority: string;
    companyTone: string;
  } | null;
  match: {
    score: number;
    matched: string[];
    gaps: string[];
    breakdown: { label: string; score: number; weight: number }[];
  } | null;
  coverLetter: string;
  cvSuggestions: string[];
  tailoredCv: { summary: string; experiences: { title: string; bullets: string[] }[] } | null;
  applicationId: string | null;
  saveError: string | null;
};

export async function POST(request: Request) {
  // 1) Auth — samo prijavljeni korisnik (RLS radi kao taj korisnik)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  // 2) Body
  let body: { jobText?: string; tone?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Neispravan zahtjev." }, { status: 400 });
  }
  const jobText = (body?.jobText ?? "").toString().trim();
  const tone = (body?.tone ?? "Profesionalan").toString();
  if (!jobText) {
    return Response.json({ error: "Nedostaje tekst oglasa." }, { status: 400 });
  }

  // 3) Stanje koje alati pune (ne oslanjamo se na model da echo-a strukturu)
  const toolSequence: string[] = [];
  const collected: Collected = {
    parsedJob: null,
    match: null,
    coverLetter: "",
    cvSuggestions: [],
    tailoredCv: null,
    applicationId: null,
    saveError: null,
  };

  // 4) Alati
  const tools = {
    parseJob: tool({
      description: "Extract structured data from the pasted job posting text. Call this first.",
      inputSchema: z.object({
        position: z.string().describe("Job title / position"),
        company: z.string().describe("Company name, or empty string if not stated"),
        requiredSkills: z.array(z.string()).describe("Key required skills / technologies mentioned in the ad"),
        seniority: z.string().describe("Seniority level (e.g. Junior/Mid/Senior), or empty string"),
        companyTone: z.string().describe("Tone/culture implied by the ad (e.g. formal, startup-casual)"),
      }),
      execute: async (input) => {
        toolSequence.push("parseJob");
        collected.parsedJob = input;
        return input;
      },
    }),

    analyzeMatch: tool({
      description:
        "Fetch the logged-in candidate's profile, experiences and education from the database and compare them to the required skills. Returns match score (0-100), matched skills, gaps, and the candidate's real profile data to ground the writing. Call after parseJob.",
      inputSchema: z.object({
        requiredSkills: z.array(z.string()).describe("Required skills extracted from the job posting"),
      }),
      execute: async ({ requiredSkills }) => {
        toolSequence.push("analyzeMatch");

        const [{ data: profile }, { data: experiences }, { data: education }, { data: projects }] = await Promise.all([
          supabase.from("profiles").select("full_name,bio,skills,default_tone,certificates,strengths").eq("id", user.id).maybeSingle(),
          supabase.from("experiences").select("company,company_url,position,period,description").eq("user_id", user.id).order("sort_order", { ascending: true }),
          supabase.from("education").select("institution,title,period").eq("user_id", user.id).order("sort_order", { ascending: true }),
          supabase.from("projects").select("name,description,period,links").eq("user_id", user.id).order("sort_order", { ascending: true }),
        ]);

        // skills jsonb: { categories: [{ name, items: [] }] }
        const userSkills: string[] = Array.isArray(
          (profile?.skills as { categories?: { items?: string[] }[] } | null)?.categories
        )
          ? (profile!.skills as { categories: { items?: string[] }[] }).categories.flatMap((c) =>
              Array.isArray(c.items) ? c.items : []
            )
          : [];

        const norm = (s: string) => s.toLowerCase().trim();
        const req = (requiredSkills || []).map((s) => s.trim()).filter(Boolean);
        const exps = experiences ?? [];
        const edus = education ?? [];
        const projs = projects ?? [];

        // tekstualni blobovi za širu analizu (iskustvo/projekti često spominju tehnologiju bez da je u "vještinama")
        const expText = exps.map((e) => `${e.position ?? ""} ${e.description ?? ""}`).join(" ").toLowerCase();
        const allText = [
          profile?.bio ?? "",
          expText,
          edus.map((e) => `${e.title ?? ""} ${e.institution ?? ""}`).join(" "),
          projs.map((p) => `${p.name ?? ""} ${p.description ?? ""}`).join(" "),
          userSkills.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        const userSkillNorm = userSkills.map(norm);
        const skillHit = (s: string) => {
          const n = norm(s);
          return userSkillNorm.some((u) => u === n || u.includes(n) || n.includes(u)) || allText.includes(n);
        };
        const matched = req.filter(skillHit);
        const gaps = req.filter((s) => !skillHit(s));

        // ---- Sustav ocjenjivanja (težinski, 0..1 po kriteriju) ----
        const pj = collected.parsedJob;
        // 1) Vještine (traženo vs profil)
        const c1 = req.length ? matched.length / req.length : userSkills.length ? 0.5 : 0;
        // 2) Relevantnost iskustva (preklapanje ključnih riječi posla s tekstom iskustva)
        const hasExp = exps.some((e) => (e.position || e.description || "").trim());
        const jobWords = Array.from(
          new Set(
            `${pj?.position ?? ""} ${req.join(" ")}`
              .toLowerCase()
              .split(/[^a-z0-9+#.]+/)
              .filter((w) => w.length > 2)
          )
        );
        const expOverlap = jobWords.length ? jobWords.filter((w) => expText.includes(w)).length / jobWords.length : 0;
        const c2 = hasExp ? Math.min(1, 0.4 + expOverlap) : 0.1;
        // 3) Razina (seniority) posla vs procijenjena razina kandidata
        const sen = (pj?.seniority ?? "").toLowerCase();
        const jobLevel = /intern|junior|entry|pripravnik/.test(sen) ? 1 : /senior|lead|principal|voditelj/.test(sen) ? 3 : /mid|medior/.test(sen) ? 2 : 0;
        const userLevel = exps.length >= 3 ? 3 : exps.length === 0 ? 1 : 2;
        const c3 = jobLevel === 0 ? 0.7 : jobLevel === userLevel ? 1 : Math.abs(jobLevel - userLevel) === 1 ? 0.65 : 0.4;
        // 4) Potpunost profila
        const c4 =
          [!!(profile?.bio ?? "").trim(), hasExp, edus.length > 0, userSkills.length > 0, projs.length > 0].filter(Boolean).length / 5;
        // 5) Pokrivenost ključnih riječi (traženo se pojavljuje bilo gdje u profilu)
        const c5 = req.length ? req.filter((s) => allText.includes(norm(s))).length / req.length : userSkills.length ? 0.5 : 0;

        const w = { skills: 0.4, experience: 0.25, seniority: 0.1, completeness: 0.1, keywords: 0.15 };
        const raw = c1 * w.skills + c2 * w.experience + c3 * w.seniority + c4 * w.completeness + c5 * w.keywords;
        const score = Math.max(0, Math.min(100, Math.round(raw * 100)));

        const breakdown = [
          { label: "Vještine", score: Math.round(c1 * 100), weight: 40 },
          { label: "Relevantnost iskustva", score: Math.round(c2 * 100), weight: 25 },
          { label: "Razina (seniority)", score: Math.round(c3 * 100), weight: 10 },
          { label: "Potpunost profila", score: Math.round(c4 * 100), weight: 10 },
          { label: "Pokrivenost ključnih riječi", score: Math.round(c5 * 100), weight: 15 },
        ];

        collected.match = { score, matched, gaps, breakdown };

        return {
          score,
          matched,
          gaps,
          breakdown,
          candidate: {
            name: profile?.full_name ?? "",
            bio: profile?.bio ?? "",
            skills: userSkills,
            certificates: Array.isArray(profile?.certificates) ? profile.certificates : [],
            strengths: Array.isArray(profile?.strengths) ? profile.strengths : [],
            experiences: exps,
            education: edus,
            projects: projs,
          },
        };
      },
    }),

    generateApplication: tool({
      description:
        "Write the final tailored cover letter and 3-5 CV bullet suggestions in the selected tone, grounded in the candidate's real profile. Call after analyzeMatch.",
      inputSchema: z.object({
        coverLetter: z.string().describe("Full tailored cover letter written in the selected tone"),
        cvSuggestions: z
          .array(z.string())
          .min(1)
          .describe("3-5 concise, achievement-oriented CV bullet suggestions tailored to this job"),
        tailoredSummary: z
          .string()
          .describe("A 2-3 sentence professional summary tailored to this job, grounded in the candidate's real profile"),
        tailoredExperience: z
          .array(
            z.object({
              title: z.string().describe("Position · Company (matching one of the candidate's real experiences)"),
              bullets: z
                .array(z.string())
                .describe("2-4 achievement-oriented bullets, REWRITTEN and tailored to this job with strong action verbs, grounded in the candidate's real experience"),
            })
          )
          .describe("Each of the candidate's real experiences, rewritten and tailored to this job"),
      }),
      execute: async ({ coverLetter, cvSuggestions, tailoredSummary, tailoredExperience }) => {
        toolSequence.push("generateApplication");
        collected.coverLetter = coverLetter;
        collected.cvSuggestions = cvSuggestions;
        collected.tailoredCv = { summary: tailoredSummary, experiences: tailoredExperience };
        return { ok: true };
      },
    }),

    saveApplication: tool({
      description:
        "Save the finished application to the database. Call this LAST, after generateApplication.",
      inputSchema: z.object({
        confirm: z.boolean().describe("Set to true to save the application"),
      }),
      execute: async () => {
        toolSequence.push("saveApplication");
        try {
          const { data, error } = await supabase
            .from("applications")
            .insert({
              user_id: user.id,
              company: collected.parsedJob?.company ?? "",
              role_title: collected.parsedJob?.position ?? "",
              job_description: jobText,
              parsed_job: collected.parsedJob,
              match_score: collected.match?.score ?? null,
              match_gaps: collected.match?.gaps ?? [],
              match_breakdown: collected.match?.breakdown ?? [],
              cover_letter: collected.coverLetter,
              cv_suggestions: collected.cvSuggestions,
              tailored_cv: collected.tailoredCv,
              tone,
              // status -> koristi DB default 'draft'
            })
            .select("id")
            .single();
          if (error) throw error;

          collected.applicationId = data.id as string;
          // agent_runs se logira nakon runa (da uhvati i tokens_used) — vidi dolje.
          return { saved: true, applicationId: data.id };
        } catch (e) {
          collected.saveError = e instanceof Error ? e.message : String(e);
          return { saved: false, error: collected.saveError };
        }
      },
    }),
  };

  // 5) Pokreni agenta
  let usageTokens: number | null = null;
  try {
    const result = await generateText({
      model: google(MODEL),
      system: SYSTEM_PROMPT,
      stopWhen: stepCountIs(8),
      tools,
      prompt: `A candidate wants to apply for the job below. Complete the whole pipeline using your tools, in order:

1) parseJob — extract structured data from the posting.
2) analyzeMatch — pass the required skills; compare against the candidate's real profile.
3) generateApplication — in the "${tone}" tone, produce: (a) a cover letter, (b) 3-5 general CV bullet suggestions, (c) a tailored 2-3 sentence professional summary, and (d) tailoredExperience: for EACH of the candidate's real experiences, rewrite its bullets tailored to this job using strong action verbs. Ground everything strictly in the candidate data returned by analyzeMatch — never invent experience.
4) saveApplication — store the result.

Job posting:
"""
${jobText}
"""`,
    });
    const usage = result.usage as { totalTokens?: number } | undefined;
    const totalUsage = (result as unknown as { totalUsage?: { totalTokens?: number } }).totalUsage;
    usageTokens = totalUsage?.totalTokens ?? usage?.totalTokens ?? null;
  } catch (e) {
    // Ako je nešto puklo, ali imamo generirani sadržaj, ipak ga vrati
    if (!collected.coverLetter) {
      return Response.json(
        { error: e instanceof Error ? e.message : "Greška agenta." },
        { status: 500 }
      );
    }
  }

  // Log agent run NAKON izvršavanja (jedan insert, uključuje steps + tokens_used).
  // agent_runs ima samo SELECT/INSERT RLS policy, pa ne radimo naknadni UPDATE.
  try {
    await supabase.from("agent_runs").insert({
      user_id: user.id,
      application_id: collected.applicationId,
      steps: toolSequence,
      model_used: MODEL,
      tokens_used: usageTokens,
    });
  } catch {
    // logiranje runa nije kritično za odgovor klijentu
  }

  // 6) Strukturirani rezultat za klijent
  return Response.json({
    coverLetter: collected.coverLetter,
    cvSuggestions: collected.cvSuggestions,
    tailoredCv: collected.tailoredCv,
    matchScore: collected.match?.score ?? null,
    gaps: collected.match?.gaps ?? [],
    matchBreakdown: collected.match?.breakdown ?? [],
    parsedJob: collected.parsedJob,
    applicationId: collected.applicationId,
    tools: toolSequence,
    saveError: collected.saveError,
  });
}
