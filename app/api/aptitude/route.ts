import { NextResponse } from "next/server";

const questions = [
  {
    id: 1,
    question: "What is 20% of 250?",
    options: ["25", "40", "50", "60"],
    answer: "50",
    difficulty: "Easy",
    category: "Quantitative Aptitude",
  },
  {
    id: 2,
    question:
      "If 5 workers complete a job in 10 days, how many days will 10 workers take?",
    options: ["2", "5", "10", "20"],
    answer: "5",
    difficulty: "Easy",
    category: "Time and Work",
  },
  {
    id: 3,
    question: "Find the next number: 2, 4, 8, 16, ?",
    options: ["20", "24", "32", "36"],
    answer: "32",
    difficulty: "Easy",
    category: "Number Series",
  },
  {
    id: 4,
    question:
      "A train travels 60 km in 1 hour. What is its speed?",
    options: ["30 km/h", "45 km/h", "60 km/h", "90 km/h"],
    answer: "60 km/h",
    difficulty: "Easy",
    category: "Speed",
  },
  {
    id: 5,
    question: "Which number is a prime number?",
    options: ["21", "27", "29", "33"],
    answer: "29",
    difficulty: "Easy",
    category: "Number System",
  },
];

// GET /api/aptitude
export async function GET() {
  return NextResponse.json({
    success: true,
    count: questions.length,
    questions,
  });
}

// POST /api/aptitude
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      questionId,
      selectedAnswer,
    } = body;

    const question = questions.find(
      (q) => q.id === Number(questionId)
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

    const correct =
      selectedAnswer === question.answer;

    return NextResponse.json({
      success: true,
      correct,
      correctAnswer: question.answer,
      questionId: question.id,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      { status: 400 }
    );
  }
}