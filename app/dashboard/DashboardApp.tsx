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

const DASH_ITEMS = [
  { initials: "In", company: "Infobip", role: "Frontend Developer", tone: "Profesionalan", date: "28. lip", c: "#2563EB" },
  { initials: "Ri", company: "Rimac Technology", role: "Software Engineer", tone: "Samouvjeren", date: "26. lip", c: "#0EA5E9" },
  { initials: "Ph", company: "Photomath", role: "React Developer", tone: "Prijateljski", date: "24. lip", c: "#7C3AED" },
  { initials: "Sp", company: "Span", role: "UI Engineer", tone: "Formalan", date: "21. lip", c: "#0F766E" },
  { initials: "Mi", company: "Microblink", role: "Frontend Developer", tone: "Kreativan", date: "18. lip", c: "#DB2777" },
  { initials: "Fl", company: "Five Agency", role: "Mobile Developer", tone: "Profesionalan", date: "15. lip", c: "#D97706" },
];
const TONE_TINT: Record<string, string> = {
  Profesionalan: "#2563EB",
  Samouvjeren: "#0EA5E9",
  Prijateljski: "#7C3AED",
  Kreativan: "#DB2777",
  Formalan: "#0F766E",
};

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
const card: CSSProperties = { background: "#fff", border: "1px solid #E9EEF6", borderRadius: 20, padding: "26px 28px", boxShadow: "0 1px 2px rgba(16,31,68,.04)" };
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

  function addSkill(catIdx: number) {
    const v = window.prompt(`Dodaj u "${skills[catIdx].name}":`)?.trim();
    if (!v) return;
    setSkills((s) => s.map((c, i) => (i === catIdx ? { ...c, items: [...c.items, v] } : c)));
  }
  function removeSkill(catIdx: number, itemIdx: number) {
    setSkills((s) => s.map((c, i) => (i === catIdx ? { ...c, items: c.items.filter((_, j) => j !== itemIdx) } : c)));
  }
  function addHobby() {
    const v = window.prompt("Dodaj hobi:")?.trim();
    if (!v) return;
    setHobbies((h) => [...h, v]);
  }
  function removeHobby(idx: number) {
    setHobbies((h) => h.filter((_, j) => j !== idx));
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
    <aside style={{ width: 266, flex: "none", background: "#fff", borderRight: "1px solid #E9EEF6", position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", padding: "22px 18px", zIndex: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "4px 6px 0" }}>
        <div style={{ width: 42, height: 42, flex: "none", borderRadius: 11, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ISearch size={22} color="#fff" />
        </div>
        <div style={{ lineHeight: 1.05 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.01em" }}>
            <span style={{ color: "#0F1F44" }}>Resume</span> <span style={{ color: "#2563EB" }}>Hunter</span>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "#9AA6BA", letterSpacing: ".02em", marginTop: 2 }}>AI agent za pametnije prijave</div>
        </div>
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

      <div style={{ marginTop: 22, padding: 16, borderRadius: 16, background: "linear-gradient(150deg,#EEF4FF,#E3EDFF)", border: "1px solid #DCE7FB" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1D3B86" }}>Profil je 80% spreman</div>
        <div style={{ height: 7, borderRadius: 6, background: "#fff", margin: "10px 0 9px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "80%", borderRadius: 6, background: "linear-gradient(90deg,#3B82F6,#2563EB)" }} />
        </div>
        <div style={{ fontSize: 11.5, color: "#5E78A8", lineHeight: 1.4 }}>Dodaj još jedno iskustvo za bolje rezultate.</div>
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
          <button type="button" style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", borderRadius: 11, border: "1px solid #DDE5F0", background: "#fff", color: "#42506B", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Pregledaj</button>
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
                    <input className="rh-field" name="period" defaultValue={exp.period} placeholder="od – do" style={fieldSm} />
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
          {sectionHead(<IStar size={20} />, "Vještine", "Grupirane po kategorijama")}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {skills.map((cat, ci) => (
              <div key={cat.name}>
                <div style={catTitle}>{cat.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  {cat.items.map((item, ii) => (
                    <span key={`${item}-${ii}`} style={chip}>
                      {item}
                      <button type="button" onClick={() => removeSkill(ci, ii)} title="Ukloni" style={chipX}>
                        <IX size={11} w={2.4} />
                      </button>
                    </span>
                  ))}
                  <button type="button" onClick={() => addSkill(ci)} style={chipAdd}>+ Dodaj</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hobiji */}
        <section style={card}>
          {sectionHead(<IHeart size={20} />, "Hobiji", "Pokaži tko si izvan posla")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {hobbies.map((h, i) => (
              <span key={`${h}-${i}`} style={chip}>
                {h}
                <button type="button" onClick={() => removeHobby(i)} title="Ukloni" style={chipX}>
                  <IX size={11} w={2.4} />
                </button>
              </span>
            ))}
            <button type="button" onClick={addHobby} style={chipAdd}>+ Dodaj</button>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { l: "Ukupno prijava", v: "12", c: "#13234A" },
            { l: "Ovaj tjedan", v: "4", c: "#13234A" },
            { l: "Pozvan na razgovor", v: "3", c: "#1FA463" },
            { l: "Stopa odgovora", v: "25%", c: "#13234A" },
          ].map((s) => (
            <div key={s.l} style={{ background: "#fff", border: "1px solid #E9EEF6", borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 2px rgba(16,31,68,.04)" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#8A94A6" }}>{s.l}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.c, marginTop: 4 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={{ padding: "8px 15px", borderRadius: 999, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Sve</button>
            <button type="button" style={{ padding: "8px 15px", borderRadius: 999, border: "1px solid #E1E8F2", background: "#fff", color: "#5A6478", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Ovaj tjedan</button>
            <button type="button" style={{ padding: "8px 15px", borderRadius: 999, border: "1px solid #E1E8F2", background: "#fff", color: "#5A6478", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Pozvan na razgovor</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#8A94A6" }}>
            <span>Poredaj:</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 13px", borderRadius: 10, border: "1px solid #E1E8F2", background: "#fff", color: "#3A4A66", fontWeight: 700, cursor: "pointer" }}>Najnovije <IChevron /></span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: 18 }}>
          {DASH_ITEMS.map((d) => {
            const tint = TONE_TINT[d.tone] || "#2563EB";
            return (
              <div key={d.company} className="rh-card" style={{ background: "#fff", border: "1px solid #E9EEF6", borderRadius: 18, padding: 20, boxShadow: "0 1px 2px rgba(16,31,68,.04)", display: "flex", flexDirection: "column", transition: "all .15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, flex: "none", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff", background: d.c }}>{d.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#13234A" }}>{d.company}</div>
                    <div style={{ fontSize: 12.5, color: "#7A879E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.role}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ padding: "4px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: tint + "18", color: tint }}>{d.tone}</span>
                  <span style={{ fontSize: 12, color: "#A0AABB", marginLeft: "auto" }}>{d.date}</span>
                </div>
                <div style={{ display: "flex", gap: 7, marginTop: "auto", paddingTop: 14, borderTop: "1px solid #F0F3F8" }}>
                  <button type="button" style={{ flex: 1, padding: 9, borderRadius: 9, border: "1px solid #E4EAF3", background: "#fff", color: "#3A4A66", font: "inherit", fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <IEye />
                    Otvori
                  </button>
                  <button type="button" title="Kopiraj" onClick={copyCv} className="rh-icon" style={{ ...iconBtn, width: 38 }}><ICopy size={15} /></button>
                  <button type="button" title="Preuzmi" onClick={() => showToast("Preuzimanje…")} className="rh-icon" style={{ ...iconBtn, width: 38 }}><IDownload size={15} /></button>
                  <button type="button" title="Generiraj ponovno" onClick={newWithHunter} className="rh-icon" style={{ ...iconBtn, width: 38 }}><IRefresh size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="rh-app" style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#F4F7FC", color: "#1B2A4E" }}>
      {sidebar}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {screen === "profile" && profileScreen}
        {screen === "hunter" && hunterScreen}
        {screen === "dashboard" && dashboardScreen}
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#13234A", color: "#fff", padding: "13px 22px", borderRadius: 12, fontSize: 13.5, fontWeight: 600, boxShadow: "0 12px 30px rgba(16,31,68,.3)", zIndex: 50, display: "flex", alignItems: "center", gap: 9, animation: "rh-toast .25s ease both" }}>
          <ICheck size={17} color="#5FD79A" w={2.5} />
          {toast}
        </div>
      )}
    </div>
  );
}
