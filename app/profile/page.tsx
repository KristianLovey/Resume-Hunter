// app/profile/page.tsx
// Profil sada živi unutar glavnog dashboarda (Moj profil tab).
import { redirect } from "next/navigation";

export default function ProfilePage() {
  redirect("/dashboard");
}
