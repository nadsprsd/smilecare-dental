import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";
import { waitlistSchema } from "@/lib/validation";

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

// POST — public. Captures interest when no doctor is bookable for a
// chosen service/date. Does NOT reserve a slot — just a lead for staff to
// follow up on (e.g. activate the on-call doctor for that day and call back).
export async function POST(req: NextRequest) {
  try {
    let raw: any;
    try {
      raw = await req.json();
    } catch {
      return Response.json({ success: false, message: "Malformed JSON" }, { status: 400 });
    }
    const parsed = waitlistSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }

    const db = await connectDB();
    const entry = {
      _id:       new ObjectId().toString(),
      name:      parsed.data.name,
      phone:     parsed.data.phone,
      service:   parsed.data.service,
      date:      parsed.data.date,
      contacted: false,
      createdAt: new Date().toISOString(),
    };
    await db.collection("waitlist").insertOne(entry as any);

    return Response.json({ success: true });
  } catch (err) {
    console.error("POST /api/waitlist failed:", err);
    return Response.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// GET — admin only, list waitlist entries (most recent first)
export async function GET() {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const db = await connectDB();
    const entries = await db.collection("waitlist").find().sort({ createdAt: -1 }).toArray();
    return Response.json({ success: true, entries });
  } catch (err) {
    console.error("GET /api/waitlist failed:", err);
    return Response.json({ success: false }, { status: 500 });
  }
}

// PATCH — admin only, mark a waitlist entry as contacted
export async function PATCH(req: NextRequest) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id, contacted } = await req.json();
    if (!id) return Response.json({ success: false }, { status: 400 });
    const db = await connectDB();
    const result = await db.collection("waitlist").updateOne(
      { _id: id },
      { $set: { contacted: !!contacted } }
    );
    return Response.json({ success: result.modifiedCount > 0 });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}
