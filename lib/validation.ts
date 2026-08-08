// lib/validation.ts
import { z } from "zod";

const SERVICES = [
  "Dental Checkup & Cleaning",
  "Teeth Whitening",
  "Dental Implants",
  "Braces / Clear Aligners",
  "Root Canal Treatment",
  "Pediatric Dentistry",
  "Smile Makeover",
  "Dentures & Bridges",
  "Other / Not Sure",
] as const;

const DOCTORS = [
  "Dr. Vineeth N.H",
  "Dr. Anumuthu P M",
  "No Preference",
] as const;

const TIME_SLOTS = [
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM",
  "2:00 PM","2:30 PM","3:00 PM","3:30 PM",
  "4:00 PM","4:30 PM","5:00 PM","6:00 PM",
] as const;

export const appointmentSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters")
    .transform(s => s.trim()),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number")
    .transform(s => s.trim()),

  service: z.enum(SERVICES, {
    message: "Please select a valid service",
  }),

  doctor: z.enum(DOCTORS, {
    message: "Please select a valid doctor",
  }).optional().default("No Preference"),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .refine(d => {
      const date  = new Date(d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Date cannot be in the past"),

  time: z.enum(TIME_SLOTS, {
    message: "Please select a valid time slot",
  }),

  notes: z
    .string()
    .max(500, "Notes too long")
    .optional()
    .default("")
    .transform(s => s.replace(/<[^>]*>/g, "").trim()),

  consent: z
    .boolean()
    .refine(v => v === true, "You must consent to data collection"),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

// ── New slot-based booking schema (real availability flow) ──
export const bookingSchema = z.object({
  patientName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters")
    .transform(s => s.trim()),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number")
    .transform(s => s.trim()),

  service: z.string().min(1, "Service is required"),
  doctorId: z.string().min(1, "Doctor is required"),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .refine(d => {
      const date  = new Date(d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Date cannot be in the past"),

  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),

  notes: z
    .string()
    .max(500, "Notes too long")
    .optional()
    .default("")
    .transform(s => s.replace(/<[^>]*>/g, "").trim()),

  consent: z
    .boolean()
    .refine(v => v === true, "You must consent to data collection"),
});

export type BookingInput = z.infer<typeof bookingSchema>;

// A "waitlist" entry — captured when a patient wants a service/date combo
// that has no bookable doctor (most commonly: the on-call specialist they
// need simply wasn't marked active for that date). No slot is reserved;
// this is a lead for staff to call back, not a booking.
export const waitlistSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters")
    .transform(s => s.trim()),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number")
    .transform(s => s.trim()),
  service: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

// Domains we trust for X-ray/image URLs. Rejects javascript:, data:, ftp:,
// file:, and any other protocol/host not explicitly allowed (SEC-019).
const ALLOWED_IMAGE_HOSTS = [
  "drive.google.com",
  "lh3.googleusercontent.com", // Google's actual image CDN — Drive/Photos links resolve here
  "photos.google.com",
  "i.imgur.com",
  "imgur.com",
];

// A plain Google Drive "share" link (.../file/d/FILE_ID/view) is an HTML
// viewer page, not an image — it can never render in an <img> tag, which is
// exactly the "couldn't load this image" bug reported. This converts it to
// a real image URL automatically so staff don't have to know the difference.
//
// IMPORTANT: this deliberately does NOT use drive.google.com/uc?export=view —
// Google has made that format unreliable; for many files it now forces a
// browser download ("Google Drive can't scan this file for viruses" style
// interstitial) instead of serving the image inline, which is exactly the
// "downloads a fake file" symptom reported. lh3.googleusercontent.com is
// Google's actual image CDN — the same one Drive/Photos thumbnails resolve
// to under the hood — and reliably renders inline instead of downloading.
//
// Google Photos share links have no equivalent stable direct-image format,
// so those still can't be auto-fixed — recommend Drive or Imgur instead.
export function normalizeImageUrl(url: string): string {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  return url;
}

export function isAllowedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    return ALLOWED_IMAGE_HOSTS.some(host => parsed.hostname === host || parsed.hostname.endsWith("." + host));
  } catch {
    return false;
  }
}

// Server-side validation for patient records — enforced here regardless of
// what the admin UI sends, since client-side maxLength is only a UX hint,
// not a real control. Limits per the August 2026 security assessment (SEC-022).
export const patientSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100, "Name is too long")
    .transform(s => s.replace(/<[^>]*>/g, "")),
  phone: z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Phone must be 10-15 digits"),
  email: z.string().trim().max(254).optional().or(z.literal("")),
  sex: z.enum(["Male", "Female", "Other"]).optional(),
  dateOfBirth: z.string().optional().refine(
    v => !v || new Date(v) <= new Date(),
    "Date of birth cannot be in the future"
  ),
  age: z.coerce.number().min(0).max(120).optional(),
  address: z.string().trim().max(300).optional().transform(s => s?.replace(/<[^>]*>/g, "")),
  source: z.string().max(50).optional(),
  medicalHistory: z.string().trim().max(5000).optional().transform(s => s?.replace(/<[^>]*>/g, "")),
  dentalHistory: z.string().trim().max(5000).optional().transform(s => s?.replace(/<[^>]*>/g, "")),
  allergies: z.string().trim().max(1000).optional().transform(s => s?.replace(/<[^>]*>/g, "")),
});

export function sanitizeForMongo(data: AppointmentInput) {
  const sanitize = (s: string) =>
    s.replace(/[${}()[\]]/g, "").trim();

  return {
    ...data,
    name:  sanitize(data.name),
    notes: sanitize(data.notes ?? ""),
  };
}