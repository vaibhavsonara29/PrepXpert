"use client";

import { useEffect, useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  difficulty: string;
  category: string;
};

export default function AptitudePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Load questions from API
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/aptitude");

        if (!response.ok) {
          throw new Error("Failed to load questions");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.questions)) {
          throw new Error("Invalid question data");
        }

        setQuestions(data.questions);
      } catch (err) {
        console.error("Question loading error:", err);
        setError("Unable to load aptitude questions.");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  // Next question / submit test
  async function handleNext() {
    if (!selected || questions.length === 0) {
      return;
    }

    const question = questions[current];

    const isCorrect = selected === question.answer;

    const newScore = isCorrect ? score + 1 : score;

    // Last question
    if (current === questions.length - 1) {
      setScore(newScore);

      const percentage = Math.round(
        (newScore / questions.length) * 100
      );

      setSaving(true);
      setSaveMessage("");

      // Get logged-in user
      let userEmail = "";

      try {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          const user = JSON.parse(savedUser);
          userEmail = user?.email || "";
        }
      } catch (error) {
        console.error("User data error:", error);
      }

      // Save result in MongoDB
      try {
        const response = await fetch("/api/aptitude/result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail,
            score: newScore,
            total: questions.length,
            percentage,
            category: "Aptitude",
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSaveMessage("Result saved successfully ✓");
        } else {
          console.error("Result save failed:", data);
          setSaveMessage("Test completed. Result could not be saved.");
        }
      } catch (error) {
        console.error("Result saving error:", error);
        setSaveMessage("Test completed. Result could not be saved.");
      } finally {
        setSaving(false);
      }

      // Also keep a local copy
      localStorage.setItem(
        "aptitudeResult",
        JSON.stringify({
          score: newScore,
          total: questions.length,
          percentage,
          date: new Date().toISOString(),
        })
      );

      setFinished(true);
    } else {
      // Move to next question
      setScore(newScore);
      setCurrent((prev) => prev + 1);
      setSelected("");
    }
  }

  // Restart test
  function restartTest() {
    setCurrent(0);
    setSelected("");
    setScore(0);
    setFinished(false);
    setSaving(false);
    setSaveMessage("");
  }

  // Loading screen
  if (loading) {
    return (
      <main style={containerStyle}>
        <div style={cardStyle}>
          <h1>Aptitude Test</h1>
          <p>Loading questions...</p>
        </div>
      </main>
    );
  }

  // Error screen
  if (error) {
    return (
      <main style={containerStyle}>
        <div style={cardStyle}>
          <h1>Aptitude Test</h1>

          <p style={{ color: "red" }}>
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            style={buttonStyle}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // No questions
  if (questions.length === 0) {
    return (
      <main style={containerStyle}>
        <div style={cardStyle}>
          <h1>Aptitude Test</h1>

          <p>
            No aptitude questions are available.
          </p>
        </div>
      </main>
    );
  }

  // Test completed
  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <main style={containerStyle}>
        <div style={cardStyle}>
          <h1>Aptitude Test Completed 🎉</h1>

          <div style={resultBoxStyle}>
            <h2>
              Score: {score} / {questions.length}
            </h2>

            <h2>{percentage}%</h2>
          </div>

          <p style={messageStyle}>
            {percentage >= 80
              ? "Excellent performance! 🚀"
              : percentage >= 60
              ? "Good performance. Keep practicing!"
              : "Keep practicing and improve your score!"}
          </p>

          {saving && (
            <p style={{ color: "#555" }}>
              Saving your result...
            </p>
          )}

          {!saving && saveMessage && (
            <p
              style={{
                color: saveMessage.includes("successfully")
                  ? "green"
                  : "#b45309",
                fontWeight: "600",
              }}
            >
              {saveMessage}
            </p>
          )}

          <button
            onClick={restartTest}
            style={buttonStyle}
          >
            Retake Test
          </button>
        </div>
      </main>
    );
  }

  const question = questions[current];

  return (
    <main style={containerStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: "0 0 5px" }}>
              Aptitude Test
            </h1>

            <small style={{ color: "#777" }}>
              {question.category} • {question.difficulty}
            </small>
          </div>

          <strong>
            {current + 1} / {questions.length}
          </strong>
        </div>

        <hr style={{ margin: "20px 0" }} />

        {/* Question */}
        <h2 style={questionStyle}>
          {question.question}
        </h2>

        {/* Options */}
        <div style={{ marginTop: "25px" }}>
          {question.options.map((option) => (
            <label
              key={option}
              style={{
                ...optionStyle,
                background:
                  selected === option
                    ? "#eeeeee"
                    : "white",
                border:
                  selected === option
                    ? "2px solid #111"
                    : "1px solid #ddd",
              }}
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                style={{
                  marginRight: "10px",
                }}
              />

              <span>{option}</span>
            </label>
          ))}
        </div>

        {/* Next / Submit */}
        <button
          onClick={handleNext}
          disabled={!selected || saving}
          style={{
            ...buttonStyle,
            opacity:
              selected && !saving ? 1 : 0.5,
          }}
        >
          {saving
            ? "Saving..."
            : current === questions.length - 1
            ? "Submit Test"
            : "Next Question"}
        </button>
      </div>
    </main>
  );
}

/* =========================
   STYLES
========================= */

const containerStyle = {
  minHeight: "100vh",
  background: "#f5f7fb",
  padding: "40px 20px",
  boxSizing: "border-box" as const,
};

const cardStyle = {
  width: "100%",
  maxWidth: "700px",
  margin: "0 auto",
  background: "white",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  boxSizing: "border-box" as const,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
};

const questionStyle = {
  lineHeight: 1.5,
  fontSize: "22px",
};

const optionStyle = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "15px",
  marginBottom: "12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const buttonStyle = {
  width: "100%",
  padding: "13px 25px",
  border: "none",
  borderRadius: "7px",
  background: "#111",
  color: "white",
  cursor: "pointer",
  marginTop: "15px",
  fontSize: "16px",
};

const resultBoxStyle = {
  background: "#f5f7fb",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "20px",
  textAlign: "center" as const,
};

const messageStyle = {
  fontSize: "17px",
  marginTop: "20px",
};