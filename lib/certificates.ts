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
    id: "vineeth-nh",
    doctorName: "Dr. Vineeth N.H",
    degree: "BDS — Government Dental College, Calicut · MDS in Endodontics — Kerala University of Health Sciences",
    certifications: [
      "1st Place, Poster Presentation — IACDE National Conference, Rajahmundry (2022)",
      "2nd Place, Paper Presentation — IACDE National Conference, Bhopal (2023)",
      "Member, Indian Dental Association (IDA)",
      "Member, CAESOK",
      "Member, Indian Association of Conservative Dentistry and Endodontics (IACDE)",
    ],
    year: "",
    image: "/doctors/vineeth.jpg",
  },
];
