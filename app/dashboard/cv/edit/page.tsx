// app/dashboard/cv/edit/page.tsx — CV Editor sa editabilnim poljima i regeneracijom
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CvEditor from "../CvEditor";

export default async function CvEditPage({
  searchParams,
}: {
  searchParams: Promise<{ app?: string }>;
}) {
  const { app: applicationId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!applicationId) redirect("/dashboard");

  // Dohvati aplikaciju s tailored CV-om
  const { data: application, error } = await supabase
    .from("applications")
    .select("id, company, role_title, tailored_cv, tailored_cv_edited")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !application) {
    redirect("/dashboard");
  }

  // Koristi edited verziju ako postoji, inače original
  const tailoredCv = application.tailored_cv_edited || application.tailored_cv;

  const initialData = {
    summary: tailoredCv?.summary ?? "",
    experiences: tailoredCv?.experiences ?? [],
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EEF2F8", padding: "24px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <a
            href="/dashboard"
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "#42506B",
              textDecoration: "none",
              marginBottom: 12,
              display: "inline-block",
            }}
          >
            ← Back
          </a>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0F1F44", margin: "12px 0 8px" }}>
            Edit Resume
          </h1>
          <p style={{ fontSize: 15, color: "#5E6B86", margin: 0 }}>
            {application.role_title} · {application.company}
          </p>
        </div>

        {/* Editor */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            padding: "32px",
            boxShadow: "0 1px 3px rgba(16,31,68,.05), 0 12px 32px rgba(16,31,68,.15)",
          }}
        >
          <CvEditor applicationId={applicationId} initialData={initialData} />
        </div>

        {/* Tips */}
        <div
          style={{
            marginTop: 28,
            padding: 16,
            borderRadius: 10,
            background: "#F0F9FF",
            border: "1px solid #BAE6FD",
            color: "#0369A1",
            fontSize: 13.5,
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>💡 Tips:</div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Click any section to edit</li>
            <li>Unsaved changes are saved in your browser (2 hours)</li>
            <li>"Regenerate CV" will enhance your edits with AI suggestions</li>
            <li>Changes are only saved to server when you click "Save"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
