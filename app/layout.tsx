import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepXpert — Smart Placement Preparation Portal",
  description:
    "Prepare smarter, practise better and get placement-ready with PrepXpert.",
  applicationName: "PrepXpert",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        <footer
          style={{
            background: "#111827",
            color: "white",
            marginTop: "60px",
            padding: "45px 20px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "35px",
            }}
          >
            {/* Brand */}
            <div>
              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "24px",
                }}
              >
                PrepXpert
              </h2>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Smart Placement Preparation Portal
              </p>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                Prepare smarter, practise better and get
                placement-ready.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ marginTop: 0 }}>
                Quick Links
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                <a href="/dashboard" style={linkStyle}>
                  Dashboard
                </a>

                <a href="/aptitude" style={linkStyle}>
                  Aptitude
                </a>

                <a href="/coding" style={linkStyle}>
                  Coding Practice
                </a>

                <a href="/interview" style={linkStyle}>
                  Interview
                </a>

                <a href="/resume" style={linkStyle}>
                  Resume Builder
                </a>

                <a href="/performance" style={linkStyle}>
                  Performance
                </a>

                <a
                  href="/recommendations"
                  style={linkStyle}
                >
                  AI Recommendations
                </a>

                <a href="/exams" style={linkStyle}>
                  Exam Preparation
                </a>

                <a href="/history" style={linkStyle}>
                  History
                </a>
              </div>
            </div>

            {/* Our Team */}
            <div>
              <h3 style={{ marginTop: 0 }}>
                Our Team
              </h3>

              <div
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                }}
              >
                <p style={{ margin: "0 0 14px" }}>
                  <strong style={{ color: "white" }}>
                    Mojidra Krunal Dipakbhai
                  </strong>
                  <br />
                  Roll No. 78
                </p>

                <p style={{ margin: "0 0 14px" }}>
                  <strong style={{ color: "white" }}>
                    Sonara Vaibhav Bhanubhai
                  </strong>
                  <br />
                  Roll No. 66
                </p>

                <p style={{ margin: 0 }}>
                  <strong style={{ color: "white" }}>
                    Sengar Sumit Shisupalsingh
                  </strong>
                  <br />
                  Roll No. 59
                  <br />
                  Enroll No. 2302031800083
                </p>
              </div>
            </div>

            {/* Contact Us */}
            <div>
              <h3 style={{ marginTop: 0 }}>
                Contact Us
              </h3>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.6,
                }}
              >
                Connect with our project team through
                LinkedIn.
              </p>

              <a
                href="https://www.linkedin.com/in/mojidra-krunal-0854ab287/"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Krunal — LinkedIn ↗
              </a>

              <br />

              <a
                href="https://www.linkedin.com/in/vaibhaysonara/"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Vaibhav — LinkedIn ↗
              </a>

              <br />

              <a
                href="https://www.linkedin.com/in/sumit-sengar-510454399?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Sumit — LinkedIn ↗
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div
            style={{
              maxWidth: "1200px",
              margin: "35px auto 0",
              paddingTop: "20px",
              borderTop: "1px solid #374151",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            © 2026 PrepXpert. Smart Placement Preparation
            Portal.
          </div>
        </footer>
      </body>
    </html>
  );
}

const linkStyle: CSSProperties = {
  color: "#cbd5e1",
  textDecoration: "none",
  fontSize: "14px",
};