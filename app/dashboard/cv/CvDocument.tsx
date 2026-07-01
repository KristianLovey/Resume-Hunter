"use client";

import { CSSProperties } from "react";

export type CvData = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  bio: string;
  skills: { name: string; items: string[] }[];
  languages: string[];
  interests: string[];
  certificates: string[];
  strengths: string[];
  experiences: { company: string; position: string; period: string; description: string }[];
  projects: { name: string; period: string; description: string; links: string[] }[];
  education: { institution: string; title: string; period: string }[];
  tailored: {
    company: string;
    role: string;
    summary: string;
    experiences: { title: string; bullets: string[] }[];
  } | null;
};

const heading: CSSProperties = {
  fontSize: 12.5,
  fontWeight: 800,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: "#0F1F44",
  borderBottom: "1.5px solid #D6E0EE",
  paddingBottom: 5,
  marginBottom: 10,
};
const sideHeading: CSSProperties = { ...heading, fontSize: 11.5, marginBottom: 8 };
const sideText: CSSProperties = { fontSize: 11.5, lineHeight: 1.5, color: "#42506B" };

function BulletList({ lines }: { lines: string[] }) {
  return (
    <ul style={{ margin: "6px 0 0", paddingLeft: 16, listStyle: "none" }}>
      {lines.map((l, i) => (
        <li key={i} style={{ position: "relative", fontSize: 12.5, lineHeight: 1.55, color: "#3A4A66", marginBottom: 3, paddingLeft: 12 }}>
          <span style={{ position: "absolute", left: 0, color: "#2563EB" }}>▸</span>
          {l}
        </li>
      ))}
    </ul>
  );
}

function DescBullets({ text }: { text: string }) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[▸•\-*]\s*/, "").trim())
    .filter(Boolean);
  if (lines.length <= 1) {
    return <p style={{ margin: "4px 0 0", fontSize: 12.5, lineHeight: 1.55, color: "#3A4A66" }}>{text.trim()}</p>;
  }
  return <BulletList lines={lines} />;
}

export default function CvDocument({ data, embed = false }: { data: CvData; embed?: boolean }) {
  const summary = (data.tailored?.summary || "").trim() || data.bio;
  const tailoredExps = data.tailored?.experiences ?? [];
  const useTailoredExp = tailoredExps.length > 0;

  return (
    <div className="cv-screen" style={{ minHeight: "100vh", background: embed ? "#fff" : "#EEF2F8", padding: embed ? 0 : "24px 16px" }}>
      {/* toolbar (skriven u embed/preview i u ispisu) */}
      {!embed && (
        <div className="no-print" style={{ maxWidth: 820, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <a href="/dashboard" style={{ fontSize: 13.5, fontWeight: 700, color: "#42506B", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>← Natrag na dashboard</a>
          <button type="button" onClick={() => window.print()} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 18px rgba(37,99,235,.3)" }}>
            Preuzmi PDF (Spremi kao PDF)
          </button>
        </div>
      )}

      {/* CV */}
      <div className="cv-doc" style={{ maxWidth: 820, margin: "0 auto", background: "#fff", boxShadow: embed ? "none" : "0 10px 40px rgba(16,31,68,.15)", padding: "40px 44px" }}>
        {/* header */}
        <div style={{ textAlign: "center", borderBottom: "2px solid #0F1F44", paddingBottom: 16, marginBottom: 22 }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: ".12em", color: "#0F1F44" }}>{data.name.toUpperCase()}</div>
          {data.headline && <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".06em", color: "#2563EB", marginTop: 6 }}>{data.headline}</div>}
          <div style={{ fontSize: 11.5, color: "#5E6B86", marginTop: 8 }}>{[data.location, data.phone, data.email].filter(Boolean).join("  |  ")}</div>
        </div>

        {/* body */}
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
          {/* lijevi stupac */}
          <div style={{ width: 232, flex: "none" }}>
            <div style={sideHeading}>Kontakt</div>
            <div style={{ ...sideText, marginBottom: 16, wordBreak: "break-word" }}>
              {data.location && <div>{data.location}</div>}
              {data.phone && <div style={{ marginTop: 3 }}>{data.phone}</div>}
              <div style={{ marginTop: 3 }}>{data.email || "—"}</div>
              {data.dob && <div style={{ marginTop: 3 }}>Datum rođenja: {data.dob}</div>}
            </div>

            {data.skills.length > 0 && (
              <>
                <div style={sideHeading}>Vještine</div>
                <div style={{ marginBottom: 16 }}>
                  {data.skills.map((c) => (
                    <div key={c.name} style={{ marginBottom: 9 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", marginBottom: 2 }}>{c.name}</div>
                      <div style={sideText}>{c.items.join(", ")}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {data.certificates.length > 0 && (
              <>
                <div style={sideHeading}>Certifikati</div>
                <div style={{ marginBottom: 16 }}>
                  {data.certificates.map((c, i) => (
                    <div key={i} style={{ ...sideText, marginBottom: 4 }}>{c}</div>
                  ))}
                </div>
              </>
            )}

            {data.languages.length > 0 && (
              <>
                <div style={sideHeading}>Jezici</div>
                <div style={{ ...sideText, marginBottom: 16 }}>{data.languages.join(", ")}</div>
              </>
            )}

            {data.strengths.length > 0 && (
              <>
                <div style={sideHeading}>Snage</div>
                <div style={{ marginBottom: 16 }}>
                  {data.strengths.map((s, i) => (
                    <div key={i} style={{ ...sideText, marginBottom: 3 }}>• {s}</div>
                  ))}
                </div>
              </>
            )}

            {data.interests.length > 0 && (
              <>
                <div style={sideHeading}>Interesi</div>
                <div style={sideText}>{data.interests.join(" • ")}</div>
              </>
            )}
          </div>

          {/* desni stupac */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {data.tailored && (
              <div style={{ marginBottom: 16, padding: "8px 12px", background: "#EAF1FE", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "#2563EB" }}>
                Prilagođeno za {[data.tailored.company, data.tailored.role].filter(Boolean).join(" · ") || "odabrani posao"}
              </div>
            )}

            {summary && (
              <>
                <div style={heading}>Profil</div>
                <p style={{ margin: "0 0 16px", fontSize: 12.5, lineHeight: 1.6, color: "#3A4A66" }}>{summary}</p>
              </>
            )}

            {(useTailoredExp || data.experiences.length > 0) && (
              <>
                <div style={heading}>Radno iskustvo</div>
                <div style={{ marginBottom: 16 }}>
                  {useTailoredExp
                    ? tailoredExps.map((e, i) => (
                        <div key={i} style={{ marginBottom: 13 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#13234A" }}>{e.title}</div>
                          {e.bullets.length > 0 && <BulletList lines={e.bullets} />}
                        </div>
                      ))
                    : data.experiences.map((e, i) => (
                        <div key={i} style={{ marginBottom: 13 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#13234A" }}>{[e.position, e.company].filter(Boolean).join(" · ")}</span>
                            {e.period && <span style={{ fontSize: 11, color: "#8A94A6", whiteSpace: "nowrap" }}>{e.period}</span>}
                          </div>
                          {e.description && <DescBullets text={e.description} />}
                        </div>
                      ))}
                </div>
              </>
            )}

            {data.projects.length > 0 && (
              <>
                <div style={heading}>Projekti</div>
                <div style={{ marginBottom: 16 }}>
                  {data.projects.map((p, i) => (
                    <div key={i} style={{ marginBottom: 13 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#13234A" }}>{p.name}</span>
                        {p.period && <span style={{ fontSize: 11, color: "#8A94A6", whiteSpace: "nowrap" }}>{p.period}</span>}
                      </div>
                      {p.description && <DescBullets text={p.description} />}
                      {p.links.length > 0 && (
                        <div style={{ marginTop: 4, fontSize: 11.5, color: "#2563EB", wordBreak: "break-all" }}>{p.links.join("  ·  ")}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {data.education.length > 0 && (
              <>
                <div style={heading}>Obrazovanje</div>
                <div>
                  {data.education.map((e, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#13234A" }}>{[e.title, e.institution].filter(Boolean).join(" · ")}</span>
                        {e.period && <span style={{ fontSize: 11, color: "#8A94A6", whiteSpace: "nowrap" }}>{e.period}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
