import { NextResponse, type NextRequest } from "next/server";

// Sin cookie de sesión, a /login. Solo mira que exista: quien decide si vale es la API
export function proxy(request: NextRequest) {
  if (request.cookies.has("session")) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/mis-solicitudes"],
};
