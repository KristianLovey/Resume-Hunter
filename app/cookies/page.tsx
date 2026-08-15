import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookies | Resume Hunter",
  description: "Which cookies Resume Hunter uses and why.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookies"
      intro="Resume Hunter only uses cookies that are necessary for the app to work. There are no advertising cookies and no cross site tracking."
    >
      <LegalSection title="Necessary cookies">
        <p style={{ margin: "0 0 10px" }}>
          When you sign in, a session cookie is set that keeps you signed in as you move between pages.
          Without it the app would sign you out on every refresh.
        </p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>
            <strong>Authentication cookies (Supabase Auth):</strong> store your session token. They are
            removed when you log out or when the session expires.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Local browser storage">
        <p style={{ margin: "0 0 10px" }}>
          Besides cookies, the app keeps the following in your browser's local storage:
        </p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li>
            <strong>Your chosen theme</strong> (light or dark), so it stays the same on your next visit.
          </li>
          <li>
            <strong>Unsaved resume edits:</strong> a temporary copy of what you are editing, so your work
            is not lost if you refresh the page. It is cleared once you save.
          </li>
        </ul>
        <p style={{ margin: "10px 0 0" }}>
          This data stays in your browser and is not sent to anyone. You can remove it by clearing site
          data in your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="Analytics and advertising">
        <p style={{ margin: 0 }}>
          We do not use analytics or advertising cookies, and we do not share your browsing data with
          advertisers.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
