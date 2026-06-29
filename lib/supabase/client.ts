// src/lib/supabase/client.ts
// Ovaj klijent radi u BROWSERU (Client Components - "use client").
// Koristi NEXT_PUBLIC_ ključeve jer su oni namjerno javni.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}