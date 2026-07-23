---
name: resume-hunter-roadmap
description: Resume Hunter features, roadmap, and what's in scope vs out-of-scope
---

# Resume Hunter — Roadmap i opseg

## v1 — Core loop (sada)

Korisnik → CV/motivacijskih pismo za jedan oglas

**In scope:**
- [ ] User registracija + login
- [ ] Profile — unesite iskustvo, obrazovanje, vještine
- [ ] Job posting paste → AI analiza
- [ ] Resume + cover letter generiranje
- [ ] Tone selection (professional/confident/friendly)
- [ ] Dashboard — popis svih aplikacija
- [ ] CV preview/edit prije slanja
- [ ] Simple PDF export

**Out of scope (v2+):**
- Mobile app (Android/iOS)
- Email integration (slanje direktno iz app-a)
- LinkedIn OAuth (samo email/pass za v1)
- Cover letter templates (AI generira sve)
- Kolaboracija (sharing CV-eva s prijateljima)
- Analytics (tracking success rate)
- Premium tiers — v1 je free za sve

## Launch checklist

- [ ] Landing page — jasna vrijednost, CTA za signup
- [ ] Email verification (Supabase auth ima built-in)
- [ ] Profile onboarding — 3-4 koraka (company, skills, tone preference)
- [ ] First CV generation test — sa stvarnim oglasom za posao
- [ ] Mobile responsiveness — dashboard na telefonu
- [ ] Error messages — korisnik razumije što je pošlo po zlu
- [ ] Privacy policy + ToS (generator je ok)
- [ ] Backup Supabase-a enabled + tested restore

## v2 — Napredne featurese

- [ ] Email integracija (pošalji CV e-mailom direktno)
- [ ] Multiple resume templates (modern, classic, creative)
- [ ] Application tracking — follow-up reminders
- [ ] Skill recommendations — "trebali bi Node.js jer ga oglas traži"
- [ ] Analytics — koliko CV-eva je poslano, success rate
- [ ] LinkedIn sync — importaj iskustvo iz LinkedIna

## Performance budžeti

- **Page load**: < 2s on 4G
- **CV generation**: < 8s end-to-end
- **Dashboard**: < 500ms (infinite scroll za aplikacije)
- **Tokens per month**: 50k max (Google AI spend)

## Prioriteti

1. **Launching** > Polish â shipping matters više od perfektnosti
2. **User feedback first 10 users** — razgovaraj s njima, iterate
3. **Stabilnost** > Features â down time je gubitak povjerenja
