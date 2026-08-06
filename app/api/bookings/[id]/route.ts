import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

// PATCH — confirm or cancel a booking. Cancelling frees the slot (the
// unique index only blocks non-cancelled bookings), so someone else can
// book that exact time the moment this is cancelled.
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id } = await context.params;
    const body   = await req.json();
    if (!["confirmed", "cancelled"].includes(body.confirmationStatus)) {
      return Response.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const db = await connectDB();
    const result = await db.collection("bookings").updateOne(
      { _id: id } as any,
      {
        $set: {
          confirmationStatus: body.confirmationStatus,
          // isActive=false is what actually releases the slot from the
          // unique index's partial filter — confirmationStatus alone
          // doesn't affect the index, this field does.
          isActive: body.confirmationStatus !== "cancelled",
        },
      }
    );

    return Response.json({ success: result.modifiedCount > 0 });
  } catch (err) {
    console.error("PATCH /api/bookings/[id] failed:", err);
    return Response.json({ success: false }, { status: 500 });
  }
}
