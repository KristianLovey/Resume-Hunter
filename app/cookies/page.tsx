import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Kolačići — Resume Hunter",
  description: "Koje kolačiće Resume Hunter koristi i zašto.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Kolačići"
      intro="Resume Hunter koristi samo kolačiće nužne za rad aplikacije. Nema kolačića za oglašavanje ni praćenje na drugim stranicama."
    >
      <LegalSection title="Nužni kolačići">
        <p style={{ margin: "0 0 10px" }}>
          Kod prijave postavlja se kolačić sesije koji te drži prijavljenim dok prelaziš među stranicama.
          Bez njega bi te aplikacija odjavila pri svakom osvježavanju.
        </p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>
            <strong>Kolačići prijave (Supabase Auth):</strong> čuvaju token sesije. Brišu se odjavom ili
            istekom sesije.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Lokalna pohrana u pregledniku">
        <p style={{ margin: "0 0 10px" }}>
          Uz kolačiće, aplikacija u lokalnoj pohrani preglednika (localStorage) čuva:
        </p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li><strong>Odabranu temu</strong> (svijetla ili tamna), kako bi ostala ista pri sljedećem posjetu.</li>
          <li>
            <strong>Nespremljene izmjene životopisa</strong> — privremena kopija koju uređuješ, da se rad
            ne izgubi ako osvježiš stranicu. Briše se nakon spremanja.
          </li>
        </ul>
        <p style={{ margin: "10px 0 0" }}>
          Ti podaci ostaju u tvom pregledniku i ne šalju se nikome. Možeš ih ukloniti brisanjem podataka
          stranice u postavkama preglednika.
        </p>
      </LegalSection>

      <LegalSection title="Analitika i oglašavanje">
        <p style={{ margin: 0 }}>
          Ne koristimo analitičke ni oglašivačke kolačiće i ne dijelimo podatke o tvom pregledavanju
          s oglašivačima.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
