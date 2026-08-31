"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const modules = [
    {
      title: "Aptitude Test",
      description: "Practice quantitative, logical and verbal questions.",
      path: "/aptitude",
    },
    {
      title: "Coding Practice",
      description: "Improve your programming and problem-solving skills.",
      path: "/coding",
    },
    {
      title: "Resume Builder",
      description: "Create a professional placement-ready resume.",
      path: "/resume",
    },
    {
      title: "Interview Preparation",
      description: "Prepare for technical and HR interview questions.",
      path: "/interview",
    },
    {
      title: "Performance Tracking",
      description: "Track your test scores and learning progress.",
      path: "/performance",
    },
    {
      title: "AI Recommendations",
      description: "Get personalized preparation recommendations.",
      path: "/recommendations",
    },
    {
  title: "Practice History",
  description:
    "View your practice activity, progress and saved performance history.",
  path: "/history",
},
{
  title: "Competitive Exam Preparation",
  description:
    "Prepare for GATE, CAT and other competitive exams.",
  path: "/exams",
},
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>PrepXpert</h1>
            <p style={{ color: "#666" }}>
              Smart Placement Preparation Portal
            </p>
          </div>

          <button
            onClick={() => router.push("/auth/login")}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#111",
              color: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* Welcome */}
        <section
          style={{
            background: "#111",
            color: "white",
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "30px",
          }}
        >
          <h2>Welcome to your Dashboard 👋</h2>

          <p style={{ color: "#ddd" }}>
            Select a module below and start your placement preparation.
          </p>
        </section>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <StatCard title="Tests Completed" value="0" />
          <StatCard title="Coding Problems" value="0" />
          <StatCard title="Resume Status" value="Not Created" />
          <StatCard title="Overall Progress" value="0%" />
        </div>

        {/* Modules */}
        <h2 style={{ marginBottom: "20px" }}>Placement Modules</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {modules.map((module) => (
            <div
              key={module.title}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "14px",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h3>{module.title}</h3>

              <p
                style={{
                  color: "#666",
                  minHeight: "45px",
                }}
              >
                {module.description}
              </p>

              <button
                onClick={() => router.push(module.path)}
                style={{
                  marginTop: "15px",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "7px",
                  background: "#111",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Open Module
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "12px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
      }}
    >
      <p style={{ color: "#666", margin: 0 }}>{title}</p>

      <h2 style={{ marginBottom: 0 }}>{value}</h2>
    </div>
  );
}