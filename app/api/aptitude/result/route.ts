import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import AptitudeResult from "../../../../models/AptitudeResult";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      userEmail,
      score,
      total,
      percentage,
      category,
    } = body;

    if (
      !userEmail ||
      typeof score !== "number" ||
      typeof total !== "number" ||
      typeof percentage !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid aptitude result data.",
        },
        { status: 400 }
      );
    }

    const result = await AptitudeResult.create({
      userEmail,
      score,
      total,
      percentage,
      category: category || "Aptitude",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Aptitude result saved successfully.",
        result: {
          id: result._id,
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