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
  "Dr. Priya Menon",
  "Dr. Arjun Nair",
  "Dr. Sreelakshmi R.",
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

export function sanitizeForMongo(data: AppointmentInput) {
  const sanitize = (s: string) =>
    s.replace(/[${}()[\]]/g, "").trim();

  return {
    ...data,
    name:  sanitize(data.name),
    notes: sanitize(data.notes ?? ""),
  };
}