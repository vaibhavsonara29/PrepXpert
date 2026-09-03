"use client";

import { useEffect, useMemo, useState } from "react";

type ExamId = "gate" | "cat" | "competitive";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

type Exam = {
  id: ExamId;
  name: string;
  description: string;
  topics: string[];
  questions: Question[];
};

const exams: Exam[] = [
  {
    id: "gate",
    name: "GATE CSE",
    description:
      "Prepare for GATE Computer Science with core CS subjects, engineering mathematics and general aptitude.",
    topics: [
      "Data Structures",
      "Algorithms",
      "Operating Systems",
      "DBMS",
      "Computer Networks",
      "Computer Organization",
      "Theory of Computation",
      "Compiler Design",
      "Engineering Mathematics",
      "General Aptitude",
    ],
    questions: [
      {
        id: 1,
        topic: "Data Structures",
        difficulty: "Easy",
        question:
          "Which data structure follows the LIFO principle?",
        options: [
          "Queue",
          "Stack",
          "Linked List",
          "Tree",
        ],
        answer: "Stack",
      },
      {
        id: 2,
        topic: "Data Structures",
        difficulty: "Medium",
        question:
          "What is the worst-case time complexity of searching in an unbalanced Binary Search Tree?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n log n)",
        ],
        answer: "O(n)",
      },
      {
        id: 3,
        topic: "Algorithms",
        difficulty: "Easy",
        question:
          "Which algorithm is commonly used to find the shortest path from a source vertex in a graph with non-negative edge weights?",
        options: [
          "Kruskal's Algorithm",
          "Dijkstra's Algorithm",
          "Prim's Algorithm",
          "DFS",
        ],
        answer: "Dijkstra's Algorithm",
      },
      {
        id: 4,
        topic: "Algorithms",
        difficulty: "Medium",
        question:
          "What is the average-case time complexity of Quick Sort?",
        options: [
          "O(n)",
          "O(log n)",
          "O(n log n)",
          "O(n²)",
        ],
        answer: "O(n log n)",
      },
      {
        id: 5,
        topic: "Operating Systems",
        difficulty: "Easy",
        question:
          "Which scheduling algorithm gives each process a fixed time slice?",
        options: [
          "FCFS",
          "SJF",
          "Round Robin",
          "Priority Scheduling",
        ],
        answer: "Round Robin",
      },
      {
        id: 6,
        topic: "DBMS",
        difficulty: "Easy",
        question:
          "Which key uniquely identifies a record in a relational table?",
        options: [
          "Foreign Key",
          "Primary Key",
          "Candidate Key",
          "Composite Key",
        ],
        answer: "Primary Key",
      },
      {
        id: 7,
        topic: "DBMS",
        difficulty: "Medium",
        question:
          "Which normal form removes partial functional dependency?",
        options: [
          "1NF",
          "2NF",
          "3NF",
          "BCNF",
        ],
        answer: "2NF",
      },
      {
        id: 8,
        topic: "Computer Networks",
        difficulty: "Easy",
        question:
          "Which protocol is used to securely transfer web pages?",
        options: [
          "HTTP",
          "FTP",
          "HTTPS",
          "SMTP",
        ],
        answer: "HTTPS",
      },
      {
        id: 9,
        topic: "Computer Networks",
        difficulty: "Medium",
        question:
          "Which layer of the OSI model is responsible for routing?",
        options: [
          "Data Link Layer",
          "Network Layer",
          "Transport Layer",
          "Session Layer",
        ],
        answer: "Network Layer",
      },
      {
        id: 10,
        topic: "Computer Organization",
        difficulty: "Easy",
        question:
          "Which memory is closest to the CPU and generally faster?",
        options: [
          "Hard Disk",
          "RAM",
          "Cache",
          "Optical Disk",
        ],
        answer: "Cache",
      },
      {
        id: 11,
        topic: "Theory of Computation",
        difficulty: "Medium",
        question:
          "Which machine is used to recognize regular languages?",
        options: [
          "Finite Automaton",
          "Turing Machine",
          "Pushdown Automaton",
          "Linear Bounded Automaton",
        ],
        answer: "Finite Automaton",
      },
      {
        id: 12,
        topic: "Compiler Design",
        difficulty: "Easy",
        question:
          "Which phase of a compiler converts source code into tokens?",
        options: [
          "Syntax Analysis",
          "Lexical Analysis",
          "Code Generation",
          "Optimization",
        ],
        answer: "Lexical Analysis",
      },
      {
        id: 13,
        topic: "Engineering Mathematics",
        difficulty: "Easy",
        question:
          "What is the derivative of x²?",
        options: [
          "x",
          "2x",
          "x²",
          "2",
        ],
        answer: "2x",
      },
      {
        id: 14,
        topic: "General Aptitude",
        difficulty: "Easy",
        question:
          "What is 25% of 200?",
        options: [
          "25",
          "40",
          "50",
          "75",
        ],
        answer: "50",
      },
      {
        id: 15,
        topic: "General Aptitude",
        difficulty: "Medium",
        question:
          "If 5 workers complete a job in 10 days, how many days will 10 workers take, assuming equal efficiency?",
        options: [
          "2 days",
          "5 days",
          "10 days",
          "20 days",
        ],
        answer: "5 days",
      },
    ],
  },

  {
    id: "cat",
    name: "CAT",
    description:
      "Practice Quantitative Ability, Logical Reasoning, Data Interpretation and Verbal Ability.",
    topics: [
      "Quantitative Ability",
      "Logical Reasoning",
      "Data Interpretation",
      "Verbal Ability",
      "Reading Comprehension",
    ],
    questions: [
      {
        id: 101,
        topic: "Quantitative Ability",
        difficulty: "Easy",
        question: "What is 20% of 350?",
        options: ["50", "60", "70", "80"],
        answer: "70",
      },
      {
        id: 102,
        topic: "Quantitative Ability",
        difficulty: "Medium",
        question:
          "If a number is increased by 20% and becomes 120, what was the original number?",
        options: ["90", "100", "110", "115"],
        answer: "100",
      },
      {
        id: 103,
        topic: "Logical Reasoning",
        difficulty: "Easy",
        question:
          "Find the next number: 3, 6, 12, 24, ?",
        options: ["30", "36", "48", "60"],
        answer: "48",
      },
      {
        id: 104,
        topic: "Data Interpretation",
        difficulty: "Medium",
        question:
          "A company sells 100 units on Monday and 150 on Tuesday. What is the percentage increase?",
        options: ["25%", "40%", "50%", "60%"],
        answer: "50%",
      },
      {
        id: 105,
        topic: "Verbal Ability",
        difficulty: "Easy",
        question:
          "Choose the word closest in meaning to 'Rapid'.",
        options: [
          "Slow",
          "Quick",
          "Weak",
          "Late",
        ],
        answer: "Quick",
      },
    ],
  },

  {
    id: "competitive",
    name: "Other Competitive Exams",
    description:
      "Build general competitive-exam preparation with aptitude, reasoning, verbal ability and problem solving.",
    topics: [
      "Quantitative Aptitude",
      "Logical Reasoning",
      "Verbal Ability",
      "General Awareness",
      "Problem Solving",
    ],
    questions: [
      {
        id: 201,
        topic: "Quantitative Aptitude",
        difficulty: "Easy",
        question:
          "What is the average of 10, 20 and 30?",
        options: ["15", "20", "25", "30"],
        answer: "20",
      },
      {
        id: 202,
        topic: "Logical Reasoning",
        difficulty: "Easy",
        question:
          "Find the next number: 5, 10, 15, 20, ?",
        options: ["22", "25", "30", "35"],
        answer: "25",
      },
      {
        id: 203,
        topic: "Verbal Ability",
        difficulty: "Easy",
        question:
          "Choose the opposite of 'Ancient'.",
        options: [
          "Old",
          "Modern",
          "Historic",
          "Traditional",
        ],
        answer: "Modern",
      },
      {
        id: 204,
        topic: "Problem Solving",
        difficulty: "Medium",
        question:
          "If 8 machines produce 800 units in one hour, how many units will 4 machines produce in one hour?",
        options: ["200", "300", "400", "600"],
        answer: "400",
      },
      {
        id: 205,
        topic: "General Awareness",
        difficulty: "Easy",
        question:
          "Which planet is known as the Red Planet?",
        options: [
          "Earth",
          "Mars",
          "Jupiter",
          "Venus",
        ],
        answer: "Mars",
      },
    ],
  },
];

export default function ExamsPage() {
  const [selectedExam, setSelectedExam] =
    useState<ExamId>("gate");

  const [selectedTopic, setSelectedTopic] =
    useState("All Topics");

  const [current, setCurrent] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const exam =
    exams.find((item) => item.id === selectedExam) ||
    exams[0];

  const availableQuestions = useMemo(() => {
    if (selectedTopic === "All Topics") {
      return exam.questions;
    }

    return exam.questions.filter(
      (question) => question.topic === selectedTopic
    );
  }, [exam, selectedTopic]);

  const progressKey = `prepxpert_exam_progress_${selectedExam}`;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(progressKey);

      if (saved) {
        const value = Number(saved);

        if (!Number.isNaN(value)) {
          setProgress(Math.min(100, Math.max(0, value)));
        }
      }
    } catch (error) {
      console.error("Progress loading error:", error);
    }
  }, [progressKey]);

  function selectExam(id: ExamId) {
    setSelectedExam(id);
    setSelectedTopic("All Topics");
    setCurrent(0);
    setSelectedAnswer("");
    setScore(0);
    setFinished(false);
    setStarted(false);
  }

  function selectTopic(topic: string) {
    setSelectedTopic(topic);
    setCurrent(0);
    setSelectedAnswer("");
    setScore(0);
    setFinished(false);
    setStarted(false);
  }

  function startPractice() {
    setCurrent(0);
    setScore(0);
    setSelectedAnswer("");
    setFinished(false);
    setStarted(true);
  }

  function saveProgress(newProgress: number) {
    const safeProgress = Math.min(
      100,
      Math.max(0, Math.round(newProgress))
    );

    setProgress(safeProgress);

    try {
      localStorage.setItem(
        progressKey,
        String(safeProgress)
      );
    } catch (error) {
      console.error("Progress save error:", error);
    }
  }

  function handleNext() {
    if (!selectedAnswer) return;

    const question =
      availableQuestions[current];

    const isCorrect =
      selectedAnswer === question.answer;

    const newScore =
      isCorrect ? score + 1 : score;

    if (
      current ===
      availableQuestions.length - 1
    ) {
      setScore(newScore);
      setFinished(true);

      const testPercentage = Math.round(
        (newScore /
          availableQuestions.length) *
          100
      );

      saveProgress(
        Math.max(progress, testPercentage)
      );

      return;
    }

    setScore(newScore);
    setCurrent((previous) => previous + 1);
    setSelectedAnswer("");

    const questionProgress =
      ((current + 1) /
        availableQuestions.length) *
      100;

    saveProgress(
      Math.max(progress, Math.round(questionProgress))
    );
  }

  function restartPractice() {
    setCurrent(0);
    setScore(0);
    setSelectedAnswer("");
    setFinished(false);
    setStarted(true);
  }

  function resetProgress() {
    setProgress(0);

    try {
      localStorage.removeItem(progressKey);
    } catch (error) {
      console.error("Progress reset error:", error);
    }
  }

  const percentage =
    availableQuestions.length > 0
      ? Math.round(
          (score / availableQuestions.length) * 100
        )
      : 0;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}

        <header style={styles.header}>
          <div>
            <div style={styles.badge}>
              SMART PLACEMENT PORTAL
            </div>

            <h1 style={styles.title}>
              Competitive Exam Preparation
            </h1>

            <p style={styles.subtitle}>
              Prepare for GATE, CAT and other
              competitive exams with topic-wise
              practice.
            </p>
          </div>

          <a
            href="/dashboard"
            style={styles.backButton}
          >
            ← Dashboard
          </a>
        </header>

        {/* EXAM SELECTOR */}

        <section style={styles.examGrid}>
          {exams.map((item) => {
            const active =
              item.id === selectedExam;

            return (
              <button
                key={item.id}
                onClick={() =>
                  selectExam(item.id)
                }
                style={{
                  ...styles.examCard,
                  border: active
                    ? "2px solid #111827"
                    : "1px solid #e2e5ea",
                  transform: active
                    ? "translateY(-3px)"
                    : "none",
                }}
              >
                <div style={styles.examIcon}>
                  {item.id === "gate"
                    ? "🎓"
                    : item.id === "cat"
                    ? "📊"
                    : "📝"}
                </div>

                <h2 style={styles.examName}>
                  {item.name}
                </h2>

                <p
                  style={styles.examDescription}
                >
                  {item.description}
                </p>

                <span style={styles.viewText}>
                  {active
                    ? "Selected ✓"
                    : "Select Exam →"}
                </span>
              </button>
            );
          })}
        </section>

        {/* MAIN PREPARATION CARD */}

        <section style={styles.contentCard}>
          <div style={styles.contentHeader}>
            <div>
              <span style={styles.sectionLabel}>
                SELECTED EXAM
              </span>

              <h2 style={styles.contentTitle}>
                {exam.name} Preparation
              </h2>

              <p
                style={
                  styles.contentDescription
                }
              >
                {exam.description}
              </p>
            </div>

            <div style={styles.progressBox}>
              <strong style={styles.progressNumber}>
                {progress}%
              </strong>

              <span>
                Preparation Progress
              </span>

              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div style={styles.divider} />

          {!started ? (
            <>
              <h3 style={styles.topicHeading}>
                Choose a Topic
              </h3>

              <div style={styles.topicSelector}>
                <button
                  onClick={() =>
                    selectTopic("All Topics")
                  }
                  style={{
                    ...styles.topicButton,
                    background:
                      selectedTopic ===
                      "All Topics"
                        ? "#111827"
                        : "#f8fafc",
                    color:
                      selectedTopic ===
                      "All Topics"
                        ? "white"
                        : "#111827",
                  }}
                >
                  All Topics
                </button>

                {exam.topics.map(
                  (topic) => (
                    <button
                      key={topic}
                      onClick={() =>
                        selectTopic(topic)
                      }
                      style={{
                        ...styles.topicButton,
                        background:
                          selectedTopic ===
                          topic
                            ? "#111827"
                            : "#f8fafc",
                        color:
                          selectedTopic ===
                          topic
                            ? "white"
                            : "#111827",
                      }}
                    >
                      {topic}
                    </button>
                  )
                )}
              </div>

              <div style={styles.practiceInfo}>
                <div>
                  <strong>
                    {availableQuestions.length}
                  </strong>

                  <span>
                    Practice Questions
                  </span>
                </div>

                <div>
                  <strong>
                    {selectedTopic}
                  </strong>

                  <span>
                    Selected Topic
                  </span>
                </div>

                <div>
                  <strong>
                    {exam.name}
                  </strong>

                  <span>
                    Exam
                  </span>
                </div>
              </div>

              <button
                onClick={startPractice}
                disabled={
                  availableQuestions.length ===
                  0
                }
                style={{
                  ...styles.primaryButton,
                  opacity:
                    availableQuestions.length ===
                    0
                      ? 0.5
                      : 1,
                }}
              >
                🚀 Start Practice
              </button>

              <button
                onClick={resetProgress}
                style={styles.secondaryButton}
              >
                Reset Progress
              </button>
            </>
          ) : finished ? (
            /* RESULT */

            <div style={styles.resultArea}>
              <div style={styles.resultIcon}>
                {percentage >= 80
                  ? "🏆"
                  : percentage >= 60
                  ? "🎯"
                  : "📚"}
              </div>

              <h2 style={styles.resultTitle}>
                Practice Completed!
              </h2>

              <p
                style={
                  styles.resultSubtitle
                }
              >
                {exam.name} •{" "}
                {selectedTopic}
              </p>

              <div style={styles.resultBox}>
                <div>
                  <span>Score</span>
                  <strong>
                    {score} /{" "}
                    {availableQuestions.length}
                  </strong>
                </div>

                <div>
                  <span>Percentage</span>
                  <strong>
                    {percentage}%
                  </strong>
                </div>
              </div>

              <div
                style={
                  styles.performanceMessage
                }
              >
                {percentage >= 80
                  ? "Excellent performance! Your preparation is on the right track. 🚀"
                  : percentage >= 60
                  ? "Good performance! Keep practicing to improve your accuracy. 💪"
                  : "Keep practicing! Focus on the weak topics and build your fundamentals. 📖"}
              </div>

              <div style={styles.resultActions}>
                <button
                  onClick={restartPractice}
                  style={
                    styles.primaryButton
                  }
                >
                  🔄 Retake Practice
                </button>

                <button
                  onClick={() => {
                    setStarted(false);
                    setFinished(false);
                    setCurrent(0);
                    setScore(0);
                    setSelectedAnswer("");
                  }}
                  style={
                    styles.secondaryButton
                  }
                >
                  ← Choose Topic
                </button>
              </div>
            </div>
          ) : (
            /* QUIZ */

            <div>
              <div
                style={
                  styles.quizTopBar
                }
              >
                <div>
                  <span
                    style={
                      styles.questionLabel
                    }
                  >
                    QUESTION{" "}
                    {current + 1} OF{" "}
                    {
                      availableQuestions.length
                    }
                  </span>

                  <h3
                    style={
                      styles.quizTopic
                    }
                  >
                    {
                      availableQuestions[
                        current
                      ].topic
                    }
                  </h3>
                </div>

                <span
                  style={{
                    ...styles.difficulty,
                    background:
                      availableQuestions[
                        current
                      ].difficulty ===
                      "Hard"
                        ? "#fee2e2"
                        : availableQuestions[
                            current
                          ].difficulty ===
                          "Medium"
                        ? "#fef3c7"
                        : "#dcfce7",
                  }}
                >
                  {
                    availableQuestions[
                      current
                    ].difficulty
                  }
                </span>
              </div>

              <div
                style={
                  styles.questionProgressTrack
                }
              >
                <div
                  style={{
                    ...styles.questionProgressFill,
                    width: `${
                      ((current + 1) /
                        availableQuestions.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <h2
                style={
                  styles.questionText
                }
              >
                {
                  availableQuestions[
                    current
                  ].question
                }
              </h2>

              <div
                style={
                  styles.optionsContainer
                }
              >
                {availableQuestions[
                  current
                ].options.map(
                  (option, index) => {
                    const selected =
                      selectedAnswer ===
                      option;

                    return (
                      <button
                        key={option}
                        onClick={() =>
                          setSelectedAnswer(
                            option
                          )
                        }
                        style={{
                          ...styles.option,
                          background:
                            selected
                              ? "#eef2ff"
                              : "white",
                          border:
                            selected
                              ? "2px solid #111827"
                              : "1px solid #dfe3e8",
                        }}
                      >
                        <span
                          style={
                            styles.optionNumber
                          }
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        <span>
                          {option}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                style={{
                  ...styles.primaryButton,
                  opacity:
                    selectedAnswer
                      ? 1
                      : 0.5,
                }}
              >
                {current ===
                availableQuestions.length -
                  1
                  ? "Submit Practice ✓"
                  : "Next Question →"}
              </button>
            </div>
          )}
        </section>

        {/* INFO CARDS */}

        <section style={styles.infoGrid}>
          <InfoCard
            icon="📚"
            title="Topic-wise Preparation"
            text="Select individual GATE subjects or practice the complete syllabus."
          />

          <InfoCard
            icon="🎯"
            title="Practice MCQs"
            text="Solve questions and instantly calculate your practice score."
          />

          <InfoCard
            icon="📈"
            title="Track Progress"
            text="Your best preparation percentage is saved automatically."
          />

          <InfoCard
            icon="🚀"
            title="Placement Ready"
            text="Use your exam performance with PrepXpert recommendations to improve weak areas."
          />
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div style={styles.infoCard}>
      <div style={styles.infoIcon}>
        {icon}
      </div>

      <h3 style={styles.infoTitle}>
        {title}
      </h3>

      <p style={styles.infoText}>
        {text}
      </p>
    </div>
  );
}

const styles: {
  [key: string]: React.CSSProperties;
} = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "35px 18px 60px",
    color: "#111827",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "30px",
  },

  badge: {
    display: "inline-block",
    padding: "7px 13px",
    border: "1px solid #f0c84b",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    background: "#fffaf0",
    marginBottom: "14px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    lineHeight: 1.15,
    letterSpacing: "-0.8px",
  },

  subtitle: {
    marginTop: "10px",
    color: "#667085",
    fontSize: "16px",
    lineHeight: 1.6,
    maxWidth: "700px",
  },

  backButton: {
    textDecoration: "none",
    background: "white",
    color: "#111827",
    border: "1px solid #d9dde5",
    padding: "11px 18px",
    borderRadius: "9px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  examGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },

  examCard: {
    background: "white",
    borderRadius: "16px",
    padding: "22px",
    textAlign: "left",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.05)",
  },

  examIcon: {
    fontSize: "30px",
    marginBottom: "10px",
  },

  examName: {
    margin: "0 0 7px",
    fontSize: "21px",
  },

  examDescription: {
    color: "#667085",
    lineHeight: 1.55,
    minHeight: "68px",
    fontSize: "14px",
  },

  viewText: {
    display: "inline-block",
    marginTop: "8px",
    fontWeight: 800,
    fontSize: "14px",
  },

  contentCard: {
    background: "white",
    borderRadius: "18px",
    padding: "30px",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.06)",
  },

  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
  },

  sectionLabel: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    color: "#667085",
  },

  contentTitle: {
    margin: "7px 0",
    fontSize: "28px",
  },

  contentDescription: {
    color: "#667085",
    margin: 0,
    lineHeight: 1.5,
  },

  progressBox: {
    minWidth: "190px",
    padding: "16px",
    borderRadius: "13px",
    background: "#f5f7fb",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  progressNumber: {
    fontSize: "27px",
  },

  progressTrack: {
    height: "7px",
    width: "100%",
    background: "#e5e7eb",
    borderRadius: "20px",
    overflow: "hidden",
    marginTop: "7px",
  },

  progressFill: {
    height: "100%",
    background: "#111827",
    borderRadius: "20px",
    transition: "width 0.3s ease",
  },

  divider: {
    height: "1px",
    background: "#e5e7eb",
    margin: "28px 0",
  },

  topicHeading: {
    margin: "0 0 16px",
    fontSize: "20px",
  },

  topicSelector: {
    display: "flex",
    gap: "9px",
    flexWrap: "wrap",
  },

  topicButton: {
    border: "1px solid #e1e5eb",
    padding: "10px 13px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },

  practiceInfo: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "25px",
    marginBottom: "22px",
  },

  practiceInfoBox: {
    background: "#f8fafc",
    padding: "18px",
    borderRadius: "12px",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    background: "#111827",
    color: "white",
    padding: "13px 20px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "15px",
    marginTop: "12px",
  },

  secondaryButton: {
    width: "100%",
    border: "1px solid #d9dde5",
    background: "white",
    color: "#111827",
    padding: "12px 20px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
    marginTop: "10px",
  },

  quizTopBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  questionLabel: {
    fontSize: "11px",
    fontWeight: 800,
    color: "#667085",
    letterSpacing: "1.2px",
  },

  quizTopic: {
    margin: "7px 0 0",
    fontSize: "18px",
  },

  difficulty: {
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 800,
  },

  questionProgressTrack: {
    width: "100%",
    height: "6px",
    background: "#e5e7eb",
    borderRadius: "20px",
    overflow: "hidden",
    marginTop: "22px",
  },

  questionProgressFill: {
    height: "100%",
    background: "#111827",
    transition: "width 0.3s ease",
  },

  questionText: {
    fontSize: "24px",
    lineHeight: 1.45,
    margin: "28px 0 22px",
  },

  optionsContainer: {
    display: "grid",
    gap: "12px",
  },

  option: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "15px",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "15px",
    fontWeight: 600,
  },

  optionNumber: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#f1f3f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    flexShrink: 0,
  },

  resultArea: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto",
    padding: "15px 0",
  },

  resultIcon: {
    fontSize: "55px",
  },

  resultTitle: {
    fontSize: "30px",
    margin: "10px 0 5px",
  },

  resultSubtitle: {
    color: "#667085",
    marginTop: "5px",
  },

  resultBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "15px",
    marginTop: "25px",
  },

  resultBoxItem: {
    background: "#f5f7fb",
    padding: "20px",
    borderRadius: "12px",
  },

  performanceMessage: {
    marginTop: "20px",
    padding: "17px",
    borderRadius: "12px",
    background: "#f8fafc",
    color: "#475467",
    lineHeight: 1.6,
  },

  resultActions: {
    marginTop: "20px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginTop: "22px",
  },

  infoCard: {
    background: "white",
    padding: "21px",
    borderRadius: "14px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.05)",
  },

  infoIcon: {
    fontSize: "25px",
  },

  infoTitle: {
    margin: "9px 0 5px",
    fontSize: "17px",
  },

  infoText: {
    color: "#667085",
    lineHeight: 1.5,
    margin: 0,
    fontSize: "14px",
  },
};