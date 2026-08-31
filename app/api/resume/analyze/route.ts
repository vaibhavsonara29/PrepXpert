import { NextResponse } from "next/server";

type ResumeData = {
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

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "GEMINI_API_KEY is missing in .env.local",
        },
        { status: 500 }
      );
    }

    const body: ResumeData = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Resume data is required",
        },
        { status: 400 }
      );
    }

    const resumeText = `
PROFILE:
Name: ${body.profile?.name || "Not provided"}
Professional Title: ${body.profile?.role || "Not provided"}
Email: ${body.profile?.email || "Not provided"}
Phone: ${body.profile?.phone || "Not provided"}
Location: ${body.profile?.location || "Not provided"}
LinkedIn: ${body.profile?.linkedin || "Not provided"}
GitHub: ${body.profile?.github || "Not provided"}
Portfolio: ${body.profile?.website || "Not provided"}
Summary: ${body.profile?.summary || "Not provided"}

SKILLS:
${body.skills?.length ? body.skills.join(", ") : "No skills provided"}

EXPERIENCE:
${
  body.experience?.length
    ? body.experience
        .map(
          (item, index) => `
Experience ${index + 1}:
Company: ${item.company || "Not provided"}
Role: ${item.role || "Not provided"}
Duration: ${item.duration || "Not provided"}
Description: ${item.description || "Not provided"}
`
        )
        .join("\n")
    : "No experience provided"
}

EDUCATION:
${
  body.education?.length
    ? body.education
        .map(
          (item, index) => `
Education ${index + 1}:
Degree: ${item.degree || "Not provided"}
Institute: ${item.institute || "Not provided"}
Duration: ${item.duration || "Not provided"}
Score: ${item.score || "Not provided"}
`
        )
        .join("\n")
    : "No education provided"
}

PROJECTS:
${
  body.projects?.length
    ? body.projects
        .map(
          (item, index) => `
Project ${index + 1}:
Name: ${item.name || "Not provided"}
Technologies: ${item.tech || "Not provided"}
Description: ${item.description || "Not provided"}
Link: ${item.link || "Not provided"}
`
        )
        .join("\n")
    : "No projects provided"
}
`;

    const prompt = `
You are an expert AI Resume Analyzer for a Smart Placement Preparation Portal called PrepXpert.

Analyze the following resume of a B.Tech Computer Science student.

Your analysis must be practical and placement-focused.

Evaluate:
- Resume completeness
- ATS friendliness
- Technical skills
- Projects
- Experience
- Education
- Professional summary
- Contact/profile information
- Career readiness

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.

Use exactly this JSON structure:

{
  "score": 0,
  "atsScore": 0,
  "overallAssessment": "",
  "strengths": [],
  "weakAreas": [],
  "missingSkills": [],
  "atsSuggestions": [],
  "sectionSuggestions": {
    "summary": "",
    "skills": "",
    "experience": "",
    "education": "",
    "projects": ""
  },
  "recommendedActions": [],
  "priority": "",
  "placementReadiness": ""
}

Rules:
- score must be an integer from 0 to 100.
- atsScore must be an integer from 0 to 100.
- strengths must contain 3 to 5 useful points.
- weakAreas must contain 3 to 5 useful points.
- missingSkills must contain realistic skills based on the student's profile and target role.
- atsSuggestions must contain practical ATS improvements.
- recommendedActions must contain 4 to 6 actionable steps.
- priority must be one of: "Low", "Medium", "High".
- placementReadiness should briefly describe how ready the student appears for placement.
- Do not invent experience, projects, education or skills that are not present.
- If information is missing, mention it as an improvement area.
- Keep the language simple and suitable for a B.Tech CSE student.

RESUME DATA:
${resumeText}
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
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("GEMINI RESUME ANALYZER ERROR:", data);

      return NextResponse.json(
        {
          success: false,
          message:
            data?.error?.message ||
            "Gemini resume analysis failed",
        },
        { status: response.status }
      );
    }

    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        {
          success: false,
          message: "Gemini returned an empty analysis",
        },
        { status: 500 }
      );
    }

    let analysis;

    try {
      const cleanedText = generatedText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      analysis = JSON.parse(cleanedText);
    } catch (error) {
      console.error(
        "RESUME ANALYSIS JSON PARSE ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "AI returned an invalid analysis format",
          raw: generatedText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("RESUME ANALYZER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze resume",
      },
      { status: 500 }
    );
  }
}