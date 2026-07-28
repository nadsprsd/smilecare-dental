// app/api/blog/route.ts
import { connectDB }    from "@/lib/mongodb";
import { generateSlug } from "@/lib/blog";
import { cookies }      from "next/headers";
import { NextRequest }  from "next/server";

// Auth check helper
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session     = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}

// GET — fetch all posts (public gets published only, admin gets all)
export async function GET(req: NextRequest) {
  try {
    const db        = await connectDB();
    const isAdmin   = await isAuthenticated();
    const query     = isAdmin ? {} : { status: "published" };

    const posts = await db
      .collection("posts")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      posts:   posts.map(p => ({ ...p, _id: p._id.toString() })),
    });
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

// POST — create new post (admin only)
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return Response.json({ success: false, message: "Unauthorised" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      title, excerpt, content, category,
      seoTitle, seoDescription, featuredImage, status,
    } = body;

    if (!title || !content) {
      return Response.json({ success: false, message: "Title and content are required" }, { status: 400 });
    }

    const db   = await connectDB();
    const slug = generateSlug(title);

    // Check slug is unique — append timestamp if duplicate
    const existing = await db.collection("posts").findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const now = new Date().toISOString();

    const result = await db.collection("posts").insertOne({
      title:          title.trim(),
      slug:           finalSlug,
      excerpt:        excerpt?.trim() || "",
      content:        content.trim(),
      category:       category || "Oral Health",
      seoTitle:       seoTitle?.trim()       || title.trim(),
      seoDescription: seoDescription?.trim() || excerpt?.trim() || "",
      featuredImage:  featuredImage?.trim()  || "",
      status:         status || "draft",
      createdAt:      now,
      updatedAt:      now,
    });

    return Response.json({
      success: true,
      id:      result.insertedId.toString(),
      slug:    finalSlug,
    });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

