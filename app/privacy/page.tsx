import type { Metadata } from "next";
import LegalPage, { LegalSection, CONTACT_EMAIL } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Pravila privatnosti — Resume Hunter",
  description: "Kako Resume Hunter prikuplja, koristi i štiti tvoje podatke.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Pravila privatnosti"
      intro="Ovdje piše koje podatke Resume Hunter prikuplja, zašto ih obrađuje, s kime ih dijeli i kako ih možeš obrisati."
    >
      <LegalSection title="1. Koje podatke prikupljamo">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>
            <strong>Podaci računa:</strong> email adresa i lozinka (lozinka je pohranjena kriptirano —
            nikad je ne vidimo u čitljivom obliku).
          </li>
          <li>
            <strong>Podaci profila koje sam unosiš:</strong> ime, datum rođenja, telefon, lokacija, opis,
            radno iskustvo, obrazovanje, projekti, vještine, certifikati, snage i hobiji.
          </li>
          <li>
            <strong>Podaci prijava:</strong> tekst oglasa koji zalijepiš te generirani životopis,
            motivacijsko pismo, procjena podudaranja i status prijave.
          </li>
          <li>
            <strong>Tehnički podaci:</strong> kolačići sesije potrebni za prijavu.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Zašto ih obrađujemo">
        <p style={{ margin: 0 }}>
          Podatke obrađujemo isključivo kako bismo ti omogućili korištenje usluge: vođenje računa,
          generiranje prilagođenog životopisa i pisma te spremanje i pregled tvojih prijava.
          Pravna osnova je izvršenje ugovora — pružanje usluge koju si zatražio.
          Ne koristimo tvoje podatke za oglašavanje i ne prodajemo ih.
        </p>
      </LegalSection>

      <LegalSection title="3. S kime dijelimo podatke">
        <p style={{ margin: "0 0 10px" }}>
          Podatke dijelimo samo s pružateljima usluga nužnima za rad aplikacije:
        </p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>
            <strong>Supabase</strong> — baza podataka, prijava i pohrana tvojih podataka.
          </li>
          <li>
            <strong>Google (Gemini API)</strong> — generiranje teksta. Kad pokreneš generiranje, podaci
            tvog profila i tekst oglasa šalju se modelu kako bi se sastavio životopis i pismo.
          </li>
        </ul>
        <p style={{ margin: "10px 0 0" }}>
          Ovi pružatelji podatke obrađuju u naše ime i podliježu vlastitim uvjetima obrade podataka.
        </p>
      </LegalSection>

      <LegalSection title="4. Koliko dugo čuvamo podatke">
        <p style={{ margin: 0 }}>
          Podatke čuvamo dok imaš račun. Kad obrišeš račun, brišu se tvoj profil, iskustva, obrazovanje,
          projekti i sve prijave, kao i sam korisnički račun.
        </p>
      </LegalSection>

      <LegalSection title="5. Sigurnost">
        <p style={{ margin: 0 }}>
          Pristup podacima ograničen je na razini baze (row-level security) tako da svaki korisnik može
          čitati i mijenjati isključivo vlastite zapise. Promet između preglednika i poslužitelja je
          kriptiran. Nijedan sustav nije potpuno neprobojan — koristi jedinstvenu lozinku i ne dijeli je.
        </p>
      </LegalSection>

      <LegalSection title="6. Tvoja prava">
        <p style={{ margin: "0 0 10px" }}>Imaš pravo na:</p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>pristup svojim podacima — vidljivi su i uredivi u tvom profilu;</li>
          <li>ispravak — svako polje profila možeš izmijeniti u aplikaciji;</li>
          <li>
            brisanje — u <strong>Postavke → Brisanje računa</strong> trajno brišeš račun i sve podatke;
          </li>
          <li>prigovor na obradu i pritužbu nadzornom tijelu za zaštitu podataka.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Djeca">
        <p style={{ margin: 0 }}>
          Usluga nije namijenjena osobama mlađima od 16 godina. Ako saznamo da smo prikupili podatke
          takve osobe bez privole roditelja, obrisat ćemo ih.
        </p>
      </LegalSection>

      <LegalSection title="8. Kontakt">
        <p style={{ margin: 0 }}>
          {CONTACT_EMAIL ? (
            <>Za pitanja o privatnosti ili zahtjev za podacima piši na <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--rh-accent)" }}>{CONTACT_EMAIL}</a>.</>
          ) : (
            <>Za pitanja o privatnosti kontaktiraj vlasnika usluge putem kontakta objavljenog na naslovnici.</>
          )}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
