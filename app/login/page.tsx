// app/login/page.tsx
import { login, signup } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Resume Hunter</h1>

      {params.error && (
        <p style={{ color: "crimson", marginBottom: 16 }}>{params.error}</p>
      )}

      <form style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          name="email"
          type="email"
          placeholder="email@example.com"
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <input
          name="password"
          type="password"
          placeholder="lozinka"
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            formAction={login}
            style={{ flex: 1, padding: 10, borderRadius: 8, background: "#2563EB", color: "white", border: "none", cursor: "pointer" }}
          >
            Prijava
          </button>
          <button
            formAction={signup}
            style={{ flex: 1, padding: 10, borderRadius: 8, background: "#e5e7eb", border: "none", cursor: "pointer" }}
          >
            Registracija
          </button>
        </div>
      </form>
    </div>
  );
}