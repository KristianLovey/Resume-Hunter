import type { Metadata } from "next";
import LegalPage, { LegalSection, CONTACT_EMAIL } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Uvjeti korištenja — Resume Hunter",
  description: "Uvjeti korištenja usluge Resume Hunter.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Uvjeti korištenja"
      intro="Korištenjem Resume Huntera prihvaćaš uvjete opisane u nastavku. Pročitaj ih prije nego što otvoriš račun."
    >
      <LegalSection title="1. Što je usluga">
        <p style={{ margin: 0 }}>
          Resume Hunter je alat koji na temelju podataka koje sam unosiš u svoj profil i teksta oglasa
          za posao generira prilagođeni životopis i motivacijsko pismo te procjenu podudaranja s oglasom.
          Usluga je pomoć pri pisanju prijave — ne jamči zaposlenje, poziv na razgovor niti bilo kakav
          ishod prijave.
        </p>
      </LegalSection>

      <LegalSection title="2. Račun">
        <p style={{ margin: 0 }}>
          Za korištenje je potreban račun s email adresom i lozinkom. Odgovoran si za točnost podataka
          koje unosiš i za čuvanje pristupnih podataka. Račun je osoban — ne dijeli ga s drugima.
          Račun možeš u svakom trenutku trajno obrisati u <strong>Postavke → Brisanje računa</strong>.
        </p>
      </LegalSection>

      <LegalSection title="3. Tvoj sadržaj">
        <p style={{ margin: 0 }}>
          Sadržaj koji unosiš (podaci o iskustvu, obrazovanju, projektima, vještinama i tekstovi oglasa)
          ostaje tvoj. Daješ nam ograničeno pravo obrade tog sadržaja isključivo u svrhu pružanja usluge —
          generiranja i spremanja tvojih prijava. Ne prodajemo tvoj sadržaj i ne koristimo ga za oglašavanje.
        </p>
      </LegalSection>

      <LegalSection title="4. Prihvatljivo korištenje">
        <p style={{ margin: "0 0 10px" }}>Prilikom korištenja usluge ne smiješ:</p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>unositi tuđe osobne podatke bez njihove privole;</li>
          <li>navoditi neistinite podatke o kvalifikacijama, radnom iskustvu ili certifikatima;</li>
          <li>koristiti uslugu za slanje neželjene pošte ili masovnih automatiziranih prijava;</li>
          <li>pokušavati zaobići sigurnosna ograničenja, opterećivati sustav ili pristupati tuđim podacima.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Sadržaj koji generira umjetna inteligencija">
        <p style={{ margin: 0 }}>
          Tekstove generira AI model i oni mogu sadržavati netočnosti ili formulacije koje ne odgovaraju
          tvojoj situaciji. <strong>Prije slanja svake prijave obavezno provjeri sadržaj.</strong> Ti si
          odgovoran za sve što šalješ poslodavcu. Procjena podudaranja s oglasom je informativna procjena,
          a ne stručna ocjena tvoje podobnosti.
        </p>
      </LegalSection>

      <LegalSection title="6. Dostupnost i izmjene">
        <p style={{ margin: 0 }}>
          Usluga se pruža „takva kakva jest”. Možemo je mijenjati, privremeno prekinuti ili ukinuti,
          kao i izmijeniti ove uvjete. O bitnim izmjenama uvjeta obavijestit ćemo te unutar aplikacije
          ili na email povezan s tvojim računom.
        </p>
      </LegalSection>

      <LegalSection title="7. Ograničenje odgovornosti">
        <p style={{ margin: 0 }}>
          U mjeri dopuštenoj zakonom, ne odgovaramo za neizravnu štetu, izgubljenu priliku za zaposlenje
          ni za posljedice odluka donesenih na temelju generiranog sadržaja. Ovo ne ograničava prava koja
          ti pripadaju po prisilnim propisima o zaštiti potrošača.
        </p>
      </LegalSection>

      <LegalSection title="8. Prestanak korištenja">
        <p style={{ margin: 0 }}>
          Korištenje možeš prekinuti u bilo kojem trenutku brisanjem računa. Možemo ograničiti ili ukinuti
          pristup računu koji krši ove uvjete.
        </p>
      </LegalSection>

      <LegalSection title="9. Kontakt">
        <p style={{ margin: 0 }}>
          {CONTACT_EMAIL ? (
            <>Za pitanja o ovim uvjetima piši na <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--rh-accent)" }}>{CONTACT_EMAIL}</a>.</>
          ) : (
            <>Za pitanja o ovim uvjetima kontaktiraj vlasnika usluge putem kontakta objavljenog na naslovnici.</>
          )}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
