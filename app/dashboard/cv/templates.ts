// app/dashboard/cv/templates.ts
// Registry vizualnih predložaka za CV. Predložak = izgled (layout + boje + tipografija).
// Agent generira SADRŽAJ; predložak određuje IZGLED (deterministički, ATS-friendly).

export type CvTemplateId = "modern" | "classic" | "minimal" | "elegant" | "compact" | "creative";

export type CvTheme = {
  id: CvTemplateId;
  name: string;
  columns: "two" | "one";
  sidebar: "light" | "dark" | "none";
  accent: string;
  ink: string; // glavna tamna boja (ime, naslovi)
  font: string; // CSS font-family
  heading: "underline" | "bar" | "caps" | "serif";
  density: "cozy" | "compact";
  nameSpacing: string; // letter-spacing za veliko ime
};

const JAKARTA = `"Plus Jakarta Sans", system-ui, sans-serif`;

export const CV_TEMPLATES: CvTheme[] = [
  { id: "modern", name: "Modern", columns: "two", sidebar: "light", accent: "#2563EB", ink: "#0F1F44", font: JAKARTA, heading: "underline", density: "cozy", nameSpacing: ".12em" },
  { id: "classic", name: "Classic", columns: "one", sidebar: "none", accent: "#1F2937", ink: "#111827", font: `Georgia, "Times New Roman", serif`, heading: "serif", density: "cozy", nameSpacing: ".06em" },
  { id: "minimal", name: "Minimal", columns: "one", sidebar: "none", accent: "#111827", ink: "#111827", font: JAKARTA, heading: "caps", density: "cozy", nameSpacing: ".2em" },
  { id: "elegant", name: "Elegant", columns: "two", sidebar: "dark", accent: "#2563EB", ink: "#0F1F44", font: JAKARTA, heading: "bar", density: "cozy", nameSpacing: ".1em" },
  { id: "compact", name: "Compact", columns: "two", sidebar: "light", accent: "#0F766E", ink: "#0F1F44", font: JAKARTA, heading: "underline", density: "compact", nameSpacing: ".08em" },
  { id: "creative", name: "Creative", columns: "one", sidebar: "none", accent: "#7C3AED", ink: "#1B1145", font: JAKARTA, heading: "bar", density: "cozy", nameSpacing: ".04em" },
];

export const DEFAULT_TEMPLATE: CvTemplateId = "modern";

export function getTemplate(id?: string | null): CvTheme {
  return CV_TEMPLATES.find((t) => t.id === id) ?? CV_TEMPLATES[0];
}
