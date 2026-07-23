---
name: cv-editable-fields
description: Resume Hunter — što se može editirati u generiranom CV-u i kako
---

# CV Editiranje — Editable Fields

## Što je editable?

Nakon što AI generiše CV, korisnik može editirati:

### 1. **Professional Summary** (Profil)
- **Što je?** 2-3 rečenice koje pozicioniraju kandidata za dati posao
- **Primjer original:** "Senior React developer sa 5+ godina iskustva u e-commerce aplikacijama. Specijaliziran za performanse i user experience."
- **Primjer edit:** "Senior React developer sa 5+ godina iskustva u e-commerce aplikacijama. Specijaliziran za optimizaciju performansi (38% smanjenje page load time) i kreiranje pristupačnih aplikacija."
- **Zašto editirati?** Korisnik možda želi drugačiji ton ili fokus na drugačiji aspekt
- **Validacija:** Ne smije biti prazno, maks 500 karaktera

### 2. **Experiences — Job Title** (Pozicija)
- **Što je?** Format: "Frontend Developer · Company Name" ili "Tech Lead · Startup XYZ"
- **Primjer original:** "Senior Frontend Engineer · Infobip"
- **Primjer edit:** "Senior Frontend Engineer (3 people team lead) · Infobip"
- **Zašto editirati?** Korisnik želi dodati kontekst ili naglasiti leadership/scope
- **Validacija:** Maks 150 karaktera

### 3. **Experiences — Achievement Bullets**
- **Što je?** 2-4 achievement-focused bullets po iskustvu
- **Primjer original:** 
  - "Developed real-time notifications system handling 100K+ daily active users"
  - "Optimized critical rendering path, reducing page load time by 38%"
  - "Mentored 2 junior developers, improving code quality and team velocity"

- **Primjer edit (user refinement):**
  - "Architected and deployed real-time notifications system handling 100K+ daily active users without downtime"
  - "Optimized critical rendering path, reducing page load time from 4.2s to 2.6s (38% improvement)"
  - "Led mentoring program for 2 junior developers, improving code review quality by 25% (measured via defect rate reduction)"

- **Zašto editirati?**
  - Dodati specifičniji kontekst
  - Ojačati rezultate s većim brojevima/detaljima
  - Prilagoditi "tone" aplikacije (bolji language fit)
  - Ispraviti netočnosti
  - Naglasiti drugačiji aspekt iskustva

- **Validacija:**
  - Max 150 karaktera po bullet-u
  - Mora počinjati s action verbom
  - Ako počinje s "I"/"We" → warning, najbolja praksa je bez

### 4. **Cover Letter** ❌ (Currently NOT editable in this release)
- **Zašto?** Kompleksna struktura (3-4 paragrafa), previsoki risk da korisnik slomit format
- **Future:** v2 feature — par klikova za edit paragrafā

---

## Što je NOT editable?

- ❌ **Company names** — sprječava frivoliranje s iskustvom
- ❌ **Dates/periods** — moraju biti točni
- ❌ **Cover letter** — v2 feature
- ❌ **Skills** — trebaju biti iz profila

---

## UI/UX Details

### Edit flow:
1. Korisnik klikne na bilo koji editable field (summary, job title, bullet)
2. Polje se pretvori u input/textarea s "Save" i "Cancel" gumbima
3. Nakon "Save" → server action sprema u `tailored_cv_edited` JSON kolonu
4. LocalStorage automatski čuva draft (2h retention)
5. Na refresh → prompt "Restore unsaved edits?" ako je draft dostupan

### Visual indicators:
- Editable polja imaju subtle hover background (`rgba(37, 99, 235, 0.08)`)
- Cursor se pretvara u pointer on hover
- Ako su nespremljene promjene → warning "Auto-saved to browser" (žuta notifikacija)
- Ako su pending edite iz localStorage → blue alert s "Restore" gumbom

### Action buttons:
- **"Spremi" (Save)** — Sprema u DB, očisti localStorage, zatvori edit mode
- **"Otkaži" (Cancel)** — Zatvori edit mode, ne gasi lokalnu promjenu (još je u textarea-i)
- **"🔄 Regeneriraj CV"** — Pokreće `/api/hunter/regenerate` s edited CV kao context
- **"Spremi kao zadani"** → Future: spremi ovu verziju kao template

---

## Database schema za edite

### applications tablica — ADD columns:
```sql
-- Original generated CV
tailored_cv JSONB  -- { summary, experiences: [{title, bullets}] }

-- User's edited version
tailored_cv_edited JSONB  -- { summary, experiences: [{title, bullets}] }

-- Metadata
edited_at TIMESTAMP  -- Kada je korisnik zadnje editirao
regenerated_at TIMESTAMP  -- Kada je zadnja regeneracija pokrenut
```

### RLS:
- Samo vlasnik aplikacije vidi own edits
- Admin može vidjeti sve edite (audit trail)

---

## Future enhancements (v2+)

- [ ] Drag-to-reorder bullets
- [ ] "Suggest similar bullet" AI feature
- [ ] Cover letter paragraf editing (split u 3 editables)
- [ ] "Reset to original" button
- [ ] Diff view — prikaži što se promijenilo od original → edited
- [ ] A/B testing — "Try this version" za regenerate s A/B testiranjem
- [ ] Tone shift — "Make this more confident" one-click AI refine
