import { connectDB }                  from "@/lib/mongodb";
import { generateRegistrationNumber }  from "@/lib/patients";
import { patientSchema }               from "@/lib/validation";
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
    const rawSearch = searchParams.get("search") || "";
    // Escape regex metacharacters so a search like "john.doe@gmail.com" matches
    // literally, and so a crafted string can't be used to build a slow regex.
    const search = rawSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
    let body: any;
    try {
      body = await req.json();
    } catch {
      return Response.json({ success: false, message: "Malformed JSON" }, { status: 400 });
    }

    const parsed = patientSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, message: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const db   = await connectDB();
    const regNo = await generateRegistrationNumber("VCC");
    const now   = new Date().toISOString();

    const result = await db.collection("patients").insertOne({
      registrationNumber: regNo,
      name:            data.name,
      phone:           data.phone.trim(),
      email:           data.email?.trim()          || "",
      sex:             data.sex                    || "Male",
      dateOfBirth:     body.dateOfBirth            || "",
      age:             data.age                    || 0,
      address:         data.address                || "",
      source:          data.source                 || "Walk-in",
      medicalHistory:  data.medicalHistory          || "",
      dentalHistory:   data.dentalHistory           || "",
      allergies:       data.allergies               || "",
      alerts:          Array.isArray(body.alerts) ? body.alerts : [],
      treatments:      [],
      xrays:           [],
      invoices:        [],
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

