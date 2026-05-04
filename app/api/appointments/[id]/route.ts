import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status } = await req.json();
    const db = await connectDB();

    console.log("ID received:", id);
    console.log("Status:", status);

    const result = await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);

    return Response.json({
      success:  result.modifiedCount > 0,
      matched:  result.matchedCount,
      modified: result.modifiedCount,
    });

  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}