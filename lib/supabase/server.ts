// src/lib/supabase/server.ts
// Ovaj klijent radi na SERVERU (Server Components, API routes).
// Čita i piše auth cookieje preko Next.js cookies() API-ja.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Poziv iz Server Componenta - može se ignorirati
            // ako imaš middleware koji osvježava sesiju.
          }
        },
      },
    }
  );
}