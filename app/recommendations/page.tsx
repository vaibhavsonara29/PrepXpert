"use client";

import { useEffect, useState } from "react";

type WeakArea = {
  area: string;
  score: number;
  priority: "High" | "Medium" | "Low";
  reason: string;
};

type Action = {
  title: string;
  description: string;
  module: "aptitude" | "coding" | "interview" | "resume";
};

type PlanItem = {
  day: string;
  task: string;
};

type Recommendation = {
  overallAssessment: string;
  strengths: string[];
  weakAreas: WeakArea[];
  recommendedActions: Action[];
  sevenDayPlan: PlanItem[];
  careerAdvice: string;
};

export default function RecommendationPage() {
  const [aptitude, setAptitude] = useState(0);
  const [coding, setCoding] = useState(0);
  const [interview, setInterview] = useState(0);
  const [resume, setResume] = useState(0);

  const [careerGoal, setCareerGoal] = useState(
    "Software Developer"
  );

  const [recommendation, setRecommendation] =
    useState<Recommendation | null>(null);

  const [overallScore, setOverallScore] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSavedRecommendation();
  }, []);

  async function generateRecommendation() {
    setLoading(true);
    setError("");
    setRecommendation(null);

    try {
      const response = await fetch(
        "/api/recommendation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aptitude,
            coding,
            interview,
            resume,
            careerGoal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Failed to generate recommendation."
        );
        return;
      }

      setRecommendation(data.recommendation);
      setOverallScore(data.overallScore || 0);

      localStorage.setItem(
        "aiRecommendation",
        JSON.stringify({
          recommendation: data.recommendation,
          overallScore: data.overallScore,
          aptitude,
          coding,
          interview,
          resume,
          careerGoal,
          date: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error(
        "Recommendation error:",
        error
      );

      setError(
        "Unable to connect with AI. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function loadSavedRecommendation() {
    const saved =
      localStorage.getItem(
        "aiRecommendation"
      );

    if (!saved) {
      return;
    }

    try {
      const data = JSON.parse(saved);

      setRecommendation(
        data.recommendation || null
      );

      setOverallScore(
        data.overallScore || 0
      );

      setAptitude(data.aptitude || 0);
      setCoding(data.coding || 0);
      setInterview(data.interview || 0);
      setResume(data.resume || 0);

      setCareerGoal(
        data.careerGoal ||
          "Software Developer"
      );
    } catch (error) {
      console.error(
        "Saved recommendation error:",
        error
      );
    }
  }

  function practiceNow(
    module: Action["module"]
  ) {
    const routes = {
      aptitude: "/aptitude",
      coding: "/coding",
      interview: "/interview",
      resume: "/resume",
    };

    window.location.href = routes[module];
  }

  function priorityClass(
    priority: WeakArea["priority"]
  ) {
    if (priority === "High") {
      return styles.highPriority;
    }

    if (priority === "Medium") {
      return styles.mediumPriority;
    }

    return styles.lowPriority;
  }

  return (
    <main style={styles.container}>
      <div style={styles.wrapper}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              AI Career Recommendation
            </h1>

            <p style={styles.subtitle}>
              Get personalized placement
              preparation guidance based on your
              performance.
            </p>
          </div>

          <div style={styles.aiBadge}>
            ✨ AI Powered
          </div>
        </div>

        {/* PERFORMANCE INPUT */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Your Performance
          </h2>

          <p style={styles.sectionText}>
            Enter your latest performance scores
            to analyze your preparation.
          </p>

          <div style={styles.scoreGrid}>
            <ScoreInput
              label="Aptitude"
              value={aptitude}
              setValue={setAptitude}
            />

            <ScoreInput
              label="Coding"
              value={coding}
              setValue={setCoding}
            />

            <ScoreInput
              label="Interview"
              value={interview}
              setValue={setInterview}
            />

            <ScoreInput
              label="Resume"
              value={resume}
              setValue={setResume}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Career Goal
            </label>

            <select
              value={careerGoal}
              onChange={(e) =>
                setCareerGoal(
                  e.target.value
                )
              }
              style={styles.select}
            >
              <option>
                Software Developer
              </option>
              <option>
                Frontend Developer
              </option>
              <option>
                Backend Developer
              </option>
              <option>
                Full Stack Developer
              </option>
              <option>
                Data Analyst
              </option>
              <option>
                Data Scientist
              </option>
              <option>
                AI / ML Engineer
              </option>
              <option>
                Cyber Security
              </option>
              <option>
                Cloud Engineer
              </option>
            </select>
          </div>

          <button
            onClick={
              generateRecommendation
            }
            disabled={loading}
            style={{
              ...styles.generateButton,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Analyzing Your Performance..."
              : "✨ Analyze My Performance"}
          </button>

          <button
            onClick={
              loadSavedRecommendation
            }
            style={styles.savedButton}
          >
            Load Previous Analysis
          </button>
        </section>

        {/* ERROR */}
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* AI RESULT */}
        {recommendation && (
          <div>
            {/* OVERALL */}
            <section style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Your AI Analysis
                  </h2>

                  <p
                    style={styles.sectionText}
                  >
                    Personalized analysis for your
                    {` ${careerGoal}`} career goal.
                  </p>
                </div>

                <div style={styles.overallScore}>
                  <strong>
                    {overallScore}%
                  </strong>

                  <span>
                    Overall Readiness
                  </span>
                </div>
              </div>

              <div style={styles.assessmentBox}>
                <h3>
                  Overall Assessment
                </h3>

                <p>
                  {
                    recommendation.overallAssessment
                  }
                </p>
              </div>

              {/* SCORE SUMMARY */}
              <div style={styles.scoreSummary}>
                <ScoreSummary
                  label="Aptitude"
                  value={aptitude}
                />

                <ScoreSummary
                  label="Coding"
                  value={coding}
                />

                <ScoreSummary
                  label="Interview"
                  value={interview}
                />

                <ScoreSummary
                  label="Resume"
                  value={resume}
                />
              </div>
            </section>

            {/* STRENGTHS */}
            <section style={styles.resultCard}>
              <h2 style={styles.sectionTitle}>
                💪 Your Strengths
              </h2>

              <div style={styles.list}>
                {recommendation.strengths
                  ?.length ? (
                  recommendation.strengths.map(
                    (strength, index) => (
                      <div
                        key={index}
                        style={styles.strengthItem}
                      >
                        ✓ {strength}
                      </div>
                    )
                  )
                ) : (
                  <p>
                    Keep practicing to build
                    stronger areas.
                  </p>
                )}
              </div>
            </section>

            {/* WEAK AREAS */}
            <section style={styles.resultCard}>
              <h2 style={styles.sectionTitle}>
                ⚠️ Areas to Improve
              </h2>

              <div style={styles.weakGrid}>
                {recommendation.weakAreas
                  ?.length ? (
                  recommendation.weakAreas.map(
                    (item, index) => (
                      <div
                        key={index}
                        style={styles.weakCard}
                      >
                        <div
                          style={
                            styles.weakTop
                          }
                        >
                          <strong>
                            {item.area}
                          </strong>

                          <span
                            style={{
                              ...styles.priority,
                              ...priorityClass(
                                item.priority
                              ),
                            }}
                          >
                            {item.priority}
                          </span>
                        </div>

                        <div
                          style={
                            styles.weakScore
                          }
                        >
                          {item.score}%
                        </div>

                        <p>
                          {item.reason}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p>
                    No major weak area was
                    identified.
                  </p>
                )}
              </div>
            </section>

            {/* ACTIONS */}
            <section style={styles.resultCard}>
              <h2 style={styles.sectionTitle}>
                🎯 Recommended Actions
              </h2>

              <div style={styles.actionGrid}>
                {recommendation
                  .recommendedActions
                  ?.map(
                    (action, index) => (
                      <div
                        key={index}
                        style={styles.actionCard}
                      >
                        <h3>
                          {action.title}
                        </h3>

                        <p>
                          {action.description}
                        </p>

                        <button
                          onClick={() =>
                            practiceNow(
                              action.module
                            )
                          }
                          style={
                            styles.practiceButton
                          }
                        >
                          Practice Now →
                        </button>
                      </div>
                    )
                  )}
              </div>
            </section>

            {/* 7 DAY PLAN */}
            <section style={styles.resultCard}>
              <h2 style={styles.sectionTitle}>
                📅 7-Day Preparation Plan
              </h2>

              <div style={styles.plan}>
                {recommendation
                  .sevenDayPlan
                  ?.map(
                    (item, index) => (
                      <div
                        key={index}
                        style={styles.planItem}
                      >
                        <div
                          style={
                            styles.dayCircle
                          }
                        >
                          {index + 1}
                        </div>

                        <div>
                          <strong>
                            {item.day}
                          </strong>

                          <p>
                            {item.task}
                          </p>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </section>

            {/* CAREER ADVICE */}
            <section style={styles.resultCard}>
              <h2 style={styles.sectionTitle}>
                💼 Career Advice
              </h2>

              <div
                style={styles.careerAdvice}
              >
                {recommendation.careerAdvice}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function ScoreInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label} Score (%)
      </label>

      <input
        type="number"
        min="0"
        max="100"
        value={value}
        onChange={(e) => {
          const value =
            Number(e.target.value);

          if (
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
          ) {
            setValue(value);
          }
        }}
        style={styles.input}
      />
    </div>
  );
}

function ScoreSummary({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={styles.summaryBox}>
      <span>{label}</span>

      <strong>{value}%</strong>

      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressBar,
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "30px 20px",
    boxSizing: "border-box" as const,
  },

  wrapper: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap" as const,
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
    lineHeight: 1.5,
  },

  aiBadge: {
    padding: "8px 14px",
    borderRadius: "20px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "13px",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
    boxSizing: "border-box" as const,
  },

  resultCard: {
    marginTop: "20px",
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
    boxSizing: "border-box" as const,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#111827",
  },

  sectionText: {
    color: "#6b7280",
    marginTop: "8px",
    lineHeight: 1.5,
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
    marginTop: "25px",
  },

  field: {
    marginTop: "18px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    color: "#374151",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxSizing: "border-box" as const,
    fontSize: "15px",
    outline: "none",
  },

  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxSizing: "border-box" as const,
    background: "white",
    fontSize: "15px",
  },

  generateButton: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    border: "none",
    borderRadius: "9px",
    background: "#111827",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },

  savedButton: {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    background: "white",
    color: "#374151",
    fontWeight: 600,
    cursor: "pointer",
  },

  errorBox: {
    marginTop: "20px",
    padding: "14px",
    borderRadius: "10px",
    background: "#fef2f2",
    color: "#b91c1c",
    overflowWrap: "anywhere" as const,
  },

  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap" as const,
  },

  overallScore: {
    minWidth: "140px",
    padding: "16px",
    borderRadius: "12px",
    background: "#fff8d6",
    textAlign: "center" as const,
  },

  assessmentBox: {
    marginTop: "25px",
    padding: "20px",
    borderRadius: "12px",
    background: "#f9fafb",
    lineHeight: 1.6,
  },

  scoreSummary: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },

  summaryBox: {
    padding: "15px",
    borderRadius: "10px",
    background: "#f9fafb",
  },

  progressTrack: {
    height: "6px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden" as const,
    marginTop: "9px",
  },

  progressBar: {
    height: "100%",
    background: "#f3c623",
    borderRadius: "10px",
  },

  list: {
    marginTop: "18px",
    display: "grid",
    gap: "10px",
  },

  strengthItem: {
    padding: "13px",
    borderRadius: "9px",
    background: "#ecfdf5",
    color: "#047857",
  },

  weakGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "18px",
  },

  weakCard: {
    padding: "18px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },

  weakTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "center",
  },

  weakScore: {
    fontSize: "28px",
    fontWeight: 700,
    marginTop: "12px",
  },

  priority: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
  },

  highPriority: {
    background: "#fee2e2",
    color: "#b91c1c",
  },

  mediumPriority: {
    background: "#fef3c7",
    color: "#92400e",
  },

  lowPriority: {
    background: "#dcfce7",
    color: "#166534",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "15px",
    marginTop: "18px",
  },

  actionCard: {
    padding: "18px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },

  practiceButton: {
    marginTop: "12px",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },

  plan: {
    display: "grid",
    gap: "12px",
    marginTop: "18px",
  },

  planItem: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    padding: "14px",
    borderRadius: "10px",
    background: "#f9fafb",
  },

  dayCircle: {
    minWidth: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },

  careerAdvice: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "12px",
    background: "#fff8d6",
    lineHeight: 1.7,
    color: "#374151",
  },
};