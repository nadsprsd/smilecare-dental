// lib/constants.ts

export interface Treatment {
  _id?: string;
  date: string;
  treatment: string;
  doctor: string;
  notes: string;
  estimatedAmount: number;
  paidAmount: number;
  status: "planned" | "in-progress" | "completed" | "cancelled";
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

export const DOCTORS = [
  "Dr. Priya Menon",
  "Dr. Arjun Nair",
  "Dr. Sreelakshmi R.",
];

export const TREATMENT_TYPES = [
  "Dental Checkup & Cleaning",
  "Teeth Whitening",
  "Dental Implant",
  "Braces / Clear Aligners",
  "Root Canal Treatment",
  "Tooth Extraction",
  "Composite Filling",
  "Crown & Bridge",
  "Dentures",
  "Gum Treatment",
  "Smile Makeover",
  "Pediatric Treatment",
  "Fluoride Treatment",
  "X-Ray",
  "Consultation",
  "Other",
];

export const XRAY_TYPES = [
  "Full Mouth X-Ray (OPG)",
  "Periapical X-Ray",
  "Bitewing X-Ray",
  "CBCT Scan",
  "Intraoral Scan",
  "Photograph",
  "Other",
];