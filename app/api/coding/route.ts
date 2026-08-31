import { NextResponse } from "next/server";

const questions = [
  {
    id: 1,
    title: "Reverse a String",
    description:
      "Write a program to reverse a given string.",
    difficulty: "Easy",
    topic: "String",
  },
  {
    id: 2,
    title: "Find Maximum Number",
    description:
      "Write a program to find the maximum number from an array.",
    difficulty: "Easy",
    topic: "Array",
  },
  {
    id: 3,
    title: "Check Palindrome",
    description:
      "Write a program to check whether a given string is a palindrome.",
    difficulty: "Easy",
    topic: "String",
  },
  {
    id: 4,
    title: "Count Vowels",
    description:
      "Write a program to count the number of vowels in a string.",
    difficulty: "Easy",
    topic: "String",
  },
  {
    id: 5,
    title: "Find Even Numbers",
    description:
      "Write a program to print all even numbers from an array.",
    difficulty: "Easy",
    topic: "Array",
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("CODING API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load coding questions",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      questionId,
      answer,
      completed,
    } = body;

    if (!questionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Question ID is required",
        },
        { status: 400 }
      );
    }

    const question = questions.find(
      (item) => item.id === Number(questionId)
    );

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found",
        },
        { status: 404 }
      );
    }

    const result = {
      questionId: question.id,
      completed: Boolean(completed),
      answer: answer || "",
      submittedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Coding answer submitted successfully",
      result,
    });
  } catch (error) {
    console.error("CODING SUBMIT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit coding answer",
      },
      { status: 500 }
    );
  }
}