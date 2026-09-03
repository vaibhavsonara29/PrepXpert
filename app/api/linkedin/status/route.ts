import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import LinkedInProfile from "../../../../models/LinkedInProfile";

export async function GET(
  request: NextRequest
) {
  try {
    const token =
      request.cookies.get(
        "auth_token"
      )?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: true,
          connected: false,
        }
      );
    }

    const user =
      await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          connected: false,
        }
      );
    }

    await connectDB();

    const profile =
      await LinkedInProfile.findOne({
        userId: user.id,
      }).lean();

    if (!profile) {
      return NextResponse.json({
        success: true,
        connected: false,
      });
    }

    return NextResponse.json({
      success: true,
      connected: true,
      profile: {
        name: profile.name,
        picture:
          profile.picture || "",
        email:
          profile.email || "",
        linkedinId:
          profile.linkedinId,
      },
    });
  } catch (error) {
    console.error(
      "LINKEDIN STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        connected: false,
        message:
          "Unable to check LinkedIn status.",
      },
      { status: 500 }
    );
  }
}