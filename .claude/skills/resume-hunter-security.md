---
name: resume-hunter-security
description: Resume Hunter security checklist - auth, RLS, PII, API safety
---

# Resume Hunter — Sigurnost

## Kritično (prije produkcije)

- [ ] **RLS enabled** na svim tablicama (profiles, experiences, education, applications, generated_documents)
- [ ] **Supabase auth middleware** u `_app.tsx` ili layout.tsx — čuva /dashboard bez auth
- [ ] **Service role key** NIKAD u klijentu — samo server-side za geniranje i DB operacije
- [ ] **Rate limiting** na `/api/hunter` — max 5 generiranja po korisniku dnevno (čuva od spam + cost)

## Auth tok

1. Korisnik prijavi se Supabase auth-om (email/password ili OAuth)
2. Sesija sprema se u httpOnly cookie (Supabase SSR middleware)
3. Server actions koristaju `auth.getSession()` za provjeru
4. API rute koriste `req.headers.get('authorization')`

## PII zaštita

- ❌ Emails korisnika se ne logiraju u debug output
- ❌ CVevi/motivacijska pisma nisu dostupna javno — URL-ovi trebaju token/auth
- ✅ User profile data accessible samo vlastniku i adminu (RLS)
- ✅ Deleted applications → cascade brisanje generiranih dokumenata

## API sigurnost

```typescript
// /api/hunter MORA biti POST + autentificiran
export async function POST(req: Request) {
  // 1. Validiraj JWT
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response('Unauthorized', { status: 401 })
  
  // 2. Validiraj input (Zod)
  const { jobLink } = hunterSchema.parse(await req.json())
  if (!isValidUrl(jobLink)) return Response('Invalid URL', { status: 400 })
  
  // 3. Rate limit check
  const recentCalls = await redis.incr(`rh:hunter:${user.id}:calls`)
  if (recentCalls > 5) return Response('Rate limited', { status: 429 })
  
  // 4. Google AI call s error handling
  try {
    const result = await generateResume(...)
  } catch (e) {
    console.error('AI generation failed', e)  // log, ne return stack
    return Response('Generation failed', { status: 500 })
  }
}
```

## Tajne

- `GOOGLE_API_KEY` — u `.env.local` (development) i GitHub Secrets (CI/CD)
- `SUPABASE_SERVICE_ROLE_KEY` — **SAMO server-side**, nikad klijent
- `.env.example` — verzija bez vrijednosti za repozirorij

## Operacijska sigurnost

- **Backup**: Supabase ima daily automated backup (provjeri retention)
- **Monitoring**: error tracking preko Sentry ili built-in Supabase logs
- **Brisanje računa**: path za `DELETE FROM profiles CASCADE` s potvrdom (GDPR)

## Checklist pred produkciju

- [ ] RLS politike testirane za sve uloge (user, admin)
- [ ] API rate limit konfiguriran
- [ ] Error poruke generiÄke (detalji u logove)
- [ ] HTTPS + Secure cookies forced
- [ ] CORS postavljen na točan origin (nie `*`)
- [ ] Security headeri: CSP, X-Content-Type-Options, X-Frame-Options
