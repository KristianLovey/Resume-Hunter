import type { Metadata } from "next";
import LegalPage, { LegalSection, CONTACT_EMAIL } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Resume Hunter",
  description: "How Resume Hunter collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This page explains what data Resume Hunter collects, why it processes it, who it is shared with, and how you can delete it."
    >
      <LegalSection title="1. What we collect">
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>
            <strong>Account data:</strong> your email address and password (the password is stored
            encrypted, we never see it in readable form).
          </li>
          <li>
            <strong>Profile data you enter:</strong> name, date of birth, phone, location, description,
            work experience, education, projects, skills, certificates, strengths and hobbies.
          </li>
          <li>
            <strong>Application data:</strong> the job ad text you paste, plus the generated resume, cover
            letter, match score and application status.
          </li>
          <li>
            <strong>Technical data:</strong> session cookies required to keep you signed in.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Why we process it">
        <p style={{ margin: 0 }}>
          We process your data only to provide the service: running your account, generating a tailored
          resume and cover letter, and storing and displaying your applications. The legal basis is
          performance of a contract, namely providing the service you asked for. We do not use your data
          for advertising and we do not sell it.
        </p>
      </LegalSection>

      <LegalSection title="3. Who we share it with">
        <p style={{ margin: "0 0 10px" }}>
          We share data only with the providers needed to run the application:
        </p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>
            <strong>Supabase:</strong> database, authentication and storage of your data.
          </li>
          <li>
            <strong>Google (Gemini API):</strong> text generation. When you start a generation, your
            profile data and the job ad text are sent to the model so it can compose the resume and letter.
          </li>
        </ul>
        <p style={{ margin: "10px 0 0" }}>
          These providers process the data on our behalf and are subject to their own data processing
          terms.
        </p>
      </LegalSection>

      <LegalSection title="4. How long we keep it">
        <p style={{ margin: 0 }}>
          We keep your data for as long as you have an account. When you delete your account, your profile,
          experience, education, projects and all applications are deleted along with the account itself.
        </p>
      </LegalSection>

      <LegalSection title="5. Security">
        <p style={{ margin: 0 }}>
          Access is restricted at the database level (row level security), so each user can read and change
          only their own records. Traffic between your browser and the server is encrypted. No system is
          completely impenetrable, so use a unique password and do not share it.
        </p>
      </LegalSection>

      <LegalSection title="6. Your rights">
        <p style={{ margin: "0 0 10px" }}>You have the right to:</p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>access your data, it is visible and editable in your profile;</li>
          <li>correct it, every profile field can be changed in the app;</li>
          <li>
            delete it, under <strong>Settings, Delete account</strong> you permanently remove your account
            and all data;
          </li>
          <li>object to processing and lodge a complaint with your data protection authority.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Children">
        <p style={{ margin: 0 }}>
          The service is not intended for people under 16. If we learn that we have collected such data
          without parental consent, we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p style={{ margin: 0 }}>
          {CONTACT_EMAIL ? (
            <>
              For privacy questions or a data request, write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--rh-accent)" }}>
                {CONTACT_EMAIL}
              </a>
              .
            </>
          ) : (
            <>
              For privacy questions, contact the service owner using the contact details published on the
              home page.
            </>
          )}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
