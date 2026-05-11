// app/api/appointments/route.ts
// Secured version with Zod validation + sanitization + injection prevention

import { connectDB }                  from "@/lib/mongodb";
import { appointmentSchema, sanitizeForMongo } from "@/lib/validation";
import { NextRequest }                from "next/server";

export async function GET() {
  return new Response("SmileCare Appointments API", { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Check Content-Type
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return Response.json(
        { success: false, message: "Invalid content type" },
        { status: 400 }
      );
    }

    // 2. Parse body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { success: false, message: "Invalid JSON" },
        { status: 400 }
      );
    }

    // 3. Validate with Zod
    const result = appointmentSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return Response.json(
        { success: false, message: "Validation failed", errors },
        { status: 422 }
      );
    }

    // 4. Sanitize for MongoDB — removes $, {, } etc.
    const clean = sanitizeForMongo(result.data);

    // 5. Save to MongoDB
    const db = await connectDB();
    await db.collection("appointments").insertOne({
      name:      clean.name,
      phone:     clean.phone,
      service:   clean.service,
      doctor:    clean.doctor,
      date:      clean.date,
      time:      clean.time,
      notes:     clean.notes,
      consent:   clean.consent,
      status:    "pending",
      createdAt: new Date(),
      // Store IP for abuse tracking (hashed, not raw)
      ipHash:    await hashIP(
        req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
      ),
    });

    return Response.json({ success: true });

  } catch (error) {
    // Never expose internal errors to client
    console.error("Appointment POST error:", error);
    return Response.json(
      { success: false, message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// Hash IP before storing — privacy compliant
async function hashIP(ip: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data    = encoder.encode(ip + process.env.IP_HASH_SECRET);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
  } catch {
    return "unknown";
  }
}

