import React from "react";
import { Link } from "react-router-dom";

const PoliceShield = () => (
  <svg width="32" height="36" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 2L3 7V16C3 23.5 8.5 29.5 15 31.5C21.5 29.5 27 23.5 27 16V7L15 2Z"
      fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" strokeLinejoin="round"
    />
    <text x="15" y="23" textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui, sans-serif">★</text>
  </svg>
);

const features = [
  {
    label: "View Your Fines",
    desc: "Check all traffic fines issued against your vehicle registration or NIC number, with full violation details and dates.",
  },
  {
    label: "Pay Online",
    desc: "Settle outstanding fines securely by card without visiting a police station. Payments are processed and confirmed immediately.",
  },
  {
    label: "SMS Notifications",
    desc: "Receive instant SMS alerts when a fine is issued to your vehicle or when a payment is successfully confirmed.",
  },
];

export default function LandingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--paper)",
      fontFamily: "'IBM Plex Sans', sans-serif",
      color: "var(--ink)",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Masthead */}
      <header style={{
        background: "var(--crimson)",
        borderBottom: "2px solid var(--gold)",
        padding: "0 24px",
        flexShrink: 0,
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          height: 60, display: "flex", alignItems: "center", gap: 14,
        }}>
          <PoliceShield />
          <div>
            <div style={{
              fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.65)",
              letterSpacing: 1.5, textTransform: "uppercase", lineHeight: 1,
            }}>
              Sri Lanka Police Department
            </div>
            <div style={{
              fontSize: 13.5, fontWeight: 600, color: "#fff", lineHeight: 1.3, marginTop: 2,
            }}>
              Traffic Fine Management System
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <Link to="/login"
            style={{
              fontSize: 13, color: "rgba(255,255,255,0.85)", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.4)", borderRadius: 3,
              padding: "5px 14px", transition: "background .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero — two column */}
      <main style={{ flex: 1 }}>
        <section style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "72px 24px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 72,
          alignItems: "center",
        }} className="landing-hero">

          {/* Left: announcement */}
          <div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 2,
              textTransform: "uppercase", color: "var(--crimson)", marginBottom: 20,
            }}>
              Official Government Portal
            </div>

            <h1 style={{
              fontFamily: "'PT Serif', 'Georgia', serif",
              fontSize: "clamp(2.4rem, 4vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.12,
              color: "var(--ink)",
              marginBottom: 24,
            }}>
              Traffic Fine<br />Management<br />System
            </h1>

            <p style={{
              fontSize: 16, color: "var(--slate)", lineHeight: 1.7,
              maxWidth: 460, marginBottom: 36,
            }}>
              The official portal of the Sri Lanka Police Department for viewing, managing, and paying traffic fines — accessible 24 hours a day, seven days a week.
            </p>

            <div style={{ width: 48, height: 2, background: "var(--gold)", marginBottom: 32 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {features.map(({ label, desc }) => (
                <div key={label} style={{ display: "flex", gap: 16 }}>
                  <div style={{
                    width: 3, flexShrink: 0, background: "var(--crimson)",
                    borderRadius: 2, marginTop: 3, height: 42, alignSelf: "flex-start",
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.55 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: entry blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              to="/login?mode=signin"
              id="cta-user-login"
              style={{
                display: "block",
                background: "var(--crimson)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 4,
                padding: "28px 28px 24px",
                transition: "background .15s, box-shadow .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--crimson-dk)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--crimson)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{
                fontSize: 9, fontWeight: 600, letterSpacing: 1.8,
                textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 8,
              }}>
                Citizen Access
              </div>
              <div style={{
                fontFamily: "'PT Serif', serif", fontSize: 22,
                fontWeight: 700, marginBottom: 6,
              }}>
                Login to Portal
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.55 }}>
                Sign in with your email and password to view and pay outstanding traffic fines.
              </div>
            </Link>

            <Link
              to="/police/login"
              id="cta-police-login"
              style={{
                display: "block",
                background: "var(--white)",
                border: "1.5px solid var(--rule)",
                color: "var(--ink)",
                textDecoration: "none",
                borderRadius: 4,
                padding: "28px 28px 24px",
                transition: "border-color .15s, box-shadow .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--crimson)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--rule)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{
                fontSize: 9, fontWeight: 600, letterSpacing: 1.8,
                textTransform: "uppercase", color: "var(--muted)", marginBottom: 8,
              }}>
                Law Enforcement
              </div>
              <div style={{
                fontFamily: "'PT Serif', serif", fontSize: 22,
                fontWeight: 700, marginBottom: 6, color: "var(--ink)",
              }}>
                Officer Portal
              </div>
              <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.55 }}>
                For Sri Lanka Police officers to issue and manage traffic violations.
              </div>
            </Link>

            <div style={{ textAlign: "center", paddingTop: 6 }}>
              <span style={{ fontSize: 13, color: "var(--slate)" }}>No account? </span>
              <Link
                to="/login?mode=signup"
                id="cta-register"
                style={{ fontSize: 13, color: "var(--crimson)", textDecoration: "underline", textUnderlineOffset: 3 }}
              >
                Register as a citizen
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--rule)",
        background: "var(--white)",
        padding: "16px 24px",
        textAlign: "center",
        fontSize: 12,
        color: "var(--muted)",
      }}>
        &copy; {new Date().getFullYear()} Sri Lanka Police Department — Traffic Fine Management System. All rights reserved.
      </footer>

      <style>{`
        @media (max-width: 800px) {
          .landing-hero {
            grid-template-columns: 1fr !important;
            padding: 44px 20px 60px !important;
            gap: 44px !important;
          }
        }
      `}</style>
    </div>
  );
}
