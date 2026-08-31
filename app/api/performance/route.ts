import { NextResponse } from "next/server";

type PerformanceData = {
  aptitude: number;
  coding: number;
  interview: number;
  resume: number;
};

// Temporary shared data.
// Later we will connect this to MongoDB.
let performance: PerformanceData = {
  aptitude: 0,
  coding: 0,
  interview: 0,
  resume: 0,
};

function calculateOverall(data: PerformanceData) {
  return Math.round(
    (data.aptitude +
      data.coding +
      data.interview +
      data.resume) /
      4
  );
}

// GET /api/performance
export async function GET() {
  try {
    const overall = calculateOverall(performance);

    return NextResponse.json({
      success: true,
      performance,
      overall,
    });
  } catch (error) {
    console.error("PERFORMANCE GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load performance",
      },
      { status: 500 }
    );
  }
}

// POST /api/performance
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.aptitude === "number") {
      performance.aptitude = Math.max(
        0,
        Math.min(100, body.aptitude)
      );
    }

    if (typeof body.coding === "number") {
      performance.coding = Math.max(
        0,
        Math.min(100, body.coding)
      );
    }

    if (typeof body.interview === "number") {
      performance.interview = Math.max(
        0,
        Math.min(100, body.interview)
      );
    }

    if (typeof body.resume === "number") {
      performance.resume = Math.max(
        0,
        Math.min(100, body.resume)
      );
    }

    const overall = calculateOverall(performance);

    return NextResponse.json({
      success: true,
      message: "Performance updated successfully",
      performance,
      overall,
    });
  } catch (error) {
    console.error("PERFORMANCE POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update performance",
      },
      { status: 500 }
    );
  }
}