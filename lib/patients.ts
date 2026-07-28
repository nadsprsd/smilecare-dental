// lib/patients.ts
"use server";

import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Patient } from "@/lib/constants";

// ── Generate registration number ──
export async function generateRegistrationNumber(clinicCode = "VCC"): Promise<string> {
  const db = await connectDB();
  const count = await db.collection("patients").countDocuments();
  const year = new Date().getFullYear();
  const num = String(count + 1).padStart(4, "0");
  return `${clinicCode}-${year}-${num}`;
}

// ── Get all patients (for list page) ──
export async function getAllPatients(): Promise<Patient[]> {
  try {
    const db = await connectDB();
    const docs = await db
      .collection("patients")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map(d => ({
      ...d,
      _id: d._id.toString(),
    })) as Patient[];
  } catch {
    return [];
  }
}

// ── Get single patient by ID ──
export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    const db = await connectDB();
    const doc = await db.collection("patients").findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() } as Patient;
  } catch {
    return null;
  }
}