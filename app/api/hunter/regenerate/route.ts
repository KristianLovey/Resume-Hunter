// app/api/hunter/regenerate/route.ts — regenerates the CV using the user's edits as context
import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const MODEL = "gemini-2.5-flash";

type EditableCvData = {
  summary: string;
  experiences: { title: string; bullets: string[] }[];
};

const REGENERATE_PROMPT = `You are Hunter, an expert career writer who improves already-written resumes and cover letters.

## TASK
The candidate has edited their resume based on AI suggestions. Your job is to:
1. Keep the candidate's edits as the primary content
2. Refine and enhance their edits (better phrasing, stronger action verbs, better metrics)
3. Maintain truthfulness, never fabricate metrics or experience
4. Re-apply the tailoring to the job posting (keywords, seniority level)

## CV BULLET RULES
- Start with strong action verbs (Developed, Led, Optimized, etc.)
- Quantify impact where possible
- Results first, then how
- One idea per bullet, ideally one line
- NO personal pronouns (no "I"/"we")
- NO clichés, NO buzzword stuffing

## COVER LETTER
- One page, opening with genuine interest in this company/role
- 1-2 middle paragraphs mapping candidate's experience to job requirements
- Close politely with call to interview
- Mirror job posting's keywords where truthfully applicable
- Use the candidate's own words and phrasing, but refine for clarity and impact

##SAFETY
- Never fabricate experience, metrics, or achievements
- Never make the CV say something the candidate's profile does not support
- If the candidate's edits are missing information needed to tailor to the job posting, ask them to add it in their profile`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "You are not signed in." }, { status: 401 });
  }

  let body: {
    applicationId?: string;
    jobText?: string;
    tone?: string;
    userEdits?: EditableCvData;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { applicationId, jobText = "", userEdits } = body;

  if (!applicationId || !jobText) {
    return Response.json({ error: "Missing application or job ad text." }, { status: 400 });
  }

  // Fetch the application to enforce ownership.
  const { data: app, error: appError } = await supabase
    .from("applications")
    .select("parsed_job,match_breakdown")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (appError || !app) {
    return Response.json({ error: "Application not found." }, { status: 404 });
  }

  // Refinement tool: same shape as the main route, but takes the user's edits as input.
  const tools = {
    refineCV: tool({
      description:
        "Refine the candidate's edited CV bullets and summary to be stronger, more concise, and better tailored to the job posting.",
      inputSchema: z.object({
        refinedSummary: z.string().describe("Refined 2-3 sentence summary based on candidate's edits and job posting"),
        refinedExperiences: z
          .array(
            z.object({
              title: z.string().describe("Position · Company from candidate's original profile"),
              bullets: z
                .array(z.string())
                .describe("Refined bullets based on candidate's edits, stronger action verbs, better metrics"),
            })
          )
          .describe("Refined experiences based on candidate's edits"),
      }),
      execute: async (input) => {
        return input;
      },
    }),
  };

  try {
    const result = await generateText({
      model: google(MODEL),
      system: REGENERATE_PROMPT,
      tools,
      prompt: `Candidate's edited CV and job posting below. Refine and enhance their edits while maintaining truthfulness and job fit.

## Candidate's Edits
Summary: ${userEdits?.summary || "N/A"}

Experiences:
${
  userEdits?.experiences
    ?.map(
      (e, i) =>
        `${i + 1}. ${e.title}
   Bullets:
   ${e.bullets.map((b) => `   - ${b}`).join("\n")}`
    )
    .join("\n\n") || "N/A"
}

## Job Posting
${jobText}

Now refine their CV using the refineCV tool.`,
    });

    // Pull the refined CV out of the tool results.
    const toolResults = (result as unknown as { steps?: { type: string; toolResult?: unknown }[] }).steps || [];
    const refinedResult = toolResults
      .find((s: { type: string; toolResult?: unknown }) => s.type === "tool-result")
      ?.toolResult as
      | { refinedSummary: string; refinedExperiences: { title: string; bullets: string[] }[] }
      | undefined;

    if (!refinedResult || !refinedResult.refinedSummary) {
      return Response.json({ error: "Could not read the refinement results." }, { status: 500 });
    }

    return Response.json({
      tailoredCv: {
        summary: refinedResult.refinedSummary,
        experiences: refinedResult.refinedExperiences || [],
      },
    });
  } catch (e) {
    console.error("Regenerate error:", e);
    return Response.json(
      { error: e instanceof Error ? e.message : "Something went wrong while regenerating" },
      { status: 500 }
    );
  }
}
