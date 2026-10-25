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
  const [recommendation, setRecommendation] =
    useState<Recommendation | null>(null);

  const [overallScore, setOverallScore] = useState(0);

  const [aptitudeScore, setAptitudeScore] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [userEmail, setUserEmail] = useState("");

  const [linkedinConnected, setLinkedinConnected] =
    useState(false);

  const [linkedinName, setLinkedinName] =
    useState("");

  useEffect(() => {
    generateRecommendation();
  }, []);

  async function generateRecommendation() {
    setLoading(true);
    setError("");

    try {
      let resumeData = null;

      try {
        const savedResume =
          localStorage.getItem("Smart Placement Preperation Portal-resume");

        if (savedResume) {
          resumeData = JSON.parse(savedResume);
        }
      } catch (storageError) {
        console.error(
          "Unable to read saved resume for AI recommendation:",
          storageError
        );
      }

      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          resume: resumeData,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to generate recommendation."
        );
        return;
      }

      setRecommendation(data.recommendation);

      setOverallScore(
        Number(data.overallScore) || 0
      );

      setAptitudeScore(
        Number(
          data.performance?.aptitude?.percentage
        ) || 0
      );

      setUserEmail(
        data.user?.email || ""
      );

      setLinkedinConnected(
        Boolean(data.linkedin?.connected)
      );

      setLinkedinName(
        data.linkedin?.name || ""
      );
    } catch (error) {
      console.error(
        "Recommendation error:",
        error
      );

      setError(
        "Unable to connect with recommendation service."
      );
    } finally {
      setLoading(false);
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

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <main style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}>
            ✨
          </div>

          <h1 style={styles.loadingTitle}>
            Wait Analyzing Your Performance
          </h1>

          <p style={styles.loadingText}>
            Wait.. Getting your latest aptitude result
            and preparing personalized AI
            recommendations...
          </p>
        </div>
      </main>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error) {
    return (
      <main style={styles.container}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>
            ⚠️
          </div>

          <h1 style={styles.errorTitle}>
            Recommendation Unavailable
          </h1>

          <p style={styles.errorText}>
            {error}
          </p>

          <button
            onClick={generateRecommendation}
            style={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // -----------------------------------------
  // RESULT
  // -----------------------------------------

  if (!recommendation) {
    return (
      <main style={styles.container}>
        <div style={styles.errorCard}>
          <h1>
            No Recommendation Available
          </h1>

          <p>
            Complete your aptitude test first.
          </p>

          <button
            onClick={() =>
              (window.location.href =
                "/aptitude")
            }
            style={styles.retryButton}
          >
            Take Aptitude Test
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <div style={styles.wrapper}>

        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <div style={styles.badge}>
              ✨ AI POWERED
            </div>

            <h1 style={styles.title}>
              AI Career Recommendation
            </h1>

            <p style={styles.subtitle}>
              Personalized placement guidance
              based on your latest performance.
            </p>

            {userEmail && (
              <p style={styles.userEmail}>
                For: {userEmail}
              </p>
            )}

            {linkedinConnected && (
              <div style={styles.linkedinBadge}>
                ✓ LinkedIn profile connected
                {linkedinName
                  ? ` — ${linkedinName}`
                  : ""}
              </div>
            )}
          </div>
        </div>

        {/* PERFORMANCE */}

        <section style={styles.resultCard}>
          <div style={styles.performanceHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Your Performance
              </h2>

              <p style={styles.sectionText}>
                Latest verified aptitude result
              </p>
            </div>

            <div style={styles.overallScore}>
              <strong>
                {overallScore}%
              </strong>

              <span>
                Current Readiness
              </span>
            </div>
          </div>

          <div style={styles.scoreSummary}>
            <div style={styles.summaryBox}>
              <div style={styles.summaryTop}>
                <span>
                  Aptitude
                </span>

                <strong>
                  {aptitudeScore}%
                </strong>
              </div>

              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${aptitudeScore}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div style={styles.infoBox}>
            ℹ️ Your recommendation uses your
            verified aptitude result. When
            available, Smart Placement Preparation Portal also uses your
            connected LinkedIn profile and saved
            Resume Builder information to make
            career guidance more personalized.
            Coding and Interview scores are not
            invented if they are not available.
          </div>
        </section>

        {/* OVERALL ASSESSMENT */}

        <section style={styles.resultCard}>
          <h2 style={styles.sectionTitle}>
            📊 Overall Assessment
          </h2>

          <div style={styles.assessmentBox}>
            {recommendation.overallAssessment}
          </div>
        </section>

        {/* STRENGTHS */}

        <section style={styles.resultCard}>
          <h2 style={styles.sectionTitle}>
            💪 Your Strengths
          </h2>

          <div style={styles.list}>
            {recommendation.strengths?.length ? (
              recommendation.strengths.map(
                (strength, index) => (
                  <div
                    key={index}
                    style={styles.strengthItem}
                  >
                    <span>
                      ✓
                    </span>

                    <span>
                      {strength}
                    </span>
                  </div>
                )
              )
            ) : (
              <p style={styles.mutedText}>
                Keep practicing to build stronger
                areas.
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
            {recommendation.weakAreas?.length ? (
              recommendation.weakAreas.map(
                (item, index) => (
                  <div
                    key={index}
                    style={styles.weakCard}
                  >
                    <div
                      style={styles.weakTop}
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
                      style={styles.weakScore}
                    >
                      {item.score}%
                    </div>

                    <p
                      style={styles.reason}
                    >
                      {item.reason}
                    </p>
                  </div>
                )
              )
            ) : (
              <p style={styles.mutedText}>
                No major weak area was
                identified.
              </p>
            )}
          </div>
        </section>

        {/* RECOMMENDED ACTIONS */}

        <section style={styles.resultCard}>
          <h2 style={styles.sectionTitle}>
            🎯 Recommended Actions
          </h2>

          <p style={styles.sectionText}>
            Follow these actions to improve your
            placement readiness.
          </p>

          <div style={styles.actionGrid}>
            {recommendation.recommendedActions?.map(
              (action, index) => (
                <div
                  key={index}
                  style={styles.actionCard}
                >
                  <div
                    style={styles.actionNumber}
                  >
                    {index + 1}
                  </div>

                  <h3 style={styles.actionTitle}>
                    {action.title}
                  </h3>

                  <p style={styles.actionText}>
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

          <p style={styles.sectionText}>
            A simple preparation schedule based
            on your current performance.
          </p>

          <div style={styles.plan}>
            {recommendation.sevenDayPlan?.map(
              (item, index) => (
                <div
                  key={index}
                  style={styles.planItem}
                >
                  <div
                    style={styles.dayCircle}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <strong>
                      {item.day}
                    </strong>

                    <p
                      style={styles.planTask}
                    >
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

          <div style={styles.careerAdvice}>
            {recommendation.careerAdvice}
          </div>
        </section>

        {/* REFRESH */}

        <div style={styles.refreshBox}>
          <p>
            Want to generate a fresh analysis?
          </p>

          <button
            onClick={generateRecommendation}
            style={styles.refreshButton}
          >
            🔄 Refresh AI Recommendation
          </button>
        </div>

      </div>
    </main>
  );
}

/* =================================================
   STYLES
================================================= */

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "30px 20px 60px",
    boxSizing: "border-box" as const,
  },

  wrapper: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "25px",
  },

  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "10px",
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

  userEmail: {
    marginTop: "6px",
    color: "#9ca3af",
    fontSize: "13px",
  },

  linkedinBadge: {
    display: "inline-block",
    marginTop: "10px",
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "12px",
    fontWeight: 700,
  },

  resultCard: {
    marginTop: "20px",
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
    boxSizing: "border-box" as const,
  },

  performanceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap" as const,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#111827",
  },

  sectionText: {
    color: "#6b7280",
    marginTop: "7px",
    lineHeight: 1.5,
  },

  overallScore: {
    minWidth: "145px",
    padding: "16px",
    borderRadius: "12px",
    background: "#fff8d6",
    textAlign: "center" as const,
  },

  summaryBox: {
    padding: "18px",
    borderRadius: "12px",
    background: "#f9fafb",
  },

  scoreSummary: {
    marginTop: "20px",
  },

  summaryTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 600,
  },

  progressTrack: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden" as const,
    marginTop: "12px",
  },

  progressBar: {
    height: "100%",
    background: "#f3c623",
    borderRadius: "10px",
  },

  infoBox: {
    marginTop: "18px",
    padding: "15px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#1e40af",
    lineHeight: 1.5,
    fontSize: "14px",
  },

  assessmentBox: {
    marginTop: "18px",
    padding: "20px",
    borderRadius: "12px",
    background: "#f9fafb",
    color: "#374151",
    lineHeight: 1.7,
  },

  list: {
    marginTop: "18px",
    display: "grid",
    gap: "10px",
  },

  strengthItem: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    padding: "14px",
    borderRadius: "10px",
    background: "#ecfdf5",
    color: "#047857",
    lineHeight: 1.5,
  },

  mutedText: {
    color: "#6b7280",
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
    alignItems: "center",
    gap: "10px",
  },

  weakScore: {
    fontSize: "28px",
    fontWeight: 700,
    marginTop: "14px",
    color: "#111827",
  },

  reason: {
    color: "#6b7280",
    lineHeight: 1.5,
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
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  actionCard: {
    position: "relative" as const,
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },

  actionNumber: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111827",
    color: "white",
    fontWeight: 700,
    fontSize: "13px",
  },

  actionTitle: {
    marginTop: "14px",
    color: "#111827",
  },

  actionText: {
    color: "#6b7280",
    lineHeight: 1.5,
  },

  practiceButton: {
    marginTop: "10px",
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
    marginTop: "20px",
  },

  planItem: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    padding: "15px",
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

  planTask: {
    marginTop: "5px",
    color: "#6b7280",
    lineHeight: 1.5,
  },

  careerAdvice: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "12px",
    background: "#fff8d6",
    lineHeight: 1.7,
    color: "#374151",
  },

  refreshBox: {
    textAlign: "center" as const,
    marginTop: "25px",
  },

  refreshButton: {
    padding: "12px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    background: "white",
    color: "#374151",
    cursor: "pointer",
    fontWeight: 600,
  },

  loadingCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "white",
    padding: "40px 30px",
    borderRadius: "16px",
    textAlign: "center" as const,
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  spinner: {
    fontSize: "40px",
  },

  loadingTitle: {
    marginTop: "15px",
    color: "#111827",
  },

  loadingText: {
    color: "#6b7280",
    lineHeight: 1.6,
  },

  errorCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "white",
    padding: "40px 30px",
    borderRadius: "16px",
    textAlign: "center" as const,
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  errorIcon: {
    fontSize: "40px",
  },

  errorTitle: {
    color: "#111827",
  },

  errorText: {
    color: "#6b7280",
    lineHeight: 1.6,
  },

  retryButton: {
    marginTop: "15px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
};