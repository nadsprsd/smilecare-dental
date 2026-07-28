import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { NextRequest } from "next/server";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session     = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return Response.json({ success: false }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    const db     = await connectDB();
    const doc    = await db.collection("posts").findOne({ _id: new ObjectId(id) });
    if (!doc) return Response.json({ success: false }, { status: 404 });
    return Response.json({ success: true, post: { ...doc, _id: doc._id.toString() } });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return Response.json({ success: false }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    const body   = await req.json();
    const db     = await connectDB();
    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    const allowed = ["title","excerpt","content","category","seoTitle","seoDescription","featuredImage","status"];
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
    }
    const result = await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return Response.json({ success: result.modifiedCount > 0 });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return Response.json({ success: false }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    const db     = await connectDB();
    const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
    return Response.json({ success: result.deletedCount > 0 });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

