import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";

async function isAuth(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_session")?.value === "authenticated";
}

// POST — log a generated invoice to the patient's permanent history
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuth())) return Response.json({ success: false }, { status: 401 });
  try {
    const { id } = await context.params;
    const body   = await req.json();
    const db     = await connectDB();

    const invoice = {
      _id:            new ObjectId().toString(),
      invoiceNo:      body.invoiceNo      || "",
      mode:           body.mode           || "single",
      treatmentIds:   Array.isArray(body.treatmentIds) ? body.treatmentIds : [],
      totalEstimated: Number(body.totalEstimated) || 0,
      totalPaid:      Number(body.totalPaid)      || 0,
      totalBalance:   Number(body.totalBalance)   || 0,
      sentVia:        body.sentVia        || "print",
      createdAt:      new Date().toISOString(),
    };

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { invoices: invoice } as any,
        $set:  { updatedAt: new Date().toISOString() },
      }
    );

    return Response.json({ success: result.modifiedCount > 0, invoice });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}
