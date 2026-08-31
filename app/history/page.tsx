"use client";

import { useEffect, useMemo, useState } from "react";

type AptitudeResult = {
  score?: number;
  total?: number;
  percentage?: number;
  date?: string;
};

type CodingResult = {
  completed?: number;
  total?: number;
  percentage?: number;
  date?: string;
};

type InterviewResult = {
  completed?: number;
  total?: number;
  percentage?: number;
  date?: string;
};

type HistoryItem = {
  module: string;
  score: number;
  date: string;
  icon: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  function loadHistory() {
    try {
      const items: HistoryItem[] = [];

      // Aptitude
      const aptitudeRaw =
        localStorage.getItem("aptitudeResult");

      if (aptitudeRaw) {
        try {
          const aptitude: AptitudeResult =
            JSON.parse(aptitudeRaw);

          items.push({
            module: "Aptitude Test",
            score: Number(
              aptitude.percentage || 0
            ),
            date:
              aptitude.date ||
              new Date().toISOString(),
            icon: "🧠",
          });
        } catch {
          console.log(
            "Invalid aptitude history"
          );
        }
      }

      // Coding
      const codingRaw =
        localStorage.getItem("codingResult");

      if (codingRaw) {
        try {
          const coding: CodingResult =
            JSON.parse(codingRaw);

          items.push({
            module: "Coding Practice",
            score: Number(
              coding.percentage || 0
            ),
            date:
              coding.date ||
              new Date().toISOString(),
            icon: "💻",
          });
        } catch {
          console.log(
            "Invalid coding history"
          );
        }
      }

      // Interview
      const interviewRaw =
        localStorage.getItem(
          "interviewResult"
        );

      if (interviewRaw) {
        try {
          const interview: InterviewResult =
            JSON.parse(interviewRaw);

          items.push({
            module:
              "Interview Preparation",
            score: Number(
              interview.percentage || 0
            ),
            date:
              interview.date ||
              new Date().toISOString(),
            icon: "🎤",
          });
        } catch {
          console.log(
            "Invalid interview history"
          );
        }
      }

      // Resume
      const resumeRaw =
        localStorage.getItem("resumeData");

      if (resumeRaw) {
        items.push({
          module: "Resume Builder",
          score: 100,
          date:
            new Date().toISOString(),
          icon: "📄",
        });
      }

      // Latest activity first
      items.sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      );

      setHistory(items);
    } catch (error) {
      console.error(
        "HISTORY LOAD ERROR:",
        error
      );

      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  const overall = useMemo(() => {
    if (!history.length) return 0;

    const total = history.reduce(
      (sum, item) =>
        sum + item.score,
      0
    );

    return Math.round(
      total / history.length
    );
  }, [history]);

  const getStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40)
      return "Needs Improvement";

    return "Start Practicing";
  };

  const formatDate = (date: string) => {
    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Unknown date";
    }
  };

  const clearHistory = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to clear your practice history?"
      );

    if (!confirmed) return;

    localStorage.removeItem(
      "aptitudeResult"
    );

    localStorage.removeItem(
      "codingResult"
    );

    localStorage.removeItem(
      "interviewResult"
    );

    localStorage.removeItem(
      "resumeData"
    );

    localStorage.removeItem(
      "codingCompleted"
    );

    setHistory([]);
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.loader}></div>

          <h2>
            Loading Practice History...
          </h2>

          <p>
            Please wait while we load your
            progress.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              SMART PLACEMENT PORTAL
            </p>

            <h1 style={styles.title}>
              Practice History
            </h1>

            <p style={styles.subtitle}>
              Review your placement
              preparation activity and
              progress.
            </p>
          </div>

          <div style={styles.headerActions}>
            <button
              onClick={loadHistory}
              style={styles.refreshButton}
            >
              ↻ Refresh
            </button>

            {history.length > 0 && (
              <button
                onClick={clearHistory}
                style={styles.clearButton}
              >
                Clear History
              </button>
            )}
          </div>
        </header>

        {/* Summary */}
        <section style={styles.summaryGrid}>

          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>
              Activities
            </span>

            <strong style={styles.summaryValue}>
              {history.length}
            </strong>

            <span style={styles.summaryText}>
              Recorded activities
            </span>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>
              Overall Progress
            </span>

            <strong style={styles.summaryValue}>
              {overall}%
            </strong>

            <span style={styles.summaryText}>
              Based on available results
            </span>
          </div>

          <div style={styles.summaryCard}>
            <span style={styles.summaryLabel}>
              Modules
            </span>

            <strong style={styles.summaryValue}>
              4
            </strong>

            <span style={styles.summaryText}>
              Placement preparation areas
            </span>
          </div>

        </section>

        {/* History */}
        <section style={styles.section}>

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Recent Activity
              </h2>

              <p style={styles.sectionText}>
                Your latest saved preparation
                results.
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div style={styles.emptyCard}>

              <div style={styles.emptyIcon}>
                📊
              </div>

              <h2>
                No practice history yet
              </h2>

              <p>
                Complete an aptitude test,
                coding practice or interview
                activity to see your progress
                here.
              </p>

            </div>
          ) : (
            <div style={styles.historyList}>

              {history.map(
                (item, index) => (
                  <div
                    key={`${item.module}-${item.date}-${index}`}
                    style={styles.historyCard}
                  >

                    <div
                      style={styles.historyLeft}
                    >

                      <div
                        style={styles.moduleIcon}
                      >
                        {item.icon}
                      </div>

                      <div>
                        <h3
                          style={
                            styles.moduleTitle
                          }
                        >
                          {item.module}
                        </h3>

                        <p
                          style={
                            styles.dateText
                          }
                        >
                          {formatDate(
                            item.date
                          )}
                        </p>
                      </div>

                    </div>

                    <div
                      style={
                        styles.historyRight
                      }
                    >

                      <strong
                        style={
                          styles.score
                        }
                      >
                        {item.score}%
                      </strong>

                      <span
                        style={{
                          ...styles.status,
                          background:
                            item.score >=
                            80
                              ? "#dcfce7"
                              : item.score >=
                                60
                              ? "#dbeafe"
                              : item.score >=
                                40
                              ? "#fef3c7"
                              : "#f3f4f6",
                          color:
                            item.score >=
                            80
                              ? "#166534"
                              : item.score >=
                                60
                              ? "#1d4ed8"
                              : item.score >=
                                40
                              ? "#92400e"
                              : "#4b5563",
                        }}
                      >
                        {getStatus(
                          item.score
                        )}
                      </span>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* Progress note */}
        <section style={styles.noteCard}>

          <div style={styles.noteIcon}>
            💡
          </div>

          <div>
            <h3 style={styles.noteTitle}>
              Keep practicing
            </h3>

            <p style={styles.noteText}>
              Your history is stored locally
              on this device. Complete more
              preparation activities to build
              your progress record.
            </p>
          </div>

        </section>

      </div>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        @media (max-width: 700px) {

          .history-page {
            padding: 20px 12px !important;
          }

        }

      `}</style>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "35px 20px",
    boxSizing:
      "border-box" as const,
  },

  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "30px",
    flexWrap:
      "wrap" as const,
  },

  eyebrow: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "#6b7280",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  headerActions: {
    display: "flex",
    gap: "10px",
    flexWrap:
      "wrap" as const,
  },

  refreshButton: {
    padding: "10px 17px",
    border:
      "1px solid #d1d5db",
    borderRadius: "9px",
    background: "white",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  },

  clearButton: {
    padding: "10px 17px",
    border: "none",
    borderRadius: "9px",
    background: "#fee2e2",
    color: "#b91c1c",
    cursor: "pointer",
    fontWeight: 600,
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "18px",
    marginBottom: "35px",
  },

  summaryCard: {
    background: "white",
    border:
      "1px solid #e5e7eb",
    borderRadius: "15px",
    padding: "22px",
  },

  summaryLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },

  summaryValue: {
    display: "block",
    marginTop: "8px",
    fontSize: "30px",
    color: "#111827",
  },

  summaryText: {
    display: "block",
    marginTop: "4px",
    color: "#9ca3af",
    fontSize: "12px",
  },

  section: {
    marginBottom: "30px",
  },

  sectionHeader: {
    marginBottom: "15px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#111827",
  },

  sectionText: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  historyList: {
    display: "flex",
    flexDirection:
      "column" as const,
    gap: "12px",
  },

  historyCard: {
    background: "white",
    border:
      "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px 20px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap:
      "wrap" as const,
  },

  historyLeft: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    minWidth: 0,
  },

  moduleIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "11px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    flexShrink: 0,
  },

  moduleTitle: {
    margin: 0,
    fontSize: "15px",
    color: "#111827",
  },

  dateText: {
    margin: "4px 0 0",
    color: "#9ca3af",
    fontSize: "12px",
  },

  historyRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  score: {
    fontSize: "20px",
    color: "#111827",
  },

  status: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    whiteSpace:
      "nowrap" as const,
  },

  emptyCard: {
    background: "white",
    border:
      "1px solid #e5e7eb",
    borderRadius: "15px",
    padding: "50px 25px",
    textAlign:
      "center" as const,
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  noteCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    background: "#111827",
    color: "white",
    borderRadius: "15px",
    padding: "22px",
  },

  noteIcon: {
    fontSize: "25px",
  },

  noteTitle: {
    margin: 0,
    fontSize: "16px",
  },

  noteText: {
    margin: "6px 0 0",
    color: "#d1d5db",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  loadingCard: {
    width: "100%",
    maxWidth: "450px",
    margin: "100px auto",
    padding: "35px",
    background: "white",
    borderRadius: "15px",
    textAlign:
      "center" as const,
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.06)",
  },

  loader: {
    width: "38px",
    height: "38px",
    margin: "0 auto 15px",
    border:
      "4px solid #e5e7eb",
    borderTopColor: "#111827",
    borderRadius: "50%",
    animation:
      "spin 0.8s linear infinite",
  },
};