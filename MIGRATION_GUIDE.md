# CV Editing Feature — Migration Guide

## Kada je Supabase dostupan, pokreni ovu migraciju:

### **Option 1: Via Supabase CLI (Preporučeno)**

```bash
# Ako nemaš Supabase CLI
npm install -g supabase

# Pokreni migraciju
supabase migration up
```

### **Option 2: Via Supabase Dashboard**

1. Otvori https://supabase.com/dashboard
2. Odaberi Resume Hunter projekt
3. Idi na **SQL Editor**
4. Kopiraj sadržaj iz `supabase/migrations/add_cv_edit_columns.sql`
5. Izvrši SQL query

### **Option 3: Via SQL direktno**

Copy-paste ovaj SQL u Supabase SQL Editor:

```sql
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS tailored_cv_edited JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS regenerated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_applications_edited_at
ON applications(user_id, edited_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_regenerated_at
ON applications(user_id, regenerated_at DESC);
```

---

## Što se mijenja:

| Kolona | Tip | Opis |
|--------|-----|------|
| `tailored_cv_edited` | JSONB | User's edited version of CV (ako je NULL, koristi `tailored_cv`) |
| `edited_at` | TIMESTAMP | Kada je user zadnje editirao CV |
| `regenerated_at` | TIMESTAMP | Kada je CV zadnje regeneriran kroz AI |

---

## RLS — Nije trebam (već postoji)

Ako `applications` tablica ima RLS, automatski će raditi jer:
- User može vidjeti samo svoje `applications` redove
- Server actions koriste `eq("user_id", user.id)` filter

---

## Testiranje nakon migracije:

```bash
# Kreni dev server
npm run dev

# Otvori aplikaciju i kreni CV editiranje
# Trebao bi raditi bez errora
```

---

## Ako nešto krene po zlu:

**Rollback (vrati nazad bez migracije):**
```sql
ALTER TABLE applications
DROP COLUMN IF EXISTS tailored_cv_edited,
DROP COLUMN IF EXISTS edited_at,
DROP COLUMN IF EXISTS regenerated_at;

DROP INDEX IF EXISTS idx_applications_edited_at;
DROP INDEX IF EXISTS idx_applications_regenerated_at;
```
