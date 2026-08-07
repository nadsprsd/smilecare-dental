// lib/constants.ts

export interface Prescription {
  _id?: string;
  drug: string;
  strengthMg: string;   // e.g. "500"
  durationDays: number;
  frequency: string;    // e.g. "Twice a day (BD)"
  mealTiming: string;   // "Before Food" | "After Food" | "Empty Stomach" | "Bedtime"
  route: string;        // "Oral" | "Topical / External" | ...
  notes?: string;
}

export interface Treatment {
  _id?: string;
  date: string;
  treatment: string;
  doctor: string;
  notes: string;
  estimatedAmount: number;
  paidAmount: number;
  status: "planned" | "in-progress" | "completed" | "cancelled";
  diagnosis?: string;
  labDetails?: string;
  prescriptions?: Prescription[];
}

export interface XRay {
  _id?: string;
  url: string;
  date: string;
  type: string;
  notes: string;
}

export interface Alert {
  type: "warning" | "info" | "danger";
  message: string;
}

export interface Invoice {
  _id?: string;
  invoiceNo: string;
  mode: "single" | "all";
  treatmentIds: string[];
  totalEstimated: number;
  totalPaid: number;
  totalBalance: number;
  sentVia: "whatsapp" | "print";
  createdAt: string;
}

export interface Patient {
  _id?: string;
  registrationNumber: string;
  name: string;
  phone: string;
  email: string;
  sex: "Male" | "Female" | "Other";
  dateOfBirth: string;
  age: number;
  address: string;
  source: string;
  medicalHistory: string;
  dentalHistory: string;
  allergies: string;
  alerts: Alert[];
  treatments: Treatment[];
  xrays: XRay[];
  invoices: Invoice[];
  createdAt: string;
  updatedAt: string;
}

export const SOURCES = [
  "Google Search",
  "Google Maps",
  "WhatsApp",
  "Referral — Friend/Family",
  "Referral — Doctor",
  "Facebook",
  "Instagram",
  "Walk-in",
  "Phone Call",
  "Other",
];

// NOTE: the doctor roster now lives in lib/doctors.ts (real names, degrees,
// specialties, full-time/on-call status). Import DOCTORS from "@/lib/doctors"
// instead — this file no longer exports a demo doctor list.

// Treatment type names — kept identical to lib/doctors.ts's SERVICES list
// (plus a few generic catch-alls) so the admin "Add Treatment" form can
// filter doctors by what they actually treat. If you add a new service in
// lib/doctors.ts, add the same string here too.
export const TREATMENT_TYPES = [
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
  "Consultation",
  "X-Ray",
  "Other",
];

// ── Scheduling module ──

// Returns today's date as YYYY-MM-DD in India Standard Time.
// IMPORTANT: never use `new Date().toISOString().split("T")[0]` for "today"
// anywhere in this app — toISOString() always returns the UTC calendar date,
// which is wrong for India between 12:00am and 5:30am IST (still the
// previous day in UTC). This was a real reported bug — a booking made in
// the evening was disappearing from "Today" the next morning before 5:30am.
export function getISTDateString(date: Date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export const XRAY_TYPES = [
  "Full Mouth X-Ray (OPG)",
  "Periapical X-Ray",
  "Bitewing X-Ray",
  "CBCT Scan",
  "Intraoral Scan",
  "Photograph",
  "Other",
];

// ── Prescription builder master data ──
// Real formulary from the clinic's prescription pad — edit freely if the
// doctor adds/removes drugs later, no other code changes needed.
export const MEDICATIONS = [
  "Tab MOXCLAV 625mg (Amoxicillin + Clavulanic Acid)",
  "Cap MOX 500mg (Amoxicillin)",
  "Tab CIPLOX TZ (Ciprofloxacin + Tinidazole)",
  "Tab METROGYL 400mg (Metronidazole)",
  "Tab ZERODOL P (Aceclofenac + Paracetamol)",
  "Tab KAINACE P (Etoricoxib + Paracetamol)",
  "Tab DOLONEX DT (Piroxicam, dispersible)",
  "Tab DOLO 650mg (Paracetamol)",
  "Tab PMOL 500mg (Paracetamol)",
  "Tab PANTOP 40mg (Pantoprazole)",
  "Tab MEFTAL FORTE (Mefenamic Acid + Paracetamol)",
  "Oin METROGYL DG (intraoral application)",
  "Oin DENTOGEL (intraoral application)",
  "REXIDIN M FORTE GEL (intraoral application)",
  "PERIOGARD MOUTHWASH",
  "Oin TURBOCORT (intraoral application)",
  "COLGATE PHOS-FLUR MOUTHWASH",
  "PERIOGARD TOOTHPASTE",
  "Syp MOXCLAV 228.5mg (Pediatric)",
  "Tab MOXCLAV 228.5mg (Pediatric)",
  "Syp MEFTAL P (Pediatric)",
  "Tab PARACETAMOL 250mg (Pediatric)",
];

export const FREQUENCY_OPTIONS = [
  "Once a day (OD)",
  "Twice a day (BD)",
  "Three times a day (TDS)",
  "Four times a day (QID)",
  "Once weekly",
  "SOS (as needed)",
];

export const MEAL_TIMING_OPTIONS = [
  "Before Food",
  "After Food",
  "Empty Stomach",
  "Bedtime",
  "Not Applicable",
];

export const ROUTE_OPTIONS = [
  "Oral",
  "Topical / External",
  "Mouthwash / Rinse",
  "Injection",
];