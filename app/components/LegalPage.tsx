// app/components/LegalPage.tsx - shared shell for legal pages
import Link from "next/link";
import type { ReactNode } from "react";

export const LEGAL_UPDATED = "15 August 2026";

/** Contact email for legal enquiries. Set NEXT_PUBLIC_CONTACT_EMAIL in .env.local. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 34 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--rh-text)", margin: "0 0 12px" }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: "var(--rh-text-2)" }}>{children}</div>
    </section>
  );
}

export default function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rh-landing"
      style={{ minHeight: "100vh", background: "var(--rh-bg)", color: "var(--rh-text)" }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--rh-border)",
          background: "var(--rh-surface)",
          padding: "18px 24px",
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Link href="/" style={{ fontSize: 17, fontWeight: 800, textDecoration: "none", letterSpacing: "-.01em" }}>
            <span style={{ color: "var(--rh-text)" }}>Resume</span> <span style={{ color: "var(--rh-accent)" }}>Hunter</span>
          </Link>
          <Link
            href="/"
            style={{ fontSize: 13.5, fontWeight: 700, color: "var(--rh-text-2)", textDecoration: "none" }}
          >
            &larr; Back to home
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: "var(--rh-text)", margin: "0 0 10px", letterSpacing: "-.02em" }}>
          {title}
        </h1>
        <p style={{ fontSize: 13.5, color: "var(--rh-text-3)", margin: "0 0 8px" }}>
          Last updated: {LEGAL_UPDATED}
        </p>
        <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--rh-text-2)", margin: "0 0 40px" }}>{intro}</p>

        <div
          style={{
            background: "var(--rh-surface)",
            border: "1px solid var(--rh-border)",
            borderRadius: 20,
            padding: "34px 36px",
            boxShadow: "var(--rh-shadow-card)",
          }}
        >
          {children}
        </div>

        <div style={{ display: "flex", gap: 18, marginTop: 28, fontSize: 13.5, fontWeight: 700 }}>
          <Link href="/terms" style={{ color: "var(--rh-accent)", textDecoration: "none" }}>Terms of Use</Link>
          <Link href="/privacy" style={{ color: "var(--rh-accent)", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/cookies" style={{ color: "var(--rh-accent)", textDecoration: "none" }}>Cookies</Link>
        </div>
      </main>
    </div>
  );
}
