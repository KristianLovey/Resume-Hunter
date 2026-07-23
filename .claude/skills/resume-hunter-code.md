---
name: resume-hunter-code
description: Resume Hunter code style, patterns, and quality standards
---

# Resume Hunter — Standardi kvalitete

## Stack

- **Next.js 16.2** (latest) + React 19 + TypeScript strict
- **Supabase SSR** za auth middleware
- **Google AI SDK** za generiranje
- **Tailwind CSS v4** + PostCSS za styling
- **Zod** za validaciju šema

## File struktura

```
app/
  ├── api/hunter/route.ts       # AI generation endpoint
  ├── auth/actions.ts           # Auth server actions
  ├── dashboard/
  │   ├── page.tsx              # Dashboard layout
  │   ├── DashboardApp.tsx       # Client component
  │   ├── actions.ts            # Mutations
  │   ├── cv/
  │   │   ├── page.tsx
  │   │   ├── CvDocument.tsx    # CV rendering component
  │   │   └── templates.ts      # CV templates
  │   └── ...
  ├── profile/page.tsx          # Profile editor
  └── page.tsx                   # Home/landing
lib/
  ├── supabase.ts               # Client i server
  └── types.ts                  # Shared types (zod schemas)
```

## Obrasci

### Server actions (dashboard mutations)

```typescript
// app/dashboard/actions.ts
'use server'

export async function saveExperience(data: ExperienceInput) {
  const { data: session } = await supabase.auth.getSession()
  if (!session) throw new Error('Unauthorized')
  
  // Validacija prije DB-a
  const validated = experienceSchema.parse(data)
  
  // DB operacija s error handling
  const { error } = await supabase
    .from('experiences')
    .insert([{ user_id: session.user.id, ...validated }])
  
  if (error) throw new Error(`Failed to save: ${error.message}`)
  
  return { success: true }
}
```

### API rute (AI generation)

```typescript
// app/api/hunter/route.ts
export async function POST(req: Request) {
  const { jobLink, userId, tone } = hunterSchema.parse(await req.json())
  
  // Fetch job posting
  // Fetch user profile + experiences
  // Generate s google AI
  // Store result u generated_documents
  // Return URL do CV/cover letter
}
```

### Validacija (Zod)

```typescript
// lib/types.ts
export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  skillsUsed: z.array(z.string()),
})

export type Experience = z.infer<typeof experienceSchema>
```

## Kvaliteta

- ✅ Tipska sigurnost: `tsconfig.json` na strict
- ✅ Error handling: sve greške se logiraju i vraćaju korisniku
- ✅ RLS zaštita: server actions koriste `auth.getSession()` PRVO
- ✅ Validacija: Zod schema za svaki ulaz iz klijenta
- ✅ Performance: memoizacija komponenti gdje je skupo, SWR za data fetching
- ❌ Nema tajni u kodu: sve env vars u `.env.local`

## Commitovi

- Imperativ: "Add resume generation endpoint"
- Body: zaš što ako nije očito ("Needed for dashboard display of past applications")
- Prije push: `npm run lint` + pregledaj diff
