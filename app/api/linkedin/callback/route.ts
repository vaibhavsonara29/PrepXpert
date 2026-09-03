import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import LinkedInProfile from "../../../../models/LinkedInProfile";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    const linkedinError = searchParams.get("error");
    const errorDescription =
      searchParams.get("error_description");

    console.log("=================================");
    console.log("LINKEDIN CALLBACK STARTED");
    console.log("Has code:", Boolean(code));
    console.log("Has state:", Boolean(returnedState));
    console.log("LinkedIn error:", linkedinError);
    console.log("=================================");

    // -----------------------------------------
    // 1. LinkedIn authorization error
    // -----------------------------------------

    if (linkedinError) {
      console.error(
        "LINKEDIN AUTHORIZATION ERROR:",
        linkedinError,
        errorDescription
      );

      return redirectToDashboard(
        request,
        "cancelled",
        errorDescription || linkedinError
      );
    }

    // -----------------------------------------
    // 2. Check authorization code
    // -----------------------------------------

    if (!code) {
      throw new Error(
        "LinkedIn authorization code is missing."
      );
    }

    // -----------------------------------------
    // 3. Check OAuth state
    // -----------------------------------------

    if (!returnedState) {
      throw new Error(
        "LinkedIn OAuth state is missing."
      );
    }

    const savedState =
      request.cookies.get(
        "linkedin_oauth_state"
      )?.value;

    console.log(
      "Saved state exists:",
      Boolean(savedState)
    );

    console.log(
      "State matches:",
      savedState === returnedState
    );

    if (!savedState) {
      throw new Error(
        "LinkedIn OAuth state cookie is missing."
      );
    }

    if (savedState !== returnedState) {
      throw new Error(
        "LinkedIn OAuth state mismatch."
      );
    }

    // -----------------------------------------
    // 4. Check PrepXpert login
    // -----------------------------------------

    const authToken =
      request.cookies.get(
        "auth_token"
      )?.value;

    console.log(
      "Auth token exists:",
      Boolean(authToken)
    );

    if (!authToken) {
      return NextResponse.redirect(
        new URL(
          "/auth/login?message=Please login first",
          request.url
        )
      );
    }

    const user =
      await verifyToken(authToken);

    console.log(
      "PrepXpert user verified:",
      Boolean(user)
    );

    if (!user) {
      return NextResponse.redirect(
        new URL(
          "/auth/login?message=Session expired",
          request.url
        )
      );
    }

    // -----------------------------------------
    // 5. LinkedIn environment variables
    // -----------------------------------------

    const clientId =
      process.env.LINKEDIN_CLIENT_ID;

    const clientSecret =
      process.env.LINKEDIN_CLIENT_SECRET;

    const redirectUri =
      process.env.LINKEDIN_REDIRECT_URI;

    console.log(
      "LinkedIn Client ID exists:",
      Boolean(clientId)
    );

    console.log(
      "LinkedIn Client Secret exists:",
      Boolean(clientSecret)
    );

    console.log(
      "LinkedIn Redirect URI:",
      redirectUri
    );

    if (
      !clientId ||
      !clientSecret ||
      !redirectUri
    ) {
      throw new Error(
        "LinkedIn environment variables are missing."
      );
    }

    // -----------------------------------------
    // 6. Exchange authorization code
    //    for access token
    // -----------------------------------------

    console.log(
      "Exchanging LinkedIn authorization code..."
    );

    const tokenResponse =
      await fetch(
        "https://www.linkedin.com/oauth/v2/accessToken",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body: new URLSearchParams({
            grant_type:
              "authorization_code",

            code,

            client_id:
              clientId,

            client_secret:
              clientSecret,

            redirect_uri:
              redirectUri,
          }).toString(),

          cache: "no-store",
        }
      );

    const tokenData =
      await tokenResponse.json();

    console.log(
      "LinkedIn token response status:",
      tokenResponse.status
    );

    if (!tokenResponse.ok) {
      console.error(
        "LINKEDIN TOKEN ERROR:",
        tokenData
      );

      throw new Error(
        tokenData?.error_description ||
          tokenData?.error ||
          "Failed to get LinkedIn access token."
      );
    }

    const accessToken =
      tokenData?.access_token;

    const expiresIn =
      Number(
        tokenData?.expires_in || 0
      );

    if (!accessToken) {
      throw new Error(
        "LinkedIn access token is missing."
      );
    }

    console.log(
      "LinkedIn access token received successfully."
    );

    // -----------------------------------------
    // 7. Get LinkedIn OIDC profile
    // -----------------------------------------

    console.log(
      "Requesting LinkedIn user profile..."
    );

    const profileResponse =
      await fetch(
        "https://api.linkedin.com/v2/userinfo",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,

            Accept:
              "application/json",
          },

          cache: "no-store",
        }
      );

    const profile =
      await profileResponse.json();

    console.log(
      "LinkedIn profile response status:",
      profileResponse.status
    );

    if (!profileResponse.ok) {
      console.error(
        "LINKEDIN PROFILE ERROR:",
        profile
      );

      throw new Error(
        profile?.message ||
          profile?.error ||
          "Failed to retrieve LinkedIn profile."
      );
    }

    console.log(
      "LinkedIn profile received:",
      {
        hasSub:
          Boolean(profile?.sub),

        hasName:
          Boolean(profile?.name),

        hasEmail:
          Boolean(profile?.email),

        locale:
          profile?.locale,
      }
    );

    if (!profile?.sub) {
      throw new Error(
        "LinkedIn profile ID is missing."
      );
    }

    // -----------------------------------------
    // 8. Connect MongoDB
    // -----------------------------------------

    console.log(
      "Connecting to MongoDB..."
    );

    await connectDB();

    console.log(
      "MongoDB connected."
    );

    // -----------------------------------------
    // 9. Prepare token expiry
    // -----------------------------------------

    const accessTokenExpiresAt =
      expiresIn > 0
        ? new Date(
            Date.now() +
              expiresIn * 1000
          )
        : undefined;

    // -----------------------------------------
    // 10. Convert LinkedIn locale
    //     OBJECT -> STRING
    // -----------------------------------------

    let locale = "";

    if (
      typeof profile?.locale ===
      "string"
    ) {
      locale = profile.locale;
    } else if (
      profile?.locale &&
      typeof profile.locale ===
        "object"
    ) {
      const country =
        typeof profile.locale.country ===
        "string"
          ? profile.locale.country
          : "";

      const language =
        typeof profile.locale.language ===
        "string"
          ? profile.locale.language
          : "";

      if (country && language) {
        locale =
          `${country}-${language}`;
      } else if (country) {
        locale = country;
      } else if (language) {
        locale = language;
      }
    }

    console.log(
      "FINAL LOCALE VALUE:",
      locale
    );

    console.log(
      "FINAL LOCALE TYPE:",
      typeof locale
    );

    // -----------------------------------------
    // 11. Prepare LinkedIn profile data
    // -----------------------------------------

    const profileData = {
      userId:
        user.id,

      linkedinId:
        String(profile.sub),

      name:
        profile.name ||
        `${profile.given_name || ""} ${
          profile.family_name || ""
        }`.trim() ||
        user.name,

      givenName:
        profile.given_name || "",

      familyName:
        profile.family_name || "",

      email:
        profile.email || "",

      emailVerified:
        Boolean(
          profile.email_verified
        ),

      picture:
        profile.picture || "",

      // IMPORTANT:
      // Always save locale as STRING
      locale: String(locale),

      accessToken,

      accessTokenExpiresAt,
    };

    console.log(
      "Saving LinkedIn profile for user:",
      user.id
    );

    // -----------------------------------------
    // 12. Save profile in MongoDB
    // -----------------------------------------

    const savedProfile =
      await LinkedInProfile.findOneAndUpdate(
        {
          userId:
            user.id,
        },

        profileData,

        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    if (!savedProfile) {
      throw new Error(
        "LinkedIn profile could not be saved."
      );
    }

    // -----------------------------------------
    // 13. SUCCESS
    // -----------------------------------------

    console.log(
      "================================="
    );

    console.log(
      "LINKEDIN CONNECTION SUCCESS"
    );

    console.log(
      "Profile name:",
      savedProfile.name
    );

    console.log(
      "LinkedIn ID saved:",
      Boolean(
        savedProfile.linkedinId
      )
    );

    console.log(
      "MongoDB document saved:",
      Boolean(
        savedProfile._id
      )
    );

    console.log(
      "================================="
    );

    // -----------------------------------------
    // 14. Redirect to Dashboard
    // -----------------------------------------

    const response =
      NextResponse.redirect(
        new URL(
          "/dashboard?linkedin=connected",
          request.url
        )
      );

    // Delete OAuth state cookie
    response.cookies.set(
      "linkedin_oauth_state",
      "",
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge: 0,
      }
    );

    return response;

  } catch (error) {
    // -----------------------------------------
    // ERROR
    // -----------------------------------------

    console.error(
      "================================="
    );

    console.error(
      "LINKEDIN CALLBACK FAILED"
    );

    console.error(
      "ERROR:",
      error
    );

    console.error(
      "================================="
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown LinkedIn callback error";

    return redirectToDashboard(
      request,
      "error",
      errorMessage
    );
  }
}

// -----------------------------------------
// Redirect helper
// -----------------------------------------

function redirectToDashboard(
  request: NextRequest,
  reason: string,
  message: string
) {
  const dashboardUrl =
    new URL(
      "/dashboard",
      request.url
    );

  dashboardUrl.searchParams.set(
    "linkedin",
    reason
  );

  dashboardUrl.searchParams.set(
    "reason",
    message
  );

  const response =
    NextResponse.redirect(
      dashboardUrl
    );

  response.cookies.set(
    "linkedin_oauth_state",
    "",
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",

      path: "/",

      maxAge: 0,
    }
  );

  return response;
}