// lib/certificates.ts
// Doctor qualifications & certifications shown on the homepage (highlights)
// and the About page (full list). Replace placeholder data with the real
// details + certificate images once the clinic sends them.

export interface Certificate {
  id: string;
  doctorName: string;
  degree: string;           // e.g. "BDS, MDS (Prosthodontics)"
  certifications: string[]; // e.g. ["Advanced Implantology — AIIMS", "Invisalign Certified Provider"]
  year?: string;            // year qualified / clinic founded, optional
  image?: string;           // path in /public/certificates/... or a doctor photo
}

export const CERTIFICATES: Certificate[] = [
  {
    id: "doctor-1",
    doctorName: "Dr. [Full Name]",
    degree: "BDS, MDS (Prosthodontics)",
    certifications: [
      "Advanced Implantology Training",
      "Invisalign / Clear Aligner Certified",
    ],
    year: "",
    // image left unset on purpose — the component shows a clean fallback
    // icon instead of a broken image until a real photo is added here,
    // e.g. image: "/certificates/doctor-1.jpg"
  },
  {
    id: "doctor-2",
    doctorName: "Dr. [Full Name]",
    degree: "BDS, MDS (Orthodontics)",
    certifications: [
      "Root Canal & Endodontics Specialisation",
      "Smile Design Certification",
    ],
    year: "",
  },
];
