# Resume Hunter — Claude Code Setup

Ovdje su smješteni lokalni skillovi i konfiguracija za Resume Hunter projekt.

## Dostupni skilovi

### Projektni skilovi (lokalni)

- **`resume-hunter-ai`** — Google AI SDK integracija, prompt design, tone variants
- **`resume-hunter-db`** — Supabase shema, RLS politike, indeksi
- **`resume-hunter-code`** — Code style, file struktura, obrasci (server actions, API routes)
- **`resume-hunter-security`** — Auth, RLS testing, PII zaštita, API sigurnost, pre-production checklist
- **`resume-hunter-roadmap`** — Featurese v1 vs v2, launch checklist, prioriteti

### Globalni skilovi (uvijek dostupni)

- **`ai-agents`** — LLM architecture, tool calling, evals
- **`code-quality`** — Error handling, commits, samo-pregled
- **`db-design`** — Postgres konvencije, migracije, time-series
- **`security-checklist`** — Pre-launch audit

## Kako koristiti

### Pisanje novog featurea

```bash
# Invoke skill za ai-agente ako trebam LLM integraciju
/ai-agents
# ili lokalno
/resume-hunter-ai
```

### Code review

```bash
/code-review  # ili /code-quality
```

### Database changes

```bash
/db-design  # ili resume-hunter-db
```

### Pre-production

```bash
/resume-hunter-security     # Local checklist
/security-checklist          # Global audit
```

## Struktura projekta

```
Resume Hunter/
├── .claude/
│   ├── skills/               # Lokalni skilovi
│   │   ├── resume-hunter-ai.md
│   │   ├── resume-hunter-db.md
│   │   ├── resume-hunter-code.md
│   │   ├── resume-hunter-security.md
│   │   └── resume-hunter-roadmap.md
│   ├── settings.json         # Projekna konfiguracija
│   └── README.md             # Ovaj fajl
├── app/                      # Next.js app router
├── lib/                      # Supabase, types, utilities
├── public/                   # Static assets
├── CLAUDE.md                 # Project instructions (root)
├── AGENTS.md                 # AI framework notes
└── package.json
```

## Quick commands

```bash
# Develop
npm run dev

# Lint
npm run lint

# Build
npm run build

# Type check
tsc --noEmit
```

## Relevantne datoteke

- `/CLAUDE.md` — Glavne instrukcije za projekt
- `/AGENTS.md` — Next.js verzija notes
- `.env.local` — Tajne (nikad u git)
- `tsconfig.json` — TypeScript strict mode
