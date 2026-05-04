import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const correctUser = process.env.ADMIN_USERNAME;
    const correctPass = process.env.ADMIN_PASSWORD;

    if (!correctUser || !correctPass) {
      return Response.json(
        { success: false, message: "Admin credentials not configured in .env.local" },
        { status: 500 }
      );
    }

    if (username === correctUser && password === correctPass) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure:   process.env.NODE_ENV === "production",
        maxAge:   60 * 60 * 24, // 24 hours
        path:     "/",
        sameSite: "lax",
      });
      return Response.json({ success: true });
    }

    return Response.json({ success: false }, { status: 401 });

  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

