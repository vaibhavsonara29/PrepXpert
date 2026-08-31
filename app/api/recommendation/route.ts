import { NextResponse } from "next/server";

type RecommendationResponse = {
  overallAssessment: string;
  strengths: string[];
  weakAreas: {
    area: string;
    score: number;
    priority: "High" | "Medium" | "Low";
    reason: string;
  }[];
  recommendedActions: {
    title: string;
    description: string;
    module: "aptitude" | "coding" | "interview" | "resume";
  }[];
  sevenDayPlan: {
    day: string;
    task: string;
  }[];
  careerAdvice: string;
};

function cleanJson(text: string) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message:
            "GEMINI_API_KEY is missing in .env.local",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const aptitude = Math.min(
      100,
      Math.max(0, Number(body.aptitude) || 0)
    );

    const coding = Math.min(
      100,
      Math.max(0, Number(body.coding) || 0)
    );

    const interview = Math.min(
      100,
      Math.max(0, Number(body.interview) || 0)
    );

    const resume = Math.min(
      100,
      Math.max(0, Number(body.resume) || 0)
    );

    const careerGoal =
      body.careerGoal || "Software Developer";

    const overallScore = Math.round(
      (aptitude + coding + interview + resume) / 4
    );

    const prompt = `
You are the AI Analyzer of a Smart Placement Preparation Portal called PrepXpert.

Analyze this student's placement preparation performance.

Aptitude: ${aptitude}%
Coding: ${coding}%
Interview: ${interview}%
Resume: ${resume}%

Career Goal: ${careerGoal}

Overall Score: ${overallScore}%

Identify:
- strongest areas
- weakest areas
- priority areas
- practical actions
- a realistic 7-day preparation plan
- career advice according to the career goal

Important rules:
1. Do not invent scores.
2. Scores below 50 should normally be treated as High priority.
3. Scores from 50 to 69 should normally be Medium priority.
4. Scores 70 or above should normally be Low priority.
5. Recommendations must be practical for a B.Tech CSE student.
6. Connect recommendations to Aptitude, Coding, Interview or Resume.
7. Return ONLY valid JSON.
8. Do not use markdown.
9. Do not put JSON inside code fences.

Return exactly this structure:

{
  "overallAssessment": "short assessment",
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "weakAreas": [
    {
      "area": "Coding",
      "score": 45,
      "priority": "High",
      "reason": "short reason"
    }
  ],
  "recommendedActions": [
    {
      "title": "Practice DSA",
      "description": "short practical action",
      "module": "coding"
    }
  ],
  "sevenDayPlan": [
    {
      "day": "Day 1",
      "task": "task"
    }
  ],
  "careerAdvice": "short career advice"
}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("GEMINI API ERROR:", data);

      return NextResponse.json(
        {
          success: false,
          message:
            data?.error?.message ||
            "Gemini API request failed",
        },
        { status: response.status }
      );
    }

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        {
          success: false,
          message: "Gemini returned an empty response",
        },
        { status: 500 }
      );
    }

    let aiResult: RecommendationResponse;

    try {
      aiResult = JSON.parse(cleanJson(rawText));
    } catch (error) {
      console.error("AI JSON PARSE ERROR:", error);
      console.error("RAW AI RESPONSE:", rawText);

      return NextResponse.json(
        {
          success: false,
          message:
            "AI returned an invalid recommendation format.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      overallScore,
      recommendation: aiResult,
    });
  } catch (error) {
    console.error(
      "RECOMMENDATION API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to generate AI recommendation.",
      },
      { status: 500 }
    );
  }
}