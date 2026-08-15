import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume Hunter",
  description: "AI agent that tailors your resume and cover letter to each job ad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Postavi temu prije prvog paint-a da nema bljeska svijetle pozadine. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("rh-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
