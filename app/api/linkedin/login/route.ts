import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        success: false,
        message: "LinkedIn environment variables are missing.",
      },
      { status: 500 }
    );
  }

  // Random state for OAuth security
  const state = crypto.randomBytes(32).toString("hex");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,

    // OpenID Connect scopes
    scope: "openid profile email",

    state,
  });

  const linkedinUrl =
    `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;

  const response = NextResponse.redirect(linkedinUrl);

  // Store OAuth state temporarily
  response.cookies.set("linkedin_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  return response;
}