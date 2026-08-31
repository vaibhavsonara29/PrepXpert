"use client";

import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const subjects = [
  "DSA",
  "DBMS",
  "Operating System",
  "Computer Networks",
  "OOP",
  "JavaScript",
  "React",
  "Node.js",
  "Web Development",
];

const difficulties = ["Easy", "Medium", "Hard"];

const languages = ["English", "Hindi"];

export default function InterviewPage() {
  const [subject, setSubject] = useState("DSA");
  const [difficulty, setDifficulty] = useState("Medium");
  const [language, setLanguage] = useState("English");

  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [showAnswer, setShowAnswer] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [started, setStarted] = useState(false);

  async function generateQuestions() {
    setLoading(true);
    setError("");
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setStarted(false);

    try {
      const params = new URLSearchParams({
        subject,
        difficulty,
        language,
      });

      const response = await fetch(
        `/api/interview?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to generate questions"
        );
      }

      setQuestions(data.questions || []);
      setStarted(true);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to generate questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(index: number) {
    if (showAnswer) return;

    setSelectedAnswer(index);
  }

  function checkAnswer() {
    if (selectedAnswer === null) return;

    setShowAnswer(true);
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  }

  function regenerate() {
    generateQuestions();
  }

  const question = questions[currentQuestion];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "24px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
            }}
          >
            Interview Preparation
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: "10px",
            }}
          >
            Practice unlimited AI-generated interview
            questions according to your subject and
            difficulty.
          </p>
        </div>

        {/* PREFERENCES */}

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "24px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Choose Your Preferences
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "18px",
            }}
          >
            {/* SUBJECT */}

            <div>
              <label>
                <strong>Subject</strong>
              </label>

              <select
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                style={selectStyle}
              >
                {subjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* DIFFICULTY */}

            <div>
              <label>
                <strong>Difficulty</strong>
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
                style={selectStyle}
              >
                {difficulties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* LANGUAGE */}

            <div>
              <label>
                <strong>Language</strong>
              </label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                style={selectStyle}
              >
                {languages.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateQuestions}
            disabled={loading}
            style={{
              ...primaryButton,
              marginTop: "22px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Generating Questions..."
              : "Generate Interview Questions"}
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#be123c",
              padding: "18px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div
            style={{
              background: "white",
              padding: "50px",
              borderRadius: "18px",
              textAlign: "center",
            }}
          >
            <h2>Generating your questions...</h2>

            <p style={{ color: "#666" }}>
              Gemini is preparing 10 fresh{" "}
              {difficulty.toLowerCase()}{" "}
              {subject} questions.
            </p>
          </div>
        )}

        {/* QUESTIONS */}

        {!loading &&
          started &&
          questions.length > 0 &&
          question && (
            <div
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "30px",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              {/* TOP */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background: "#eef2ff",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontWeight: 600,
                  }}
                >
                  {subject}
                </span>

                <span
                  style={{
                    background: "#f1f5f9",
                    padding: "8px 14px",
                    borderRadius: "20px",
                  }}
                >
                  {difficulty}
                </span>

                <span>
                  Question {currentQuestion + 1} of{" "}
                  {questions.length}
                </span>
              </div>

              {/* QUESTION */}

              <h2
                style={{
                  fontSize: "24px",
                  lineHeight: 1.5,
                }}
              >
                Q{currentQuestion + 1}.{" "}
                {question.question}
              </h2>

              {/* OPTIONS */}

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  marginTop: "25px",
                }}
              >
                {question.options.map(
                  (option, index) => {
                    const isCorrect =
                      index ===
                      question.correctAnswer;

                    const isSelected =
                      selectedAnswer === index;

                    let background = "#fff";
                    let border = "1px solid #ddd";

                    if (showAnswer && isCorrect) {
                      background = "#dcfce7";
                      border =
                        "1px solid #22c55e";
                    }

                    if (
                      showAnswer &&
                      isSelected &&
                      !isCorrect
                    ) {
                      background = "#fee2e2";
                      border =
                        "1px solid #ef4444";
                    }

                    if (
                      !showAnswer &&
                      isSelected
                    ) {
                      background = "#eff6ff";
                      border =
                        "2px solid #2563eb";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          selectAnswer(index)
                        }
                        style={{
                          textAlign: "left",
                          padding: "16px",
                          border,
                          borderRadius: "10px",
                          background,
                          cursor: showAnswer
                            ? "default"
                            : "pointer",
                          fontSize: "16px",
                        }}
                      >
                        <strong>
                          {String.fromCharCode(
                            65 + index
                          )}
                          .
                        </strong>{" "}
                        {option}
                      </button>
                    );
                  }
                )}
              </div>

              {/* ANSWER */}

              {!showAnswer && (
                <button
                  onClick={checkAnswer}
                  disabled={
                    selectedAnswer === null
                  }
                  style={{
                    ...primaryButton,
                    marginTop: "22px",
                    opacity:
                      selectedAnswer === null
                        ? 0.5
                        : 1,
                  }}
                >
                  Check Answer
                </button>
              )}

              {showAnswer && (
                <div
                  style={{
                    marginTop: "25px",
                    padding: "20px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    Explanation
                  </h3>

                  <p
                    style={{
                      lineHeight: 1.7,
                    }}
                  >
                    {question.explanation}
                  </p>
                </div>
              )}

              {/* NAVIGATION */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "25px",
                  gap: "10px",
                }}
              >
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  style={secondaryButton}
                >
                  ← Previous
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={
                    currentQuestion ===
                    questions.length - 1
                  }
                  style={primarySmallButton}
                >
                  Next →
                </button>
              </div>

              {/* REGENERATE */}

              <button
                onClick={regenerate}
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                🔄 Generate 10 New Questions
              </button>
            </div>
          )}

        {/* EMPTY STATE */}

        {!loading &&
          !started &&
          !error && (
            <div
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "45px",
                textAlign: "center",
                color: "#666",
              }}
            >
              <h2>Ready for Practice?</h2>

              <p>
                Select your subject, difficulty and
                language, then generate your interview
                questions.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}

const selectStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "13px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  background: "white",
  fontSize: "15px",
};

const primaryButton = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "white",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
};

const primarySmallButton = {
  padding: "11px 20px",
  border: "none",
  borderRadius: "9px",
  background: "#2563eb",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButton = {
  padding: "11px 20px",
  border: "1px solid #d1d5db",
  borderRadius: "9px",
  background: "white",
  cursor: "pointer",
};