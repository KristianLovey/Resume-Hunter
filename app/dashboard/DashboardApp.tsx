"use client";

import { CSSProperties, useEffect, useRef, useState, useTransition } from "react";
import { logout } from "@/app/auth/actions";
import { getMatchingCities, isMajorCity } from "@/lib/locationData";
import DatePicker from "@/app/components/DatePicker";
import { useTheme } from "@/lib/useTheme";
import HunterChat from "./HunterChat";
import {
  saveProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addProject,
  updateProject,
  deleteProject,
  deleteApplication,
  updateApplicationStatus,
  deleteAccount,
} from "./actions";

/* ===================== Icons ===================== */
type IconProps = { size?: number; color?: string; w?: number };
const base = (size: number, color: string, w: number): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: w,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});
const IUser = ({ size = 19, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const ISearch = ({ size = 19, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
const IGrid = ({ size = 19, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);
const IBriefcase = ({ size = 20, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);
const ICap = ({ size = 20, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>
);
const IFolder = ({ size = 20, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z" /></svg>
);
const IAward = ({ size = 20, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><circle cx="12" cy="8" r="6" /><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" /></svg>
);
const IStar = ({ size = 20, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="m12 2 2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6z" /></svg>
);
const IHeart = ({ size = 20, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.9z" /></svg>
);
const IChat = ({ size = 20, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg>
);
const IPlus = ({ size = 17, color = "currentColor", w = 2.3 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M12 5v14M5 12h14" /></svg>
);
const IX = ({ size = 15, color = "currentColor", w = 2.2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
const ILink = ({ size = 14, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></svg>
);
const IInfo = ({ size = 15, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
);
const ISparkles = ({ size = 19, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="m12 3 1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" /></svg>
);
const IRefresh = ({ size = 16, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.4 2.6L3 8" /><path d="M3 3v5h5" /></svg>
);
const ICheck = ({ size = 15, color = "currentColor", w = 3 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M20 6 9 17l-5-5" /></svg>
);
const IFile = ({ size = 17, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
);
const IMail = ({ size = 17, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>
);
const IEye = ({ size = 15, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
);
const ICopy = ({ size = 16, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);
const IDownload = ({ size = 16, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
);
const IChevron = ({ size = 14, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="m6 9 6 6 6-6" /></svg>
);
const IChevronLeft = ({ size = 16, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="m15 18-6-6 6-6" /></svg>
);
const IChevronRight = ({ size = 16, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="m9 18 6-6-6-6" /></svg>
);
const ICog = ({ size = 19, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
);
const IMoon = ({ size = 18, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
);
const ISun = ({ size = 18, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
const ITrash = ({ size = 17, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
);
const IShield = ({ size = 18, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const ILogout = ({ size = 17, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
);

/* ===================== Data ===================== */
type Tone = { name: string; desc: string };
const TONES: Tone[] = [
  { name: "Professional", desc: "Clear and dependable" },
  { name: "Confident", desc: "Decisive and direct" },
  { name: "Friendly", desc: "Warm and approachable" },
  { name: "Creative", desc: "Imaginative and lively" },
  { name: "Formal", desc: "Classic and polite" },
];
const TONE_TINT: Record<string, string> = {
  Professional: "var(--rh-accent)",
  Confident: "#0EA5E9",
  Friendly: "#7C3AED",
  Creative: "#DB2777",
  Formal: "#0F766E",
};
// Profiles saved before the UI moved to English still hold Croatian tone names.
// Map them across so the saved tone stays selected instead of silently resetting.
const LEGACY_TONES: Record<string, string> = {
  Profesionalan: "Professional",
  Samouvjeren: "Confident",
  Prijateljski: "Friendly",
  Kreativan: "Creative",
  Formalan: "Formal",
};
function normalizeTone(tone: string | null | undefined): string {
  const t = (tone || "").trim();
  if (!t) return "Professional";
  if (LEGACY_TONES[t]) return LEGACY_TONES[t];
  return TONES.some((x) => x.name === t) ? t : "Professional";
}
// Sigurna poveznica za render, dopusti samo http(s) (spriječi javascript:/data: XSS).
function safeHref(raw: string): string {
  const s = (raw || "").trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (/^(javascript|data|vbscript|file|blob):/i.test(s)) return "#";
  if (/^[\w.-]+\.[a-z]{2,}(\/|$|\?|#)/i.test(s)) return `https://${s}`;
  return "#";
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};
const WORK = [
  "Analysing your profile and skills",
  "Reviewing the ad and the company site",
  "Finding keywords and requirements",
  "Writing your tailored resume",
  "Composing your cover letter",
];

// Skill category templates (clicking adds an empty category you then fill in).
const SKILL_CATEGORY_TEMPLATES = [
  "Languages",
  "IT & technology",
  "Business & finance",
  "Design",
  "Marketing",
  "Management",
  "Other",
];
// Suggested skills per category (clicking adds it to that category).
const SKILL_SUGGESTIONS: Record<string, string[]> = {
  Languages: ["English", "German", "Italian", "Spanish", "French", "Croatian", "Slovenian"],
  "IT & technology": ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "SQL", "PostgreSQL", "Git", "Docker", "AWS", "HTML/CSS"],
  "Business & finance": ["Project management", "Agile methods", "Analytics", "Negotiation", "Excel", "Finance", "Sales"],
  Design: ["Figma", "Photoshop", "Illustrator", "UI/UX", "Wireframing", "Prototyping", "Brand design"],
  Marketing: ["SEO", "Google Ads", "Content marketing", "Social media", "Email marketing", "Copywriting", "Analytics"],
  Management: ["Team leadership", "Communication", "Organisation", "Mentoring", "Decision making", "Time management"],
  Other: ["Driving licence (B)", "Teamwork", "Problem solving", "Creativity", "Adaptability"],
};

// Suggested hobbies grouped by category (clicking toggles selection).
const HOBBY_SUGGESTIONS: { name: string; items: string[] }[] = [
  { name: "Sport and recreation", items: ["Hiking", "Running", "Football", "Basketball", "Cycling", "Swimming", "Yoga", "Gym", "Tennis"] },
  { name: "Arts and culture", items: ["Photography", "Playing an instrument", "Painting", "Writing", "Theatre", "Film", "Dance"] },
  { name: "Technology", items: ["Programming", "Gaming", "Robotics", "3D printing", "Electronics"] },
  { name: "Nature and travel", items: ["Travel", "Camping", "Gardening", "Fishing", "Birdwatching"] },
  { name: "Social and mind", items: ["Chess", "Reading", "Volunteering", "Cooking", "Board games", "Language learning"] },
];

/* ===================== Props ===================== */
type SkillCategory = { name: string; items: string[] };
type ProfileData = {
  full_name: string;
  date_of_birth: string;
  phone: string;
  location: string;
  bio: string;
  default_tone: string;
  skills: { categories: SkillCategory[] };
  hobbies: string[];
  certificates: string[];
  strengths: string[];
};
type ExperienceRow = { id: string; company: string; company_url: string; position: string; period: string; description: string };
type EducationRow = { id: string; institution: string; title: string; period: string; link: string };
type ProjectRow = { id: string; name: string; description: string; period: string; links: string[] };
type MatchCriterion = { label: string; score: number; weight: number };
type HunterResult = {
  coverLetter: string;
  cvSuggestions: string[];
  matchScore: number | null;
  gaps: string[];
  matchBreakdown?: MatchCriterion[];
  parsedJob: { position?: string; company?: string; requiredSkills?: string[]; seniority?: string; companyTone?: string } | null;
  applicationId: string | null;
  saveError?: string | null;
};
type ApplicationRow = {
  id: string;
  company: string | null;
  role_title: string | null;
  tone: string | null;
  match_score: number | null;
  match_gaps: string[] | null;
  match_breakdown: MatchCriterion[] | null;
  cover_letter: string | null;
  cv_suggestions: string[] | null;
  parsed_job: { company?: string; position?: string } | null;
  status: string | null;
  created_at: string;
};

/* ===================== Shared styles ===================== */
const card: CSSProperties = { background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 20, padding: "28px 30px", boxShadow: "0 1px 2px rgba(var(--rh-shadow-rgb),.06), 0 22px 44px -26px rgba(var(--rh-shadow-rgb),.3)" };
const secIcon: CSSProperties = { width: 40, height: 40, borderRadius: 11, background: "var(--rh-accent-soft)", color: "var(--rh-accent)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" };
const label: CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 700, color: "var(--rh-text-2)", marginBottom: 7 };
const labelSm: CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "var(--rh-text-2)", marginBottom: 6 };
const field: CSSProperties = { width: "100%", padding: "12px 14px", border: "1px solid var(--rh-border)", borderRadius: 11, font: "inherit", fontSize: 14, color: "var(--rh-text)", background: "var(--rh-surface)" };
const fieldSm: CSSProperties = { width: "100%", padding: "11px 13px", border: "1px solid var(--rh-border)", borderRadius: 10, font: "inherit", fontSize: 13.5, color: "var(--rh-text)", background: "var(--rh-surface)" };
const chip: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 999, background: "var(--rh-surface-3)", color: "var(--rh-text-2)", fontSize: 13, fontWeight: 600 };
const chipX: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", border: "none", background: "transparent", color: "var(--rh-text-3)", cursor: "pointer", padding: 0 };
const chipAdd: CSSProperties = { padding: "8px 13px", borderRadius: 999, background: "var(--rh-surface)", border: "1px dashed var(--rh-border-strong)", color: "var(--rh-accent)", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const addBtn: CSSProperties = { marginTop: 16, width: "100%", padding: 13, borderRadius: 12, border: "1.5px dashed var(--rh-border-strong)", background: "var(--rh-surface-2)", color: "var(--rh-accent)", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };
const iconBtn: CSSProperties = { width: 34, height: 34, borderRadius: 9, border: "1px solid #E4EAF3", background: "var(--rh-surface)", color: "var(--rh-text-2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const saveRowBtn: CSSProperties = { padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const catTitle: CSSProperties = { fontSize: 12.5, fontWeight: 800, color: "var(--rh-accent)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 11 };
const suggChip: CSSProperties = { padding: "7px 12px", borderRadius: 999, background: "var(--rh-surface-2)", border: "1px dashed var(--rh-border-strong)", color: "var(--rh-accent)", font: "inherit", fontSize: 12.5, fontWeight: 700, cursor: "pointer" };
const suggChipActive: CSSProperties = { padding: "7px 12px", borderRadius: 999, background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", border: "1px solid var(--rh-accent)", color: "#fff", font: "inherit", fontSize: 12.5, fontWeight: 700, cursor: "pointer" };
const suggLabel: CSSProperties = { fontSize: 12, fontWeight: 600, color: "var(--rh-text-3)" };
const catRemoveBtn: CSSProperties = { width: 26, height: 26, flex: "none", borderRadius: 8, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-text-4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const cvH: CSSProperties = { fontSize: 11.5, fontWeight: 800, color: "var(--rh-accent)", letterSpacing: ".05em", margin: "22px 0 9px" };
const cvChip: CSSProperties = { padding: "5px 11px", borderRadius: 999, background: "var(--rh-surface-3)", color: "var(--rh-text-2)", fontSize: 12, fontWeight: 600 };
const sectionHead = (icon: React.ReactNode, title: string, sub: string) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
    <div style={secIcon}>{icon}</div>
    <div>
      <h2 style={{ margin: 0, fontSize: 16.5, fontWeight: 800, color: "var(--rh-text)" }}>{title}</h2>
      <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--rh-text-3)" }}>{sub}</p>
    </div>
  </div>
);

type Screen = "profile" | "hunter" | "dashboard" | "settings";
type HunterStep = "input" | "working" | "result";
type HunterMode = "generate" | "chat";

// Inline dodavanje chipa (zamjena za window.prompt, koji nije podržan u VS Code browseru).
function ChipAdder({ placeholder, onAdd }: { placeholder: string; onAdd: (v: string) => void }) {
  const [v, setV] = useState("");
  const submit = () => {
    const t = v.trim();
    if (!t) return;
    onAdd(t);
    setV("");
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <input
        className="rh-field"
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        style={{ width: 168, padding: "7px 13px", border: "1px solid var(--rh-border)", borderRadius: 999, font: "inherit", fontSize: 13, color: "var(--rh-text)", background: "var(--rh-surface)" }}
      />
      <button type="button" onClick={submit} title="Add" style={{ ...chipAdd, padding: "7px 13px" }}>+ Add</button>
    </span>
  );
}

// Mala napomena s indikatorom (zeleno = uvjet ispunjen).
function Note({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p style={{ margin: "8px 0 0", fontSize: 12, fontWeight: 600, color: ok ? "var(--rh-success)" : "var(--rh-text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
      {ok ? <ICheck size={13} color="var(--rh-success)" w={3} /> : <IInfo size={13} color="var(--rh-text-4)" />}
      {children}
    </p>
  );
}

/* ===================== Period (mjesec/godina) picker ===================== */
const MONTHS_HR = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const NOW_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: NOW_YEAR - 1969 }, (_, i) => String(NOW_YEAR - i));

function parsePeriod(v: string) {
  const res = { fromM: "", fromY: "", toM: "", toY: "", current: false };
  if (!v) return res;
  const parts = v.split(/\s*[-–,]\s*/);
  const parseOne = (s: string) => {
    const m = s.match(/(\d{1,2})[/.](\d{4})/);
    return m ? { mo: String(parseInt(m[1], 10)), yr: m[2] } : null;
  };
  const a = parts[0] ? parseOne(parts[0]) : null;
  if (a) {
    res.fromM = a.mo;
    res.fromY = a.yr;
  }
  const bRaw = parts[1] || "";
  if (/present|danas|current|sada/i.test(bRaw)) res.current = true;
  else {
    const b = parseOne(bRaw);
    if (b) {
      res.toM = b.mo;
      res.toY = b.yr;
    }
  }
  return res;
}

function PeriodField({ name, defaultValue }: { name: string; defaultValue: string }) {
  const parsed = parsePeriod(defaultValue);
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const [fromM, setFromM] = useState(parsed.fromM);
  const [fromY, setFromY] = useState(parsed.fromY);
  const [toM, setToM] = useState(parsed.toM);
  const [toY, setToY] = useState(parsed.toY);
  const [current, setCurrent] = useState(parsed.current);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function apply() {
    const from = fromM && fromY ? `${fromM}/${fromY}` : "";
    let result = "";
    if (from) {
      if (current) result = `${from} - present`;
      else if (toM && toY) result = `${from} - ${toM}/${toY}`;
      else result = from;
    }
    setValue(result);
    setOpen(false);
  }

  const selStyle: CSSProperties = { ...fieldSm, padding: "9px 10px", cursor: "pointer" };
  const grpLabel: CSSProperties = { fontSize: 11.5, fontWeight: 800, color: "var(--rh-text-2)", letterSpacing: ".03em", marginBottom: 7 };
  const monthOpts = MONTHS_HR.map((m, i) => (
    <option key={m} value={i + 1}>
      {i + 1} – {m}
    </option>
  ));
  const yearOpts = YEAR_OPTIONS.map((y) => (
    <option key={y} value={y}>
      {y}
    </option>
  ));

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <input type="hidden" name={name} value={value} readOnly />
      <button type="button" onClick={() => setOpen((o) => !o)} className="rh-field" style={{ ...fieldSm, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ color: value ? "var(--rh-text)" : "var(--rh-text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value || "Select a period"}</span>
        <IChevron size={14} color="var(--rh-text-3)" />
      </button>

      {open && (
        <div style={{ position: "absolute", zIndex: 40, top: "calc(100% + 6px)", left: 0, minWidth: 292, background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 14, boxShadow: "0 20px 44px rgba(16,31,68,.2)", padding: 16 }}>
          <div style={grpLabel}>OD</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <select value={fromM} onChange={(e) => setFromM(e.target.value)} style={selStyle}>
              <option value="">Mjesec</option>
              {monthOpts}
            </select>
            <select value={fromY} onChange={(e) => setFromY(e.target.value)} style={{ ...selStyle, maxWidth: 112 }}>
              <option value="">Godina</option>
              {yearOpts}
            </select>
          </div>

          {!current && (
            <>
              <div style={grpLabel}>DO</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <select value={toM} onChange={(e) => setToM(e.target.value)} style={selStyle}>
                  <option value="">Mjesec</option>
                  {monthOpts}
                </select>
                <select value={toY} onChange={(e) => setToY(e.target.value)} style={{ ...selStyle, maxWidth: 112 }}>
                  <option value="">Godina</option>
                  {yearOpts}
                </select>
              </div>
            </>
          )}

          <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--rh-text-2)", marginBottom: 16 }}>
            <input type="checkbox" checked={current} onChange={(e) => setCurrent(e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--rh-accent)", cursor: "pointer" }} />
            I currently work here (present)
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setOpen(false)} style={{ padding: "9px 14px", borderRadius: 9, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-text-2)", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Odustani</button>
            <button type="button" onClick={apply} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Primijeni</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardApp({
  email,
  profile,
  experiences,
  education,
  projects,
  applications,
}: {
  email: string;
  profile: ProfileData;
  experiences: ExperienceRow[];
  education: EducationRow[];
  projects: ProjectRow[];
  applications: ApplicationRow[];
}) {
  const [screen, setScreen] = useState<Screen>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoOk, setLogoOk] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Settings, brisanje računa
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, startDelete] = useTransition();

  // Profil, kontrolirana polja (init iz baze)
  const [fullName, setFullName] = useState(profile.full_name);
  const [dob, setDob] = useState(profile.date_of_birth);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<typeof import("@/lib/locationData").MAJOR_CITIES>([]);
  const [bio, setBio] = useState(profile.bio);
  const [selectedTone, setSelectedTone] = useState(normalizeTone(profile.default_tone));
  const [skills, setSkills] = useState<SkillCategory[]>(profile.skills.categories);
  const [hobbies, setHobbies] = useState<string[]>(profile.hobbies);
  const [certificates, setCertificates] = useState<string[]>(profile.certificates);
  const [strengths, setStrengths] = useState<string[]>(profile.strengths);
  const [isSaving, startSave] = useTransition();

  // Hunter
  const [hunterTone, setHunterTone] = useState(normalizeTone(profile.default_tone));
  const [hunterStep, setHunterStep] = useState<HunterStep>("input");
  const [hunterMode, setHunterMode] = useState<HunterMode>("generate");
  const [workIdx, setWorkIdx] = useState(0);
  const [toast, setToast] = useState("");
  const [jobText, setJobText] = useState("");
  const [hunterResult, setHunterResult] = useState<HunterResult | null>(null);
  const [dashFilter, setDashFilter] = useState<"all" | "week" | "interview">("all");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (toastRef.current) clearTimeout(toastRef.current);
    },
    []
  );

  // Zatvori pregled na Escape
  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewOpen]);

  const derivedName = email
    ? email
        .split("@")[0]
        .split(/[._-]/)
        .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
        .join(" ")
    : "Korisnik";
  const displayName = fullName.trim() || derivedName;
  const initials = (displayName.replace(/[^A-Za-zČĆĐŠŽ ]/g, "").trim() || "RH")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Stvarna popunjenost profila (živi izračun dok uređuješ).
  const completionChecks = [
    { ok: !!fullName.trim(), hint: "Add your first and last name" },
    { ok: !!dob, hint: "Add your date of birth" },
    { ok: !!bio.trim(), hint: "Write a short description about yourself" },
    { ok: experiences.some((e) => (e.company || e.position || e.description || "").trim()), hint: "Add radno iskustvo" },
    { ok: education.some((e) => (e.institution || e.title || "").trim()), hint: "Add obrazovanje" },
    { ok: skills.some((c) => c.items.length > 0), hint: "Add at least one skill" },
    { ok: hobbies.length >= 3, hint: "Pick at least 3 hobbies" },
  ];
  const completionDone = completionChecks.filter((c) => c.ok).length;
  const completionPct = Math.round((completionDone / completionChecks.length) * 100);
  const completionHint = completionChecks.find((c) => !c.ok)?.hint;

  /**
   * Provjera spremnosti profila za Hunter, deterministička, bez AI-ja.
   * "blocking" znači da bez toga generirani CV nema od čega nastati.
   */
  const readinessChecks = [
    { label: "Full name", ok: !!fullName.trim(), blocking: true, fix: "Enter your first and last name in your profile." },
    {
      label: "Work experience",
      ok: experiences.some((e) => (e.position || "").trim() && (e.company || "").trim()),
      blocking: true,
      fix: "Add at least one role with a position and company.",
    },
    {
      label: "Experience descriptions",
      ok: experiences.some((e) => (e.description || "").trim().length >= 40),
      blocking: true,
      fix: "Describe what you did in at least one job (2 to 3 sentences).",
    },
    {
      label: "Skills",
      ok: skills.reduce((n, c) => n + c.items.length, 0) >= 3,
      blocking: true,
      fix: "Add at least 3 skills.",
    },
    { label: "Short description about you", ok: bio.trim().length >= 40, blocking: false, fix: "Write 2 to 3 sentences about yourself." },
    {
      label: "Education",
      ok: education.some((e) => (e.institution || "").trim()),
      blocking: false,
      fix: "Add a school or university.",
    },
    { label: "Contact (phone)", ok: !!phone.trim(), blocking: false, fix: "Add a phone number." },
    { label: "Location", ok: !!location.trim(), blocking: false, fix: "Add the city where you are job hunting." },
    {
      label: "Projects or certificates",
      ok: projects.some((p) => (p.name || "").trim()) || certificates.length > 0,
      blocking: false,
      fix: "Add a project or certificate. It strengthens your application.",
    },
  ];
  const readinessBlocking = readinessChecks.filter((c) => c.blocking && !c.ok);
  const readinessOptional = readinessChecks.filter((c) => !c.blocking && !c.ok);
  const readinessOk = readinessBlocking.length === 0;

  // Filtrirani podaci za CV pregled (preskoči prazne retke)
  const expList = experiences.filter((e) => (e.company || e.position || e.description || e.period || "").trim());
  const eduList = education.filter((e) => (e.institution || e.title || e.period || "").trim());
  const projList = projects.filter((p) => (p.name || p.description || (p.links || []).join("")).trim());
  const skillCats = skills.filter((c) => c.items.length > 0);
  const dobFmt = dob ? `${dob.split("-").reverse().join(".")}.` : "";
  const headRole = experiences.find((e) => (e.position || "").trim())?.position || "";

  function go(next: Screen) {
    setScreen(next);
    window.scrollTo(0, 0);
  }

  function showToast(msg: string) {
    setToast(msg);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(""), 1900);
  }

  function onSaveProfile() {
    startSave(async () => {
      const res = await saveProfile({
        full_name: fullName,
        date_of_birth: dob,
        phone,
        location,
        bio,
        default_tone: selectedTone,
        skills: { categories: skills },
        hobbies,
        certificates,
        strengths,
      });
      showToast(res?.ok ? "Profile saved" : res?.message || "Something went wrong while saving");
    });
  }

  function addSkillValue(catIdx: number, v: string) {
    setSkills((s) => s.map((c, i) => (i === catIdx ? (c.items.includes(v) ? c : { ...c, items: [...c.items, v] }) : c)));
  }
  function removeSkill(catIdx: number, itemIdx: number) {
    setSkills((s) => s.map((c, i) => (i === catIdx ? { ...c, items: c.items.filter((_, j) => j !== itemIdx) } : c)));
  }
  function addCategory(name: string) {
    const n = name.trim();
    if (!n) return;
    setSkills((s) => (s.some((c) => c.name.toLowerCase() === n.toLowerCase()) ? s : [...s, { name: n, items: [] }]));
  }
  function removeCategory(catIdx: number) {
    setSkills((s) => s.filter((_, i) => i !== catIdx));
  }
  function addHobbyValue(v: string) {
    setHobbies((h) => (h.includes(v) ? h : [...h, v]));
  }
  function removeHobby(idx: number) {
    setHobbies((h) => h.filter((_, j) => j !== idx));
  }
  function toggleHobby(v: string) {
    setHobbies((h) => (h.includes(v) ? h.filter((x) => x !== v) : [...h, v]));
  }
  function addCertificate(v: string) {
    setCertificates((c) => (c.includes(v) ? c : [...c, v]));
  }
  function removeCertificate(idx: number) {
    setCertificates((c) => c.filter((_, j) => j !== idx));
  }
  function addStrength(v: string) {
    setStrengths((s) => (s.includes(v) ? s : [...s, v]));
  }
  function removeStrength(idx: number) {
    setStrengths((s) => s.filter((_, j) => j !== idx));
  }

  async function generate() {
    const text = jobText.trim();
    if (!text) {
      showToast("Paste the job ad text.");
      return;
    }
    setHunterResult(null);
    setHunterStep("working");
    setWorkIdx(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    // koraci se vrte kao loader dok agent radi; zadnji korak "pulsira" do odgovora
    intervalRef.current = setInterval(() => {
      setWorkIdx((prev) => (prev < WORK.length - 1 ? prev + 1 : prev));
    }, 900);
    try {
      const res = await fetch("/api/hunter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobText: text, tone: hunterTone }),
      });
      const data = await res.json().catch(() => ({}));
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!res.ok) {
        setHunterStep("input");
        showToast(data?.error || "Something went wrong while generating.");
        return;
      }
      setWorkIdx(WORK.length);
      setHunterResult(data as HunterResult);
      setHunterStep("result");
    } catch {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setHunterStep("input");
      showToast("The agent is unavailable right now.");
    }
  }

  function copyCover() {
    try {
      navigator.clipboard.writeText(hunterResult?.coverLetter || "");
    } catch {}
    showToast("Cover letter copied");
  }
  function resetHunter() {
    setHunterStep("input");
    setWorkIdx(0);
    setHunterResult(null);
  }
  function newWithHunter() {
    resetHunter();
    go("hunter");
  }
  // Open spremljenu prijavu u Hunter "result" prikazu (reuse istog UI-ja)
  function openApplication(app: ApplicationRow) {
    const pj = app.parsed_job && typeof app.parsed_job === "object" ? app.parsed_job : {};
    setHunterTone(app.tone || "Professional");
    setHunterResult({
      coverLetter: app.cover_letter || "",
      cvSuggestions: Array.isArray(app.cv_suggestions) ? app.cv_suggestions : [],
      matchScore: app.match_score ?? null,
      gaps: Array.isArray(app.match_gaps) ? app.match_gaps : [],
      matchBreakdown: Array.isArray(app.match_breakdown) ? app.match_breakdown : [],
      parsedJob: { ...pj, company: app.company || pj.company || "", position: app.role_title || pj.position || "" },
      applicationId: app.id,
      saveError: null,
    });
    setHunterStep("result");
    go("hunter");
  }

  const navStyle = (name: Screen): CSSProperties => {
    const active = screen === name;
    return {
      display: "flex",
      alignItems: "center",
      gap: 12,
      // Aktivna stavka ima i traku s lijeve strane, ne samo drugu boju,
      // da se razlikuje i kad se boje ne razaznaju.
      padding: "11px 14px 11px 11px",
      borderRadius: 12,
      cursor: "pointer",
      border: "none",
      borderLeft: active ? "3px solid var(--rh-accent)" : "3px solid transparent",
      width: "100%",
      textAlign: "left",
      fontFamily: "inherit",
      fontSize: 14.5,
      fontWeight: active ? 700 : 600,
      color: active ? "var(--rh-accent)" : "var(--rh-text-2)",
      background: active ? "var(--rh-accent-soft)" : "transparent",
      boxShadow: "none",
      transition: "background .18s ease, color .18s ease",
    };
  };

  /* ===================== Sidebar ===================== */
  const sidebar = (
    <div style={{ flex: "none", width: sidebarOpen ? 266 : 0, transition: "width .26s ease", position: "sticky", top: 0, height: "100vh", overflow: "hidden", zIndex: 5 }}>
      <aside style={{ width: 266, height: "100vh", background: "var(--rh-surface)", borderRight: "1px solid rgba(var(--rh-shadow-rgb),.06)", display: "flex", flexDirection: "column", padding: "22px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "4px 2px 0" }}>
          <a href="/" title="Back to home" aria-label="Back to home" style={{ display: "inline-flex", flex: "none", textDecoration: "none" }}>
            {logoOk ? (
              <img src="/logo.png" alt="Resume Hunter" onError={() => setLogoOk(false)} style={{ width: 42, height: 42, flex: "none", objectFit: "contain", borderRadius: 11 }} />
            ) : (
              <div style={{ width: 42, height: 42, flex: "none", borderRadius: 11, background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent-dark))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ISearch size={22} color="#fff" />
              </div>
            )}
          </a>
          <div style={{ lineHeight: 1.05, flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.01em" }}>
              <span style={{ color: "var(--rh-text)" }}>Resume</span> <span style={{ color: "var(--rh-accent)" }}>Hunter</span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--rh-text-3)", letterSpacing: ".02em", marginTop: 2 }}>AI agent for smarter applications</div>
          </div>
          <button type="button" onClick={() => setSidebarOpen(false)} title="Hide menu" className="rh-icon" style={{ ...iconBtn, width: 30, height: 30, flex: "none" }}>
            <IChevronLeft size={16} color="var(--rh-text-3)" />
          </button>
        </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 30 }}>
        <button onClick={() => go("profile")} style={navStyle("profile")}>
          <IUser />
          <span>My profile</span>
        </button>
        <button onClick={() => go("hunter")} style={navStyle("hunter")}>
          <ISearch />
          <span>Hunter Agent</span>
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 800, letterSpacing: ".04em", padding: "2px 7px", borderRadius: 6, background: screen === "hunter" ? "var(--rh-accent)" : "var(--rh-accent-soft-2)", color: screen === "hunter" ? "#fff" : "var(--rh-accent)" }}>AI</span>
        </button>
        <button onClick={() => go("dashboard")} style={navStyle("dashboard")}>
          <IGrid />
          <span>Dashboard</span>
        </button>
        <button onClick={() => go("settings")} style={navStyle("settings")}>
          <ICog />
          <span>Settings</span>
        </button>
      </nav>

      <div style={{ marginTop: 22, padding: "15px 16px", borderRadius: 16, background: "var(--rh-surface)", border: "1px solid var(--rh-border)", boxShadow: "0 1px 2px rgba(var(--rh-shadow-rgb),.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            {completionPct === 100 && (
              <span style={{ width: 18, height: 18, flex: "none", borderRadius: "50%", background: "var(--rh-success-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ICheck size={11} color="var(--rh-success)" w={3} />
              </span>
            )}
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--rh-text-2)", letterSpacing: "-.01em" }}>Profile completeness</span>
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: completionPct === 100 ? "var(--rh-success)" : "var(--rh-accent)" }}>{completionPct}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 6, background: "var(--rh-border-soft)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${completionPct}%`, borderRadius: 6, background: completionPct === 100 ? "linear-gradient(90deg,#22C55E,var(--rh-success))" : "linear-gradient(90deg,var(--rh-accent-2),var(--rh-accent))", transition: "width .35s ease" }} />
        </div>
        <div style={{ fontSize: 11.5, color: "var(--rh-text-3)", lineHeight: 1.45, marginTop: 10 }}>
          {completionHint ? `${completionHint} for better results.` : "Profile complete and ready for Hunter."}
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 11, padding: "16px 8px 0", borderTop: "1px solid var(--rh-border-soft)" }}>
        <div style={{ width: 38, height: 38, flex: "none", borderRadius: "50%", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent-dark))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{initials}</div>
        <div style={{ minWidth: 0, lineHeight: 1.2, flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--rh-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
          <div style={{ fontSize: 11.5, color: "var(--rh-text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</div>
        </div>
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={theme === "dark" ? "Svijetla tema" : "Tamna tema"}
          className="rh-icon"
          style={{ ...iconBtn, width: 32, height: 32, border: "1px solid var(--rh-border-soft)" }}
        >
          {theme === "dark" ? <ISun size={16} color="var(--rh-text-4)" /> : <IMoon size={16} color="var(--rh-text-4)" />}
        </button>
        <form action={logout}>
          <button type="submit" title="Log out" className="rh-icon" style={{ ...iconBtn, width: 32, height: 32, border: "1px solid var(--rh-border-soft)" }}>
            <ILogout size={16} color="var(--rh-text-4)" />
          </button>
        </form>
      </div>
      </aside>
    </div>
  );

  /* ===================== Screen: Profile ===================== */
  const profileScreen = (
    <div>
      <header style={{ position: "sticky", top: 0, zIndex: 4, background: "color-mix(in srgb, var(--rh-bg) 82%, transparent)", backdropFilter: "saturate(160%) blur(16px)", WebkitBackdropFilter: "saturate(160%) blur(16px)", borderBottom: "1px solid rgba(var(--rh-shadow-rgb),.06)", padding: "20px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--rh-text)", letterSpacing: "-.01em" }}>My profile</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--rh-text-3)" }}>Build your profile once. Hunter uses it for every application.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => setPreviewOpen(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", borderRadius: 11, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-text-2)", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            <IEye size={16} />
            Preview
          </button>
          <button type="button" onClick={onSaveProfile} disabled={isSaving} className="rh-soft" style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 18px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", color: "#fff", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: isSaving ? "default" : "pointer", opacity: isSaving ? 0.7 : 1, boxShadow: "0 8px 18px rgba(37,99,235,.28)" }}>{isSaving ? "Spremam…" : "Save profile"}</button>
        </div>
      </header>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "30px 44px 70px", display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Personal details */}
        <section style={card}>
          {sectionHead(<IUser size={20} />, "Personal details", "Basic information about you")}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <div style={{ width: 72, height: 72, flex: "none", borderRadius: "50%", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent-dark))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24 }}>{initials}</div>
            <button type="button" style={{ padding: "9px 15px", borderRadius: 10, border: "1px dashed #B9C6DC", background: "var(--rh-surface-2)", color: "#3D6CC8", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Upload photo</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16 }}>
            <div>
              <label style={label}>Full name</label>
              <input className="rh-field" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Alex Morgan" style={field} />
            </div>
            <div>
              <label style={label}>Date of birth</label>
              <DatePicker value={dob} onChange={setDob} placeholder="Select your date of birth" />
            </div>
            <div>
              <label style={label}>Phone</label>
              <input className="rh-field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +1 234 567 8900" style={field} />
            </div>
            <div style={{ position: "relative" }}>
              <label style={label}>Location</label>
              <input
                className="rh-field"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (e.target.value.length > 1) {
                    setFilteredCities(getMatchingCities(e.target.value));
                    setShowLocationDropdown(true);
                  } else {
                    setShowLocationDropdown(false);
                  }
                }}
                onFocus={() => location.length > 1 && setShowLocationDropdown(true)}
                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                placeholder="e.g. New York, USA"
                style={field}
              />
              {showLocationDropdown && filteredCities.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "var(--rh-surface)",
                    border: "1px solid var(--rh-border)",
                    borderRadius: 8,
                    maxHeight: 200,
                    overflowY: "auto",
                    zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    marginTop: 4,
                  }}
                >
                  {filteredCities.map((city) => (
                    <div
                      key={city.name}
                      onClick={() => {
                        setLocation(city.name);
                        setShowLocationDropdown(false);
                      }}
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                        borderBottom: "1px solid #F0F0F0",
                        fontSize: 14,
                        color: "var(--rh-text-2)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--rh-surface)")}
                    >
                      {city.name}
                    </div>
                  ))}
                </div>
              )}
              {location && !isMajorCity(location) && location.length > 3 && (
                <div style={{ fontSize: 12, color: "var(--rh-text-3)", marginTop: 6 }}>
                  ℹ️ If you select a smaller city, we'll help you match better with more companies!
                </div>
              )}
            </div>
          </div>
          <Note ok={!!fullName.trim() && !!dob}>Full name and date of birth are required.</Note>
          <div style={{ marginTop: 16 }}>
            <label style={label}>
              About you <span style={{ color: "var(--rh-text-3)", fontWeight: 500 }}>(your best qualities and strengths)</span>
            </label>
            <textarea className="rh-field" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Reliable and curious… briefly about yourself" style={{ ...field, resize: "vertical", lineHeight: 1.55 }} />
          </div>
        </section>

        {/* Work experience */}
        <section style={card}>
          {sectionHead(<IBriefcase size={20} />, "Work experience", "Add your positions and achievements")}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {experiences.length === 0 && (
              <div style={{ fontSize: 13.5, color: "var(--rh-text-3)", padding: "4px 2px" }}>No work experience added yet.</div>
            )}
            {experiences.map((exp) => (
              <form key={exp.id} action={updateExperience} style={{ border: "1px solid var(--rh-border)", borderRadius: 16, padding: 18, background: "var(--rh-surface-2)", position: "relative" }}>
                <input type="hidden" name="id" value={exp.id} />
                <button type="submit" formAction={deleteExperience} className="rh-del" title="Remove" style={{ position: "absolute", top: 13, right: 13, width: 30, height: 30, borderRadius: 9, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-text-4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IX />
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 14, paddingRight: 34 }}>
                  <div>
                    <label style={labelSm}>Company name</label>
                    <input className="rh-field" name="company" defaultValue={exp.company} placeholder="e.g. Infobip" style={fieldSm} />
                  </div>
                  <div>
                    <label style={labelSm}>Position</label>
                    <input className="rh-field" name="position" defaultValue={exp.position} placeholder="e.g. Frontend Developer" style={fieldSm} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={labelSm}>Company website</label>
                    <div className="rh-fieldwrap" style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--rh-border)", borderRadius: 10, background: "var(--rh-surface)", padding: "0 11px" }}>
                      <ISearch size={15} color="var(--rh-text-3)" />
                      <input name="company_url" defaultValue={exp.company_url} placeholder="e.g. infobip.com" style={{ width: "100%", padding: "11px 2px", border: "none", outline: "none", font: "inherit", fontSize: 13.5, color: "var(--rh-accent)", background: "transparent" }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelSm}>Period</label>
                    <PeriodField name="period" defaultValue={exp.period} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelSm}>Opis</label>
                  <textarea className="rh-field" name="description" rows={2} placeholder="What you did and achieved in this role…" style={{ ...fieldSm, resize: "vertical", lineHeight: 1.5 }} defaultValue={exp.description} />
                </div>
                <button type="submit" className="rh-soft" style={saveRowBtn}>Save</button>
              </form>
            ))}
          </div>
          <form action={addExperience}>
            <button type="submit" className="rh-add" style={addBtn}>
              <IPlus />
              Add experience
            </button>
          </form>
        </section>

        {/* Education */}
        <section style={card}>
          {sectionHead(<ICap size={20} />, "Education & Courses", "Degrees, courses and certifications")}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {education.length === 0 && (
              <div style={{ fontSize: 13.5, color: "var(--rh-text-3)", padding: "4px 2px" }}>No education added yet.</div>
            )}
            {education.map((ed) => (
              <form key={ed.id} action={updateEducation} style={{ border: "1px solid var(--rh-border)", borderRadius: 16, padding: 18, background: "var(--rh-surface-2)", position: "relative" }}>
                <input type="hidden" name="id" value={ed.id} />
                <button type="submit" formAction={deleteEducation} className="rh-del" title="Remove" style={{ position: "absolute", top: 13, right: 13, width: 30, height: 30, borderRadius: 9, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-text-4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IX />
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 14, paddingRight: 34 }}>
                  <div>
                    <label style={labelSm}>Ustanova</label>
                    <input className="rh-field" name="institution" defaultValue={ed.institution} placeholder="e.g. University of Zagreb" style={fieldSm} />
                  </div>
                  <div>
                    <label style={labelSm}>Titula / zvanje</label>
                    <input className="rh-field" name="title" defaultValue={ed.title} placeholder="e.g. BSc Computer Science" style={fieldSm} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={labelSm}>Period</label>
                    <input className="rh-field" name="period" defaultValue={ed.period} placeholder="e.g. 2014 to 2019" style={fieldSm} />
                  </div>
                  <div>
                    <label style={labelSm}>Link (diploma or certificate)</label>
                    <div className="rh-fieldwrap" style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--rh-border)", borderRadius: 10, background: "var(--rh-surface)", padding: "0 11px" }}>
                      <ILink size={15} color="var(--rh-text-3)" />
                      <input name="link" defaultValue={ed.link} placeholder="https://…" style={{ width: "100%", padding: "11px 2px", border: "none", outline: "none", font: "inherit", fontSize: 13.5, color: "var(--rh-accent)", background: "transparent" }} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="rh-soft" style={saveRowBtn}>Save</button>
              </form>
            ))}
          </div>
          <form action={addEducation}>
            <button type="submit" className="rh-add" style={{ ...addBtn, marginTop: 15 }}>
              <IPlus />
              Add education or a course
            </button>
          </form>
        </section>

        {/* Projects */}
        <section style={card}>
          {sectionHead(<IFolder size={20} />, "Projects", "Personal or professional projects, with links")}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {projects.length === 0 && (
              <div style={{ fontSize: 13.5, color: "var(--rh-text-3)", padding: "4px 2px" }}>No projects added yet.</div>
            )}
            {projects.map((p) => (
              <form key={p.id} action={updateProject} style={{ border: "1px solid var(--rh-border)", borderRadius: 16, padding: 18, background: "var(--rh-surface-2)", position: "relative" }}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" formAction={deleteProject} className="rh-del" title="Remove" style={{ position: "absolute", top: 13, right: 13, width: 30, height: 30, borderRadius: 9, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-text-4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IX />
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 14, paddingRight: 34 }}>
                  <div>
                    <label style={labelSm}>Project name</label>
                    <input className="rh-field" name="name" defaultValue={p.name} placeholder="e.g. Resume Hunter" style={fieldSm} />
                  </div>
                  <div>
                    <label style={labelSm}>Vrijeme izrade</label>
                    <input className="rh-field" name="period" defaultValue={p.period} placeholder="e.g. 2024 or 3/2024 to 6/2024" style={fieldSm} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelSm}>Opis</label>
                  <textarea className="rh-field" name="description" rows={2} placeholder="What the project does, your role, technologies…" style={{ ...fieldSm, resize: "vertical", lineHeight: 1.5 }} defaultValue={p.description} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelSm}>Poveznice <span style={{ color: "var(--rh-text-3)", fontWeight: 500 }}>, jedna po retku</span></label>
                  <textarea className="rh-field" name="links" rows={2} placeholder={"https://github.com/…\nhttps://demo.example.com"} style={{ ...fieldSm, resize: "vertical", lineHeight: 1.5, color: "var(--rh-accent)" }} defaultValue={(p.links || []).join("\n")} />
                </div>
                <button type="submit" className="rh-soft" style={saveRowBtn}>Save</button>
              </form>
            ))}
          </div>
          <form action={addProject}>
            <button type="submit" className="rh-add" style={addBtn}>
              <IPlus />
              Add project
            </button>
          </form>
        </section>

        {/* Skills */}
        <section style={card}>
          {sectionHead(<IStar size={20} />, "Skills", "Select suggested or add your own, organized by category")}
          <div style={{ marginBottom: 14 }}>
            <Note ok={skills.some((c) => c.items.length > 0)}>Add at least one category with at least one skill.</Note>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {skills.length === 0 && (
              <div style={{ fontSize: 13.5, color: "var(--rh-text-3)", marginBottom: 4 }}>No categories yet, add one below.</div>
            )}
            {skills.map((cat, ci) => {
              const suggestions = (SKILL_SUGGESTIONS[cat.name] || []).filter((s) => !cat.items.includes(s));
              return (
                <div key={cat.name} style={{ borderTop: ci ? "1px solid var(--rh-surface-3)" : "none", paddingTop: ci ? 18 : 0, paddingBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
                    <div style={{ ...catTitle, marginBottom: 0 }}>{cat.name}</div>
                    <button type="button" onClick={() => removeCategory(ci)} title="Remove category" className="rh-del" style={catRemoveBtn}>
                      <IX size={12} w={2.3} />
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: suggestions.length ? 12 : 0 }}>
                    {cat.items.map((item, ii) => (
                      <span key={`${item}-${ii}`} style={chip}>
                        {item}
                        <button type="button" onClick={() => removeSkill(ci, ii)} title="Remove" style={chipX}>
                          <IX size={11} w={2.4} />
                        </button>
                      </span>
                    ))}
                    <ChipAdder placeholder="Add a skill…" onAdd={(v) => addSkillValue(ci, v)} />
                  </div>
                  {suggestions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                      <span style={suggLabel}>Suggested:</span>
                      {suggestions.map((sg) => (
                        <button type="button" key={sg} onClick={() => addSkillValue(ci, sg)} style={suggChip}>+ {sg}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add category */}
          <div style={{ marginTop: skills.length ? 4 : 12, paddingTop: 18, borderTop: "1px solid var(--rh-surface-3)" }}>
            <div style={{ ...catTitle, color: "var(--rh-text-2)" }}>Add category</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              {SKILL_CATEGORY_TEMPLATES.filter((t) => !skills.some((c) => c.name === t)).map((t) => (
                <button type="button" key={t} onClick={() => addCategory(t)} style={suggChip}>+ {t}</button>
              ))}
              <ChipAdder placeholder="New category…" onAdd={addCategory} />
            </div>
          </div>
        </section>

        {/* Hobbies */}
        <section style={card}>
          {sectionHead(<IHeart size={20} />, "Hobbies", "Pick from suggestions or add your own")}
          <div style={{ marginBottom: 14 }}>
            <Note ok={hobbies.length >= 3}>Pick at least 3 hobbies (currently {hobbies.length}).</Note>
          </div>
          {/* odabrani */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 18 }}>
            {hobbies.length === 0 && <span style={{ fontSize: 13, color: "var(--rh-text-3)" }}>No hobbies selected yet. Click a suggestion below or add your own.</span>}
            {hobbies.map((h, i) => (
              <span key={`${h}-${i}`} style={chip}>
                {h}
                <button type="button" onClick={() => removeHobby(i)} title="Remove" style={chipX}>
                  <IX size={11} w={2.4} />
                </button>
              </span>
            ))}
            <ChipAdder placeholder="Add a hobby…" onAdd={addHobbyValue} />
          </div>
          {/* predlošci po kategorijama */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, borderTop: "1px solid var(--rh-surface-3)", paddingTop: 18 }}>
            {HOBBY_SUGGESTIONS.map((group) => (
              <div key={group.name}>
                <div style={catTitle}>{group.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.items.map((item) => {
                    const active = hobbies.includes(item);
                    return (
                      <button type="button" key={item} onClick={() => toggleHobby(item)} style={active ? suggChipActive : suggChip}>
                        {active ? "✓ " : "+ "}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section style={card}>
          {sectionHead(<IAward size={20} />, "Certificates", "Your professional certifications")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {certificates.map((c, i) => (
              <span key={`${c}-${i}`} style={chip}>
                {c}
                <button type="button" onClick={() => removeCertificate(i)} title="Remove" style={chipX}>
                  <IX size={11} w={2.4} />
                </button>
              </span>
            ))}
            <ChipAdder placeholder="e.g. Azure AI Fundamentals (Microsoft)" onAdd={addCertificate} />
          </div>
        </section>

        {/* Strengths */}
        <section style={card}>
          {sectionHead(<IHeart size={20} />, "Strengths", "Your greatest strengths and qualities")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {strengths.map((s, i) => (
              <span key={`${s}-${i}`} style={chip}>
                {s}
                <button type="button" onClick={() => removeStrength(i)} title="Remove" style={chipX}>
                  <IX size={11} w={2.4} />
                </button>
              </span>
            ))}
            <ChipAdder placeholder="e.g. Attention to detail" onAdd={addStrength} />
          </div>
        </section>

        {/* Ton */}
        <section style={card}>
          {sectionHead(<IChat size={20} />, "Default tone", "How you want to sound in your applications")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))", gap: 12 }}>
            {TONES.map((t) => {
              const active = selectedTone === t.name;
              return (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => setSelectedTone(t.name)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    alignItems: "flex-start",
                    textAlign: "left",
                    padding: "14px 16px",
                    borderRadius: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all .15s",
                    border: active ? "1.5px solid var(--rh-accent)" : "1.5px solid var(--rh-border)",
                    background: active ? "linear-gradient(150deg,var(--rh-accent-soft),var(--rh-accent-soft-2))" : "var(--rh-surface)",
                    color: active ? "var(--rh-accent-text)" : "var(--rh-text)",
                    boxShadow: active ? "0 6px 16px rgba(37,99,235,.16)" : "none",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: active ? "var(--rh-accent-text)" : "var(--rh-text-3)" }}>{t.desc}</span>
                </button>
              );
            })}
          </div>
          <p style={{ margin: "16px 0 0", fontSize: 12, color: "var(--rh-text-3)" }}>Changes to skills, hobbies and tone are saved when you click Save profile.</p>
        </section>
      </div>
    </div>
  );

  /* ===================== Screen: Hunter ===================== */
  const hunterScreen = (
    <div>
      <header style={{ position: "sticky", top: 0, zIndex: 4, background: "color-mix(in srgb, var(--rh-bg) 82%, transparent)", backdropFilter: "saturate(160%) blur(16px)", WebkitBackdropFilter: "saturate(160%) blur(16px)", borderBottom: "1px solid rgba(var(--rh-shadow-rgb),.06)", padding: "20px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--rh-text)", letterSpacing: "-.01em", display: "flex", alignItems: "center", gap: 10 }}>
            Hunter Agent <span style={{ fontSize: 10.5, fontWeight: 800, color: "var(--rh-accent)", background: "var(--rh-accent-soft)", padding: "3px 8px", borderRadius: 6, letterSpacing: ".04em" }}>AI</span>
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--rh-text-3)" }}>Paste an ad, pick a tone, get a tailored resume and cover letter.</p>
        </div>
        {hunterStep === "result" && (
          <button type="button" onClick={resetHunter} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", borderRadius: 11, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-text-2)", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            <IRefresh />
            New application
          </button>
        )}
      </header>

      {hunterStep === "input" && (
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "34px 44px 70px" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 26 }}>
            <div style={{ width: 46, height: 46, flex: "none", borderRadius: 13, background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent-dark))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px rgba(37,99,235,.28)" }}>
              <ISearch size={23} color="#fff" />
            </div>
            <div style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: "6px 18px 18px 18px", padding: "18px 20px", boxShadow: "0 1px 2px rgba(var(--rh-shadow-rgb),.06)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--rh-accent)", letterSpacing: ".03em", marginBottom: 6 }}>HUNTER AGENT</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--rh-text-2)" }}>
                {hunterMode === "generate"
                  ? `Hi ${displayName.split(" ")[0]}, ready to find your next opportunity. Paste the job ad you want to apply for and I'll compare it with your profile, then write a tailored resume and cover letter.`
                  : `Hi ${displayName.split(" ")[0]}, ask me anything about your resume, cover letters or job hunting. I answer from what's in your profile, so keep it up to date.`}
              </p>
            </div>
          </div>

          {/* Odabir načina rada */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18, background: "var(--rh-surface-3)", padding: 5, borderRadius: 14, border: "1px solid var(--rh-border)" }}>
            {([
              { key: "generate" as const, label: "Generate from job ad", icon: <ISparkles size={16} />, hint: "Paste an ad, get a resume and cover letter" },
              { key: "chat" as const, label: "Chat with Hunter", icon: <IChat size={16} />, hint: "Ask questions about your application" },
            ]).map((m) => {
              const active = hunterMode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setHunterMode(m.key)}
                  title={m.hint}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "11px 14px",
                    borderRadius: 10,
                    border: active ? "1px solid var(--rh-accent)" : "1px solid transparent",
                    background: active ? "var(--rh-surface)" : "transparent",
                    color: active ? "var(--rh-accent)" : "var(--rh-text-2)",
                    font: "inherit",
                    fontSize: 13.5,
                    fontWeight: active ? 800 : 600,
                    cursor: "pointer",
                    boxShadow: active ? "0 2px 8px rgba(var(--rh-shadow-rgb),.14)" : "none",
                  }}
                >
                  {m.icon}
                  {m.label}
                </button>
              );
            })}
          </div>

          {hunterMode === "chat" ? (
            <HunterChat firstName={displayName.split(" ")[0]} />
          ) : (
          <>
          {/* Provjera profila, deterministička, prije generiranja */}
          <div
            style={{
              background: "var(--rh-surface)",
              border: `1px solid ${readinessOk ? "var(--rh-border)" : "var(--rh-warn)"}`,
              borderRadius: 18,
              padding: "18px 20px",
              marginBottom: 18,
              boxShadow: "var(--rh-shadow-card)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: readinessBlocking.length || readinessOptional.length ? 14 : 0 }}>
              <span
                style={{
                  width: 30, height: 30, flex: "none", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
                  background: readinessOk ? "var(--rh-success-soft)" : "var(--rh-warn-soft)",
                  color: readinessOk ? "var(--rh-success)" : "var(--rh-warn)",
                }}
              >
                {readinessOk ? <ICheck size={15} w={3} /> : <IInfo size={16} />}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--rh-text)" }}>
                  {readinessOk ? "Your profile is ready for Hunter" : "Your profile is missing basic details"}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--rh-text-3)", marginTop: 2 }}>
                  {readinessOk
                    ? readinessOptional.length
                      ? `Sve nužno je tu. Još ${readinessOptional.length} stvari mogu poboljšati rezultat.`
                      : "Everything is filled in."
                    : "Hunter writes only from what you entered. Without it there is nothing to build a resume from."}
                </div>
              </div>
              {(readinessBlocking.length > 0 || readinessOptional.length > 0) && (
                <button
                  type="button"
                  onClick={() => go("profile")}
                  style={{ marginLeft: "auto", flex: "none", padding: "8px 14px", borderRadius: 10, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-accent)", font: "inherit", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                >
                  Complete profile
                </button>
              )}
            </div>

            {readinessBlocking.map((c) => (
              <div key={c.label} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "7px 0", fontSize: 13, color: "var(--rh-text-2)" }}>
                <span style={{ color: "var(--rh-warn)", fontWeight: 800, lineHeight: 1.5 }}>!</span>
                <span><strong>{c.label}</strong>: {c.fix}</span>
              </div>
            ))}
            {readinessOptional.map((c) => (
              <div key={c.label} style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "7px 0", fontSize: 13, color: "var(--rh-text-3)" }}>
                <span style={{ color: "var(--rh-text-4)", fontWeight: 800, lineHeight: 1.5 }}>·</span>
                <span>{c.label}: {c.fix}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 20, padding: 24, boxShadow: "0 2px 8px rgba(var(--rh-shadow-rgb),.06)" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--rh-text-2)", marginBottom: 10 }}>Job ad</label>
            <div className="rh-fieldwrap" style={{ border: "1px solid var(--rh-border)", borderRadius: 13, background: "var(--rh-surface-2)", padding: 6 }}>
              <textarea value={jobText} onChange={(e) => setJobText(e.target.value)} rows={6} placeholder={"Paste the job ad text, e.g.:\n\nFrontend Developer, Infobip, Zagreb\nWe are looking for an experienced frontend developer with React and TypeScript…"} style={{ width: "100%", padding: "10px 12px", border: "none", outline: "none", font: "inherit", fontSize: 14, color: "var(--rh-text)", background: "transparent", resize: "vertical", lineHeight: 1.7 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 12.5, color: "var(--rh-text-3)" }}>
              <IInfo />
              Paste the full job description for the best result, not just a link.
            </div>

            <div style={{ height: 1, background: "var(--rh-border-soft)", margin: "22px 0" }} />

            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--rh-text-2)", marginBottom: 12 }}>Tone for this application</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {TONES.map((t) => {
                const active = hunterTone === t.name;
                return (
                  <button
                    type="button"
                    key={t.name}
                    onClick={() => setHunterTone(t.name)}
                    style={{
                      padding: "9px 16px",
                      borderRadius: 999,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 13.5,
                      fontWeight: 700,
                      transition: "all .15s",
                      border: active ? "1.5px solid var(--rh-accent)" : "1.5px solid var(--rh-border)",
                      background: active ? "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))" : "var(--rh-surface)",
                      color: active ? "#fff" : "var(--rh-text-2)",
                      boxShadow: active ? "0 6px 14px rgba(37,99,235,.25)" : "none",
                    }}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                if (!readinessOk) {
                  showToast("Fill in the required profile details");
                  go("profile");
                  return;
                }
                generate();
              }}
              className="rh-soft"
              title={readinessOk ? undefined : "Your profile is missing basic details"}
              style={{ marginTop: 24, width: "100%", padding: 15, borderRadius: 13, border: "none", background: readinessOk ? "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))" : "var(--rh-text-4)", color: "#fff", font: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: readinessOk ? "0 10px 22px rgba(37,99,235,.3)" : "none" }}
            >
              <ISparkles />
              {readinessOk ? "Generate with Hunter Agent" : "Complete your profile to generate"}
            </button>
          </div>
          </>
          )}
        </div>
      )}

      {hunterStep === "working" && (
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "60px 44px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 34 }}>
            <div style={{ width: 74, height: 74, borderRadius: 20, background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent-dark))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(37,99,235,.32)", position: "relative" }}>
              <div style={{ position: "absolute", inset: -6, borderRadius: 24, border: "2px solid var(--rh-accent-soft-2)", borderTopColor: "transparent", animation: "rh-spin 1s linear infinite" }} />
              <ISearch size={34} color="#fff" />
            </div>
            <h2 style={{ margin: "22px 0 6px", fontSize: 20, fontWeight: 800, color: "var(--rh-text)" }}>Hunter is working on your application…</h2>
            <p style={{ margin: 0, fontSize: 14, color: "var(--rh-text-3)" }}>This usually takes a few seconds.</p>
          </div>
          <div style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 18, padding: "14px 10px", boxShadow: "0 2px 8px rgba(var(--rh-shadow-rgb),.06)" }}>
            {WORK.map((labelText, i) => {
              const done = i < workIdx;
              const active = i === workIdx;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 14px", borderRadius: 12, transition: "all .3s", background: active ? "var(--rh-surface-2)" : "transparent" }}>
                  <div style={{ width: 26, height: 26, flex: "none", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "var(--rh-success)" : active ? "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))" : "var(--rh-border-soft)" }}>
                    {done ? <ICheck color="#fff" /> : active ? <div style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid #fff", borderTopColor: "transparent", animation: "rh-spin .8s linear infinite" }} /> : <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--rh-border-strong)" }} />}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: done || active ? 700 : 500, color: done ? "var(--rh-text)" : active ? "var(--rh-text)" : "var(--rh-text-4)", transition: "all .3s" }}>{labelText}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hunterStep === "result" && hunterResult && (
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 44px 70px" }}>
          {/* status banner */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: hunterResult.saveError ? "linear-gradient(135deg,var(--rh-warn-soft),var(--rh-warn-soft))" : "linear-gradient(135deg,var(--rh-success-soft),var(--rh-success-soft))", border: hunterResult.saveError ? "1px solid #F3D9A6" : "1px solid #C7EAD6", borderRadius: 14, padding: "14px 18px", marginBottom: 22 }}>
            <div style={{ width: 34, height: 34, flex: "none", borderRadius: 10, background: hunterResult.saveError ? "var(--rh-warn)" : "var(--rh-success)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ICheck size={18} w={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: hunterResult.saveError ? "#8A5A00" : "#0E6B3D" }}>{hunterResult.saveError ? "Generated (save failed)" : "Ready and saved to Dashboard!"}</div>
              <div style={{ fontSize: 12.5, color: hunterResult.saveError ? "#9A6B18" : "#3E9468" }}>
                Tailored for <strong>{[hunterResult.parsedJob?.company, hunterResult.parsedJob?.position].filter(Boolean).join(" · ") || "posao"}</strong> · ton: {hunterTone}
                {hunterResult.matchScore != null ? ` · ${hunterResult.matchScore}% podudaranje` : ""}
              </div>
            </div>
            <button type="button" onClick={resetHunter} className="rh-soft" style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>New application</button>
          </div>

          {/* skill gaps */}
          {hunterResult.gaps && hunterResult.gaps.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 14, padding: "13px 18px", marginBottom: 22 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#8A5A00" }}>Traže, a nedostaje ti u profilu:</span>
              {hunterResult.gaps.map((g, i) => (
                <span key={`${g}-${i}`} style={{ padding: "4px 11px", borderRadius: 999, background: "var(--rh-warn-soft)", color: "#8A5A00", fontSize: 12, fontWeight: 600 }}>{g}</span>
              ))}
            </div>
          )}

          {/* podudaranje po kriterijima */}
          {hunterResult.matchBreakdown && hunterResult.matchBreakdown.length > 0 && (
            <div style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 16, padding: "18px 20px", marginBottom: 22, boxShadow: "0 1px 2px rgba(var(--rh-shadow-rgb),.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--rh-text)" }}>Podudaranje po kriterijima</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: (hunterResult.matchScore ?? 0) >= 70 ? "var(--rh-success)" : (hunterResult.matchScore ?? 0) >= 40 ? "var(--rh-accent)" : "var(--rh-warn)" }}>{hunterResult.matchScore ?? 0}%</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {hunterResult.matchBreakdown.map((c) => (
                  <div key={c.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "var(--rh-text-2)", fontWeight: 600 }}>{c.label} <span style={{ color: "var(--rh-text-4)" }}>· {c.weight}%</span></span>
                      <span style={{ color: "var(--rh-text-2)", fontWeight: 700 }}>{c.score}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 6, background: "var(--rh-border-soft)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${c.score}%`, borderRadius: 6, background: c.score >= 70 ? "var(--rh-success)" : c.score >= 40 ? "var(--rh-accent)" : "var(--rh-warn)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))", gap: 22 }}>
            {/* Životopis, live PDF pregled (skica) */}
            <div style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 20, boxShadow: "0 2px 10px rgba(var(--rh-shadow-rgb),.06)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--rh-border-soft)", background: "var(--rh-surface-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ ...secIcon, width: 34, height: 34, borderRadius: 10 }}><IFile /></div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--rh-text)" }}>Resume (PDF)</span>
                </div>
                <a href={hunterResult.applicationId ? `/dashboard/cv?app=${hunterResult.applicationId}` : "/dashboard/cv"} target="_blank" rel="noreferrer" title="Open / Download PDF" className="rh-icon" style={iconBtn}><IDownload /></a>
              </div>
              <div style={{ position: "relative", height: 420, overflow: "hidden", background: "var(--rh-surface)", borderBottom: "1px solid var(--rh-border-soft)" }}>
                <iframe
                  title="Resume preview"
                  src={`/dashboard/cv?embed=1${hunterResult.applicationId ? `&app=${hunterResult.applicationId}` : ""}`}
                  sandbox="allow-same-origin allow-scripts"
                  style={{ width: 1080, height: 1320, border: "none", transform: "scale(0.53)", transformOrigin: "top left", pointerEvents: "none", background: "var(--rh-surface)" }}
                />
                {/* klik bilo gdje po pregledu otvara puni CV */}
                <a href={hunterResult.applicationId ? `/dashboard/cv?app=${hunterResult.applicationId}` : "/dashboard/cv"} target="_blank" rel="noreferrer" title="Open CV (PDF)" style={{ position: "absolute", inset: 0 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "14px 20px", background: "var(--rh-surface-2)" }}>
                <a href={hunterResult.applicationId ? `/dashboard/cv/edit?app=${hunterResult.applicationId}` : "#"} className="rh-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 11, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-accent)", fontSize: 13.5, fontWeight: 700, textDecoration: "none", cursor: hunterResult.applicationId ? "pointer" : "not-allowed", opacity: hunterResult.applicationId ? 1 : 0.5 }}>
                  ✏️ Uredi
                </a>
                <a href={hunterResult.applicationId ? `/dashboard/cv?app=${hunterResult.applicationId}` : "/dashboard/cv"} target="_blank" rel="noreferrer" className="rh-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 11, background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", color: "#fff", fontSize: 13.5, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 18px rgba(37,99,235,.3)" }}>
                  <IEye size={16} /> Download PDF
                </a>
              </div>
            </div>

            {/* Cover letter */}
            <div style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 20, boxShadow: "0 2px 10px rgba(var(--rh-shadow-rgb),.06)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--rh-border-soft)", background: "var(--rh-surface-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ ...secIcon, width: 34, height: 34, borderRadius: 10 }}><IMail /></div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--rh-text)" }}>Cover letter</span>
                </div>
                <button type="button" onClick={copyCover} title="Copy" className="rh-icon" style={iconBtn}><ICopy /></button>
              </div>
              <div style={{ padding: "24px 26px", maxHeight: 560, overflow: "auto", fontSize: 13.5, lineHeight: 1.75, color: "var(--rh-text-2)", whiteSpace: "pre-wrap" }}>{hunterResult.coverLetter || ","}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ===================== Screen: Dashboard ===================== */
  // Dashboard izračuni iz stvarnih prijava
  const dashNow = Date.now();
  const weekMs = 7 * 24 * 3600 * 1000;
  const isThisWeek = (a: ApplicationRow) => dashNow - new Date(a.created_at).getTime() < weekMs;
  const totalApps = applications.length;
  const weekApps = applications.filter(isThisWeek).length;
  const interviewApps = applications.filter((a) => a.status === "interview").length;
  const respondedApps = applications.filter((a) => ["interview", "offer", "rejected"].includes(a.status || "")).length;
  const responseRate = totalApps ? Math.round((respondedApps / totalApps) * 100) : 0;
  const filteredApps = applications.filter((a) =>
    dashFilter === "week" ? isThisWeek(a) : dashFilter === "interview" ? a.status === "interview" : true
  );
  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("hr-HR", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  const dashboardScreen = (
    <div>
      <header style={{ position: "sticky", top: 0, zIndex: 4, background: "color-mix(in srgb, var(--rh-bg) 82%, transparent)", backdropFilter: "saturate(160%) blur(16px)", WebkitBackdropFilter: "saturate(160%) blur(16px)", borderBottom: "1px solid rgba(var(--rh-shadow-rgb),.06)", padding: "20px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--rh-text)", letterSpacing: "-.01em" }}>Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--rh-text-3)" }}>All the resumes and cover letters you have generated.</p>
        </div>
        <button type="button" onClick={newWithHunter} className="rh-soft" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", color: "#fff", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 18px rgba(37,99,235,.28)" }}>
          <IPlus w={2.2} />
          Novo s Hunter Agentom
        </button>
      </header>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 44px 70px" }}>
        {totalApps === 0 ? (
          <div style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 20, padding: "64px 40px", boxShadow: "0 1px 2px rgba(var(--rh-shadow-rgb),.06)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 66, height: 66, flex: "none", borderRadius: 18, background: "var(--rh-accent-soft)", color: "var(--rh-accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <IGrid size={30} />
            </div>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "var(--rh-text)" }}>You have no saved applications yet</h2>
            <p style={{ margin: "9px 0 24px", fontSize: 14, color: "var(--rh-text-3)", maxWidth: 440, lineHeight: 1.6 }}>
              Once you generate a resume and cover letter with Hunter Agent, it will show up here with stats and an overview of every application.
            </p>
            <button type="button" onClick={newWithHunter} className="rh-soft" style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", color: "#fff", font: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 22px rgba(37,99,235,.3)" }}>
              <IPlus w={2.2} />
              Generate your first application
            </button>
          </div>
        ) : (
          <>
            {/* statistika */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { l: "Total applications", v: String(totalApps), c: "var(--rh-text)" },
                { l: "This week", v: String(weekApps), c: "var(--rh-text)" },
                { l: "Interviews", v: String(interviewApps), c: "var(--rh-success)" },
                { l: "Response rate", v: `${responseRate}%`, c: "var(--rh-text)" },
              ].map((s) => (
                <div key={s.l} style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 2px rgba(var(--rh-shadow-rgb),.06)" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--rh-text-3)" }}>{s.l}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.c, marginTop: 4 }}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* filteri */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {([["all", "Sve"], ["week", "This week"], ["interview", "Interview"]] as const).map(([key, label]) => {
                const active = dashFilter === key;
                return (
                  <button key={key} type="button" onClick={() => setDashFilter(key)} style={{ padding: "8px 15px", borderRadius: 999, border: active ? "none" : "1px solid var(--rh-border)", background: active ? "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))" : "var(--rh-surface)", color: active ? "#fff" : "var(--rh-text-2)", font: "inherit", fontSize: 13, fontWeight: active ? 700 : 600, cursor: "pointer" }}>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* kartice */}
            {filteredApps.length === 0 ? (
              <div style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 16, padding: 40, textAlign: "center", fontSize: 14, color: "var(--rh-text-3)" }}>No applications match this filter.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: 18 }}>
                {filteredApps.map((app) => {
                  const tint = TONE_TINT[app.tone || ""] || "var(--rh-accent)";
                  const cardInitials = (app.company || app.role_title || "?").trim().slice(0, 2).toUpperCase();
                  return (
                    <div key={app.id} className="rh-card" style={{ background: "var(--rh-surface)", border: "1px solid var(--rh-border)", borderRadius: 20, padding: 20, boxShadow: "0 1px 2px rgba(var(--rh-shadow-rgb),.06)", display: "flex", flexDirection: "column", transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 44, height: 44, flex: "none", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff", background: tint }}>{cardInitials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--rh-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.company || ","}</div>
                          <div style={{ fontSize: 12.5, color: "var(--rh-text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.role_title || ","}</div>
                        </div>
                        {app.match_score != null && (
                          <span style={{ padding: "4px 9px", flex: "none", borderRadius: 999, fontSize: 11.5, fontWeight: 800, background: "var(--rh-success-soft)", color: "var(--rh-success)" }}>{app.match_score}%</span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                        {app.tone && <span style={{ padding: "4px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: tint + "18", color: tint }}>{app.tone}</span>}
                        <span style={{ fontSize: 12, color: "var(--rh-text-4)" }}>{fmtDate(app.created_at)}</span>
                        <form action={updateApplicationStatus} style={{ marginLeft: "auto" }}>
                          <input type="hidden" name="id" value={app.id} />
                          <select name="status" defaultValue={app.status || "draft"} onChange={(e) => e.currentTarget.form?.requestSubmit()} style={{ fontSize: 12, fontWeight: 700, color: "var(--rh-text-2)", padding: "5px 8px", borderRadius: 8, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", cursor: "pointer", fontFamily: "inherit" }}>
                            {Object.entries(STATUS_LABELS).map(([v, l]) => (
                              <option key={v} value={v}>{l}</option>
                            ))}
                          </select>
                        </form>
                      </div>
                      <div style={{ display: "flex", gap: 7, marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--rh-surface-3)" }}>
                        <button type="button" onClick={() => openApplication(app)} className="rh-soft" style={{ flex: 1, padding: 9, borderRadius: 9, border: "none", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", color: "#fff", font: "inherit", fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <IEye />
                          Open
                        </button>
                        <form action={deleteApplication}>
                          <input type="hidden" name="id" value={app.id} />
                          <button type="submit" title="Delete" className="rh-icon rh-del" style={{ ...iconBtn, width: 38 }}><IX size={15} /></button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  /* ===================== Screen: Settings ===================== */
  const settingsScreen = (
    <div>
      <header style={{ position: "sticky", top: 0, zIndex: 4, background: "rgba(var(--rh-shadow-rgb),.02)", backdropFilter: "saturate(160%) blur(16px)", WebkitBackdropFilter: "saturate(160%) blur(16px)", borderBottom: "1px solid var(--rh-border)", padding: "20px 44px" }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--rh-text)", letterSpacing: "-.01em" }}>Settings</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--rh-text-3)" }}>Appearance aplikacije i upravljanje računom.</p>
      </header>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "30px 44px 70px", display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Appearance */}
        <section style={card}>
          {sectionHead(<IMoon size={20} />, "Appearance", "Choose a light or dark theme")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            {([
              { key: "light" as const, label: "Svijetla", desc: "Classic bright view", icon: <ISun size={18} /> },
              { key: "dark" as const, label: "Tamna", desc: "Easier on the eyes at night", icon: <IMoon size={18} /> },
            ]).map((opt) => {
              const active = theme === opt.key;
              return (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setTheme(opt.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 18px",
                    borderRadius: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    border: active ? "1.5px solid var(--rh-accent)" : "1.5px solid var(--rh-border)",
                    background: active ? "var(--rh-accent-soft)" : "var(--rh-surface)",
                    color: active ? "var(--rh-accent-text)" : "var(--rh-text)",
                    boxShadow: active ? "0 6px 16px rgba(var(--rh-shadow-rgb),.16)" : "none",
                  }}
                >
                  <span style={{ width: 38, height: 38, flex: "none", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: active ? "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))" : "var(--rh-surface-3)", color: active ? "#fff" : "var(--rh-text-3)" }}>
                    {opt.icon}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>{opt.label}</span>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--rh-text-3)", marginTop: 2 }}>{opt.desc}</span>
                  </span>
                  {active && <span style={{ marginLeft: "auto", color: "var(--rh-accent)" }}><ICheck size={16} /></span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Account */}
        <section style={card}>
          {sectionHead(<IShield size={20} />, "Account", "Your account details")}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, background: "var(--rh-surface-2)", border: "1px solid var(--rh-border)" }}>
            <div style={{ width: 38, height: 38, flex: "none", borderRadius: "50%", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent-dark))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--rh-text)" }}>{displayName}</div>
              <div style={{ fontSize: 12.5, color: "var(--rh-text-3)" }}>{email}</div>
            </div>
            <form action={logout} style={{ marginLeft: "auto" }}>
              <button type="submit" style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10, border: "1px solid var(--rh-border)", background: "var(--rh-surface)", color: "var(--rh-text-2)", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                <ILogout size={15} /> Log out
              </button>
            </form>
          </div>
        </section>

        {/* Opasna zona */}
        <section style={{ ...card, border: "1px solid var(--rh-danger)" }}>
          {sectionHead(<ITrash size={20} />, "Delete account", "Permanently deletes your profile, experience, projects and all applications")}

          <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--rh-danger-soft)", border: "1px solid var(--rh-danger)", color: "var(--rh-danger)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
            This action is <strong>nepovratna</strong>. All your data will be permanently deleted and the account cannot be recovered.
          </div>

          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--rh-text-2)", marginBottom: 8 }}>
            Type your email to confirm: <span style={{ color: "var(--rh-text-3)", fontWeight: 600 }}>{email}</span>
          </label>
          <input
            type="email"
            value={deleteConfirm}
            onChange={(e) => { setDeleteConfirm(e.target.value); setDeleteError(""); }}
            placeholder={email}
            className="rh-field"
            style={{ width: "100%", maxWidth: 380, padding: "11px 14px", borderRadius: 11, border: "1px solid var(--rh-border-strong)", background: "var(--rh-surface)", color: "var(--rh-text)", font: "inherit", fontSize: 14, outline: "none" }}
          />

          {deleteError && (
            <div style={{ marginTop: 12, fontSize: 13, color: "var(--rh-danger)", fontWeight: 600 }}>{deleteError}</div>
          )}

          <button
            type="button"
            disabled={isDeleting || deleteConfirm.trim().toLowerCase() !== (email || "").toLowerCase()}
            onClick={() => {
              setDeleteError("");
              startDelete(async () => {
                const res = await deleteAccount(deleteConfirm);
                if (!res.ok) {
                  setDeleteError(res.message);
                  return;
                }
                window.location.href = "/login";
              });
            }}
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 18px",
              borderRadius: 11,
              border: "none",
              background: "var(--rh-danger)",
              color: "#fff",
              font: "inherit",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: isDeleting ? "default" : "pointer",
              opacity: deleteConfirm.trim().toLowerCase() === (email || "").toLowerCase() && !isDeleting ? 1 : 0.5,
            }}
          >
            <ITrash size={16} />
            {isDeleting ? "Deleting…" : "Permanently delete account"}
          </button>
        </section>
      </div>
    </div>
  );

  return (
    <div className="rh-app" style={{ display: "flex", minHeight: "100vh", width: "100%", background: "var(--rh-bg)", color: "var(--rh-text)" }}>
      {sidebar}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div key={screen} className="rh-enter" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {screen === "profile" && profileScreen}
          {screen === "hunter" && hunterScreen}
          {screen === "dashboard" && dashboardScreen}
          {screen === "settings" && settingsScreen}
        </div>
      </main>

      {!sidebarOpen && (
        <button type="button" onClick={() => setSidebarOpen(true)} title="Open menu" style={{ position: "fixed", top: "50%", left: 0, transform: "translateY(-50%)", zIndex: 30, width: 26, height: 66, borderRadius: "0 13px 13px 0", border: "1px solid var(--rh-border)", borderLeft: "none", background: "var(--rh-surface)", color: "var(--rh-accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 0 12px rgba(var(--rh-shadow-rgb),.16)" }}>
          <IChevronRight size={18} />
        </button>
      )}

      {/* Profile preview (CV) */}
      {previewOpen && (
        <div onClick={() => setPreviewOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(15,31,68,.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 760, background: "var(--rh-surface)", borderRadius: 20, boxShadow: "0 30px 70px rgba(var(--rh-shadow-rgb),.4)", animation: "rh-pop .3s ease both", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: "1px solid var(--rh-border-soft)", background: "var(--rh-surface)", borderRadius: "20px 20px 0 0" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--rh-text)", display: "flex", alignItems: "center", gap: 9 }}>
                <IFile size={18} color="var(--rh-accent)" />
                Profile preview
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <a href="/dashboard/cv" target="_blank" rel="noreferrer" className="rh-btn" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  <IDownload size={15} /> Download PDF
                </a>
                <button type="button" onClick={() => setPreviewOpen(false)} className="rh-icon" style={iconBtn} title="Close (Esc)">
                  <IX />
                </button>
              </div>
            </div>

            <div style={{ padding: "32px 40px 42px" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--rh-text)" }}>{displayName}</div>
              {headRole && <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--rh-accent)", marginTop: 3 }}>{headRole}</div>}
              <div style={{ fontSize: 12.5, color: "var(--rh-text-3)", marginTop: 7 }}>{[email, phone, location, dobFmt].filter(Boolean).join(" · ")}</div>

              {bio.trim() && (
                <>
                  <div style={cvH}>SAŽETAK</div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "var(--rh-text-2)" }}>{bio}</p>
                </>
              )}

              {expList.length > 0 && (
                <>
                  <div style={cvH}>ISKUSTVO</div>
                  {expList.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: 13 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--rh-text)" }}>{[exp.position, exp.company].filter(Boolean).join(" · ") || ","}</span>
                        {exp.period && <span style={{ fontSize: 12, color: "var(--rh-text-3)", whiteSpace: "nowrap" }}>{exp.period}</span>}
                      </div>
                      {exp.description && <p style={{ margin: "5px 0 0", fontSize: 13, lineHeight: 1.6, color: "var(--rh-text-2)" }}>{exp.description}</p>}
                    </div>
                  ))}
                </>
              )}

              {eduList.length > 0 && (
                <>
                  <div style={cvH}>OBRAZOVANJE</div>
                  {eduList.map((ed) => (
                    <div key={ed.id} style={{ marginBottom: 11 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--rh-text)" }}>{[ed.title, ed.institution].filter(Boolean).join(" · ") || ","}</span>
                        {ed.period && <span style={{ fontSize: 12, color: "var(--rh-text-3)", whiteSpace: "nowrap" }}>{ed.period}</span>}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {projList.length > 0 && (
                <>
                  <div style={cvH}>PROJEKTI</div>
                  {projList.map((p) => (
                    <div key={p.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--rh-text)" }}>{p.name || ","}</span>
                        {p.period && <span style={{ fontSize: 12, color: "var(--rh-text-3)", whiteSpace: "nowrap" }}>{p.period}</span>}
                      </div>
                      {p.description && <p style={{ margin: "5px 0 0", fontSize: 13, lineHeight: 1.6, color: "var(--rh-text-2)" }}>{p.description}</p>}
                      {(p.links || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
                          {p.links.map((l, i) => (
                            <a key={`${l}-${i}`} href={safeHref(l)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "var(--rh-accent)", textDecoration: "none", wordBreak: "break-all" }}>{l}</a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {skillCats.length > 0 && (
                <>
                  <div style={cvH}>VJEŠTINE</div>
                  {skillCats.map((c) => (
                    <div key={c.name} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--rh-text-2)", marginBottom: 6 }}>{c.name}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {c.items.map((it, i) => (
                          <span key={`${it}-${i}`} style={cvChip}>{it}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {certificates.length > 0 && (
                <>
                  <div style={cvH}>CERTIFIKATI</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {certificates.map((c, i) => (
                      <span key={`${c}-${i}`} style={cvChip}>{c}</span>
                    ))}
                  </div>
                </>
              )}

              {strengths.length > 0 && (
                <>
                  <div style={cvH}>SNAGE</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {strengths.map((s, i) => (
                      <span key={`${s}-${i}`} style={cvChip}>{s}</span>
                    ))}
                  </div>
                </>
              )}

              {hobbies.length > 0 && (
                <>
                  <div style={cvH}>HOBBIES</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {hobbies.map((h, i) => (
                      <span key={`${h}-${i}`} style={cvChip}>{h}</span>
                    ))}
                  </div>
                </>
              )}

              {!bio.trim() && expList.length === 0 && eduList.length === 0 && projList.length === 0 && skillCats.length === 0 && hobbies.length === 0 && certificates.length === 0 && strengths.length === 0 && (
                <p style={{ margin: "22px 0 0", fontSize: 13.5, color: "var(--rh-text-3)" }}>Your profile is still empty. Fill in your details and they will show up here as a resume.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "var(--rh-text)", color: "#fff", padding: "13px 22px", borderRadius: 12, fontSize: 13.5, fontWeight: 600, boxShadow: "0 12px 30px rgba(16,31,68,.3)", zIndex: 50, display: "flex", alignItems: "center", gap: 9, animation: "rh-toast .25s ease both" }}>
          <ICheck size={17} color="#5FD79A" w={2.5} />
          {toast}
        </div>
      )}
    </div>
  );
}
