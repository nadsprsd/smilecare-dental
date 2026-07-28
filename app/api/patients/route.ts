import { connectDB }                  from "@/lib/mongodb";
import { generateRegistrationNumber }  from "@/lib/patients";
import { cookies }                     from "next/headers";
import { NextRequest }                 from "next/server";

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

// GET — all patients with optional search
export async function GET(req: NextRequest) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const db    = await connectDB();
    const query = search
      ? {
          $or: [
            { name:               { $regex: search, $options: "i" } },
            { phone:              { $regex: search, $options: "i" } },
            { registrationNumber: { $regex: search, $options: "i" } },
            { email:              { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const patients = await db
      .collection("patients")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success:  true,
      patients: patients.map(p => ({ ...p, _id: p._id.toString() })),
    });
  } catch (error) {
    console.error("GET /api/patients:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

// POST — create new patient
export async function POST(req: NextRequest) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });

  try {
    const body = await req.json();

    if (!body.name || !body.phone) {
      return Response.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    const db   = await connectDB();
    const regNo = await generateRegistrationNumber("VCC");
    const now   = new Date().toISOString();

    const result = await db.collection("patients").insertOne({
      registrationNumber: regNo,
      name:            body.name?.trim()          || "",
      phone:           body.phone?.trim()         || "",
      email:           body.email?.trim()         || "",
      sex:             body.sex                   || "Male",
      dateOfBirth:     body.dateOfBirth           || "",
      age:             Number(body.age)           || 0,
      address:         body.address?.trim()       || "",
      source:          body.source               || "Walk-in",
      medicalHistory:  body.medicalHistory?.trim()|| "",
      dentalHistory:   body.dentalHistory?.trim() || "",
      allergies:       body.allergies?.trim()     || "",
      alerts:          body.alerts               || [],
      treatments:      [],
      xrays:           [],
      createdAt:       now,
      updatedAt:       now,
    });

    return Response.json({
      success: true,
      id:      result.insertedId.toString(),
      regNo,
    });
  } catch (error) {
    console.error("POST /api/patients:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

