import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

// POST — add xray/image to patient
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id } = await context.params;
    const body   = await req.json();
    const db     = await connectDB();

    const xray = {
      _id:   new ObjectId().toString(),
      url:   body.url   || "",
      date:  body.date  || new Date().toISOString().split("T")[0],
      type:  body.type  || "X-Ray",
      notes: body.notes || "",
    };

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { xrays: xray } as any,
        $set:  { updatedAt: new Date().toISOString() },
      }
    );

    return Response.json({ success: result.modifiedCount > 0, xray });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

// DELETE — remove xray by its _id
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id }  = await context.params;
    const body    = await req.json();
    const db      = await connectDB();

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      {
        $pull:  { xrays: { _id: body.xrayId } } as any,
        $set:   { updatedAt: new Date().toISOString() },
      }
    );

    return Response.json({ success: result.modifiedCount > 0 });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

