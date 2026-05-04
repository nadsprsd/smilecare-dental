import { connectDB } from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function GET() {
  return new Response("SmileCare Appointments API");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.phone || !body.service || !body.date || !body.time) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    await db.collection("appointments").insertOne({
      name:      body.name,
      phone:     body.phone,
      service:   body.service,
      doctor:    body.doctor  || "No preference",
      date:      body.date,
      time:      body.time,
      notes:     body.notes   || "",
      status:    "pending",
      createdAt: new Date(),
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error("POST error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}