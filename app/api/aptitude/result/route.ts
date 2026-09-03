import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/mongodb";
import AptitudeResult from "../../../../models/AptitudeResult";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to save your result.",
        },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const score = Number(body.score);
    const total = Number(body.total);
    const percentage = Number(body.percentage);

    const category =
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : "Aptitude";

    if (
      !Number.isFinite(score) ||
      !Number.isFinite(total) ||
      !Number.isFinite(percentage)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid aptitude result data.",
        },
        { status: 400 }
      );
    }

    if (total < 1 || score < 0 || score > total) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid score or total questions.",
        },
        { status: 400 }
      );
    }

    if (percentage < 0 || percentage > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid percentage.",
        },
        { status: 400 }
      );
    }

    const result = await AptitudeResult.create({
      userEmail: user.email,
      score,
      total,
      percentage,
      category,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Aptitude result saved successfully.",
        result: {
          id: result._id.toString(),
          userEmail: result.userEmail,
          score: result.score,
          total: result.total,
          percentage: result.percentage,
          category: result.category,
          createdAt: result.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("APTITUDE RESULT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save aptitude result.",
      },
      { status: 500 }
    );
  }
}