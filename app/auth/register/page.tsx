"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Registration successful!");

        setName("");
        setEmail("");
        setPassword("");

        // After registration, go to Sign In
        setTimeout(() => {
          router.push("/auth/login");
        }, 800);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={containerStyle}>
      <form onSubmit={handleRegister} style={cardStyle}>
        <h1 style={headingStyle}>Create Account</h1>

        <p style={subheadingStyle}>
          Create your Smart Placement Preparation Portal account to start your placement journey.
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          style={inputStyle}
        />

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
          autoComplete="new-password"
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
          {loading ? "Creating..." : "Create Account"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color:
                message === "Registration successful!"
                  ? "green"
                  : "#b91c1c",
              fontWeight: "600",
            }}
          >
            {message}
          </p>
        )}

        {/* Sign In option */}
        <div style={accountLinkBox}>
          <span>Already have an account?</span>

          <Link href="/auth/login" style={linkStyle}>
            Sign In
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
  border: "none",
  borderRadius: "6px",
  background: "#111",
  color: "white",
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