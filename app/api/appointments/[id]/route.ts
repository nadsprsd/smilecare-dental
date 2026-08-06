import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

const VALID_STATUSES = ["pending", "confirmed", "cancelled"];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const params = await context.params;
    const { status } = await request.json();

    if (!VALID_STATUSES.includes(status)) {
      return Response.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const db = await connectDB();

    const result = await db.collection("appointments").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return Response.json({
      success:  result.modifiedCount > 0,
      matched:  result.matchedCount,
      modified: result.modifiedCount,
    });

  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}