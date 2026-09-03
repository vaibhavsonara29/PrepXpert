"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          })
        );

        setMessage("Login successful!");

        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={containerStyle}>
      <form onSubmit={handleLogin} style={cardStyle}>
        <h1 style={headingStyle}>Sign In</h1>

        <p style={subheadingStyle}>
          Sign in to continue to your PrepXpert dashboard.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in..." : "Sign In / Login"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color:
                message === "Login successful!"
                  ? "green"
                  : "#b91c1c",
              fontWeight: "600",
            }}
          >
            {message}
          </p>
        )}

        {/* Create Account option */}
        <div style={accountLinkBox}>
          <span>Don't have an account?</span>

          <Link href="/auth/register" style={linkStyle}>
            Create Account
          </Link>
        </div>
      </form>
    </main>
  );
}

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f5f5",
  padding: "20px",
  boxSizing: "border-box" as const,
};

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  padding: "30px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  boxSizing: "border-box" as const,
};

const headingStyle = {
  marginBottom: "8px",
  color: "#111",
};

const subheadingStyle = {
  marginTop: 0,
  marginBottom: "22px",
  color: "#666",
  lineHeight: 1.5,
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box" as const,
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#111",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const accountLinkBox = {
  marginTop: "22px",
  paddingTop: "18px",
  borderTop: "1px solid #eee",
  textAlign: "center" as const,
  fontSize: "14px",
  color: "#666",
};

const linkStyle = {
  marginLeft: "6px",
  color: "#111",
  fontWeight: "700",
  textDecoration: "none",
};