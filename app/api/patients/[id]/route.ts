import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id } = await context.params;
    const db     = await connectDB();
    const doc    = await db.collection("patients").findOne({ _id: new ObjectId(id) });
    if (!doc) return Response.json({ success: false }, { status: 404 });
    return Response.json({ success: true, patient: { ...doc, _id: doc._id.toString() } });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id } = await context.params;
    const body   = await req.json();
    const db     = await connectDB();

    const allowed = [
      "name","phone","email","sex","dateOfBirth","age",
      "address","source","medicalHistory","dentalHistory",
      "allergies","alerts",
    ];

    const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return Response.json({ success: result.modifiedCount > 0 });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id } = await context.params;
    const db     = await connectDB();
    const result = await db.collection("patients").deleteOne({ _id: new ObjectId(id) });
    return Response.json({ success: result.deletedCount > 0 });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

