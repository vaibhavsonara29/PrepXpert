import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "../../../lib/auth";
import { connectDB } from "../../../lib/mongodb";
import AptitudeResult from "../../../models/AptitudeResult";
import LinkedInProfile from "../../../models/LinkedInProfile";

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
    module:
      | "aptitude"
      | "coding"
      | "interview"
      | "resume";
  }[];

  sevenDayPlan: {
    day: string;
    task: string;
  }[];

  careerAdvice: string;
};

type ResumeContext = {
  profile?: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    summary?: string;
  };

  skills?: string[];

  experience?: {
    company?: string;
    role?: string;
    duration?: string;
    description?: string;
  }[];

  education?: {
    degree?: string;
    institute?: string;
    duration?: string;
    score?: string;
  }[];

  projects?: {
    name?: string;
    tech?: string;
    description?: string;
    link?: string;
  }[];
};

function cleanJson(text: string) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function getPriority(
  score: number
): "High" | "Medium" | "Low" {
  if (score < 50) return "High";
  if (score < 70) return "Medium";
  return "Low";
}

function safeText(
  value: unknown,
  maxLength = 1000
) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function safeStringArray(
  value: unknown,
  maxItems = 30
) {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

export async function POST(req: NextRequest) {
  try {
    // -----------------------------------------
    // 1. CHECK LOGIN TOKEN
    // -----------------------------------------

    const token =
      req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      const response =
        NextResponse.json(
          {
            success: false,
            message:
              "Session expired. Please login again.",
          },
          { status: 401 }
        );

      response.cookies.delete("auth_token");

      return response;
    }

    // -----------------------------------------
    // 2. USER EMAIL
    // -----------------------------------------

    const userEmail =
      user.email?.toLowerCase();

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User email not found in session.",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // 3. READ OPTIONAL RESUME CONTEXT
    // -----------------------------------------

    let body: {
      resume?: ResumeContext | null;
    } = {};

    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const resume = body.resume || null;

    // -----------------------------------------
    // 4. CONNECT MONGODB
    // -----------------------------------------

    await connectDB();

    // -----------------------------------------
    // 5. GET LATEST APTITUDE RESULT
    // -----------------------------------------

    const latestResult =
      await AptitudeResult.findOne({
        userEmail,
      }).sort({
        createdAt: -1,
      });

    if (!latestResult) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No aptitude result found. Please complete the aptitude test first.",
        },
        { status: 404 }
      );
    }

    const aptitude = Math.min(
      100,
      Math.max(
        0,
        Number(
          latestResult.percentage
        ) || 0
      )
    );

    const aptitudeScore =
      Number(latestResult.score) || 0;

    const aptitudeTotal =
      Number(latestResult.total) || 0;

    // -----------------------------------------
    // 6. GET LINKEDIN PROFILE
    // -----------------------------------------

    const linkedinProfile =
      await LinkedInProfile.findOne({
        userId: user.id,
      }).lean();

    const linkedinConnected =
      Boolean(linkedinProfile);

    const linkedinName = safeText(
      linkedinProfile?.name
    );

    const linkedinEmail = safeText(
      linkedinProfile?.email
    );

    const linkedinLocale = safeText(
      linkedinProfile?.locale
    );

    // -----------------------------------------
    // 7. PREPARE RESUME CONTEXT
    // -----------------------------------------

    const resumeProfile =
      resume?.profile || {};

    const resumeName = safeText(
      resumeProfile.name
    );

    const resumeRole = safeText(
      resumeProfile.role
    );

    const resumeSummary = safeText(
      resumeProfile.summary,
      1500
    );

    const resumeSkills =
      safeStringArray(
        resume?.skills,
        20
      );

    const resumeProjects =
      Array.isArray(
        resume?.projects
      )
        ? resume.projects
            .slice(0, 8)
            .map((project) => ({
              name: safeText(
                project?.name,
                200
              ),
              tech: safeText(
                project?.tech,
                300
              ),
              description: safeText(
                project?.description,
                700
              ),
            }))
            .filter(
              (project) =>
                project.name ||
                project.tech ||
                project.description
            )
        : [];

    const resumeExperience =
      Array.isArray(
        resume?.experience
      )
        ? resume.experience
            .slice(0, 5)
            .map((item) => ({
              company: safeText(
                item?.company,
                200
              ),
              role: safeText(
                item?.role,
                200
              ),
              description: safeText(
                item?.description,
                700
              ),
            }))
            .filter(
              (item) =>
                item.company ||
                item.role ||
                item.description
            )
        : [];

    const resumeEducation =
      Array.isArray(
        resume?.education
      )
        ? resume.education
            .slice(0, 5)
            .map((item) => ({
              degree: safeText(
                item?.degree,
                200
              ),
              institute: safeText(
                item?.institute,
                250
              ),
              score: safeText(
                item?.score,
                100
              ),
            }))
            .filter(
              (item) =>
                item.degree ||
                item.institute ||
                item.score
            )
        : [];

    // -----------------------------------------
    // 8. GEMINI API KEY
    // -----------------------------------------

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message:
            "GEMINI_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 9. BUILD PERSONALIZED AI PROMPT
    // -----------------------------------------

    const linkedinContext =
      linkedinConnected
        ? `
LinkedIn connection status:
Connected

LinkedIn name:
${linkedinName || "Not available"}

LinkedIn email:
${linkedinEmail || "Not available"}

LinkedIn locale:
${linkedinLocale || "Not available"}
`
        : `
LinkedIn connection status:
Not connected

Do not claim that the student has a LinkedIn profile connected.
`;

    const resumeContext = `
Resume Builder data available:
${resume ? "Yes" : "No"}

Resume name:
${resumeName || "Not available"}

Resume professional role:
${resumeRole || "Not available"}

Resume summary:
${resumeSummary || "Not available"}

Resume skills:
${
  resumeSkills.length
    ? resumeSkills.join(", ")
    : "Not available"
}

Resume projects:
${
  resumeProjects.length
    ? JSON.stringify(
        resumeProjects
      )
    : "Not available"
}

Resume experience:
${
  resumeExperience.length
    ? JSON.stringify(
        resumeExperience
      )
    : "Not available"
}

Resume education:
${
  resumeEducation.length
    ? JSON.stringify(
        resumeEducation
      )
    : "Not available"
}
`;

    const prompt = `
You are the AI Recommendation Engine of PrepXpert,
a Smart Placement Preparation Portal for B.Tech CSE students.

Create a personalized placement recommendation using ONLY
the verified aptitude result plus the available LinkedIn
profile and Resume Builder context below.

Student Email:
${userEmail}

Latest Verified Aptitude Score:
${aptitudeScore} / ${aptitudeTotal}

Aptitude Percentage:
${aptitude}%

Aptitude Priority:
${getPriority(aptitude)}

${linkedinContext}

${resumeContext}

Important data rules:

1. The aptitude result is the ONLY verified performance score
   currently available from the database.
2. Do NOT invent coding, interview, or resume scores.
3. Do NOT say the student completed coding or interview tests
   unless such verified data is explicitly provided.
4. LinkedIn data is profile context, not a performance score.
5. Resume skills/projects/experience are profile context,
   not performance scores.
6. If LinkedIn is connected, personalize career advice using
   the available LinkedIn name/profile context.
7. If Resume Builder skills or projects are available,
   connect recommendations to those actual skills/projects.
8. Never invent skills, projects, companies, education,
   job experience, or achievements.
9. The student's current career goal can be inferred only when
   a professional role is present in the saved Resume Builder
   profile. Otherwise give broad B.Tech CSE placement advice.
10. Keep language simple and student-friendly.
11. Recommendations must be practical and actionable.
12. Prioritize Aptitude according to:
    - Below 50 = High
    - 50 to 69 = Medium
    - 70 or above = Low
13. Mention LinkedIn/Resume context naturally when useful.
14. Do not expose access tokens or private credentials.
15. Return ONLY valid JSON.
16. Do not use markdown.
17. Do not use code fences.

Your response must contain:

- overall assessment
- strengths
- weak areas
- practical recommended actions
- a realistic 7-day plan
- career advice

For weakAreas, use the verified aptitude percentage
for the Aptitude item. Other areas may be discussed as
recommendation areas, but do not assign invented scores.

Return exactly this structure:

{
  "overallAssessment": "short personalized assessment",
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "weakAreas": [
    {
      "area": "Aptitude",
      "score": ${aptitude},
      "priority": "${getPriority(aptitude)}",
      "reason": "short reason based on the verified aptitude result"
    }
  ],
  "recommendedActions": [
    {
      "title": "Practice Aptitude",
      "description": "short practical action",
      "module": "aptitude"
    },
    {
      "title": "Practice DSA",
      "description": "short practical coding action",
      "module": "coding"
    },
    {
      "title": "Prepare Interview Questions",
      "description": "short practical interview action",
      "module": "interview"
    },
    {
      "title": "Improve Resume",
      "description": "short practical resume action using available profile data",
      "module": "resume"
    }
  ],
  "sevenDayPlan": [
    {
      "day": "Day 1",
      "task": "task"
    },
    {
      "day": "Day 2",
      "task": "task"
    },
    {
      "day": "Day 3",
      "task": "task"
    },
    {
      "day": "Day 4",
      "task": "task"
    },
    {
      "day": "Day 5",
      "task": "task"
    },
    {
      "day": "Day 6",
      "task": "task"
    },
    {
      "day": "Day 7",
      "task": "task"
    }
  ],
  "careerAdvice": "short personalized career advice"
}
`;

    // -----------------------------------------
    // 10. CALL GEMINI
    // -----------------------------------------

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "x-goog-api-key":
            apiKey,
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
            responseMimeType:
              "application/json",
          },
        }),
      }
    );

    const data =
      await response.json();

    // -----------------------------------------
    // 11. GEMINI ERROR
    // -----------------------------------------

    if (!response.ok) {
      console.error(
        "GEMINI API ERROR:",
        data
      );

      return NextResponse.json(
        {
          success: false,
          message:
            data?.error?.message ||
            "Gemini API request failed.",
        },
        {
          status:
            response.status,
        }
      );
    }

    // -----------------------------------------
    // 12. GET AI RESPONSE
    // -----------------------------------------

    const rawText =
      data?.candidates?.[0]
        ?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gemini returned an empty response.",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 13. PARSE JSON
    // -----------------------------------------

    let recommendation:
      RecommendationResponse;

    try {
      recommendation =
        JSON.parse(
          cleanJson(rawText)
        );
    } catch (error) {
      console.error(
        "AI JSON PARSE ERROR:",
        error
      );

      console.error(
        "RAW AI RESPONSE:",
        rawText
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "AI returned an invalid recommendation format.",
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 14. RETURN PERSONALIZED RESULT
    // -----------------------------------------

    return NextResponse.json({
      success: true,

      user: {
        email: userEmail,
      },

      linkedin: {
        connected:
          linkedinConnected,

        name:
          linkedinName,
      },

      profileContext: {
        resumeAvailable:
          Boolean(resume),

        resumeSkills:
          resumeSkills,

        resumeRole:
          resumeRole,
      },

      performance: {
        aptitude: {
          score:
            aptitudeScore,

          total:
            aptitudeTotal,

          percentage:
            aptitude,

          priority:
            getPriority(
              aptitude
            ),
        },
      },

      overallScore:
        aptitude,

      recommendation,
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
