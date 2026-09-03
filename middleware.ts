import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  const user = await verifyToken(token);

  if (!user) {
    const response = NextResponse.redirect(
      new URL("/auth/login", request.url)
    );

    response.cookies.delete("auth_token");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/coding/:path*",
    "/aptitude/:path*",
    "/interview/:path*",
    "/performance/:path*",
    "/recommendations/:path*",
    "/resume/:path*",
    "/exams/:path*",
    "/history/:path*",
  ],
};