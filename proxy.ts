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

  // Rate limiting — different limits per endpoint since login brute-force
  // attempts need a much stricter window than normal booking traffic.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rateLimitRules: { match: () => boolean; limit: number; windowMs: number; key: string }[] = [
    {
      match: () => pathname === "/api/admin/login" && request.method === "POST",
      limit: 5, windowMs: 15 * 60 * 1000, key: "login",
    },
    {
      match: () => pathname === "/api/appointments" && request.method === "POST",
      limit: 5, windowMs: 60 * 1000, key: "appointments",
    },
    {
      match: () => pathname === "/api/bookings" && request.method === "POST",
      limit: 5, windowMs: 60 * 1000, key: "bookings",
    },
  ];

  for (const rule of rateLimitRules) {
    if (!rule.match()) continue;
    const { allowed, remaining } = getRateLimitResult(`${rule.key}:${ip}`, rule.limit, rule.windowMs);

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Too many requests. Please wait before trying again.",
        }),
        {
          status:  429,
          headers: {
            "Content-Type":          "application/json",
            "Retry-After":           String(Math.round(rule.windowMs / 1000)),
            "X-RateLimit-Limit":     String(rule.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    response.headers.set("X-RateLimit-Limit",     String(rule.limit));
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