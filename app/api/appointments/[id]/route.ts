import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { status } = await request.json();
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