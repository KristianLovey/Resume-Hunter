"use client";

import { CSSProperties, useEffect, useRef, useState, useTransition } from "react";
import { logout } from "@/app/auth/actions";
import {
  saveProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
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
const ILogout = ({ size = 17, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...base(size, color, w)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
);

/* ===================== Data ===================== */
type Tone = { name: string; desc: string };
const TONES: Tone[] = [
  { name: "Profesionalan", desc: "Jasno i pouzdano" },
  { name: "Samouvjeren", desc: "Odlučno i direktno" },
  { name: "Prijateljski", desc: "Toplo i pristupačno" },
  { name: "Kreativan", desc: "Maštovito i živo" },
  { name: "Formalan", desc: "Klasično i uljudno" },
];
const WORK = [
  "Analiziram tvoj profil i vještine",
  "Pregledavam oglas i web stranicu tvrtke",
  "Pronalazim ključne riječi i zahtjeve",
  "Pišem prilagođeni životopis",
  "Sastavljam motivacijsko pismo",
];

// Predlošci kategorija vještina (klik dodaje praznu kategoriju koju puniš).
const SKILL_CATEGORY_TEMPLATES = [
  "Jezici",
  "IT & tehnologije",
  "Ekonomija & poslovanje",
  "Dizajn",
  "Marketing",
  "Menadžment",
  "Ostalo",
];
// Predložene vještine po kategoriji (klik dodaje u tu kategoriju).
const SKILL_SUGGESTIONS: Record<string, string[]> = {
  Jezici: ["Hrvatski", "Engleski", "Njemački", "Talijanski", "Španjolski", "Francuski", "Slovenski"],
  "IT & tehnologije": ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "SQL", "PostgreSQL", "Git", "Docker", "AWS", "HTML/CSS"],
  "Ekonomija & poslovanje": ["Vođenje projekata", "Agilne metode", "Analitika", "Pregovaranje", "Excel", "Financije", "Prodaja"],
  Dizajn: ["Figma", "Photoshop", "Illustrator", "UI/UX", "Wireframing", "Prototipiranje", "Brand dizajn"],
  Marketing: ["SEO", "Google Ads", "Content marketing", "Društvene mreže", "Email marketing", "Copywriting", "Analitika"],
  Menadžment: ["Vodstvo tima", "Komunikacija", "Organizacija", "Mentorstvo", "Donošenje odluka", "Upravljanje vremenom"],
  Ostalo: ["Vozačka B kategorija", "Timski rad", "Rješavanje problema", "Kreativnost", "Prilagodljivost"],
};

// Predloženi hobiji grupirani po kategorijama (klik (de)selektira).
const HOBBY_SUGGESTIONS: { name: string; items: string[] }[] = [
  { name: "Sport i rekreacija", items: ["Planinarenje", "Trčanje", "Nogomet", "Košarka", "Biciklizam", "Plivanje", "Joga", "Teretana", "Tenis"] },
  { name: "Umjetnost i kultura", items: ["Fotografija", "Sviranje instrumenta", "Slikanje", "Pisanje", "Kazalište", "Film", "Ples"] },
  { name: "Tehnologija", items: ["Programiranje", "Gaming", "Robotika", "3D printanje", "Elektronika"] },
  { name: "Priroda i putovanja", items: ["Putovanja", "Kampiranje", "Vrtlarstvo", "Ribolov", "Promatranje ptica"] },
  { name: "Društvo i um", items: ["Šah", "Čitanje", "Volontiranje", "Kuhanje", "Društvene igre", "Učenje jezika"] },
];

/* ===================== Props ===================== */
type SkillCategory = { name: string; items: string[] };
type ProfileData = {
  full_name: string;
  date_of_birth: string;
  bio: string;
  default_tone: string;
  skills: { categories: SkillCategory[] };
  hobbies: string[];
};
type ExperienceRow = { id: string; company: string; company_url: string; position: string; period: string; description: string };
type EducationRow = { id: string; institution: string; title: string; period: string; link: string };

/* ===================== Shared styles ===================== */
const card: CSSProperties = { background: "#fff", border: "1px solid #E9EEF6", borderRadius: 20, padding: "26px 28px", boxShadow: "0 2px 4px rgba(16,31,68,.04), 0 24px 48px -24px rgba(16,31,68,.32)" };
const secIcon: CSSProperties = { width: 40, height: 40, borderRadius: 11, background: "#EAF1FE", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" };
const label: CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 700, color: "#5A6478", marginBottom: 7 };
const labelSm: CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#5A6478", marginBottom: 6 };
const field: CSSProperties = { width: "100%", padding: "12px 14px", border: "1px solid #E1E8F2", borderRadius: 11, font: "inherit", fontSize: 14, color: "#1B2A4E", background: "#fff" };
const fieldSm: CSSProperties = { width: "100%", padding: "11px 13px", border: "1px solid #E1E8F2", borderRadius: 10, font: "inherit", fontSize: 13.5, color: "#1B2A4E", background: "#fff" };
const chip: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 999, background: "#EEF3FB", color: "#2C3E63", fontSize: 13, fontWeight: 600 };
const chipX: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, borderRadius: "50%", border: "none", background: "transparent", color: "#9AA6BA", cursor: "pointer", padding: 0 };
const chipAdd: CSSProperties = { padding: "8px 13px", borderRadius: 999, background: "#fff", border: "1px dashed #C2D0E6", color: "#2563EB", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const addBtn: CSSProperties = { marginTop: 16, width: "100%", padding: 13, borderRadius: 12, border: "1.5px dashed #C2D0E6", background: "#F7FAFF", color: "#2563EB", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };
const iconBtn: CSSProperties = { width: 34, height: 34, borderRadius: 9, border: "1px solid #E4EAF3", background: "#fff", color: "#5A6478", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const saveRowBtn: CSSProperties = { padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const catTitle: CSSProperties = { fontSize: 12.5, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 11 };
const suggChip: CSSProperties = { padding: "7px 12px", borderRadius: 999, background: "#F4F8FF", border: "1px dashed #C2D0E6", color: "#2563EB", font: "inherit", fontSize: 12.5, fontWeight: 700, cursor: "pointer" };
const suggChipActive: CSSProperties = { padding: "7px 12px", borderRadius: 999, background: "linear-gradient(135deg,#3B82F6,#2563EB)", border: "1px solid #2563EB", color: "#fff", font: "inherit", fontSize: 12.5, fontWeight: 700, cursor: "pointer" };
const suggLabel: CSSProperties = { fontSize: 12, fontWeight: 600, color: "#9AA6BA" };
const catRemoveBtn: CSSProperties = { width: 26, height: 26, flex: "none", borderRadius: 8, border: "1px solid #E8EDF5", background: "#fff", color: "#A6B0C2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const cvH: CSSProperties = { fontSize: 11.5, fontWeight: 800, color: "#2563EB", letterSpacing: ".05em", margin: "22px 0 9px" };
const cvChip: CSSProperties = { padding: "5px 11px", borderRadius: 999, background: "#EEF3FB", color: "#2C3E63", fontSize: 12, fontWeight: 600 };
const sectionHead = (icon: React.ReactNode, title: string, sub: string) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
    <div style={secIcon}>{icon}</div>
    <div>
      <h2 style={{ margin: 0, fontSize: 16.5, fontWeight: 800, color: "#13234A" }}>{title}</h2>
      <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#8A94A6" }}>{sub}</p>
    </div>
  </div>
);

type Screen = "profile" | "hunter" | "dashboard";
type HunterStep = "input" | "working" | "result";

// Inline dodavanje chipa (zamjena za window.prompt — koji nije podržan u VS Code browseru).
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
        style={{ width: 168, padding: "7px 13px", border: "1px solid #E1E8F2", borderRadius: 999, font: "inherit", fontSize: 13, color: "#1B2A4E", background: "#fff" }}
      />
      <button type="button" onClick={submit} title="Dodaj" style={{ ...chipAdd, padding: "7px 13px" }}>+ Dodaj</button>
    </span>
  );
}

// Mala napomena s indikatorom (zeleno = uvjet ispunjen).
function Note({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p style={{ margin: "8px 0 0", fontSize: 12, fontWeight: 600, color: ok ? "#1FA463" : "#8A94A6", display: "inline-flex", alignItems: "center", gap: 6 }}>
      {ok ? <ICheck size={13} color="#1FA463" w={3} /> : <IInfo size={13} color="#B7C1D2" />}
      {children}
    </p>
  );
}

/* ===================== Period (mjesec/godina) picker ===================== */
const MONTHS_HR = ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"];
const NOW_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: NOW_YEAR - 1969 }, (_, i) => String(NOW_YEAR - i));

function parsePeriod(v: string) {
  const res = { fromM: "", fromY: "", toM: "", toY: "", current: false };
  if (!v) return res;
  const parts = v.split(/\s*[-–—]\s*/);
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
  const grpLabel: CSSProperties = { fontSize: 11.5, fontWeight: 800, color: "#5A6478", letterSpacing: ".03em", marginBottom: 7 };
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
        <span style={{ color: value ? "#1B2A4E" : "#9AA6BA", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value || "Odaberi razdoblje"}</span>
        <IChevron size={14} color="#9AA6BA" />
      </button>

      {open && (
        <div style={{ position: "absolute", zIndex: 40, top: "calc(100% + 6px)", left: 0, minWidth: 292, background: "#fff", border: "1px solid #E9EEF6", borderRadius: 14, boxShadow: "0 20px 44px rgba(16,31,68,.2)", padding: 16 }}>
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

          <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#3A4A66", marginBottom: 16 }}>
            <input type="checkbox" checked={current} onChange={(e) => setCurrent(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#2563EB", cursor: "pointer" }} />
            Trenutno radim ovdje (present)
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setOpen(false)} style={{ padding: "9px 14px", borderRadius: 9, border: "1px solid #E1E8F2", background: "#fff", color: "#5A6478", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Odustani</button>
            <button type="button" onClick={apply} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Primijeni</button>
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
}: {
  email: string;
  profile: ProfileData;
  experiences: ExperienceRow[];
  education: EducationRow[];
}) {
  const [screen, setScreen] = useState<Screen>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoOk, setLogoOk] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Profil — kontrolirana polja (init iz baze)
  const [fullName, setFullName] = useState(profile.full_name);
  const [dob, setDob] = useState(profile.date_of_birth);
  const [bio, setBio] = useState(profile.bio);
  const [selectedTone, setSelectedTone] = useState(profile.default_tone || "Profesionalan");
  const [skills, setSkills] = useState<SkillCategory[]>(profile.skills.categories);
  const [hobbies, setHobbies] = useState<string[]>(profile.hobbies);
  const [isSaving, startSave] = useTransition();

  // Hunter
  const [hunterTone, setHunterTone] = useState(profile.default_tone || "Profesionalan");
  const [hunterStep, setHunterStep] = useState<HunterStep>("input");
  const [workIdx, setWorkIdx] = useState(0);
  const [toast, setToast] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (toastRef.current) clearTimeout(toastRef.current);
    },
    []
  );

  useEffect(() => {
    if (hunterStep === "working" && workIdx > WORK.length) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setHunterStep("result");
    }
  }, [workIdx, hunterStep]);

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
    { ok: !!fullName.trim(), hint: "Dodaj ime i prezime" },
    { ok: !!dob, hint: "Dodaj datum rođenja" },
    { ok: !!bio.trim(), hint: "Napiši kratki opis o sebi" },
    { ok: experiences.some((e) => (e.company || e.position || e.description || "").trim()), hint: "Dodaj radno iskustvo" },
    { ok: education.some((e) => (e.institution || e.title || "").trim()), hint: "Dodaj obrazovanje" },
    { ok: skills.some((c) => c.items.length > 0), hint: "Dodaj barem jednu vještinu" },
    { ok: hobbies.length >= 3, hint: "Odaberi barem 3 hobija" },
  ];
  const completionDone = completionChecks.filter((c) => c.ok).length;
  const completionPct = Math.round((completionDone / completionChecks.length) * 100);
  const completionHint = completionChecks.find((c) => !c.ok)?.hint;

  // Filtrirani podaci za CV pregled (preskoči prazne retke)
  const expList = experiences.filter((e) => (e.company || e.position || e.description || e.period || "").trim());
  const eduList = education.filter((e) => (e.institution || e.title || e.period || "").trim());
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
        bio,
        default_tone: selectedTone,
        skills: { categories: skills },
        hobbies,
      });
      showToast(res?.ok ? "Profil spremljen" : res?.message || "Greška pri spremanju");
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

  function generate() {
    setHunterStep("working");
    setWorkIdx(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setWorkIdx((prev) => prev + 1);
    }, 850);
  }

  function copyCv() {
    try {
      navigator.clipboard.writeText(`${displayName} – Frontend Developer`);
    } catch {}
    showToast("Životopis kopiran u međuspremnik");
  }
  function copyCover() {
    try {
      navigator.clipboard.writeText("Poštovani, ...");
    } catch {}
    showToast("Motivacijsko pismo kopirano");
  }
  function saveToDashboard() {
    showToast("Spremljeno u Dashboard");
    setTimeout(() => go("dashboard"), 700);
  }
  function newWithHunter() {
    setHunterStep("input");
    setWorkIdx(0);
    go("hunter");
  }

  const navStyle = (name: Screen): CSSProperties => {
    const active = screen === name;
    return {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "11px 14px",
      borderRadius: 12,
      cursor: "pointer",
      border: "none",
      width: "100%",
      textAlign: "left",
      fontFamily: "inherit",
      fontSize: 14.5,
      fontWeight: active ? 700 : 600,
      color: active ? "#fff" : "#5A6478",
      background: active ? "linear-gradient(135deg,#3B82F6,#2563EB)" : "transparent",
      boxShadow: active ? "0 8px 18px rgba(37,99,235,.30)" : "none",
      transition: "all .15s",
    };
  };

  /* ===================== Sidebar ===================== */
  const sidebar = (
    <div style={{ flex: "none", width: sidebarOpen ? 266 : 0, transition: "width .26s ease", position: "sticky", top: 0, height: "100vh", overflow: "hidden", zIndex: 5 }}>
      <aside style={{ width: 266, height: "100vh", background: "#fff", borderRight: "1px solid #E9EEF6", display: "flex", flexDirection: "column", padding: "22px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "4px 2px 0" }}>
          <a href="/" title="Povratak na naslovnicu" aria-label="Povratak na naslovnicu" style={{ display: "inline-flex", flex: "none", textDecoration: "none" }}>
            {logoOk ? (
              <img src="/logo.png" alt="Resume Hunter" onError={() => setLogoOk(false)} style={{ width: 42, height: 42, flex: "none", objectFit: "contain", borderRadius: 11 }} />
            ) : (
              <div style={{ width: 42, height: 42, flex: "none", borderRadius: 11, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ISearch size={22} color="#fff" />
              </div>
            )}
          </a>
          <div style={{ lineHeight: 1.05, flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.01em" }}>
              <span style={{ color: "#0F1F44" }}>Resume</span> <span style={{ color: "#2563EB" }}>Hunter</span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: "#9AA6BA", letterSpacing: ".02em", marginTop: 2 }}>AI agent za pametnije prijave</div>
          </div>
          <button type="button" onClick={() => setSidebarOpen(false)} title="Sakrij izbornik" className="rh-icon" style={{ ...iconBtn, width: 30, height: 30, flex: "none" }}>
            <IChevronLeft size={16} color="#9AA6BA" />
          </button>
        </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 30 }}>
        <button onClick={() => go("profile")} style={navStyle("profile")}>
          <IUser />
          <span>Moj profil</span>
        </button>
        <button onClick={() => go("hunter")} style={navStyle("hunter")}>
          <ISearch />
          <span>Hunter Agent</span>
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 800, letterSpacing: ".04em", padding: "2px 7px", borderRadius: 6, background: screen === "hunter" ? "rgba(255,255,255,.22)" : "#EAF1FE", color: screen === "hunter" ? "#fff" : "#2563EB" }}>AI</span>
        </button>
        <button onClick={() => go("dashboard")} style={navStyle("dashboard")}>
          <IGrid />
          <span>Dashboard</span>
        </button>
      </nav>

      <div style={{ marginTop: 22, padding: "15px 16px", borderRadius: 16, background: "#fff", border: "1px solid #E9EEF6", boxShadow: "0 1px 2px rgba(16,31,68,.04)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            {completionPct === 100 && (
              <span style={{ width: 18, height: 18, flex: "none", borderRadius: "50%", background: "#E7F7EE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ICheck size={11} color="#1FA463" w={3} />
              </span>
            )}
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#42506B", letterSpacing: "-.01em" }}>Dovršenost profila</span>
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: completionPct === 100 ? "#1FA463" : "#2563EB" }}>{completionPct}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 6, background: "#EEF2F8", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${completionPct}%`, borderRadius: 6, background: completionPct === 100 ? "linear-gradient(90deg,#22C55E,#1FA463)" : "linear-gradient(90deg,#3B82F6,#2563EB)", transition: "width .35s ease" }} />
        </div>
        <div style={{ fontSize: 11.5, color: "#8A94A6", lineHeight: 1.45, marginTop: 10 }}>
          {completionHint ? `${completionHint} za bolje rezultate.` : "Profil je potpun — spreman za Hunter."}
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 11, padding: "16px 8px 0", borderTop: "1px solid #EEF2F8" }}>
        <div style={{ width: 38, height: 38, flex: "none", borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{initials}</div>
        <div style={{ minWidth: 0, lineHeight: 1.2, flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1B2A4E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
          <div style={{ fontSize: 11.5, color: "#9AA6BA", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</div>
        </div>
        <form action={logout}>
          <button type="submit" title="Odjava" className="rh-icon" style={{ ...iconBtn, width: 32, height: 32, border: "1px solid #EEF2F8" }}>
            <ILogout size={16} color="#B7C1D2" />
          </button>
        </form>
      </div>
      </aside>
    </div>
  );

  /* ===================== Screen: Profile ===================== */
  const profileScreen = (
    <div>
      <header style={{ position: "sticky", top: 0, zIndex: 4, background: "rgba(244,247,252,.86)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E9EEF6", padding: "20px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F1F44", letterSpacing: "-.01em" }}>Moj profil</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#7A879E" }}>Izgradi svoj profil jednom — Hunter ga koristi za svaku prijavu.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => setPreviewOpen(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", borderRadius: 11, border: "1px solid #DDE5F0", background: "#fff", color: "#42506B", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            <IEye size={16} />
            Pregledaj
          </button>
          <button type="button" onClick={onSaveProfile} disabled={isSaving} className="rh-soft" style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 18px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: isSaving ? "default" : "pointer", opacity: isSaving ? 0.7 : 1, boxShadow: "0 8px 18px rgba(37,99,235,.28)" }}>{isSaving ? "Spremam…" : "Spremi profil"}</button>
        </div>
      </header>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "30px 44px 70px", display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Osobni podaci */}
        <section style={card}>
          {sectionHead(<IUser size={20} />, "Osobni podaci", "Osnovne informacije o tebi")}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <div style={{ width: 72, height: 72, flex: "none", borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24 }}>{initials}</div>
            <button type="button" style={{ padding: "9px 15px", borderRadius: 10, border: "1px dashed #B9C6DC", background: "#F7FAFF", color: "#3D6CC8", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Učitaj fotografiju</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16 }}>
            <div>
              <label style={label}>Ime i prezime</label>
              <input className="rh-field" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="npr. Marko Horvat" style={field} />
            </div>
            <div>
              <label style={label}>Datum rođenja</label>
              <input className="rh-field" type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={field} />
            </div>
          </div>
          <Note ok={!!fullName.trim() && !!dob}>Ime i datum rođenja su obavezni.</Note>
          <div style={{ marginTop: 16 }}>
            <label style={label}>
              Kratki opis <span style={{ color: "#9AA6BA", fontWeight: 500 }}>— tvoje najbolje osobine i snage</span>
            </label>
            <textarea className="rh-field" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Pouzdan i znatiželjan… ukratko o sebi" style={{ ...field, resize: "vertical", lineHeight: 1.55 }} />
          </div>
        </section>

        {/* Radno iskustvo */}
        <section style={card}>
          {sectionHead(<IBriefcase size={20} />, "Radno iskustvo", "Dodaj svoje pozicije i projekte")}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {experiences.length === 0 && (
              <div style={{ fontSize: 13.5, color: "#8A94A6", padding: "4px 2px" }}>Još nema unesenih iskustava.</div>
            )}
            {experiences.map((exp) => (
              <form key={exp.id} action={updateExperience} style={{ border: "1px solid #E8EDF5", borderRadius: 16, padding: 18, background: "#FBFCFE", position: "relative" }}>
                <input type="hidden" name="id" value={exp.id} />
                <button type="submit" formAction={deleteExperience} className="rh-del" title="Ukloni" style={{ position: "absolute", top: 13, right: 13, width: 30, height: 30, borderRadius: 9, border: "1px solid #E8EDF5", background: "#fff", color: "#A6B0C2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IX />
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 14, paddingRight: 34 }}>
                  <div>
                    <label style={labelSm}>Naziv tvrtke</label>
                    <input className="rh-field" name="company" defaultValue={exp.company} placeholder="npr. Infobip" style={fieldSm} />
                  </div>
                  <div>
                    <label style={labelSm}>Pozicija</label>
                    <input className="rh-field" name="position" defaultValue={exp.position} placeholder="npr. Frontend Developer" style={fieldSm} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={labelSm}>Poveznica na tvrtku</label>
                    <div className="rh-fieldwrap" style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #E1E8F2", borderRadius: 10, background: "#fff", padding: "0 11px" }}>
                      <ISearch size={15} color="#9AA6BA" />
                      <input name="company_url" defaultValue={exp.company_url} placeholder="npr. infobip.com" style={{ width: "100%", padding: "11px 2px", border: "none", outline: "none", font: "inherit", fontSize: 13.5, color: "#2563EB", background: "transparent" }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelSm}>Razdoblje</label>
                    <PeriodField name="period" defaultValue={exp.period} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelSm}>Opis</label>
                  <textarea className="rh-field" name="description" rows={2} placeholder="Što si radio i postigao na ovoj poziciji…" style={{ ...fieldSm, resize: "vertical", lineHeight: 1.5 }} defaultValue={exp.description} />
                </div>
                <button type="submit" className="rh-soft" style={saveRowBtn}>Spremi</button>
              </form>
            ))}
          </div>
          <form action={addExperience}>
            <button type="submit" className="rh-add" style={addBtn}>
              <IPlus />
              Dodaj iskustvo
            </button>
          </form>
        </section>

        {/* Obrazovanje */}
        <section style={card}>
          {sectionHead(<ICap size={20} />, "Obrazovanje i tečajevi", "Diplome, tečajevi i certifikati")}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {education.length === 0 && (
              <div style={{ fontSize: 13.5, color: "#8A94A6", padding: "4px 2px" }}>Još nema unesenog obrazovanja.</div>
            )}
            {education.map((ed) => (
              <form key={ed.id} action={updateEducation} style={{ border: "1px solid #E8EDF5", borderRadius: 16, padding: 18, background: "#FBFCFE", position: "relative" }}>
                <input type="hidden" name="id" value={ed.id} />
                <button type="submit" formAction={deleteEducation} className="rh-del" title="Ukloni" style={{ position: "absolute", top: 13, right: 13, width: 30, height: 30, borderRadius: 9, border: "1px solid #E8EDF5", background: "#fff", color: "#A6B0C2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IX />
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 14, paddingRight: 34 }}>
                  <div>
                    <label style={labelSm}>Ustanova</label>
                    <input className="rh-field" name="institution" defaultValue={ed.institution} placeholder="npr. FER" style={fieldSm} />
                  </div>
                  <div>
                    <label style={labelSm}>Titula / zvanje</label>
                    <input className="rh-field" name="title" defaultValue={ed.title} placeholder="npr. mag. ing." style={fieldSm} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={labelSm}>Razdoblje</label>
                    <input className="rh-field" name="period" defaultValue={ed.period} placeholder="npr. 2014 – 2019" style={fieldSm} />
                  </div>
                  <div>
                    <label style={labelSm}>Poveznica (diploma/certifikat)</label>
                    <div className="rh-fieldwrap" style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #E1E8F2", borderRadius: 10, background: "#fff", padding: "0 11px" }}>
                      <ILink size={15} color="#9AA6BA" />
                      <input name="link" defaultValue={ed.link} placeholder="https://…" style={{ width: "100%", padding: "11px 2px", border: "none", outline: "none", font: "inherit", fontSize: 13.5, color: "#2563EB", background: "transparent" }} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="rh-soft" style={saveRowBtn}>Spremi</button>
              </form>
            ))}
          </div>
          <form action={addEducation}>
            <button type="submit" className="rh-add" style={{ ...addBtn, marginTop: 15 }}>
              <IPlus />
              Dodaj obrazovanje ili tečaj
            </button>
          </form>
        </section>

        {/* Vještine */}
        <section style={card}>
          {sectionHead(<IStar size={20} />, "Vještine", "Odaberi predložene ili dodaj svoje — po kategorijama")}
          <div style={{ marginBottom: 14 }}>
            <Note ok={skills.some((c) => c.items.length > 0)}>Dodaj barem jednu kategoriju s barem jednom vještinom.</Note>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {skills.length === 0 && (
              <div style={{ fontSize: 13.5, color: "#8A94A6", marginBottom: 4 }}>Još nema kategorija — dodaj jednu ispod.</div>
            )}
            {skills.map((cat, ci) => {
              const suggestions = (SKILL_SUGGESTIONS[cat.name] || []).filter((s) => !cat.items.includes(s));
              return (
                <div key={cat.name} style={{ borderTop: ci ? "1px solid #F0F3F8" : "none", paddingTop: ci ? 18 : 0, paddingBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
                    <div style={{ ...catTitle, marginBottom: 0 }}>{cat.name}</div>
                    <button type="button" onClick={() => removeCategory(ci)} title="Ukloni kategoriju" className="rh-del" style={catRemoveBtn}>
                      <IX size={12} w={2.3} />
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: suggestions.length ? 12 : 0 }}>
                    {cat.items.map((item, ii) => (
                      <span key={`${item}-${ii}`} style={chip}>
                        {item}
                        <button type="button" onClick={() => removeSkill(ci, ii)} title="Ukloni" style={chipX}>
                          <IX size={11} w={2.4} />
                        </button>
                      </span>
                    ))}
                    <ChipAdder placeholder="Dodaj vještinu…" onAdd={(v) => addSkillValue(ci, v)} />
                  </div>
                  {suggestions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                      <span style={suggLabel}>Predloženo:</span>
                      {suggestions.map((sg) => (
                        <button type="button" key={sg} onClick={() => addSkillValue(ci, sg)} style={suggChip}>+ {sg}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dodaj kategoriju */}
          <div style={{ marginTop: skills.length ? 4 : 12, paddingTop: 18, borderTop: "1px solid #F0F3F8" }}>
            <div style={{ ...catTitle, color: "#5A6478" }}>Dodaj kategoriju</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              {SKILL_CATEGORY_TEMPLATES.filter((t) => !skills.some((c) => c.name === t)).map((t) => (
                <button type="button" key={t} onClick={() => addCategory(t)} style={suggChip}>+ {t}</button>
              ))}
              <ChipAdder placeholder="Nova kategorija…" onAdd={addCategory} />
            </div>
          </div>
        </section>

        {/* Hobiji */}
        <section style={card}>
          {sectionHead(<IHeart size={20} />, "Hobiji", "Odaberi predložene ili dodaj svoje")}
          <div style={{ marginBottom: 14 }}>
            <Note ok={hobbies.length >= 3}>Odaberi barem 3 hobija (trenutno {hobbies.length}).</Note>
          </div>
          {/* odabrani */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 18 }}>
            {hobbies.length === 0 && <span style={{ fontSize: 13, color: "#8A94A6" }}>Još nema odabranih hobija — klikni predložene ispod ili dodaj svoj.</span>}
            {hobbies.map((h, i) => (
              <span key={`${h}-${i}`} style={chip}>
                {h}
                <button type="button" onClick={() => removeHobby(i)} title="Ukloni" style={chipX}>
                  <IX size={11} w={2.4} />
                </button>
              </span>
            ))}
            <ChipAdder placeholder="Dodaj hobi…" onAdd={addHobbyValue} />
          </div>
          {/* predlošci po kategorijama */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, borderTop: "1px solid #F0F3F8", paddingTop: 18 }}>
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

        {/* Ton */}
        <section style={card}>
          {sectionHead(<IChat size={20} />, "Zadani ton", "Kako želiš zvučati u svojim prijavama")}
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
                    border: active ? "1.5px solid #2563EB" : "1.5px solid #E6ECF5",
                    background: active ? "linear-gradient(150deg,#EEF4FF,#E3EDFF)" : "#fff",
                    color: active ? "#1D3B86" : "#1B2A4E",
                    boxShadow: active ? "0 6px 16px rgba(37,99,235,.16)" : "none",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: active ? "#4E72C0" : "#9AA6BA" }}>{t.desc}</span>
                </button>
              );
            })}
          </div>
          <p style={{ margin: "16px 0 0", fontSize: 12, color: "#9AA6BA" }}>Promjene u vještinama, hobijima i tonu spremaju se klikom na „Spremi profil”.</p>
        </section>
      </div>
    </div>
  );

  /* ===================== Screen: Hunter ===================== */
  const hunterScreen = (
    <div>
      <header style={{ position: "sticky", top: 0, zIndex: 4, background: "rgba(244,247,252,.86)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E9EEF6", padding: "20px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F1F44", letterSpacing: "-.01em", display: "flex", alignItems: "center", gap: 10 }}>
            Hunter Agent <span style={{ fontSize: 10.5, fontWeight: 800, color: "#2563EB", background: "#EAF1FE", padding: "3px 8px", borderRadius: 6, letterSpacing: ".04em" }}>AI</span>
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#7A879E" }}>Zalijepi oglas, odaberi ton — dobiješ prilagođeni životopis i pismo.</p>
        </div>
        {hunterStep === "result" && (
          <button type="button" onClick={() => setHunterStep("input")} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", borderRadius: 11, border: "1px solid #DDE5F0", background: "#fff", color: "#42506B", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
            <IRefresh />
            Nova prijava
          </button>
        )}
      </header>

      {hunterStep === "input" && (
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "34px 44px 70px" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 26 }}>
            <div style={{ width: 46, height: 46, flex: "none", borderRadius: 13, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px rgba(37,99,235,.28)" }}>
              <ISearch size={23} color="#fff" />
            </div>
            <div style={{ background: "#fff", border: "1px solid #E9EEF6", borderRadius: "6px 18px 18px 18px", padding: "18px 20px", boxShadow: "0 1px 2px rgba(16,31,68,.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#2563EB", letterSpacing: ".03em", marginBottom: 6 }}>HUNTER AGENT</div>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#3A4A66" }}>Bok {displayName.split(" ")[0]} — spreman sam pronaći tvoju sljedeću priliku. Zalijepi poveznice na oglase ili tvrtke na koje se želiš prijaviti, a ja ću usporediti tvoj profil s onim što traže i napisati prilagođen životopis i motivacijsko pismo.</p>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E9EEF6", borderRadius: 20, padding: 24, boxShadow: "0 2px 8px rgba(16,31,68,.05)" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3A4A66", marginBottom: 10 }}>Poveznice na oglase / tvrtke</label>
            <div className="rh-fieldwrap" style={{ border: "1px solid #E1E8F2", borderRadius: 13, background: "#FBFCFE", padding: 6 }}>
              <textarea rows={3} placeholder={"https://poslovi.infobip.com/frontend-developer\nhttps://careers.rimac-technology.com/…"} style={{ width: "100%", padding: "10px 12px", border: "none", outline: "none", font: "inherit", fontSize: 14, color: "#1B2A4E", background: "transparent", resize: "vertical", lineHeight: 1.7 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 12.5, color: "#8A94A6" }}>
              <IInfo />
              Možeš dodati više poveznica — svaka u svoj red.
            </div>

            <div style={{ height: 1, background: "#EEF2F8", margin: "22px 0" }} />

            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#3A4A66", marginBottom: 12 }}>Ton za ovu prijavu</label>
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
                      border: active ? "1.5px solid #2563EB" : "1.5px solid #E1E8F2",
                      background: active ? "linear-gradient(135deg,#3B82F6,#2563EB)" : "#fff",
                      color: active ? "#fff" : "#5A6478",
                      boxShadow: active ? "0 6px 14px rgba(37,99,235,.25)" : "none",
                    }}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>

            <button type="button" onClick={generate} className="rh-soft" style={{ marginTop: 24, width: "100%", padding: 15, borderRadius: 13, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", font: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: "0 10px 22px rgba(37,99,235,.3)" }}>
              <ISparkles />
              Generiraj s Hunter Agentom
            </button>
          </div>
        </div>
      )}

      {hunterStep === "working" && (
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "60px 44px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 34 }}>
            <div style={{ width: 74, height: 74, borderRadius: 20, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(37,99,235,.32)", position: "relative" }}>
              <div style={{ position: "absolute", inset: -6, borderRadius: 24, border: "2px solid #BBD2FF", borderTopColor: "transparent", animation: "rh-spin 1s linear infinite" }} />
              <ISearch size={34} color="#fff" />
            </div>
            <h2 style={{ margin: "22px 0 6px", fontSize: 20, fontWeight: 800, color: "#13234A" }}>Hunter radi na tvojoj prijavi…</h2>
            <p style={{ margin: 0, fontSize: 14, color: "#7A879E" }}>Ovo obično traje nekoliko sekundi.</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E9EEF6", borderRadius: 18, padding: "14px 10px", boxShadow: "0 2px 8px rgba(16,31,68,.05)" }}>
            {WORK.map((labelText, i) => {
              const done = i < workIdx;
              const active = i === workIdx;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 14px", borderRadius: 12, transition: "all .3s", background: active ? "#F4F8FF" : "transparent" }}>
                  <div style={{ width: 26, height: 26, flex: "none", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "#1FA463" : active ? "linear-gradient(135deg,#3B82F6,#2563EB)" : "#EEF2F8" }}>
                    {done ? <ICheck color="#fff" /> : active ? <div style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid #fff", borderTopColor: "transparent", animation: "rh-spin .8s linear infinite" }} /> : <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#C2CDDD" }} />}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: done || active ? 700 : 500, color: done ? "#1B2A4E" : active ? "#13234A" : "#A0AABB", transition: "all .3s" }}>{labelText}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hunterStep === "result" && (
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 44px 70px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,#EAF7EF,#E1F5EA)", border: "1px solid #C7EAD6", borderRadius: 14, padding: "14px 18px", marginBottom: 22 }}>
            <div style={{ width: 34, height: 34, flex: "none", borderRadius: 10, background: "#1FA463", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ICheck size={18} w={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: "#0E6B3D" }}>Spremno!</div>
              <div style={{ fontSize: 12.5, color: "#3E9468" }}>Prilagođeno za <strong>Infobip · Frontend Developer</strong> · ton: {hunterTone}</div>
            </div>
            <button type="button" onClick={saveToDashboard} style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#1FA463", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Spremi u Dashboard</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(380px,1fr))", gap: 22 }}>
            {/* CV */}
            <div style={{ background: "#fff", border: "1px solid #E9EEF6", borderRadius: 20, boxShadow: "0 2px 10px rgba(16,31,68,.06)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #EEF2F8", background: "#FBFCFE" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ ...secIcon, width: 34, height: 34, borderRadius: 10 }}><IFile /></div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#13234A" }}>Životopis</span>
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  <button type="button" onClick={copyCv} title="Kopiraj" className="rh-icon" style={iconBtn}><ICopy /></button>
                  <button type="button" onClick={() => showToast("Preuzimanje životopisa…")} title="Preuzmi" className="rh-icon" style={iconBtn}><IDownload /></button>
                </div>
              </div>
              <div style={{ padding: "24px 26px", maxHeight: 560, overflow: "auto" }}>
                <div style={{ fontSize: 21, fontWeight: 800, color: "#0F1F44" }}>{displayName}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#2563EB", marginTop: 2 }}>{experiences[0]?.position || "Frontend Developer"}</div>
                <div style={{ fontSize: 12, color: "#8A94A6", marginTop: 6 }}>{email} · +385 91 234 5678 · Zagreb, HR</div>
                <div style={{ height: 1, background: "#EEF2F8", margin: "16px 0" }} />
                <div style={{ fontSize: 11.5, fontWeight: 800, color: "#2563EB", letterSpacing: ".05em", marginBottom: 7 }}>SAŽETAK</div>
                <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.65, color: "#3A4A66" }}>{bio || "Frontend developer s iskustvom u izradi skalabilnih web aplikacija. Usmjeren na performanse, pristupačnost i čist kod."}</p>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: "#2563EB", letterSpacing: ".05em", marginBottom: 9 }}>ISKUSTVO</div>
                {(experiences.length ? experiences : []).map((exp) => (
                  <div key={exp.id} style={{ marginBottom: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1B2A4E" }}>{exp.position || "Pozicija"}{exp.company ? ` · ${exp.company}` : ""}</span>
                      <span style={{ fontSize: 12, color: "#8A94A6", whiteSpace: "nowrap" }}>{exp.period}</span>
                    </div>
                    {exp.description && <p style={{ margin: "5px 0 0", fontSize: 13, lineHeight: 1.6, color: "#566179" }}>{exp.description}</p>}
                  </div>
                ))}
                {experiences.length === 0 && <p style={{ margin: "0 0 13px", fontSize: 13, color: "#8A94A6" }}>Dodaj iskustva u „Moj profil”.</p>}
                <div style={{ fontSize: 11.5, fontWeight: 800, color: "#2563EB", letterSpacing: ".05em", margin: "4px 0 8px" }}>VJEŠTINE</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {skills.flatMap((c) => c.items).slice(0, 12).map((t, i) => (
                    <span key={`${t}-${i}`} style={{ padding: "5px 11px", borderRadius: 999, background: "#EEF3FB", color: "#2C3E63", fontSize: 12, fontWeight: 600 }}>{t}</span>
                  ))}
                  {skills.flatMap((c) => c.items).length === 0 && <span style={{ fontSize: 12, color: "#8A94A6" }}>—</span>}
                </div>
              </div>
            </div>

            {/* Cover letter */}
            <div style={{ background: "#fff", border: "1px solid #E9EEF6", borderRadius: 20, boxShadow: "0 2px 10px rgba(16,31,68,.06)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #EEF2F8", background: "#FBFCFE" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ ...secIcon, width: 34, height: 34, borderRadius: 10 }}><IMail /></div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#13234A" }}>Motivacijsko pismo</span>
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  <button type="button" onClick={copyCover} title="Kopiraj" className="rh-icon" style={iconBtn}><ICopy /></button>
                  <button type="button" onClick={() => showToast("Preuzimanje pisma…")} title="Preuzmi" className="rh-icon" style={iconBtn}><IDownload /></button>
                </div>
              </div>
              <div style={{ padding: "24px 26px", maxHeight: 560, overflow: "auto", fontSize: 13.5, lineHeight: 1.75, color: "#3A4A66" }}>
                <p style={{ margin: "0 0 13px" }}>Poštovani,</p>
                <p style={{ margin: "0 0 13px" }}>s velikim entuzijazmom prijavljujem se na poziciju <strong>Frontend Developera</strong> u Infobipu. Vaš fokus na izgradnju pouzdane komunikacijske infrastrukture za milijune korisnika izravno se poklapa s mojim iskustvom u razvoju brzih i skalabilnih sučelja.</p>
                <p style={{ margin: "0 0 13px" }}>U dosadašnjem radu vodio sam razvoj korisničkog sučelja platforme s globalnim dosegom, gdje sam smanjio vrijeme učitavanja za 38% i uveo komponentni sustav koji je ubrzao rad cijelog tima. Vjerujem da bih sličnu vrijednost mogao donijeti i vašem timu.</p>
                <p style={{ margin: "0 0 13px" }}>Posebno me privlači Infobipova kultura inženjerske izvrsnosti i prilika za rad na proizvodu koji svakodnevno koristi velik broj ljudi. Radujem se mogućnosti da svoje znanje primijenim na vaše izazove.</p>
                <p style={{ margin: "0 0 13px" }}>Hvala na razmatranju moje prijave. Stojim na raspolaganju za razgovor u terminu koji vam odgovara.</p>
                <p style={{ margin: 0 }}>Srdačan pozdrav,<br /><strong>{displayName}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ===================== Screen: Dashboard ===================== */
  const dashboardScreen = (
    <div>
      <header style={{ position: "sticky", top: 0, zIndex: 4, background: "rgba(244,247,252,.86)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E9EEF6", padding: "20px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F1F44", letterSpacing: "-.01em" }}>Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#7A879E" }}>Svi tvoji generirani životopisi i motivacijska pisma.</p>
        </div>
        <button type="button" onClick={newWithHunter} className="rh-soft" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 18px rgba(37,99,235,.28)" }}>
          <IPlus w={2.2} />
          Novo s Hunter Agentom
        </button>
      </header>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 44px 70px" }}>
        <div style={{ background: "#fff", border: "1px solid #E9EEF6", borderRadius: 20, padding: "64px 40px", boxShadow: "0 1px 2px rgba(16,31,68,.04)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 66, height: 66, flex: "none", borderRadius: 18, background: "#EAF1FE", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <IGrid size={30} />
          </div>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "#13234A" }}>Još nemaš spremljenih prijava</h2>
          <p style={{ margin: "9px 0 24px", fontSize: 14, color: "#7A879E", maxWidth: 440, lineHeight: 1.6 }}>
            Kad s Hunter Agentom generiraš životopis i motivacijsko pismo te ih spremiš, pojavit će se ovdje — sa statistikama i pregledom svih prijava.
          </p>
          <button type="button" onClick={newWithHunter} className="rh-soft" style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", font: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 22px rgba(37,99,235,.3)" }}>
            <IPlus w={2.2} />
            Generiraj prvu prijavu
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rh-app" style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#F4F7FC", color: "#1B2A4E" }}>
      {sidebar}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div key={screen} className="rh-enter" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {screen === "profile" && profileScreen}
          {screen === "hunter" && hunterScreen}
          {screen === "dashboard" && dashboardScreen}
        </div>
      </main>

      {!sidebarOpen && (
        <button type="button" onClick={() => setSidebarOpen(true)} title="Otvori izbornik" style={{ position: "fixed", top: "50%", left: 0, transform: "translateY(-50%)", zIndex: 30, width: 26, height: 66, borderRadius: "0 13px 13px 0", border: "1px solid #E9EEF6", borderLeft: "none", background: "#fff", color: "#2563EB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "3px 0 12px rgba(16,31,68,.12)" }}>
          <IChevronRight size={18} />
        </button>
      )}

      {/* Pregled profila (CV) */}
      {previewOpen && (
        <div onClick={() => setPreviewOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(15,31,68,.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 760, background: "#fff", borderRadius: 20, boxShadow: "0 30px 70px rgba(16,31,68,.35)", animation: "rh-pop .3s ease both", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: "1px solid #EEF2F8", background: "#fff", borderRadius: "20px 20px 0 0" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#13234A", display: "flex", alignItems: "center", gap: 9 }}>
                <IFile size={18} color="#2563EB" />
                Pregled profila
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} className="rh-icon" style={iconBtn} title="Zatvori (Esc)">
                <IX />
              </button>
            </div>

            <div style={{ padding: "32px 40px 42px" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#0F1F44" }}>{displayName}</div>
              {headRole && <div style={{ fontSize: 14.5, fontWeight: 700, color: "#2563EB", marginTop: 3 }}>{headRole}</div>}
              <div style={{ fontSize: 12.5, color: "#8A94A6", marginTop: 7 }}>{[email, dobFmt].filter(Boolean).join(" · ")}</div>

              {bio.trim() && (
                <>
                  <div style={cvH}>SAŽETAK</div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "#3A4A66" }}>{bio}</p>
                </>
              )}

              {expList.length > 0 && (
                <>
                  <div style={cvH}>ISKUSTVO</div>
                  {expList.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: 13 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1B2A4E" }}>{[exp.position, exp.company].filter(Boolean).join(" · ") || "—"}</span>
                        {exp.period && <span style={{ fontSize: 12, color: "#8A94A6", whiteSpace: "nowrap" }}>{exp.period}</span>}
                      </div>
                      {exp.description && <p style={{ margin: "5px 0 0", fontSize: 13, lineHeight: 1.6, color: "#566179" }}>{exp.description}</p>}
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
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1B2A4E" }}>{[ed.title, ed.institution].filter(Boolean).join(" · ") || "—"}</span>
                        {ed.period && <span style={{ fontSize: 12, color: "#8A94A6", whiteSpace: "nowrap" }}>{ed.period}</span>}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {skillCats.length > 0 && (
                <>
                  <div style={cvH}>VJEŠTINE</div>
                  {skillCats.map((c) => (
                    <div key={c.name} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6478", marginBottom: 6 }}>{c.name}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {c.items.map((it, i) => (
                          <span key={`${it}-${i}`} style={cvChip}>{it}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {hobbies.length > 0 && (
                <>
                  <div style={cvH}>HOBIJI</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {hobbies.map((h, i) => (
                      <span key={`${h}-${i}`} style={cvChip}>{h}</span>
                    ))}
                  </div>
                </>
              )}

              {!bio.trim() && expList.length === 0 && eduList.length === 0 && skillCats.length === 0 && hobbies.length === 0 && (
                <p style={{ margin: "22px 0 0", fontSize: 13.5, color: "#8A94A6" }}>Profil je još prazan — popuni podatke pa će se ovdje prikazati kao životopis.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#13234A", color: "#fff", padding: "13px 22px", borderRadius: 12, fontSize: 13.5, fontWeight: 600, boxShadow: "0 12px 30px rgba(16,31,68,.3)", zIndex: 50, display: "flex", alignItems: "center", gap: 9, animation: "rh-toast .25s ease both" }}>
          <ICheck size={17} color="#5FD79A" w={2.5} />
          {toast}
        </div>
      )}
    </div>
  );
}
