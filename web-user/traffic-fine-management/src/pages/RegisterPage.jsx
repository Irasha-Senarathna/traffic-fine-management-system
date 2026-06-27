import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as authRegister } from "../services/authService";

const PoliceShield = () => (
  <svg width="28" height="32" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 2L3 7V16C3 23.5 8.5 29.5 15 31.5C21.5 29.5 27 23.5 27 16V7L15 2Z"
      fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    <text x="15" y="23" textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui, sans-serif">★</text>
  </svg>
);

function Field({ id, label, ...inputProps }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label htmlFor={id} style={{
        display: "block", fontSize: 10, fontWeight: 600, color: "var(--slate)",
        marginBottom: 6, letterSpacing: 0.9, textTransform: "uppercase",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}>
        {label}
      </label>
      <input
        id={id}
        style={{
          width: "100%", padding: "9px 0",
          background: "transparent", border: "none",
          borderBottom: "1.5px solid var(--rule)",
          color: "var(--ink)", fontSize: 15,
          fontFamily: "'IBM Plex Sans', sans-serif",
          outline: "none", transition: "border-color .15s", boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderBottomColor = "var(--crimson)")}
        onBlur={(e) => (e.target.style.borderBottomColor = "var(--rule)")}
        {...inputProps}
      />
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", nic: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    authRegister(form)
      .then(() => navigate("/login?mode=signin"))
      .catch((err) =>
        setError(err?.response?.data?.message || err.message || "Registration failed")
      )
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--paper)",
      fontFamily: "'IBM Plex Sans', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
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
          <Link to="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>← Home</Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
        <div style={{
          width: "100%", maxWidth: 400,
          background: "var(--white)", border: "1px solid var(--rule)",
          borderRadius: 4, padding: "40px 36px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--crimson)", marginBottom: 10 }}>
              Citizen Registration
            </div>
            <h1 style={{ fontFamily: "'PT Serif', 'Georgia', serif", fontSize: 24, fontWeight: 700, color: "var(--ink)", lineHeight: 1.25 }}>
              Create an Account
            </h1>
          </div>

          {error && (
            <div style={{
              background: "var(--danger-bg)", border: "1px solid #FECACA",
              borderRadius: 3, padding: "10px 14px",
              fontSize: 13, color: "var(--danger)", marginBottom: 20,
            }} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Field id="reg-name" label="Full Name" type="text" name="name"
              placeholder="e.g. Kamal Perera" value={form.name} onChange={handleChange} autoFocus required />
            <Field id="reg-nic" label="NIC Number" type="text" name="nic"
              placeholder="e.g. 980123456V" value={form.nic} onChange={handleChange} required />
            <Field id="reg-email" label="Email Address" type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" required />
            <Field id="reg-password" label="Password" type="password" name="password"
              placeholder="Minimum 6 characters" value={form.password} onChange={handleChange}
              autoComplete="new-password" minLength={6} required />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", marginTop: 8, padding: "12px",
                borderRadius: 3, border: "none",
                background: loading ? "var(--rule)" : "var(--crimson)",
                color: "#fff", fontWeight: 600, fontSize: 14,
                fontFamily: "'IBM Plex Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: 0.3, transition: "background .15s",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--crimson-dk)"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--crimson)"; }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 12.5, color: "var(--muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--crimson)", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--rule)", padding: "14px 24px", textAlign: "center", fontSize: 12, color: "var(--muted)" }}>
        &copy; {new Date().getFullYear()} Sri Lanka Police Department. All rights reserved.
      </footer>
    </div>
  );
}
