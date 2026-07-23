---
name: resume-hunter-db
description: Resume Hunter database schema and Supabase RLS patterns
---

# Resume Hunter — Baza podataka

## Shema (iz memorije)

- **profiles** (user_id, name, email, role, created_at)
  - RLS: korisnik vidi samo sebe, admin sve
  
- **experiences** (id, user_id, company, role, description, start_date, end_date, skills_used)
  - RLS: korisnik vidi samo svoje, admin sve
  - FK: user_id → profiles (CASCADE)
  
- **education** (id, user_id, institution, degree, field, graduation_date)
  - RLS: korisnik vidi samo svoje, admin sve
  - FK: user_id → profiles (CASCADE)
  
- **applications** (id, user_id, job_title, company, job_link, resume_used, cover_letter_used, tone, status, created_at, applied_at)
  - Čuva sve aplikacije s verzijama CV/motivacijskog pisma
  - RLS: korisnik vidi samo svoje
  - FK: user_id → profiles (CASCADE)

- **generated_documents** (id, application_id, type, content, tokens_used, created_at)
  - type: "resume" | "cover_letter"
  - Separation concern: dokumenti = immutable, applications je referenca

## RLS politike

```sql
-- profiles: korisnik vidi samo sebe
create policy user_sees_own_profile on profiles
  for select using (auth.uid() = user_id OR is_admin());

create policy admin_manage_profiles on profiles
  for all using (is_admin());

-- experiences: kao profiles
create policy user_sees_own_exp on experiences
  for select using (auth.uid() = (select user_id from profiles p where p.id = experiences.user_id) OR is_admin());
```

## Indeksi

- `experiences.user_id` (FK lookup)
- `education.user_id` (FK lookup)
- `applications.user_id` + `applications.created_at DESC` (dashboard list)
- `generated_documents.application_id` (dokument retrieval)

## Migracije

Sve DDL promjene kroz `supabase` CLI ili MCP `apply_migration`. Nikad ručno u editoru.
