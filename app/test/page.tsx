// src/app/test/page.tsx
// PRIVREMENA test stranica - obrisat ćemo je kasnije.
import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();

  // Pokušaj dohvatiti sesiju (bit će null jer nismo logirani - to je ok).
  // Bitno je da poziv PROĐE bez greške = veza radi.
  const { data, error } = await supabase.auth.getSession();

  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>Supabase connection test</h1>
      <p>Error: {error ? error.message : "none ✅"}</p>
      <p>Session: {data.session ? "logged in" : "no session (expected)"}</p>
    </div>
  );
}