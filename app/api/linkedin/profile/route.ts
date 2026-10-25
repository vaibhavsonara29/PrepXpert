import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import LinkedInProfile from "../../../../models/LinkedInProfile";

export async function GET(request: NextRequest) {
  try {
    // Check Smart Placement Preparation Portal login session
    const authToken =
      request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    const user = await verifyToken(authToken);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Session expired. Please login again.",
        },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find the LinkedIn profile belonging to this user
    const profile =
      await LinkedInProfile.findOne({
        userId: user.id,
      }).lean();

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          connected: false,
          message:
            "LinkedIn profile is not connected.",
        },
        { status: 404 }
      );
    }

    // Never send accessToken to the browser.
    return NextResponse.json({
      success: true,
      connected: true,
      profile: {
        name: profile.name || "",
        givenName: profile.givenName || "",
        familyName: profile.familyName || "",
        email: profile.email || "",
        picture: profile.picture || "",
        locale: profile.locale || "",
      },
    });
  } catch (error) {
    console.error(
      "LINKEDIN PROFILE API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load LinkedIn profile.",
      },
      { status: 500 }
    );
  }
}
