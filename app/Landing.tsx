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
    tag: "Profile",
    title: "Fill out your profile, just once",
    desc: "Add your experience, education, skills, and what you enjoy. Hunter remembers it, so you never start from scratch again.",
  },
  {
    icon: <ISearch size={26} color="#fff" />,
    tag: "Analysis",
    title: "Paste the job ad, we'll do the rest",
    desc: "Drop a link to the posting and Hunter reads what the employer is really after, then connects it to what you bring.",
  },
  {
    icon: <IFile size={26} color="#fff" />,
    tag: "Generation",
    title: "Resume and cover letter, served up",
    desc: "Tailored to that exact job, highlighting what matters to that employer. You just review and hit send.",
  },
  {
    icon: <IChat size={26} color="#fff" />,
    tag: "Tone",
    title: "Sounds like you",
    desc: "Professional, confident, casual… pick the tone that fits you, and Hunter nails it.",
  },
  {
    icon: <IGrid size={26} color="#fff" />,
    tag: "Overview",
    title: "Every application in one place",
    desc: "Your dashboard remembers every application and tone, so you always know where you applied and what you sent.",
  },
];

/* ===================== Styles ===================== */
const wrap: CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "0 24px", width: "100%" };
const footLink: CSSProperties = { fontSize: 13.5, fontWeight: 600, color: "#5E6B86", textDecoration: "none" };
const btnPrimary: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#4C8DF7 0%,#2563EB 55%,#1D4ED8 100%)", color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", textDecoration: "none", boxShadow: "inset 0 1px 0 rgba(255,255,255,.22), 0 8px 20px -8px rgba(37,99,235,.42)" };
const btnGhost: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 12, border: "1px solid #E4E9F2", background: "rgba(255,255,255,.7)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", color: "#42506B", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer", textDecoration: "none", boxShadow: "0 1px 2px rgba(16,31,68,.04)" };

export default function Landing({ loggedIn }: { loggedIn: boolean }) {
  const [logoOk, setLogoOk] = useState(true);
  const ctaHref = loggedIn ? "/dashboard" : "/login";
  const ctaLabel = loggedIn ? "Open dashboard" : "Get started free";

  const logoImg = logoOk ? (
    <img src="/logo.png" alt="Resume Hunter" onError={() => setLogoOk(false)} style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 10 }} />
  ) : (
    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ISearch size={21} color="#fff" />
    </div>
  );
  const logo = (
    <a href="/" aria-label="Resume Hunter, home" style={{ display: "inline-flex", textDecoration: "none" }}>
      {logoImg}
    </a>
  );

  return (
    <div className="rh-landing" style={{ width: "100%", background: "#fff", color: "#1B2A4E", overflowX: "hidden" }}>
      <div style={{ height: 3, background: "linear-gradient(90deg,#60A5FA,#2563EB 55%,#1D4ED8)" }} />
      {/* ===== Navbar ===== */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.72)", backdropFilter: "saturate(140%) blur(12px)", WebkitBackdropFilter: "saturate(140%) blur(12px)", borderBottom: "1px solid rgba(16,31,68,.06)", boxShadow: "0 1px 0 rgba(16,31,68,.02)" }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            {logo}
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.01em" }}>
              <span style={{ color: "#0F1F44" }}>Resume</span> <span style={{ color: "#2563EB" }}>Hunter</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="#features" className="rh-navlink" style={{ fontSize: 14, fontWeight: 700, color: "#5E6B86", textDecoration: "none" }}>Features</a>
            {!loggedIn ? (
              <>
                <a href="/login" className="rh-btn" style={{ ...btnGhost, padding: "10px 18px", fontSize: 14 }}>
                  Log in
                </a>
                <a href="/login?mode=signup" className="rh-btn" style={{ ...btnPrimary, padding: "10px 18px", fontSize: 14, boxShadow: "0 6px 14px -6px rgba(37,99,235,.5)" }}>
                  Sign up
                </a>
              </>
            ) : (
              <a href={ctaHref} className="rh-btn" style={{ ...btnPrimary, padding: "10px 18px", fontSize: 14, boxShadow: "0 6px 14px -6px rgba(37,99,235,.5)" }}>
                Dashboard
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg,#FFFFFF 0%,#FAFBFD 52%,#F2F4F8 100%)" }}>
        {/* suptilna točkasta tekstura (blijedi prema rubovima) */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #D6DEEB 1px, transparent 1.4px)", backgroundSize: "26px 26px", opacity: 0.3, WebkitMaskImage: "radial-gradient(120% 82% at 50% 0%, #000 40%, transparent 78%)", maskImage: "radial-gradient(120% 82% at 50% 0%, #000 40%, transparent 78%)", pointerEvents: "none" }} />
        {/* dekorativni blobovi (vrlo suptilni) */}
        <div style={{ position: "absolute", top: -160, right: -110, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle,#E2ECFB,transparent 70%)", animation: "rh-blob 12s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -200, left: -150, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#EAF0FC,transparent 70%)", animation: "rh-blob 14s ease-in-out infinite", pointerEvents: "none" }} />
        {/* oštar rub prema sljedećoj sekciji */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(16,31,68,.06),transparent)", pointerEvents: "none" }} />

        <div style={{ ...wrap, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "100px 24px 104px" }}>
          <Reveal delay={40} y={26}>
            <h1 style={{ margin: 0, fontSize: "clamp(44px,7.6vw,78px)", lineHeight: 1.03, fontWeight: 800, letterSpacing: "-.038em", color: "#0B1730", maxWidth: 960 }}>
              Apply for jobs smarter, not harder.{" "}
              <span style={{ background: "linear-gradient(135deg,#3B82F6,#2563EB)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>With Hunter, now you can!</span>
            </h1>
          </Reveal>

          <Reveal delay={140} y={26}>
            <p style={{ margin: "26px auto 0", fontSize: "clamp(17px,2.2vw,21px)", lineHeight: 1.6, color: "#5A6782", maxWidth: 640, fontWeight: 500, letterSpacing: "-.01em" }}>
              Fill out your profile once, paste a job link, and get a resume and cover letter tailored to that exact role. No more staring at a blank page.
            </p>
          </Reveal>

          <Reveal delay={240} y={26}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 34 }}>
              <a href={ctaHref} className="rh-btn" style={btnPrimary}>
                {ctaLabel}
                <IArrow />
              </a>
              <a href="#features" className="rh-btn" style={btnGhost}>See how it works</a>
            </div>
          </Reveal>

          {/* product mock */}
          <Reveal delay={220} y={42}>
            <div style={{ position: "relative", marginTop: 72, width: "min(720px,100%)", animation: "rh-float 6s ease-in-out infinite" }}>
              {/* meki sjaj iza kartice (suptilan) */}
              <div style={{ position: "absolute", inset: "-6% -4% -12%", background: "radial-gradient(56% 60% at 50% 44%, rgba(37,99,235,.12), transparent 72%)", filter: "blur(26px)", pointerEvents: "none" }} />
              <div style={{ position: "relative", background: "#fff", border: "1px solid #E8EDF6", borderRadius: 24, boxShadow: "0 2px 6px rgba(16,31,68,.05), 0 32px 64px -30px rgba(16,31,68,.28)", overflow: "hidden", textAlign: "left" }}>
                {/* browser chrome */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "13px 16px", borderBottom: "1px solid #EEF2F8", background: "#FBFCFE" }}>
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
                  <span style={{ marginLeft: 10, fontSize: 12.5, fontWeight: 700, color: "#9AA6BA" }}>Hunter Agent</span>
                </div>

                <div style={{ padding: 18 }}>
                  {/* match row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F7FAFF", borderRadius: 14, padding: "12px 14px" }}>
                    <div style={{ width: 38, height: 38, flex: "none", borderRadius: 11, background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>In</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: "#13234A" }}>Frontend Developer</div>
                      <div style={{ fontSize: 12, color: "#8A94A6" }}>Infobip · Zagreb</div>
                    </div>
                  </div>

                  {/* docs */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
                    {/* CV */}
                    <div style={{ background: "#fff", border: "1px solid #EEF2F8", borderRadius: 14, padding: 15 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                        <IFile size={15} color="#2563EB" />
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#13234A" }}>Resume</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0F1F44" }}>Marko Horvat</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#2563EB", marginBottom: 9 }}>Frontend Developer</div>
                      <div style={{ fontSize: 9, fontWeight: 800, color: "#9AA6BA", letterSpacing: ".05em", marginBottom: 5 }}>SUMMARY</div>
                      <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.55, color: "#7A879E" }}>Frontend developer with 5+ years of experience in React and TypeScript. Focused on performance and clean code.</p>
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
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#13234A" }}>Cover letter</span>
                      </div>
                      <p style={{ margin: "0 0 7px", fontSize: 10.5, lineHeight: 1.6, color: "#566179" }}>Dear Hiring Manager,</p>
                      <p style={{ margin: "0 0 7px", fontSize: 10.5, lineHeight: 1.6, color: "#7A879E" }}>I'm excited to apply for the Frontend Developer role at Infobip, your focus on reliable communication aligns closely with my experience.</p>
                      <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.6, color: "#7A879E" }}>In my recent work I cut page load times by 38%…</p>
                    </div>
                  </div>

                  {/* tones */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#9AA6BA" }}>Tone:</span>
                    <span style={{ padding: "6px 12px", borderRadius: 999, background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "#fff", fontSize: 11.5, fontWeight: 700 }}>Professional</span>
                    <span style={{ padding: "6px 12px", borderRadius: 999, background: "#fff", border: "1px solid #E1E8F2", color: "#5A6478", fontSize: 11.5, fontWeight: 700 }}>Confident</span>
                    <span style={{ padding: "6px 12px", borderRadius: 999, background: "#fff", border: "1px solid #E1E8F2", color: "#5A6478", fontSize: 11.5, fontWeight: 700 }}>Friendly</span>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ margin: "24px auto 0", maxWidth: 560, textAlign: "center", fontSize: 15.5, lineHeight: 1.6, color: "#5E6B86", fontWeight: 500 }}>
              This is exactly what you get: paste a job ad and Hunter hands back a resume and cover letter tailored to it, in seconds. No templates, no blank page. Just review and hit send.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Mogućnosti (scroll stablo) ===== */}
      <section id="features" style={{ background: "#F5F6F9", padding: "88px 0 100px" }}>
        <div style={wrap}>
          <Reveal y={24}>
            <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 56px" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#2563EB", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 12 }}>How it works</div>
              <h2 style={{ margin: 0, fontSize: "clamp(28px,4.4vw,42px)", fontWeight: 800, letterSpacing: "-.02em", color: "#0F1F44" }}>From profile to a ready application</h2>
              <p style={{ margin: "14px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "#5E6B86" }}>No fuss, five steps and your application is ready to send.</p>
            </div>
          </Reveal>

          {/* stablo, svi koraci se otkrivaju odjednom */}
          <Reveal y={36}>
            <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
              <div style={{ position: "absolute", left: 27, top: 24, bottom: 24, width: 2, background: "linear-gradient(#C9DBF8,#EAF1FE)" }} />
              {STEPS.map((s, i) => (
                <div key={s.title} style={{ display: "flex", gap: 22, alignItems: "flex-start", marginBottom: i === STEPS.length - 1 ? 0 : 26 }}>
                  <div style={{ position: "relative", zIndex: 1, flex: "none", width: 56, display: "flex", justifyContent: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#4C8DF7,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 5px #F5F6F9, inset 0 1px 0 rgba(255,255,255,.3), 0 8px 18px -6px rgba(37,99,235,.4)" }}>{s.icon}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, background: "#fff", border: "1px solid #E7EDF7", borderRadius: 18, padding: "20px 24px", boxShadow: "0 1px 2px rgba(16,31,68,.04), 0 16px 32px -20px rgba(16,31,68,.2)" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#2563EB", letterSpacing: ".05em", textTransform: "uppercase" }}>Step {i + 1} · {s.tag}</div>
                    <h3 style={{ margin: "7px 0 8px", fontSize: 19, fontWeight: 800, color: "#13234A" }}>{s.title}</h3>
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "#5E6B86" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Zašto ===== */}
      <section style={{ background: "#fff", padding: "80px 0" }}>
        <div style={wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {[
              { t: "No more blank page", d: "Hunter writes the first draft, you just polish it. The hardest part is done." },
              { t: "Tailored to every job", d: "Every application highlights exactly what that employer wants to hear." },
              { t: "Done before your coffee", d: "What used to take an hour is now finished in a couple of minutes." },
            ].map((b, i) => (
              <Reveal key={b.t} delay={i * 80} y={30}>
                <div style={{ height: "100%", background: "linear-gradient(180deg,#FFFFFF,#F7FAFF)", border: "1px solid #E7EDF7", borderRadius: 18, padding: "26px 24px", boxShadow: "0 1px 2px rgba(16,31,68,.04), 0 12px 26px -20px rgba(16,31,68,.16)" }}>
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
              <h2 style={{ margin: 0, fontSize: "clamp(26px,4.4vw,40px)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", position: "relative" }}>Your next opportunity is waiting.</h2>
              <p style={{ margin: "14px auto 0", fontSize: 16.5, lineHeight: 1.6, color: "rgba(255,255,255,.88)", maxWidth: 500, position: "relative" }}>Build your profile and leave the hard part to Hunter. You just apply, it does the writing.</p>
              <a href={ctaHref} className="rh-btn" style={{ ...btnPrimary, position: "relative", marginTop: 28, background: "#fff", color: "#2563EB", boxShadow: "0 12px 26px rgba(0,0,0,.18)" }}>
                {ctaLabel}
                <IArrow color="#2563EB" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{ borderTop: "1px solid #DDE4F0", background: "#fff" }}>
        <div style={{ ...wrap, padding: "44px 24px 20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between" }}>
            {/* Brand */}
            <div style={{ maxWidth: 320, minWidth: 240 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                {logo}
                <span style={{ fontSize: 16, fontWeight: 800, color: "#0F1F44", letterSpacing: "-.01em" }}>
                  Resume <span style={{ color: "#2563EB" }}>Hunter</span>
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "#5E6B86" }}>
                AI agent that tailors your resume and cover letter to each job ad, so every application
                actually fits the role.
              </p>
            </div>

            {/* Product */}
            <div style={{ minWidth: 150 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0F1F44", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14 }}>
                Product
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="#features" style={footLink}>Features</a>
                <a href="/login" style={footLink}>Log in</a>
                <a href="/login?mode=signup" style={footLink}>Sign up</a>
              </nav>
            </div>

            {/* Legal */}
            <div style={{ minWidth: 150 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0F1F44", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14 }}>
                Legal
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="/terms" style={footLink}>Terms of Use</a>
                <a href="/privacy" style={footLink}>Privacy Policy</a>
                <a href="/cookies" style={footLink}>Cookies</a>
              </nav>
            </div>
          </div>

          {/* AI disclaimer, pošteno upozorenje, ne marketing */}
          <div
            style={{
              marginTop: 34,
              padding: "14px 16px",
              borderRadius: 12,
              background: "#F7F9FD",
              border: "1px solid #DDE4F0",
              fontSize: 12.5,
              lineHeight: 1.65,
              color: "#5E6B86",
            }}
          >
            Resume Hunter generates text with AI. Always review what it writes before sending it to an
            employer, you are responsible for the content of your application. Match scores are an
            estimate, not an assessment of your suitability.
          </div>

          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid #E8EDF5",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 13, color: "#8A94A6" }}>© {new Date().getFullYear()} Resume Hunter</div>
            <div style={{ display: "flex", gap: 18 }}>
              <a href="/terms" style={{ ...footLink, fontSize: 13 }}>Terms</a>
              <a href="/privacy" style={{ ...footLink, fontSize: 13 }}>Privacy</a>
              <a href="/cookies" style={{ ...footLink, fontSize: 13 }}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
