import { connectDB } from "@/lib/mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

// GET /api/roster?start=YYYY-MM-DD&end=YYYY-MM-DD
// Returns availability records for on-call doctors in that date range.
export async function GET(req: NextRequest) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start") || new Date().toISOString().split("T")[0];
    const end   = searchParams.get("end")   || start;

    const db = await connectDB();
    const records = await db.collection("doctor_availability")
      .find({ date: { $gte: start, $lte: end } })
      .toArray();

    return Response.json({
      success: true,
      records: records.map(r => ({ doctorId: r.doctorId, date: r.date, status: r.status })),
    });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

// POST — set/toggle a single doctor's status for a single date.
// Body: { doctorId, date: "YYYY-MM-DD", status: "active" | "off-site" }
export async function POST(req: NextRequest) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.doctorId || !body.date || !["active", "off-site"].includes(body.status)) {
      return Response.json({ success: false, message: "Invalid roster entry" }, { status: 400 });
    }

    const db = await connectDB();
    await db.collection("doctor_availability").updateOne(
      { doctorId: body.doctorId, date: body.date },
      { $set: { doctorId: body.doctorId, date: body.date, status: body.status } },
      { upsert: true }
    );

    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}
