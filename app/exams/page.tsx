"use client";

import { useState } from "react";

type Exam = {
  id: string;
  name: string;
  description: string;
  topics: string[];
};

const exams: Exam[] = [
  {
    id: "gate",
    name: "GATE",
    description:
      "Prepare for GATE Computer Science and Engineering with core CS and aptitude topics.",
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
  },
  {
    id: "cat",
    name: "CAT",
    description:
      "Prepare for CAT with quantitative aptitude, logical reasoning and verbal ability.",
    topics: [
      "Quantitative Ability",
      "Logical Reasoning",
      "Data Interpretation",
      "Verbal Ability",
      "Reading Comprehension",
    ],
  },
  {
    id: "competitive",
    name: "Other Competitive Exams",
    description:
      "Build preparation for placement and other competitive examinations.",
    topics: [
      "Quantitative Aptitude",
      "Logical Reasoning",
      "Verbal Ability",
      "General Awareness",
      "Problem Solving",
    ],
  },
];

export default function ExamsPage() {
  const [selectedExam, setSelectedExam] = useState("gate");

  const exam =
    exams.find((item) => item.id === selectedExam) || exams[0];

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.badge}>SMART PLACEMENT PORTAL</div>

            <h1 style={styles.title}>
              Competitive Exam Preparation
            </h1>

            <p style={styles.subtitle}>
              Prepare for GATE, CAT and other competitive exams
              from one place.
            </p>
          </div>

          <a href="/dashboard" style={styles.backButton}>
            ← Dashboard
          </a>
        </div>

        <section style={styles.examGrid}>
          {exams.map((item) => {
            const active = item.id === selectedExam;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedExam(item.id)}
                style={{
                  ...styles.examCard,
                  border: active
                    ? "2px solid #111"
                    : "1px solid #e2e5ea",
                  transform: active
                    ? "translateY(-2px)"
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

                <p style={styles.examDescription}>
                  {item.description}
                </p>

                <span style={styles.viewText}>
                  View Preparation →
                </span>
              </button>
            );
          })}
        </section>

        <section style={styles.contentCard}>
          <div style={styles.contentHeader}>
            <div>
              <span style={styles.sectionLabel}>
                SELECTED EXAM
              </span>

              <h2 style={styles.contentTitle}>
                {exam.name} Preparation
              </h2>

              <p style={styles.contentDescription}>
                {exam.description}
              </p>
            </div>

            <div style={styles.progressBox}>
              <strong>0%</strong>
              <span>Preparation Progress</span>
            </div>
          </div>

          <div style={styles.divider} />

          <h3 style={styles.topicHeading}>
            Important Topics
          </h3>

          <div style={styles.topicGrid}>
            {exam.topics.map((topic, index) => (
              <div key={topic} style={styles.topicCard}>
                <div style={styles.topicNumber}>
                  {index + 1}
                </div>

                <div>
                  <strong>{topic}</strong>

                  <p style={styles.topicStatus}>
                    Start preparing
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.actionArea}>
            <a href="/aptitude" style={styles.primaryButton}>
              Start Practice
            </a>

            <span style={styles.note}>
              Practice questions will be added to this
              preparation module.
            </span>
          </div>
        </section>

        <section style={styles.infoGrid}>
          <InfoCard
            icon="📚"
            title="Topic-wise Preparation"
            text="Study important subjects and organize your preparation."
          />

          <InfoCard
            icon="🎯"
            title="Exam Focus"
            text="Choose the exam that matches your preparation goal."
          />

          <InfoCard
            icon="📈"
            title="Track Progress"
            text="Monitor your preparation progress from the portal."
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
      <div style={styles.infoIcon}>{icon}</div>

      <h3 style={styles.infoTitle}>{title}</h3>

      <p style={styles.infoText}>{text}</p>
    </div>
  );
}

const styles: {
  [key: string]: React.CSSProperties;
} = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px",
    color: "#111827",
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
    marginBottom: "35px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    border: "1px solid #f0c84b",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    background: "#fffaf0",
    marginBottom: "15px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    lineHeight: 1.15,
  },

  subtitle: {
    marginTop: "10px",
    color: "#667085",
    fontSize: "16px",
  },

  backButton: {
    textDecoration: "none",
    background: "white",
    color: "#111",
    border: "1px solid #d9dde5",
    padding: "11px 18px",
    borderRadius: "9px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  examGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  examCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "left",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  },

  examIcon: {
    fontSize: "30px",
    marginBottom: "12px",
  },

  examName: {
    margin: "0 0 8px",
    fontSize: "22px",
  },

  examDescription: {
    color: "#667085",
    lineHeight: 1.6,
    minHeight: "70px",
  },

  viewText: {
    display: "inline-block",
    marginTop: "10px",
    fontWeight: 700,
  },

  contentCard: {
    background: "white",
    borderRadius: "18px",
    padding: "30px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  },

  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
  },

  sectionLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "#667085",
  },

  contentTitle: {
    margin: "8px 0",
    fontSize: "28px",
  },

  contentDescription: {
    color: "#667085",
    margin: 0,
  },

  progressBox: {
    minWidth: "160px",
    padding: "18px",
    borderRadius: "12px",
    background: "#f5f7fb",
    textAlign: "center",
  },

  divider: {
    height: "1px",
    background: "#e5e7eb",
    margin: "28px 0",
  },

  topicHeading: {
    marginBottom: "18px",
  },

  topicGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
  },

  topicCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "15px",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
  },

  topicNumber: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#f1f3f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    flexShrink: 0,
  },

  topicStatus: {
    margin: "4px 0 0",
    color: "#98a2b3",
    fontSize: "13px",
  },

  actionArea: {
    marginTop: "28px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  primaryButton: {
    display: "inline-block",
    background: "#111827",
    color: "white",
    textDecoration: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    fontWeight: 600,
  },

  note: {
    color: "#667085",
    fontSize: "13px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginTop: "25px",
  },

  infoCard: {
    background: "white",
    padding: "22px",
    borderRadius: "14px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
  },

  infoIcon: {
    fontSize: "25px",
  },

  infoTitle: {
    margin: "10px 0 5px",
  },

  infoText: {
    color: "#667085",
    lineHeight: 1.5,
    margin: 0,
  },
};