// app/login/page.tsx — Modern auth page in Resume Hunter style
"use client";

import { CSSProperties, useState } from "react";

type Mode = "login" | "signup";

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

const ISearch = ({ size = 24, color = "currentColor", w = 2 }: { size?: number; color?: string; w?: number }) => (
  <svg {...svg(size, color, w)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);

const IArrow = ({ size = 18, color = "currentColor", w = 2.2 }: { size?: number; color?: string; w?: number }) => (
  <svg {...svg(size, color, w)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const IUser = ({ size = 20, color = "currentColor", w = 2 }: { size?: number; color?: string; w?: number }) => (
  <svg {...svg(size, color, w)}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const ICheck = ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg {...svg(size, color, 2.5)}><path d="M20 6 9 17l-5-5" /></svg>
);

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const endpoint = mode === "login" ? "/auth?action=login" : "/auth?action=signup";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Authentication failed");
        return;
      }

      window.location.href = result.redirect || "/dashboard";
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    } finally {
      setIsPending(false);
    }
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1.5px solid #D1D5DB",
    fontFamily: "inherit",
    fontSize: 15,
    lineHeight: 1.4,
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
    color: "#13234A",
  };

  const btnPrimary: CSSProperties = {
    width: "100%",
    padding: "12px 24px",
    borderRadius: 11,
    border: "none",
    background: "linear-gradient(135deg,#3B82F6,#2563EB)",
    color: "#fff",
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 700,
    cursor: isPending ? "default" : "pointer",
    opacity: isPending ? 0.7 : 1,
    transition: "all 0.2s ease",
    boxShadow: "0 8px 20px rgba(37,99,235,.3)",
  };

  const btnSecondary: CSSProperties = {
    width: "100%",
    padding: "12px 24px",
    borderRadius: 11,
    border: "1.5px solid #E5E7EB",
    background: "#fff",
    color: "#42506B",
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const tabBtn = (isActive: boolean): CSSProperties => ({
    flex: 1,
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    background: isActive ? "linear-gradient(135deg,#3B82F6,#2563EB)" : "#F3F4F6",
    color: isActive ? "#fff" : "#42506B",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: isActive ? "0 4px 12px rgba(37,99,235,.2)" : "none",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#FFFFFF 0%,#FAFBFD 52%,#F2F4F8 100%)",
        display: "flex",
        alignItems: "stretch",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: -160,
          right: -110,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background: "radial-gradient(circle,#E2ECFB,transparent 70%)",
          pointerEvents: "none",
          animation: "float 12s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle,#EAF0FC,transparent 70%)",
          pointerEvents: "none",
          animation: "float 14s ease-in-out infinite",
        }}
      />

      {/* Left side — Info */}
      <div
        className="auth-left-side"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 48px",
          minHeight: "100vh",
          position: "relative",
          zIndex: 5,
        }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800,
            color: "#0F1F44",
            margin: "0 0 20px",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Get hired faster
        </h2>
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 18px)",
            color: "#5E6B86",
            margin: "0 0 40px",
            lineHeight: 1.7,
            maxWidth: 500,
          }}
        >
          Every job is different. Stop writing generic resumes. Let AI tailor your application to match what employers are actually looking for.
        </p>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { title: "AI-Powered", desc: "Tailored resumes in seconds, not hours" },
            { title: "Smart Matching", desc: "See how well you fit each job (match score)" },
            { title: "Cover Letters", desc: "Personalized letters that tell your story" },
            { title: "Track All", desc: "Manage applications in one dashboard" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "linear-gradient(135deg,#3B82F6,#2563EB)",
                  flex: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#FFFFFF" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#13234A", marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 14, color: "#8A94A6" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid #E5E7EB" }}>
          <p style={{ fontSize: 13, color: "#8A94A6", margin: 0 }}>
            Join 500+ job hunters already using Resume Hunter to land interviews.
          </p>
        </div>
      </div>

      {/* Right side — Auth Form */}
      <div
        className="auth-right-side"
        style={{
          width: "100%",
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
          position: "relative",
          zIndex: 10,
        }}
      >

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-card {
          animation: slideIn 0.5s ease-out;
        }
        input:focus {
          outline: none;
          border-color: #2563EB !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
        }
        input::placeholder {
          color: #A0AEC0 !important;
          opacity: 1 !important;
        }
        input {
          color: #13234A !important;
        }
        @media (max-width: 1024px) {
          .auth-left-side {
            display: none !important;
          }
          .auth-right-side {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Card */}
      <div
        className="auth-card"
        style={{
          position: "relative",
          zIndex: 10,
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #E8EDF6",
          boxShadow: "0 2px 6px rgba(16,31,68,.05), 0 32px 64px -30px rgba(16,31,68,.28)",
          padding: "48px 40px",
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg,#3B82F6,#2563EB)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 20px rgba(37,99,235,.3)",
            }}
          >
            <ISearch size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F1F44", margin: "0 0 8px" }}>
            Resume Hunter
          </h1>
          <p style={{ fontSize: 14, color: "#8A94A6", margin: 0 }}>
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          <button onClick={() => setMode("login")} style={tabBtn(mode === "login")}>
            Login
          </button>
          <button onClick={() => setMode("signup")} style={tabBtn(mode === "signup")}>
            Sign up
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: "#FEE2E2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              fontSize: 13.5,
              marginBottom: 20,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <span style={{ marginTop: 2 }}>⚠️</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#5E6B86", marginBottom: 6 }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              disabled={isPending}
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#5E6B86", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isPending}
              style={inputStyle}
            />
          </div>

          {/* Features for signup */}
          {mode === "signup" && (
            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 12, fontSize: 12.5, color: "#5E6B86" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <ICheck size={16} color="#10B981" />
                <span>AI-powered resume generator</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <ICheck size={16} color="#10B981" />
                <span>Tailored cover letters</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <ICheck size={16} color="#10B981" />
                <span>Track all applications</span>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            style={{
              ...btnPrimary,
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {isPending ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>
                {mode === "login" ? "Sign in" : "Create account"}
                <IArrow size={16} />
              </>
            )}
          </button>
        </form>

        {/* Forgot password link (login only) */}
        {mode === "login" && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <a
              href="#"
              style={{
                fontSize: 13.5,
                color: "#2563EB",
                textDecoration: "none",
                fontWeight: 600,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1D4ED8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#2563EB")}
            >
              Forgot your password?
            </a>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
            opacity: 0.3,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#D1D5DB" }} />
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#D1D5DB" }} />
        </div>

        {/* OAuth (placeholder) */}
        <button
          type="button"
          disabled={isPending}
          style={{
            ...btnSecondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <IUser size={18} />
          Continue with Google
        </button>

        {/* Footer text */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#8A94A6" }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563EB",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563EB",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
      {/* End right side card */}
      </div>
      {/* End main container */}
    </div>
  );
}
