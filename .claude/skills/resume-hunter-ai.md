---
name: resume-hunter-ai
description: Resume Hunter AI feature patterns - working with Google AI SDK, prompt design for resume/cover letter generation, tone variants
---

# Resume Hunter — AI integracija

## Google AI SDK integracija

- Koristimo `@ai-sdk/google` + `ai` biblioteku (vercel/ai).
- Model: `gemini-2.0-flash` za brzinu/cijenu (resume generiranje je čest call); `gemini-1.5-pro` za kompleksne analize oglednog teksta.
- API key u `.env.local` (`GOOGLE_API_KEY`), struktuirano kao env secret.

## Prompt shema

Resume i motivacijsko pismo trebaju biti **struktuirani** :

1. **Ulaz**: job posting tekst + user profile (experience, education, skills, tone preference)
2. **Sistem prompt** (fiksni, u kodu): govori modelu da je "profesionalni AI asistent koji piše CV-eve"
3. **Validacija izlaza**: JSON schema za "Resume" i "CoverLetter" s mandatory poljima
4. **Retry logika**: ako je JSON nevaljani, retry s porukom o greški

## Tone variants

Korisnik bira **tone** prije generiranja. Tone se injektira u system prompt:

- "Professional": "Formal, achievement-focused, metrics-driven"
- "Confident": "Bold, ownership-focused, impact-driven"  
- "Friendly": "Warm, approachable, collaborative tone"

Svaki tone ima mini-template u promptu (3-4 primjera kako bi taj ton zvučao).

## Job posting analiza

Prije nego što generiram CV:
1. Ekstrahiraj **core responsibilities** i **required skills** iz oglasa (LLM ili regex)
2. Matchaj s user profilom (koji skills se poklapaju)
3. Izračunaj match percentage (za UI feedback)
4. Prosljeđi match info u generation prompt ("naglasi React + Node jer oglas traži to")

## Cost i latencija

- Tracking: `tokens_used` per request, log u Supabase za analytics.
- Cap: max 2000 tokens output per CV/letter (dovoljno za 1-strana dokument).
- Timeout: 10s per request, nakon čega korisnik vidi "Generation je trajala duže…"

## Evals (za buduće iteracije)

Čuva se u `evals/` direktoriju:
- 10-15 resume/cover letter parova s klijentskim feedbackom ("korištena je moja iskustva?")
- Test: generiraj i usporedi s očekivanim kvalitetom (embedding similarity, keyword matchanje)
