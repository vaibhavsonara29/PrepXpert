"use client";

import { useEffect, useState } from "react";

type Question = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
};

type Language = {
  id: string;
  name: string;
  extension: string;
  starter: string;
};

const languages: Language[] = [
  {
    id: "python",
    name: "Python",
    extension: ".py",
    starter: `# Write your solution here

print("Hello, World!")`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    starter: `// Write your solution here

console.log("Hello, World!");`,
  },
  {
    id: "cpp",
    name: "C++",
    extension: ".cpp",
    starter: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,
  },
  {
    id: "c",
    name: "C",
    extension: ".c",
    starter: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
  },
  {
    id: "java",
    name: "Java",
    extension: ".java",
    starter: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
];

export default function CodingPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);

  const [language, setLanguage] =
    useState("python");

  const [code, setCode] = useState("");

  const [completed, setCompleted] =
    useState<number[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [running, setRunning] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  useEffect(() => {
    loadQuestions();

    const saved =
      localStorage.getItem(
        "codingCompleted"
      );

    if (saved) {
      try {
        setCompleted(
          JSON.parse(saved)
        );
      } catch {
        setCompleted([]);
      }
    }
  }, []);

  useEffect(() => {
    const selectedLanguage =
      languages.find(
        (item) => item.id === language
      );

    if (selectedLanguage) {
      setCode(
        selectedLanguage.starter
      );
    }

    setOutput("");
    setMessage("");
  }, [language]);

  async function loadQuestions() {
    try {
      const response = await fetch(
        "/api/coding"
      );

      const data =
        await response.json();

      if (data.success) {
        setQuestions(
          data.questions
        );
      } else {
        setMessage(
          data.message ||
            "Unable to load coding questions."
        );
      }
    } catch (error) {
      console.error(
        "Failed to load coding questions:",
        error
      );

      setMessage(
        "Unable to load coding questions."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectQuestion(
    index: number
  ) {
    setCurrent(index);
    setOutput("");
    setMessage("");
    setFinished(false);

    const selectedLanguage =
      languages.find(
        (item) => item.id === language
      );

    setCode(
      selectedLanguage?.starter || ""
    );
  }

  /*
   * Temporary Run Code handler.
   *
   * This validates that code exists and
   * shows a preview in the output panel.
   *
   * Actual multi-language execution will
   * be connected to a secure code execution
   * service later.
   */
  async function runCode() {
    if (!code.trim()) {
      setOutput(
        "Please write some code first."
      );
      return;
    }

    setRunning(true);
    setOutput("");
    setMessage("");

    try {
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 700)
      );

      const selectedLanguage =
        languages.find(
          (item) =>
            item.id === language
        );

      setOutput(
        `Code received successfully.

Language: ${
          selectedLanguage?.name ||
          language
        }

Execution service is not connected yet.

Your code is ready to be sent to the secure compiler/execution service.`
      );
    } catch (error) {
      console.error(
        "Run code error:",
        error
      );

      setOutput(
        "Unable to run the code."
      );
    } finally {
      setRunning(false);
    }
  }

  async function submitAnswer() {
    if (!code.trim()) {
      setMessage(
        "Please write your answer before submitting."
      );
      return;
    }

    const question =
      questions[current];

    try {
      const response =
        await fetch("/api/coding", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            questionId:
              question.id,
            answer: code,
            language,
            completed: true,
          }),
        });

      const data =
        await response.json();

      if (!data.success) {
        setMessage(
          data.message ||
            "Submission failed."
        );
        return;
      }

      const updatedCompleted =
        completed.includes(
          question.id
        )
          ? completed
          : [
              ...completed,
              question.id,
            ];

      setCompleted(
        updatedCompleted
      );

      localStorage.setItem(
        "codingCompleted",
        JSON.stringify(
          updatedCompleted
        )
      );

      localStorage.setItem(
        "codingResult",
        JSON.stringify({
          completed:
            updatedCompleted.length,
          total:
            questions.length,
          percentage:
            questions.length
              ? Math.round(
                  (updatedCompleted.length /
                    questions.length) *
                    100
                )
              : 0,
          date:
            new Date().toISOString(),
        })
      );

      setMessage(
        "Answer submitted successfully!"
      );

      if (
        updatedCompleted.length ===
        questions.length
      ) {
        setFinished(true);
      }
    } catch (error) {
      console.error(
        "Submit error:",
        error
      );

      setMessage(
        "Something went wrong while submitting."
      );
    }
  }

  function nextQuestion() {
    if (
      current <
      questions.length - 1
    ) {
      setCurrent(
        (prev) => prev + 1
      );

      setOutput("");
      setMessage("");
      setFinished(false);

      const selectedLanguage =
        languages.find(
          (item) =>
            item.id === language
        );

      setCode(
        selectedLanguage?.starter ||
          ""
      );
    }
  }

  function previousQuestion() {
    if (current > 0) {
      setCurrent(
        (prev) => prev - 1
      );

      setOutput("");
      setMessage("");
      setFinished(false);

      const selectedLanguage =
        languages.find(
          (item) =>
            item.id === language
        );

      setCode(
        selectedLanguage?.starter ||
          ""
      );
    }
  }

  if (loading) {
    return (
      <main
        style={styles.container}
      >
        <div style={styles.card}>
          <p>
            Loading coding
            questions...
          </p>
        </div>
      </main>
    );
  }

  if (!questions.length) {
    return (
      <main
        style={styles.container}
      >
        <div style={styles.card}>
          <h1>
            Coding Practice
          </h1>

          <p>
            No coding questions
            available.
          </p>
        </div>
      </main>
    );
  }

  const question =
    questions[current];

  const progress =
    Math.round(
      (completed.length /
        questions.length) *
        100
    );

  return (
    <main
      style={styles.container}
    >
      <div style={styles.wrapper}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1
              style={styles.title}
            >
              Coding Practice
            </h1>

            <p
              style={styles.subtitle}
            >
              Improve your
              programming skills by
              solving coding
              problems.
            </p>
          </div>

          <div
            style={
              styles.progressBox
            }
          >
            <strong>
              {progress}%
            </strong>

            <span>
              Completed
            </span>
          </div>
        </div>

        {/* Question navigation */}
        <div
          style={
            styles.questionNav
          }
        >
          {questions.map(
            (item, index) => (
              <button
                key={item.id}
                onClick={() =>
                  selectQuestion(
                    index
                  )
                }
                style={{
                  ...styles.questionButton,

                  ...(current ===
                  index
                    ? styles.activeQuestion
                    : {}),

                  ...(completed.includes(
                    item.id
                  )
                    ? styles.completedQuestion
                    : {}),
                }}
              >
                {index + 1}
              </button>
            )
          )}
        </div>

        {/* Main card */}
        <div
          style={styles.card}
        >
          <div
            style={
              styles.questionTop
            }
          >
            <div>
              <span
                style={
                  styles.questionNumber
                }
              >
                Question{" "}
                {current + 1} of{" "}
                {questions.length}
              </span>

              <h2
                style={
                  styles.questionTitle
                }
              >
                {question.title}
              </h2>
            </div>

            <div
              style={styles.badges}
            >
              <span
                style={styles.badge}
              >
                {
                  question.difficulty
                }
              </span>

              <span
                style={
                  styles.topicBadge
                }
              >
                {question.topic}
              </span>
            </div>
          </div>

          <p
            style={styles.description}
          >
            {question.description}
          </p>

          {/* Language */}
          <div
            style={
              styles.languageRow
            }
          >
            <label
              style={styles.label}
            >
              Select Language
            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
              style={
                styles.languageSelect
              }
            >
              {languages.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Editor */}
          <label
            style={styles.label}
          >
            Write your solution
          </label>

          <textarea
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
              )
            }
            spellCheck={false}
            style={styles.editor}
          />

          {/* Run + Output */}
          <div
            style={
              styles.runSection
            }
          >
            <button
              onClick={runCode}
              disabled={running}
              style={{
                ...styles.runButton,
                opacity: running
                  ? 0.6
                  : 1,
              }}
            >
              {running
                ? "Running..."
                : "▶ Run Code"}
            </button>

            <div
              style={
                styles.outputContainer
              }
            >
              <div
                style={
                  styles.outputHeader
                }
              >
                <strong>
                  Output
                </strong>

                <span>
                  {
                    languages.find(
                      (item) =>
                        item.id ===
                        language
                    )?.name
                  }
                </span>
              </div>

              <pre
                style={
                  styles.output
                }
              >
                {output ||
                  "Run your code to see the output here."}
              </pre>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              style={{
                ...styles.message,

                background:
                  message.includes(
                    "success"
                  )
                    ? "#ecfdf5"
                    : "#fef2f2",

                color:
                  message.includes(
                    "success"
                  )
                    ? "#047857"
                    : "#b91c1c",
              }}
            >
              {message}
            </div>
          )}

          {/* Buttons */}
          <div
            style={styles.actions}
          >
            <button
              onClick={
                previousQuestion
              }
              disabled={
                current === 0
              }
              style={{
                ...styles.secondaryButton,
                opacity:
                  current === 0
                    ? 0.5
                    : 1,
              }}
            >
              ← Previous
            </button>

            <button
              onClick={
                submitAnswer
              }
              style={
                styles.submitButton
              }
            >
              Submit Answer
            </button>

            <button
              onClick={
                nextQuestion
              }
              disabled={
                current ===
                questions.length - 1
              }
              style={{
                ...styles.secondaryButton,
                opacity:
                  current ===
                  questions.length - 1
                    ? 0.5
                    : 1,
              }}
            >
              Next →
            </button>
          </div>

          {/* Completion */}
          {finished && (
            <div
              style={
                styles.completedBox
              }
            >
              <h2>
                🎉 Coding Practice
                Completed!
              </h2>

              <p>
                You completed all{" "}
                {questions.length}{" "}
                coding questions.
              </p>

              <strong>
                Progress:{" "}
                {completed.length}/
                {questions.length}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      <style jsx>{`
        @media (max-width: 700px) {
          .coding-page {
            padding: 18px 12px !important;
          }
        }
      `}</style>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "30px 20px",
    boxSizing:
      "border-box" as const,
  },

  wrapper: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
    flexWrap:
      "wrap" as const,
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "15px",
  },

  progressBox: {
    background: "white",
    padding: "14px 20px",
    borderRadius: "12px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection:
      "column" as const,
    alignItems: "center",
    minWidth: "100px",
  },

  questionNav: {
    display: "flex",
    gap: "10px",
    flexWrap:
      "wrap" as const,
    marginBottom: "20px",
  },

  questionButton: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    border:
      "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px",
  },

  activeQuestion: {
    background: "#111827",
    color: "white",
    borderColor: "#111827",
  },

  completedQuestion: {
    borderColor: "#10b981",
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
    boxSizing:
      "border-box" as const,
    width: "100%",
  },

  questionTop: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "flex-start",
    gap: "20px",
    flexWrap:
      "wrap" as const,
  },

  questionNumber: {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: 600,
  },

  questionTitle: {
    margin: "8px 0 0",
    fontSize: "25px",
    color: "#111827",
  },

  badges: {
    display: "flex",
    gap: "8px",
    flexWrap:
      "wrap" as const,
  },

  badge: {
    background: "#ecfdf5",
    color: "#047857",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
  },

  topicBadge: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
  },

  description: {
    marginTop: "25px",
    color: "#374151",
    lineHeight: 1.6,
    fontSize: "16px",
  },

  languageRow: {
    marginTop: "25px",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: 600,
    color: "#111827",
  },

  languageSelect: {
    width: "100%",
    maxWidth: "320px",
    padding: "11px 13px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    color: "#111827",
    fontSize: "14px",
    outline: "none",
  },

  editor: {
    width: "100%",
    minHeight: "300px",
    padding: "16px",
    boxSizing:
      "border-box" as const,
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    background: "#111827",
    color: "#f9fafb",
    fontFamily: "monospace",
    fontSize: "14px",
    lineHeight: 1.6,
    resize:
      "vertical" as const,
    outline: "none",
  },

  runSection: {
    marginTop: "18px",
  },

  runButton: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  },

  outputContainer: {
    marginTop: "15px",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    overflow: "hidden",
  },

  outputHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "11px 14px",
    background: "#f3f4f6",
    color: "#111827",
    fontSize: "13px",
  },

  output: {
    margin: 0,
    minHeight: "100px",
    padding: "15px",
    background: "#111827",
    color: "#e5e7eb",
    fontFamily: "monospace",
    fontSize: "13px",
    lineHeight: 1.6,
    whiteSpace:
      "pre-wrap" as const,
    wordBreak:
      "break-word" as const,
    overflowX:
      "auto" as const,
  },

  message: {
    marginTop: "15px",
    padding: "12px 15px",
    borderRadius: "8px",
    fontSize: "14px",
  },

  actions: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "12px",
    marginTop: "20px",
    flexWrap:
      "wrap" as const,
  },

  secondaryButton: {
    padding: "11px 18px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  },

  submitButton: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },

  completedBox: {
    marginTop: "25px",
    padding: "20px",
    borderRadius: "12px",
    background: "#ecfdf5",
    color: "#065f46",
    textAlign:
      "center" as const,
  },
};