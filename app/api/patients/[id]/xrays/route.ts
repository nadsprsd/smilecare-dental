import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";
import { getISTDateString, } from "@/lib/constants";
import { isAllowedImageUrl, normalizeImageUrl } from "@/lib/validation";

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

    let body: any;
    try {
      body = await req.json();
    } catch {
      return Response.json({ success: false, message: "Malformed JSON" }, { status: 400 });
    }

    const rawUrl = (body.url || "").trim();
    if (!rawUrl) {
      return Response.json({ success: false, message: "Image URL is required" }, { status: 400 });
    }
    const url = normalizeImageUrl(rawUrl);
    if (!isAllowedImageUrl(url)) {
      return Response.json(
        { success: false, message: "Only Google Drive, Google Photos, or Imgur links are allowed" },
        { status: 400 }
      );
    }

    const db     = await connectDB();

    const xray = {
      _id:   new ObjectId().toString(),
      url,
      date:  body.date  || getISTDateString(),
      type:  body.type  || "X-Ray",
      notes: (body.notes || "").slice(0, 500),
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

