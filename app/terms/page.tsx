import type { Metadata } from "next";
import LegalPage, { LegalSection, CONTACT_EMAIL } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use | Resume Hunter",
  description: "Terms of use for the Resume Hunter service.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="By using Resume Hunter you accept the terms below. Please read them before you create an account."
    >
      <LegalSection title="1. What the service is">
        <p style={{ margin: 0 }}>
          Resume Hunter generates a tailored resume and cover letter, plus an estimated match score, based
          on the details you enter into your profile and the text of a job ad you paste in. It is a writing
          aid. It does not guarantee employment, an interview, or any particular outcome.
        </p>
      </LegalSection>

      <LegalSection title="2. Your account">
        <p style={{ margin: 0 }}>
          You need an account with an email address and password. You are responsible for the accuracy of
          what you enter and for keeping your login details safe. Accounts are personal, do not share them.
          You can permanently delete your account at any time under{" "}
          <strong>Settings, Delete account</strong>.
        </p>
      </LegalSection>

      <LegalSection title="3. Your content">
        <p style={{ margin: 0 }}>
          The content you enter (experience, education, projects, skills and job ad text) stays yours. You
          grant us a limited right to process it solely to provide the service: generating and storing your
          applications. We do not sell your content and we do not use it for advertising.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p style={{ margin: "0 0 10px" }}>While using the service you must not:</p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>enter another person's personal data without their consent;</li>
          <li>state false qualifications, work history or certificates;</li>
          <li>use the service to send spam or mass automated applications;</li>
          <li>attempt to bypass security limits, overload the system, or access other users' data.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. AI generated content">
        <p style={{ margin: 0 }}>
          The text is produced by an AI model and may contain inaccuracies or phrasing that does not fit
          your situation. <strong>Always review the content before you send any application.</strong> You
          are responsible for everything you send to an employer. The match score is an estimate, not a
          professional assessment of your suitability.
        </p>
      </LegalSection>

      <LegalSection title="6. Availability and changes">
        <p style={{ margin: 0 }}>
          The service is provided as is. We may change, suspend or discontinue it, and we may update these
          terms. We will tell you about material changes to the terms inside the app or by email to the
          address on your account.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitation of liability">
        <p style={{ margin: 0 }}>
          To the extent permitted by law, we are not liable for indirect damage, lost employment
          opportunities, or the consequences of decisions made based on generated content. This does not
          limit rights you have under mandatory consumer protection law.
        </p>
      </LegalSection>

      <LegalSection title="8. Ending your use">
        <p style={{ margin: 0 }}>
          You may stop using the service at any time by deleting your account. We may limit or terminate
          access to an account that breaches these terms.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p style={{ margin: 0 }}>
          {CONTACT_EMAIL ? (
            <>
              For questions about these terms, write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--rh-accent)" }}>
                {CONTACT_EMAIL}
              </a>
              .
            </>
          ) : (
            <>
              For questions about these terms, contact the service owner using the contact details
              published on the home page.
            </>
          )}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
