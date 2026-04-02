import { NextRequest, NextResponse } from "next/server";

function buildContentSecurityPolicy(nonce: string, isDev: boolean, apiOrigin: string): string {
  const wsOrigin = apiOrigin.replace(/^http/, "ws");

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://placehold.co https://res.cloudinary.com",
    "font-src 'self' data:",
    "script-src 'self' 'nonce-" + nonce + "' 'strict-dynamic'" + (isDev ? " 'unsafe-eval'" : ""),
    "style-src 'self' 'unsafe-inline'",
    `connect-src 'self' ${apiOrigin} ${wsOrigin}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "script-src-attr 'none'",
  ].join("; ");
}

export function proxy(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const apiOrigin = new URL(apiUrl).origin;
  const isDev = process.env.NODE_ENV === "development";
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce, isDev, apiOrigin);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", contentSecurityPolicy);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
