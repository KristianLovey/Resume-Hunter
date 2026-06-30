// proxy.ts (Next 16 zamjena za "middleware")
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Ako env varijable još nisu učitane (npr. dev server pokrenut prije .env.local),
  // NE ruši cijeli app — samo propusti zahtjev. Inače proxy baca grešku na SVAKOJ
  // ruti pa ništa nije klikabilno dok se server ne osvježi.
  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[proxy] Supabase env varijable nedostaju — preskačem osvježavanje sesije."
      );
    }
    return response;
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // upiši osvježene cookieje natrag i u request i u response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // OVO je ključno: getUser() osvježi token ako je istekao
  await supabase.auth.getUser();

  return response;
}

// Pokreni proxy na svim rutama OSIM statičkih fajlova
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
