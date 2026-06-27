import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--rule)",
      background: "var(--white)",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
      fontFamily: "'IBM Plex Sans', sans-serif",
    }}>
      <span style={{ fontSize: 12, color: "var(--muted)" }}>
        &copy; {new Date().getFullYear()} Sri Lanka Police Department — Traffic Fine Management System. All rights reserved.
      </span>
      <div style={{ display: "flex", gap: 20 }}>
        <Link to="/dashboard"
          style={{ fontSize: 12, color: "var(--slate)", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--crimson)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--slate)")}
        >Dashboard</Link>
        <Link to="/profile"
          style={{ fontSize: 12, color: "var(--slate)", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--crimson)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--slate)")}
        >Profile</Link>
      </div>
    </footer>
  );
}
