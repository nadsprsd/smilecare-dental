// lib/doctors.ts
//
// Real roster from Vee Care Dental Clinic. Vineeth and Anumuthu are the
// full-time team — confirmed by the clinic (Aug 2026) as always bookable,
// for every service, so patients are never shown "no doctor available."
// The other 6 are on-call specialists, each tied to their own specialty,
// only bookable on days they're marked Active on the Roster page.
// Everything here is plain data — edit directly, no other code changes needed.

export type DoctorType = "full-time" | "on-call";

export interface Doctor {
  id: string;            // stable slug, used as the DB key — don't change once bookings exist
  name: string;
  degree: string;
  specialty: string;
  type: DoctorType;
  services: string[];    // must match entries in SERVICES below
}

export const SERVICES = [
  "General Dentistry",
  "Root Canal Treatment",
  "Teeth Cleaning",
  "Tooth Filling",
  "Tooth Extractions",
  "Braces and Aligners",
  "Dental Implants",
  "Smile Correction",
  "Teeth Whitening",
  "Crown and Bridges",
  "Veneers",
  "Fixed and Removable Dentures",
  "Pediatric Dentistry",
  "Gum Care",
  "Laser Dentistry",
] as const;

export const DOCTORS: Doctor[] = [
  {
    id: "vineeth",
    name: "Dr. Vineeth N.H",
    degree: "BDS, MDS",
    specialty: "Chief Dental Surgeon & Endodontist (Root Canal Specialist)",
    type: "full-time", // clinic's stated lead — confident on this one
    services: [...SERVICES], // always bookable, every service — clinic's explicit instruction (Aug 2026)
  },
  {
    id: "anumuthu",
    name: "Dr. Anumuthu P M",
    degree: "BDS",
    specialty: "Resident Dental Surgeon",
    type: "full-time", // guess — residents are typically on-site daily; please confirm
    services: [...SERVICES], // always bookable, every service — clinic's explicit instruction (Aug 2026)
  },
  {
    id: "reshma",
    name: "Dr. Reshma R",
    degree: "MBBS, MS",
    specialty: "General Surgeon",
    type: "on-call",
    services: ["Tooth Extractions"], // guess — likely surgical support/clearance, please confirm her actual bookable role
  },
  {
    id: "arun-george",
    name: "Dr. Arun George",
    degree: "BDS, MDS",
    specialty: "Orthodontist (Braces & Aligner Specialist)",
    type: "on-call",
    services: ["Braces and Aligners"],
  },
  {
    id: "mathew",
    name: "Dr. Mathew",
    degree: "BDS, MDS",
    specialty: "Oral & Maxillofacial Surgeon",
    type: "on-call",
    services: ["Tooth Extractions", "Dental Implants"],
  },
  {
    id: "nithin",
    name: "Dr. Nithin",
    degree: "BDS, MDS",
    specialty: "Oral & Maxillofacial Surgeon",
    type: "on-call",
    services: ["Tooth Extractions", "Dental Implants"],
  },
  {
    id: "sreeja",
    name: "Dr. Sreeja",
    degree: "BDS, MDS",
    specialty: "Prosthodontics",
    type: "on-call",
    services: ["Crown and Bridges", "Veneers", "Fixed and Removable Dentures", "Smile Correction"],
  },
  {
    id: "akhil",
    name: "Dr. Akhil S",
    degree: "BDS, MDS",
    specialty: "Implant Specialist",
    type: "on-call",
    services: ["Dental Implants"],
  },
];

// Clinic operating hours — used to generate bookable time slots.
// Real hours per the clinic: Mon–Sat 10am–8pm, Sunday 10am–4pm.
export const CLINIC_HOURS: Record<number, { open: string; close: string } | null> = {
  0: { open: "10:00", close: "16:00" }, // Sunday
  1: { open: "10:00", close: "20:00" },
  2: { open: "10:00", close: "20:00" },
  3: { open: "10:00", close: "20:00" },
  4: { open: "10:00", close: "20:00" },
  5: { open: "10:00", close: "20:00" },
  6: { open: "10:00", close: "20:00" },
};

export const SLOT_MINUTES = 30;

export function getDoctorById(id: string): Doctor | undefined {
  return DOCTORS.find(d => d.id === id);
}

export function doctorsForService(service: string): Doctor[] {
  return DOCTORS.filter(d => d.services.includes(service));
}

// Generates every slot start-time string ("10:00", "10:30", ...) for a given weekday.
export function generateSlotsForDay(dayOfWeek: number): string[] {
  const hours = CLINIC_HOURS[dayOfWeek];
  if (!hours) return [];
  const slots: string[] = [];
  let [h, m] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  while (h < closeH || (h === closeH && m < closeM)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += SLOT_MINUTES;
    if (m >= 60) { m -= 60; h += 1; }
  }
  return slots;
}

