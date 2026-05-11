import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitResult(ip: string, limit: number, windowMs: number) {
  const now    = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

export function proxy(request: NextRequest) {   // ← changed from middleware
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // security headers...
  response.headers.set("X-Content-Type-Options",  "nosniff");
  response.headers.set("X-Frame-Options",          "DENY");
  response.headers.set("X-XSS-Protection",         "1; mode=block");
  response.headers.set("Referrer-Policy",          "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy",       "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // rate limit POST /api/appointments
  if (pathname === "/api/appointments" && request.method === "POST") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { allowed, remaining } = getRateLimitResult(ip, 5, 60 * 1000);

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Too many requests. Please wait a minute before trying again.",
        }),
        {
          status:  429,
          headers: {
            "Content-Type":          "application/json",
            "Retry-After":           "60",
            "X-RateLimit-Limit":     "5",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    response.headers.set("X-RateLimit-Limit",     "5");
    response.headers.set("X-RateLimit-Remaining", String(remaining));
  }

  // block suspicious user agents
  if (pathname.startsWith("/api/")) {
    const ua = request.headers.get("user-agent") || "";
    const suspicious = ["sqlmap", "nikto", "nmap", "masscan", "python-requests"];
    if (suspicious.some(s => ua.toLowerCase().includes(s))) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};