"use client";

import { CSSProperties, ReactNode } from "react";
import { CV_TEMPLATES, CvTheme } from "./templates";
import { setCvTemplate } from "../actions";

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

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[▸•\-*]\s*/, "").trim())
    .filter(Boolean);
}

export default function CvDocument({
  data,
  theme,
  embed = false,
  appId,
}: {
  data: CvData;
  theme: CvTheme;
  embed?: boolean;
  appId?: string;
}) {
  const compact = theme.density === "compact";
  const accent = theme.accent;
  const ink = theme.ink;
  const twoCol = theme.columns === "two";
  const dark = theme.sidebar === "dark";
  const secGap = compact ? 12 : 16;
  const bodyFs = compact ? 12 : 12.5;

  const sidebarBg = theme.sidebar === "dark" ? ink : theme.sidebar === "light" ? "#F6F9FE" : "transparent";
  const sideText = dark ? "#C7D2E6" : "#42506B";
  const sideAccent = dark ? "#9DBEFF" : accent;

  // ---------- naslov sekcije (ovisi o temi) ----------
  const heading = (text: string, onDark = false): ReactNode => {
    const color = onDark ? "#FFFFFF" : ink;
    const acc = onDark ? "#9DBEFF" : accent;
    if (theme.heading === "caps")
      return <div style={{ textTransform: "uppercase", letterSpacing: ".16em", fontWeight: 800, fontSize: 12.5, color: acc, marginBottom: 9 }}>{text}</div>;
    if (theme.heading === "bar")
      return <div style={{ textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 800, fontSize: 12.5, color, borderLeft: `3px solid ${acc}`, paddingLeft: 9, marginBottom: 9 }}>{text}</div>;
    if (theme.heading === "serif")
      return <div style={{ textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700, fontSize: 13, color, borderBottom: `1px solid ${ink}33`, paddingBottom: 4, marginBottom: 9 }}>{text}</div>;
    return <div style={{ textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 800, fontSize: 12.5, color, borderBottom: `1.5px solid ${onDark ? "#ffffff33" : "#D6E0EE"}`, paddingBottom: 5, marginBottom: 9 }}>{text}</div>;
  };

  const bullets = (lines: string[]) => (
    <ul style={{ margin: "6px 0 0", paddingLeft: 16, listStyle: "none" }}>
      {lines.map((l, i) => (
        <li key={i} style={{ position: "relative", fontSize: bodyFs, lineHeight: 1.55, color: "#3A4A66", marginBottom: 3, paddingLeft: 12 }}>
          <span style={{ position: "absolute", left: 0, color: accent }}>▸</span>
          {l}
        </li>
      ))}
    </ul>
  );
  const desc = (text: string) => {
    const lines = splitLines(text);
    if (lines.length <= 1) return <p style={{ margin: "4px 0 0", fontSize: bodyFs, lineHeight: 1.55, color: "#3A4A66" }}>{text.trim()}</p>;
    return bullets(lines);
  };

  const summaryText = (data.tailored?.summary || "").trim() || data.bio;
  const tailoredExps = data.tailored?.experiences ?? [];
  const useTailoredExp = tailoredExps.length > 0;

  // ---------- glavne sekcije (desni stupac / one-column tijelo) ----------
  const Summary = summaryText ? (
    <div style={{ marginBottom: secGap }}>
      {heading("Profil")}
      <p style={{ margin: 0, fontSize: bodyFs, lineHeight: 1.6, color: "#3A4A66" }}>{summaryText}</p>
    </div>
  ) : null;

  const Experience =
    useTailoredExp || data.experiences.length > 0 ? (
      <div style={{ marginBottom: secGap }}>
        {heading("Radno iskustvo")}
        {useTailoredExp
          ? tailoredExps.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#13234A" }}>{e.title}</div>
                {e.bullets.length > 0 && bullets(e.bullets)}
              </div>
            ))
          : data.experiences.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#13234A" }}>{[e.position, e.company].filter(Boolean).join(" · ")}</span>
                  {e.period && <span style={{ fontSize: 11, color: "#8A94A6", whiteSpace: "nowrap" }}>{e.period}</span>}
                </div>
                {e.description && desc(e.description)}
              </div>
            ))}
      </div>
    ) : null;

  const Projects =
    data.projects.length > 0 ? (
      <div style={{ marginBottom: secGap }}>
        {heading("Projekti")}
        {data.projects.map((p, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#13234A" }}>{p.name}</span>
              {p.period && <span style={{ fontSize: 11, color: "#8A94A6", whiteSpace: "nowrap" }}>{p.period}</span>}
            </div>
            {p.description && desc(p.description)}
            {p.links.length > 0 && <div style={{ marginTop: 4, fontSize: 11.5, color: accent, wordBreak: "break-all" }}>{p.links.join("  ·  ")}</div>}
          </div>
        ))}
      </div>
    ) : null;

  const Education =
    data.education.length > 0 ? (
      <div style={{ marginBottom: secGap }}>
        {heading("Obrazovanje")}
        {data.education.map((e, i) => (
          <div key={i} style={{ marginBottom: 9 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#13234A" }}>{[e.title, e.institution].filter(Boolean).join(" · ")}</span>
              {e.period && <span style={{ fontSize: 11, color: "#8A94A6", whiteSpace: "nowrap" }}>{e.period}</span>}
            </div>
          </div>
        ))}
      </div>
    ) : null;

  // ---------- sekcije koje idu u sidebar (two-col) ili full-width (one-col) ----------
  const skillsBlock = (onDark: boolean) =>
    data.skills.length > 0 ? (
      <div style={{ marginBottom: secGap }}>
        {heading("Vještine", onDark)}
        {data.skills.map((c) => (
          <div key={c.name} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: onDark ? "#9DBEFF" : accent, marginBottom: 2 }}>{c.name}</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.5, color: onDark ? sideText : "#42506B" }}>{c.items.join(", ")}</div>
          </div>
        ))}
      </div>
    ) : null;

  const listBlock = (title: string, items: string[], onDark: boolean, joiner = ", ") =>
    items.length > 0 ? (
      <div style={{ marginBottom: secGap }}>
        {heading(title, onDark)}
        <div style={{ fontSize: 11.5, lineHeight: 1.5, color: onDark ? sideText : "#42506B" }}>{items.join(joiner)}</div>
      </div>
    ) : null;

  const contactBlock = (onDark: boolean) => (
    <div style={{ marginBottom: secGap }}>
      {heading("Kontakt", onDark)}
      <div style={{ fontSize: 11.5, lineHeight: 1.55, color: onDark ? sideText : "#42506B", wordBreak: "break-word" }}>
        {data.location && <div>{data.location}</div>}
        {data.phone && <div style={{ marginTop: 3 }}>{data.phone}</div>}
        <div style={{ marginTop: 3 }}>{data.email || "—"}</div>
        {data.dob && <div style={{ marginTop: 3 }}>Datum rođenja: {data.dob}</div>}
      </div>
    </div>
  );

  const sideSections = (onDark: boolean) => (
    <>
      {contactBlock(onDark)}
      {skillsBlock(onDark)}
      {listBlock("Certifikati", data.certificates, onDark, " · ")}
      {listBlock("Jezici", data.languages, onDark)}
      {listBlock("Snage", data.strengths, onDark, " · ")}
      {listBlock("Interesi", data.interests, onDark, " • ")}
    </>
  );

  // ---------- header ----------
  const headerBorder = theme.heading === "serif" || theme.heading === "caps" ? ink : accent;
  const header = (
    <div style={{ textAlign: "center", borderBottom: `2px solid ${headerBorder}`, paddingBottom: 16, marginBottom: 22 }}>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: theme.nameSpacing, color: ink }}>{data.name.toUpperCase()}</div>
      {data.headline && <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".06em", color: accent, marginTop: 6 }}>{data.headline}</div>}
      <div style={{ fontSize: 11.5, color: "#5E6B86", marginTop: 8 }}>{[data.location, data.phone, data.email].filter(Boolean).join("  |  ")}</div>
    </div>
  );

  // ---------- toolbar (picker) ----------
  const pill = (active: boolean): CSSProperties => ({
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12.5,
    fontWeight: 700,
    textDecoration: "none",
    border: active ? "none" : "1px solid #DDE5F0",
    background: active ? "linear-gradient(135deg,#3B82F6,#2563EB)" : "#fff",
    color: active ? "#fff" : "#5A6478",
  });

  return (
    <div className="cv-screen" style={{ minHeight: "100vh", background: embed ? "#fff" : "#EEF2F8", padding: embed ? 0 : "24px 16px" }}>
      {!embed && (
        <div className="no-print" style={{ maxWidth: 900, margin: "0 auto 16px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <a href="/dashboard" style={{ fontSize: 13.5, fontWeight: 700, color: "#42506B", textDecoration: "none" }}>← Natrag</a>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#8A94A6" }}>Predložak:</span>
            {CV_TEMPLATES.map((t) => (
              <a key={t.id} href={`?template=${t.id}${appId ? `&app=${appId}` : ""}`} style={pill(t.id === theme.id)}>
                {t.name}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <form action={setCvTemplate}>
              <input type="hidden" name="template" value={theme.id} />
              {appId && <input type="hidden" name="app" value={appId} />}
              <button type="submit" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #DDE5F0", background: "#fff", color: "#42506B", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Spremi kao zadani</button>
            </form>
            <button type="button" onClick={() => window.print()} style={{ padding: "10px 18px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", fontFamily: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 18px rgba(37,99,235,.3)" }}>Preuzmi PDF</button>
          </div>
        </div>
      )}

      {/* CV */}
      <div className="cv-doc" style={{ maxWidth: 820, margin: "0 auto", background: "#fff", boxShadow: embed ? "none" : "0 1px 3px rgba(16,31,68,.05), 0 24px 60px -18px rgba(16,31,68,.2)", padding: "40px 44px", fontFamily: theme.font }}>
        {header}

        {twoCol ? (
          <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
            <div style={{ width: 236, flex: "none", background: sidebarBg, borderRadius: 12, padding: theme.sidebar === "none" ? 0 : 16, color: dark ? sideText : undefined }}>
              {sideSections(dark)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {Summary}
              {Experience}
              {Projects}
              {Education}
            </div>
          </div>
        ) : (
          <div>
            {Summary}
            {Experience}
            {Projects}
            {Education}
            {skillsBlock(false)}
            {listBlock("Certifikati", data.certificates, false, " · ")}
            {listBlock("Jezici", data.languages, false)}
            {listBlock("Snage", data.strengths, false, " · ")}
            {listBlock("Interesi", data.interests, false, " • ")}
          </div>
        )}
      </div>
    </div>
  );
}
