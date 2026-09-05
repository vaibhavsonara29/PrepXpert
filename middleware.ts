import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get("auth_token")?.value;

  const pathname = request.nextUrl.pathname;

  // -----------------------------------------
  // AUTH PAGES
  // If user is already logged in, don't show
  // Login/Register page again.
  // -----------------------------------------

  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register";

  if (isAuthPage) {
    // No token → user is not logged in,
    // allow login/register page.
    if (!token) {
      return NextResponse.next();
    }

    // Token exists → verify it.
    const user = await verifyToken(token);

    // Valid token → user is already logged in.
    // Send directly to dashboard.
    if (user) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    // Invalid/expired token → remove it
    // and allow login page.
    const response = NextResponse.next();

    response.cookies.delete("auth_token");

    return response;
  }

  // -----------------------------------------
  // PROTECTED PAGES
  // -----------------------------------------

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  // -----------------------------------------
  // VERIFY LOGIN SESSION
  // -----------------------------------------

  const user = await verifyToken(token);

  if (!user) {
    const response = NextResponse.redirect(
      new URL("/auth/login", request.url)
    );

    // Remove expired/invalid token
    response.cookies.delete("auth_token");

    return response;
  }

  // -----------------------------------------
  // USER IS LOGGED IN
  // -----------------------------------------

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/login",
    "/auth/register",

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