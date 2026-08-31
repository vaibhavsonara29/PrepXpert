import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const subject = searchParams.get("subject") || "DSA";
    const difficulty = searchParams.get("difficulty") || "Medium";
    const language = searchParams.get("language") || "English";

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message:
            "GEMINI_API_KEY is missing in .env.local",
        },
        { status: 500 }
      );
    }

    const prompt = `
You are an expert technical interviewer.

Generate exactly 10 UNIQUE interview practice questions.

Subject: ${subject}
Difficulty: ${difficulty}
Language: ${language}

Rules:
1. Questions must be relevant to the selected subject.
2. Questions must match the selected difficulty.
3. Questions should be useful for technical placement interviews.
4. Do not repeat questions.
5. Every question must have exactly 4 options.
6. Only one option must be correct.
7. Give a clear explanation of the correct answer.
8. Return ONLY valid JSON matching the provided schema.
9. Do not use markdown.
10. Questions and answers must be in ${language}.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            questions: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  question: {
                    type: "string",
                  },

                  options: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },

                  correctAnswer: {
                    type: "integer",
                  },

                  explanation: {
                    type: "string",
                  },
                },

                required: [
                  "question",
                  "options",
                  "correctAnswer",
                  "explanation",
                ],
              },
            },
          },

          required: ["questions"],
        },
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response");
    }

    const data = JSON.parse(response.text);

    if (
      !data.questions ||
      !Array.isArray(data.questions)
    ) {
      throw new Error("Invalid question response");
    }

    const validQuestions = data.questions.filter(
      (q: any) =>
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        Number.isInteger(q.correctAnswer) &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3 &&
        typeof q.explanation === "string"
    );

    return NextResponse.json({
      success: true,
      subject,
      difficulty,
      language,
      count: validQuestions.length,
      questions: validQuestions,
    });
  } catch (error: any) {
    console.error("Gemini Interview API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to generate interview questions",
      },
      { status: 500 }
    );
  }
}