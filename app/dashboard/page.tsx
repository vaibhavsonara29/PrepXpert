"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LinkedInStatus = {
  connected: boolean;
  name?: string;
  picture?: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [linkedin, setLinkedin] = useState<LinkedInStatus>({
    connected: false,
  });

  const [linkedinLoading, setLinkedinLoading] = useState(true);

  const modules = [
    {
      title: "Aptitude Test",
      description:
        "Practice quantitative, logical and verbal questions.",
      path: "/aptitude",
    },
    {
      title: "Coding Practice",
      description:
        "Improve your programming and problem-solving skills.",
      path: "/coding",
    },
    {
      title: "Resume Builder",
      description:
        "Create a professional placement-ready resume.",
      path: "/resume",
    },
    {
      title: "Interview Preparation",
      description:
        "Prepare for technical and HR interview questions.",
      path: "/interview",
    },
    {
      title: "Performance Tracking",
      description:
        "Track your test scores and learning progress.",
      path: "/performance",
    },
    {
      title: "AI Recommendations",
      description:
        "Get personalized preparation recommendations.",
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

  // Check LinkedIn connection status
  useEffect(() => {
    async function checkLinkedIn() {
      try {
        const response = await fetch("/api/linkedin/status", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          setLinkedin({
            connected: false,
          });
          return;
        }

        const data = await response.json();

        if (data.success) {
          setLinkedin({
            connected: Boolean(data.connected),
            name: data.profile?.name,
            picture: data.profile?.picture,
          });
        }
      } catch (error) {
        console.error("LinkedIn status error:", error);

        setLinkedin({
          connected: false,
        });
      } finally {
        setLinkedinLoading(false);
      }
    }

    checkLinkedIn();
  }, []);

  // Start LinkedIn OAuth
  function connectLinkedIn() {
    window.location.href = "/api/linkedin/login";
  }

  // Logout
  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("user");

    router.push("/auth/login");
    router.refresh();
  }

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
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {/* ================= HEADER ================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              PrepXpert
            </h1>

            <p
              style={{
                color: "#666",
                marginBottom: 0,
              }}
            >
              Smart Placement Preparation Portal
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#111",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>

        {/* ================= LINKEDIN ================= */}

        <section
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "30px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Left Side */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {/* Profile Image / LinkedIn Icon */}

            {linkedin.picture ? (
              <img
                src={linkedin.picture}
                alt="LinkedIn profile"
                width={58}
                height={58}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #0a66c2",
                }}
              />
            ) : (
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "50%",
                  background: "#0a66c2",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  fontWeight: "700",
                }}
              >
                in
              </div>
            )}

            {/* Text */}

            <div>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "19px",
                }}
              >
                LinkedIn Integration
              </h3>

              {linkedinLoading ? (
                <p
                  style={{
                    margin: 0,
                    color: "#666",
                  }}
                >
                  Checking LinkedIn connection...
                </p>
              ) : linkedin.connected ? (
                <p
                  style={{
                    margin: 0,
                    color: "#15803d",
                    fontWeight: "600",
                  }}
                >
                  ✓ LinkedIn Connected
                  {linkedin.name
                    ? ` — ${linkedin.name}`
                    : ""}
                </p>
              ) : (
                <p
                  style={{
                    margin: 0,
                    color: "#666",
                    maxWidth: "650px",
                    lineHeight: 1.5,
                  }}
                >
                  Connect your LinkedIn profile to use
                  your profile information for better
                  resume and AI recommendations.
                </p>
              )}
            </div>
          </div>

          {/* Right Side */}

          {!linkedinLoading && !linkedin.connected && (
            <button
              onClick={connectLinkedIn}
              style={{
                padding: "12px 22px",
                border: "none",
                borderRadius: "8px",
                background: "#0a66c2",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
              }}
            >
              Connect LinkedIn
            </button>
          )}

          {!linkedinLoading && linkedin.connected && (
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: "#dcfce7",
                color: "#166534",
                fontWeight: "600",
              }}
            >
              Connected ✓
            </div>
          )}
        </section>

        {/* ================= WELCOME ================= */}

        <section
          style={{
            background: "#111",
            color: "white",
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            Welcome to your Dashboard 👋
          </h2>

          <p
            style={{
              color: "#ddd",
              marginBottom: 0,
            }}
          >
            Select a module below and start your
            placement preparation.
          </p>
        </section>

        {/* ================= STATS ================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <StatCard
            title="Tests Completed"
            value="0"
          />

          <StatCard
            title="Coding Problems"
            value="0"
          />

          <StatCard
            title="Resume Status"
            value="Not Created"
          />

          <StatCard
            title="Overall Progress"
            value="0%"
          />
        </div>

        {/* ================= MODULES ================= */}

        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Placement Modules
        </h2>

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
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                }}
              >
                {module.title}
              </h3>

              <p
                style={{
                  color: "#666",
                  minHeight: "45px",
                  lineHeight: 1.5,
                }}
              >
                {module.description}
              </p>

              <button
                onClick={() =>
                  router.push(module.path)
                }
                style={{
                  marginTop: "15px",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "7px",
                  background: "#111",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
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

/* ================= STAT CARD ================= */

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
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.06)",
      }}
    >
      <p
        style={{
          color: "#666",
          margin: 0,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          marginBottom: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}