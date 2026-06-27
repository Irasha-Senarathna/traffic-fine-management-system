import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout as authLogout } from "../services/authService";

const PoliceShield = ({ size = 28 }) => (
  <svg width={size} height={Math.round(size * 1.13)} viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 2L3 7V16C3 23.5 8.5 29.5 15 31.5C21.5 29.5 27 23.5 27 16V7L15 2Z"
      fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" strokeLinejoin="round"
    />
    <text x="15" y="23" textAnchor="middle" fill="white" fontSize="13" fontFamily="system-ui, sans-serif">★</text>
  </svg>
);

const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 15, height: 15 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 15, height: 15 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 15, height: 15 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 22, height: 22 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 22, height: 22 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    try { authLogout(); } catch (_) {}
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (path, Icon, label) => (
    <Link
      to={path}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "0 14px",
        height: 60,
        fontSize: 13.5,
        fontWeight: isActive(path) ? 600 : 400,
        color: isActive(path) ? "#fff" : "rgba(255,255,255,0.75)",
        textDecoration: "none",
        borderBottom: isActive(path) ? "2px solid var(--gold)" : "2px solid transparent",
        transition: "color .15s, border-color .15s",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={(e) => { if (!isActive(path)) e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
    >
      <Icon /> {label}
    </Link>
  );

  return (
    <>
      <nav
        style={{
          background: "var(--crimson)",
          borderBottom: "2px solid var(--gold)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        aria-label="Main navigation"
      >
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
            <PoliceShield size={28} />
            <div>
              <div style={{
                fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.65)",
                letterSpacing: 1.5, textTransform: "uppercase", lineHeight: 1,
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}>
                Sri Lanka Police Department
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: "#fff",
                fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.3, marginTop: 2,
              }}>
                Traffic Fine Management System
              </div>
            </div>
          </Link>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center" }} className="nav-desktop">
            {navLink("/dashboard", IconHome, "Dashboard")}
            {navLink("/profile", IconUser, "Profile")}
            <button
              id="navbar-logout-btn"
              onClick={handleLogout}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                marginLeft: 8, padding: "6px 14px",
                fontSize: 13.5, fontWeight: 400,
                border: "1px solid rgba(255,255,255,0.35)", borderRadius: 3,
                background: "transparent", color: "rgba(255,255,255,0.85)",
                cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
                transition: "background .15s, color .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            >
              <IconLogout /> Sign Out
            </button>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            style={{ display: "none", background: "none", border: "none", color: "rgba(255,255,255,0.9)", cursor: "pointer", padding: 4 }}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="nav-toggle"
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        {open && (
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.15)",
            padding: "8px 24px 16px",
            display: "flex", flexDirection: "column", gap: 0,
          }}>
            {[
              { to: "/dashboard", Icon: IconHome, label: "Dashboard" },
              { to: "/profile",   Icon: IconUser,  label: "Profile" },
            ].map(({ to, Icon, label }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "11px 4px", color: "#fff", textDecoration: "none",
                fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}>
                <Icon /> {label}
              </Link>
            ))}
            <button onClick={() => { setOpen(false); handleLogout(); }} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 4px", background: "none", border: "none",
              color: "rgba(255,255,255,0.8)", cursor: "pointer",
              fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif",
            }}>
              <IconLogout /> Sign Out
            </button>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-toggle  { display: block !important; }
        }
      `}</style>
    </>
  );
}
