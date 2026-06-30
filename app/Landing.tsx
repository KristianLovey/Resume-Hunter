"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

/* ===================== Icons ===================== */
type IconProps = { size?: number; color?: string; w?: number };
const svg = (size: number, color: string, w: number): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: w,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});
const ISearch = ({ size = 24, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...svg(size, color, w)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
const IUser = ({ size = 24, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...svg(size, color, w)}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const IFile = ({ size = 24, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...svg(size, color, w)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
);
const IChat = ({ size = 24, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...svg(size, color, w)}><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg>
);
const IGrid = ({ size = 24, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...svg(size, color, w)}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);
const IArrow = ({ size = 18, color = "currentColor", w = 2.2 }: IconProps) => (
  <svg {...svg(size, color, w)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ICheck = ({ size = 16, color = "currentColor", w = 2.5 }: IconProps) => (
  <svg {...svg(size, color, w)}><path d="M20 6 9 17l-5-5" /></svg>
);
const ISpark = ({ size = 16, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...svg(size, color, w)}><path d="m12 3 1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" /></svg>
);
const IMail = ({ size = 16, color = "currentColor", w = 2 }: IconProps) => (
  <svg {...svg(size, color, w)}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>
);

/* ===================== Scroll reveal ===================== */
function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity .6s ease ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ===================== Data ===================== */
const STEPS: { icon: React.ReactNode; tag: string; title: string; desc: string }[] = [
  {
    icon: <IUser size={26} color="#fff" />,
    tag: "Profil",
    title: "Ispuni profil — samo jednom",
    desc: "Upišeš iskustvo, obrazovanje, vještine i ono što te veseli. Hunter to zapamti, pa više nikad ne kreneš od nule.",
  },
  {
    icon: <ISearch size={26} color="#fff" />,
    tag: "Analiza",
    title: "Zalijepi oglas, ostalo je na nama",
    desc: "Baci link na oglas i Hunter pročita što poslodavac zapravo traži — pa to poveže s onime što ti donosiš.",
  },
  {
    icon: <IFile size={26} color="#fff" />,
    tag: "Generiranje",
    title: "Životopis i pismo — na tanjuru",
    desc: "Skrojeni baš za taj posao, s naglaskom na ono što tom poslodavcu znači. Ti samo pregledaš i pošalješ.",
  },
  {
    icon: <IChat size={26} color="#fff" />,
    tag: "Ton",
    title: "Zvuči kao ti",
    desc: "Profesionalno, samouvjereno, opušteno… odaberi ton koji ti paše, a Hunter će ga pogoditi.",
  },
  {
    icon: <IGrid size={26} color="#fff" />,
    tag: "Pregled",
    title: "Sve prijave na jednom mjestu",
    desc: "Dashboard pamti svaku prijavu i ton — da uvijek znaš gdje si se javio i što si točno poslao.",
  },
];

/* ===================== Styles ===================== */
const wrap: CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "0 24px", width: "100%" };
const btnPrimary: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 24px", borderRadius: 13, border: "none", background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", textDecoration: "none", boxShadow: "0 12px 26px rgba(37,99,235,.32)" };
const btnGhost: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", borderRadius: 13, border: "1px solid #DDE5F0", background: "#fff", color: "#42506B", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", textDecoration: "none" };

export default function Landing({ loggedIn }: { loggedIn: boolean }) {
  const [logoOk, setLogoOk] = useState(true);
  const ctaHref = loggedIn ? "/dashboard" : "/login";
  const ctaLabel = loggedIn ? "Otvori dashboard" : "Započni besplatno";

  const logo = logoOk ? (
    <img src="/logo.png" alt="Resume Hunter" onError={() => setLogoOk(false)} style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 10 }} />
  ) : (
    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ISearch size={21} color="#fff" />
    </div>
  );

  return (
    <div className="rh-landing" style={{ width: "100%", background: "#fff", color: "#1B2A4E", overflowX: "hidden" }}>
      {/* ===== Navbar ===== */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.82)", backdropFilter: "blur(10px)", borderBottom: "1px solid #EEF2F8" }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            {logo}
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.01em" }}>
              <span style={{ color: "#0F1F44" }}>Resume</span> <span style={{ color: "#2563EB" }}>Hunter</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="#mogucnosti" style={{ fontSize: 14, fontWeight: 700, color: "#5E6B86", textDecoration: "none" }}>Mogućnosti</a>
            <a href={ctaHref} style={{ ...btnPrimary, padding: "10px 18px", fontSize: 14, boxShadow: "none" }}>
              {loggedIn ? "Dashboard" : "Prijava"}
            </a>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#F4F8FF,#FFFFFF)" }}>
        {/* dekorativni blobovi */}
        <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,#DCE7FB,transparent 70%)", animation: "rh-blob 9s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -160, left: -120, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle,#E3EDFF,transparent 70%)", animation: "rh-blob 11s ease-in-out infinite", pointerEvents: "none" }} />

        <div style={{ ...wrap, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "84px 24px 96px" }}>
          <Reveal delay={40} y={26}>
            <h1 style={{ margin: 0, fontSize: "clamp(40px,7vw,68px)", lineHeight: 1.02, fontWeight: 800, letterSpacing: "-.03em", color: "#0F1F44", maxWidth: 920 }}>
              Prijave za posao su naporne.{" "}
              <span style={{ background: "linear-gradient(135deg,#3B82F6,#2563EB)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Hunter ih piše umjesto tebe.</span>
            </h1>
          </Reveal>

          <Reveal delay={140} y={26}>
            <p style={{ margin: "24px auto 0", fontSize: "clamp(17px,2.2vw,20px)", lineHeight: 1.65, color: "#5E6B86", maxWidth: 630, fontWeight: 500 }}>
              Ispuni profil jednom, zalijepi link na oglas i u ruci imaš životopis i motivacijsko pismo skrojene baš za taj posao. Bez zurenja u prazan dokument.
            </p>
          </Reveal>

          <Reveal delay={240} y={26}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 34 }}>
              <a href={ctaHref} style={btnPrimary}>
                {ctaLabel}
                <IArrow />
              </a>
              <a href="#mogucnosti" style={btnGhost}>Pogledaj mogućnosti</a>
            </div>
          </Reveal>

          {/* product mock */}
          <Reveal delay={220} y={42}>
            <div style={{ marginTop: 64, width: "min(720px,100%)", animation: "rh-float 6s ease-in-out infinite" }}>
              <div style={{ background: "#fff", border: "1px solid #E9EEF6", borderRadius: 22, boxShadow: "0 44px 90px rgba(16,31,68,.22)", overflow: "hidden", textAlign: "left" }}>
                {/* browser chrome */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "13px 16px", borderBottom: "1px solid #EEF2F8", background: "#FBFCFE" }}>
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
                  <span style={{ marginLeft: 10, fontSize: 12.5, fontWeight: 700, color: "#9AA6BA" }}>Hunter Agent</span>
                  <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, color: "#1FA463", background: "#E7F7EE", padding: "4px 9px", borderRadius: 999 }}>
                    <ISpark size={12} color="#1FA463" /> Generirano
                  </span>
                </div>

                <div style={{ padding: 18 }}>
                  {/* match row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F7FAFF", borderRadius: 14, padding: "12px 14px" }}>
                    <div style={{ width: 38, height: 38, flex: "none", borderRadius: 11, background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>In</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: "#13234A" }}>Frontend Developer</div>
                      <div style={{ fontSize: 12, color: "#8A94A6" }}>Infobip · Zagreb</div>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: "#1FA463", background: "#E7F7EE", padding: "6px 11px", borderRadius: 999 }}>
                      <ICheck size={13} color="#1FA463" /> 94% podudaranje
                    </div>
                  </div>

                  {/* docs */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                    {/* CV */}
                    <div style={{ background: "#fff", border: "1px solid #EEF2F8", borderRadius: 14, padding: 15 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                        <IFile size={15} color="#2563EB" />
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#13234A" }}>Životopis</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0F1F44" }}>Marko Horvat</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#2563EB", marginBottom: 9 }}>Frontend Developer</div>
                      <div style={{ fontSize: 9, fontWeight: 800, color: "#9AA6BA", letterSpacing: ".05em", marginBottom: 5 }}>SAŽETAK</div>
                      <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.55, color: "#7A879E" }}>Frontend developer s 5+ godina iskustva u Reactu i TypeScriptu. Fokus na performanse i čist kod.</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 11 }}>
                        {["React", "TypeScript", "Node.js"].map((t) => (
                          <span key={t} style={{ padding: "3px 9px", borderRadius: 999, background: "#EAF1FE", color: "#2563EB", fontSize: 10, fontWeight: 700 }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    {/* Cover */}
                    <div style={{ background: "#fff", border: "1px solid #EEF2F8", borderRadius: 14, padding: 15 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                        <IMail size={15} color="#2563EB" />
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#13234A" }}>Motivacijsko pismo</span>
                      </div>
                      <p style={{ margin: "0 0 7px", fontSize: 10.5, lineHeight: 1.6, color: "#566179" }}>Poštovani,</p>
                      <p style={{ margin: "0 0 7px", fontSize: 10.5, lineHeight: 1.6, color: "#7A879E" }}>s veseljem se prijavljujem na poziciju Frontend Developera u Infobipu — vaš fokus na pouzdanu komunikaciju poklapa se s mojim iskustvom.</p>
                      <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.6, color: "#7A879E" }}>U dosadašnjem radu smanjio sam vrijeme učitavanja za 38%…</p>
                    </div>
                  </div>

                  {/* tones */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#9AA6BA" }}>Ton:</span>
                    <span style={{ padding: "6px 12px", borderRadius: 999, background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", fontSize: 11.5, fontWeight: 700 }}>Profesionalan</span>
                    <span style={{ padding: "6px 12px", borderRadius: 999, background: "#fff", border: "1px solid #E1E8F2", color: "#5A6478", fontSize: 11.5, fontWeight: 700 }}>Samouvjeren</span>
                    <span style={{ padding: "6px 12px", borderRadius: 999, background: "#fff", border: "1px solid #E1E8F2", color: "#5A6478", fontSize: 11.5, fontWeight: 700 }}>Prijateljski</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Mogućnosti (scroll stablo) ===== */}
      <section id="mogucnosti" style={{ background: "#F4F7FC", padding: "84px 0 96px" }}>
        <div style={wrap}>
          <Reveal y={24}>
            <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 56px" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#2563EB", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 12 }}>Kako radi</div>
              <h2 style={{ margin: 0, fontSize: "clamp(28px,4.4vw,42px)", fontWeight: 800, letterSpacing: "-.02em", color: "#0F1F44" }}>Od profila do gotove prijave</h2>
              <p style={{ margin: "14px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "#5E6B86" }}>Bez kompliciranja — pet koraka i prijava je spremna za slanje.</p>
            </div>
          </Reveal>

          {/* stablo */}
          <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
            <div style={{ position: "absolute", left: 27, top: 24, bottom: 24, width: 2, background: "linear-gradient(#C9DBF8,#EAF1FE)" }} />
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 60} y={36}>
                <div style={{ display: "flex", gap: 22, alignItems: "flex-start", marginBottom: i === STEPS.length - 1 ? 0 : 26 }}>
                  <div style={{ position: "relative", zIndex: 1, flex: "none", width: 56, display: "flex", justifyContent: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 22px rgba(37,99,235,.28)" }}>{s.icon}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, background: "#fff", border: "1px solid #E9EEF6", borderRadius: 18, padding: "20px 24px", boxShadow: "0 2px 10px rgba(16,31,68,.05)" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#2563EB", letterSpacing: ".05em", textTransform: "uppercase" }}>Korak {i + 1} · {s.tag}</div>
                    <h3 style={{ margin: "7px 0 8px", fontSize: 19, fontWeight: 800, color: "#13234A" }}>{s.title}</h3>
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "#5E6B86" }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Zašto ===== */}
      <section style={{ background: "#fff", padding: "80px 0" }}>
        <div style={wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {[
              { t: "Nema više praznog papira", d: "Hunter napiše prvi nacrt, ti ga samo dotjeraš. Najteži dio je riješen." },
              { t: "Skrojeno za svaki oglas", d: "Svaka prijava naglašava baš ono što taj poslodavac želi čuti." },
              { t: "Gotovo dok skuhaš kavu", d: "Ono što je nekad trajalo sat vremena sad je gotovo za par minuta." },
            ].map((b, i) => (
              <Reveal key={b.t} delay={i * 80} y={30}>
                <div style={{ height: "100%", background: "#F7FAFF", border: "1px solid #E9EEF6", borderRadius: 18, padding: "26px 24px" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: "#EAF1FE", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <ICheck size={20} color="#2563EB" />
                  </div>
                  <h3 style={{ margin: "0 0 7px", fontSize: 17, fontWeight: 800, color: "#13234A" }}>{b.t}</h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#5E6B86" }}>{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Završni CTA ===== */}
      <section style={{ padding: "0 0 90px", background: "#fff" }}>
        <div style={wrap}>
          <Reveal y={30}>
            <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#2563EB,#1D4ED8)", borderRadius: 28, padding: "60px 32px", textAlign: "center", boxShadow: "0 30px 60px rgba(37,99,235,.3)" }}>
              <div style={{ position: "absolute", top: -80, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
              <h2 style={{ margin: 0, fontSize: "clamp(26px,4.4vw,40px)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", position: "relative" }}>Tvoja sljedeća prilika te čeka.</h2>
              <p style={{ margin: "14px auto 0", fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,.88)", maxWidth: 500, position: "relative" }}>Napravi profil, a teži dio prepusti Hunteru. Ti se samo javi — on će napisati.</p>
              <a href={ctaHref} style={{ ...btnPrimary, position: "relative", marginTop: 28, background: "#fff", color: "#2563EB", boxShadow: "0 12px 26px rgba(0,0,0,.18)" }}>
                {ctaLabel}
                <IArrow color="#2563EB" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{ borderTop: "1px solid #EEF2F8", background: "#fff" }}>
        <div style={{ ...wrap, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {logo}
            <span style={{ fontSize: 14, fontWeight: 700, color: "#5E6B86" }}>Resume Hunter · AI agent za prijave</span>
          </div>
          <div style={{ fontSize: 13, color: "#9AA6BA" }}>© {new Date().getFullYear()} Resume Hunter</div>
        </div>
      </footer>
    </div>
  );
}
