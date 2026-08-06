import { connectDB } from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { doctorsForService, generateSlotsForDay } from "@/lib/doctors";

// GET /api/bookings/availability?service=...&date=YYYY-MM-DD
// Public endpoint — powers the booking calendar. Returns only doctors who
// are actually bookable for that service on that date, each with their
// remaining open slots (already-booked slots removed).
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service") || "";
    const date    = searchParams.get("date")    || "";

    if (!service || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json({ success: false, message: "service and a valid date are required" }, { status: 400 });
    }

    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    const allSlots  = generateSlotsForDay(dayOfWeek);
    if (allSlots.length === 0) {
      return Response.json({ success: true, doctors: [], message: "Clinic is closed on this date" });
    }

    const candidates = doctorsForService(service);
    if (candidates.length === 0) {
      return Response.json({ success: true, doctors: [] });
    }

    const db = await connectDB();

    // Roster status for this date (only matters for on-call doctors)
    const rosterDocs = await db.collection("doctor_availability")
      .find({ date, doctorId: { $in: candidates.map(d => d.id) } })
      .toArray();
    const rosterMap = new Map(rosterDocs.map(r => [r.doctorId, r.status]));

    // Existing non-cancelled bookings for this date, for these doctors
    const bookingDocs = await db.collection("bookings")
      .find({ date, doctorId: { $in: candidates.map(d => d.id) }, confirmationStatus: { $ne: "cancelled" } })
      .toArray();
    const takenByDoctor = new Map<string, Set<string>>();
    for (const b of bookingDocs) {
      if (!takenByDoctor.has(b.doctorId)) takenByDoctor.set(b.doctorId, new Set());
      takenByDoctor.get(b.doctorId)!.add(b.time);
    }

    const doctors = candidates
      .filter(d => {
        if (d.type === "full-time") {
          // Full-time doctor is bookable unless explicitly marked off (leave)
          return rosterMap.get(d.id) !== "off-site";
        }
        // On-call doctor must be explicitly marked "active" for this date
        return rosterMap.get(d.id) === "active";
      })
      .map(d => {
        const taken = takenByDoctor.get(d.id) ?? new Set<string>();
        return {
          id: d.id,
          name: d.name,
          specialty: d.specialty,
          type: d.type,
          availableSlots: allSlots.filter(s => !taken.has(s)),
        };
      })
      .filter(d => d.availableSlots.length > 0);

    return Response.json({ success: true, doctors });
  } catch (err) {
    console.error("GET /api/bookings/availability failed:", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
