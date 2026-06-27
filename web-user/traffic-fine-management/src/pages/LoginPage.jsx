import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { login as authLogin, register as authRegister } from "../services/authService";

const PoliceShield = () => (
  <svg width="28" height="32" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 2L3 7V16C3 23.5 8.5 29.5 15 31.5C21.5 29.5 27 23.5 27 16V7L15 2Z"
      fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" strokeLinejoin="round"
    />
    <text x="15" y="23" textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui, sans-serif">★</text>
  </svg>
);

function Field({ id, label, ...inputProps }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label htmlFor={id} style={{
        display: "block",
        fontSize: 10, fontWeight: 600, color: "var(--slate)",
        marginBottom: 6, letterSpacing: 0.9, textTransform: "uppercase",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}>
        {label}
      </label>
      <input
        id={id}
        style={{
          width: "100%",
          padding: "9px 0",
          background: "transparent",
          border: "none",
          borderBottom: "1.5px solid var(--rule)",
          color: "var(--ink)",
          fontSize: 15,
          fontFamily: "'IBM Plex Sans', sans-serif",
          outline: "none",
          transition: "border-color .15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderBottomColor = "var(--crimson)")}
        onBlur={(e) => (e.target.style.borderBottomColor = "var(--rule)")}
        {...inputProps}
      />
    </div>
  );
}

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramMode = searchParams.get("mode");
  const initialMode = paramMode === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState(initialMode);

  const [name,     setName]     = useState("");
  const [nic,      setNic]      = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [info,     setInfo]     = useState(null);

  const navigate = useNavigate();

  const switchMode = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
    setError(null);
    setInfo(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === "signup") {
      authRegister({ name, nic, email, password })
        .then((res) => { setLoading(false); switchMode("signin"); setInfo(res?.message || "Account created. Please sign in."); })
        .catch((err) => { setLoading(false); setError(err?.response?.data?.message || err.message || "Registration failed"); });
    } else {
      authLogin({ email, password })
        .then(() => { setLoading(false); navigate("/dashboard"); })
        .catch((err) => { setLoading(false); setError(err?.response?.data?.message || err.message || "Login failed"); });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--paper)",
      fontFamily: "'IBM Plex Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Masthead */}
      <header style={{ background: "var(--crimson)", borderBottom: "2px solid var(--gold)", padding: "0 24px", flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 60, display: "flex", alignItems: "center", gap: 14 }}>
          <PoliceShield />
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: 1.5, textTransform: "uppercase", lineHeight: 1 }}>
              Sri Lanka Police Department
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", lineHeight: 1.3, marginTop: 2 }}>
              Traffic Fine Management System
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <Link to="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>
            ← Home
          </Link>
        </div>
      </header>

      {/* Body */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
        <div style={{
          width: "100%", maxWidth: 400,
          background: "var(--white)",
          border: "1px solid var(--rule)",
          borderRadius: 4,
          padding: "40px 36px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontSize: 9, fontWeight: 600, letterSpacing: 2,
              textTransform: "uppercase", color: "var(--crimson)", marginBottom: 10,
            }}>
              Citizen Portal
            </div>
            <h1 style={{
              fontFamily: "'PT Serif', 'Georgia', serif",
              fontSize: 24, fontWeight: 700, color: "var(--ink)", lineHeight: 1.25,
            }}>
              {mode === "signin" ? "Sign In to Your Account" : "Create an Account"}
            </h1>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: "flex",
            borderBottom: "1.5px solid var(--rule)",
            marginBottom: 28,
          }}>
            {[
              { key: "signin", label: "Sign In" },
              { key: "signup", label: "Register" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                style={{
                  flex: 1, padding: "8px 0",
                  background: "none", border: "none",
                  borderBottom: mode === key ? "2px solid var(--crimson)" : "2px solid transparent",
                  marginBottom: "-1.5px",
                  fontSize: 13.5,
                  fontWeight: mode === key ? 600 : 400,
                  color: mode === key ? "var(--crimson)" : "var(--muted)",
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  transition: "color .15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div style={{
              background: "var(--danger-bg)", border: "1px solid #FECACA",
              borderRadius: 3, padding: "10px 14px",
              fontSize: 13, color: "var(--danger)", marginBottom: 20,
            }} role="alert">
              {error}
            </div>
          )}
          {info && (
            <div style={{
              background: "var(--success-bg)", border: "1px solid #BBF7D0",
              borderRadius: 3, padding: "10px 14px",
              fontSize: 13, color: "var(--success)", marginBottom: 20,
            }} role="status">
              {info}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {mode === "signup" && (
              <>
                <Field id="reg-name" label="Full Name" type="text" placeholder="e.g. Kamal Perera"
                  value={name} onChange={(e) => setName(e.target.value)} autoFocus required />
                <Field id="reg-nic" label="NIC Number" type="text" placeholder="e.g. 980123456V"
                  value={nic} onChange={(e) => setNic(e.target.value)} required />
              </>
            )}
            <Field id="login-email" label="Email Address" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              autoFocus={mode === "signin"} autoComplete="email" required />
            <Field id="login-password" label="Password" type="password" placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"} required />

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              style={{
                width: "100%", marginTop: 8,
                padding: "12px",
                borderRadius: 3, border: "none",
                background: loading ? "var(--rule)" : "var(--crimson)",
                color: "#fff",
                fontWeight: 600, fontSize: 14,
                fontFamily: "'IBM Plex Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: 0.3,
                transition: "background .15s",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--crimson-dk)"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--crimson)"; }}
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 12.5, color: "var(--muted)" }}>
            Are you a Police Officer?{" "}
            <Link to="/police/login" style={{ color: "var(--crimson)", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Officer Portal
            </Link>
          </p>
        </div>
      </main>

      <footer style={{
        borderTop: "1px solid var(--rule)",
        padding: "14px 24px",
        textAlign: "center",
        fontSize: 12,
        color: "var(--muted)",
      }}>
        &copy; {new Date().getFullYear()} Sri Lanka Police Department. All rights reserved.
      </footer>
    </div>
  );
}
