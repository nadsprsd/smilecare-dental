import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { getDoctorById } from "@/lib/doctors";

function sanitize(s: string): string {
  return s.replace(/[${}()[\]]/g, "").trim();
}

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

// Ensures the slot-locking index exists. Cheap no-op if it's already there —
// safe to call on every request rather than requiring a separate migration step.
//
// Note: partialFilterExpression only supports $eq / $exists / $gt / $gte /
// $lt / $lte / $type (and top-level $and) — NOT $ne. An earlier version of
// this used { confirmationStatus: { $ne: "cancelled" } }, which MongoDB
// rejects outright, making every booking fail. Using a plain boolean field
// works within that limitation instead.
async function ensureSlotLockIndex(db: any) {
  await db.collection("bookings").createIndex(
    { doctorId: 1, date: 1, time: 1 },
    { unique: true, partialFilterExpression: { isActive: { $eq: true } }, name: "slot_lock" }
  );
}

// POST — public endpoint, creates a booking. This is the only place a
// double-booking could theoretically be attempted, and the unique index
// makes it structurally impossible rather than just "checked for".
export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = bookingSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const data = parsed.data;

    const doctor = getDoctorById(data.doctorId);
    if (!doctor) {
      return Response.json({ success: false, message: "Unknown doctor" }, { status: 400 });
    }

    const db = await connectDB();
    await ensureSlotLockIndex(db);

    const booking = {
      _id:                new ObjectId().toString(),
      patientName:        sanitize(data.patientName),
      phone:              data.phone,
      service:            data.service,
      doctorId:           data.doctorId,
      doctorName:         doctor.name,
      date:               data.date,
      time:               data.time,
      notes:              sanitize(data.notes),
      // Full-time doctors auto-confirm; on-call always needs human confirmation
      // that the specialist is actually present, per the clinic's requirement.
      confirmationStatus: doctor.type === "full-time" ? "confirmed" : "pending",
      isActive:           true, // flips to false on cancellation — see [id]/route.ts
      createdAt:          new Date().toISOString(),
    };

    try {
      await db.collection("bookings").insertOne(booking as any);
    } catch (err: any) {
      if (err?.code === 11000) {
        // The unique index caught a race — someone else took this exact slot first.
        return Response.json({ success: false, message: "That slot was just booked by someone else. Please pick another." }, { status: 409 });
      }
      throw err;
    }

    return Response.json({ success: true, booking });
  } catch (err) {
    console.error("POST /api/bookings failed:", err);
    return Response.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// GET — admin only, list bookings (optionally filtered by status/date range)
export async function GET(req: NextRequest) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query: any = {};
    if (status) query.confirmationStatus = status;

    const db = await connectDB();
    const bookings = await db.collection("bookings")
      .find(query)
      .sort({ date: 1, time: 1 })
      .toArray();

    return Response.json({ success: true, bookings });
  } catch (err) {
    console.error("GET /api/bookings failed:", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
