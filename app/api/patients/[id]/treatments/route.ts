import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

// POST — add new treatment to patient
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id } = await context.params;
    const body   = await req.json();
    const db     = await connectDB();

    const treatment = {
      _id:             new ObjectId().toString(),
      date:            body.date            || new Date().toISOString().split("T")[0],
      treatment:       body.treatment       || "",
      doctor:          body.doctor          || "",
      notes:           body.notes           || "",
      estimatedAmount: Number(body.estimatedAmount) || 0,
      paidAmount:      Number(body.paidAmount)      || 0,
      status:          body.status          || "planned",
      diagnosis:       body.diagnosis       || "",
      labDetails:      body.labDetails      || "",
      prescriptions:   Array.isArray(body.prescriptions) ? body.prescriptions : [],
    };

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      {
        $push:  { treatments: treatment } as any,
        $set:   { updatedAt: new Date().toISOString() },
      }
    );

    return Response.json({ success: result.modifiedCount > 0, treatment });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

// PATCH — update existing treatment status/notes
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id }       = await context.params;
    const body         = await req.json();
    const { treatmentId, ...updates } = body;
    const db           = await connectDB();

    const setObj: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    for (const [k, v] of Object.entries(updates)) {
      setObj[`treatments.$[t].${k}`] = v;
    }

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      { $set: setObj },
      { arrayFilters: [{ "t._id": treatmentId }] }
    );

    return Response.json({ success: result.modifiedCount > 0 });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

