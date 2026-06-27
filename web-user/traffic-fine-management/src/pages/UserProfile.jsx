import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../services/userService";
import { getFinesByUser } from "../services/fineService";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finesSummary, setFinesSummary] = useState({ total: 0, paid: 0, unpaid: 0 });

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) { setError("No user session found. Please log in."); return; }
    setLoading(true);
    Promise.all([getUserById(id), getFinesByUser(id)])
      .then(([data, fines]) => {
        setUser({ name: data.name || "", email: data.email || "", nic: data.nic || "", role: data.role || "USER" });
        const total = Array.isArray(fines) ? fines.length : 0;
        const paid = Array.isArray(fines) ? fines.filter((f) => f.status === "PAID").length : 0;
        setFinesSummary({ total, paid, unpaid: total - paid });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err?.response?.data?.message || err.message || "Failed to load profile");
      });
  }, []);

  if (loading) return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14 }}>
      Loading profile…
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--danger-bg)", border: "1px solid #FECACA", borderRadius: 3, padding: "12px 16px", fontSize: 14, color: "var(--danger)", maxWidth: 400 }}>
        {error}
      </div>
    </div>
  );

  if (!user) return null;

  const initials = (user.name || "").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() || "U";
  const isAdmin = localStorage.getItem("isAdmin") === "true" || user.role === "ADMIN";

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", padding: "36px 24px", fontFamily: "'IBM Plex Sans', sans-serif", color: "var(--ink)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--crimson)", marginBottom: 8 }}>
            Citizen Profile
          </div>
          <h1 style={{ fontFamily: "'PT Serif', 'Georgia', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>
            Account Details
          </h1>
        </div>

        <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
          {/* Identity header */}
          <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, borderBottom: "1px solid var(--rule)", flexWrap: "wrap" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: "var(--crimson)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#fff",
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <h2 style={{ fontFamily: "'PT Serif', serif", fontSize: 22, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2, marginBottom: 4 }}>
                {user.name || "Unnamed"}
              </h2>
              <div style={{ fontSize: 14, color: "var(--slate)" }}>{user.email}</div>
              {isAdmin && (
                <div style={{ marginTop: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
                    color: "var(--crimson)",
                    background: "rgba(139,26,45,0.08)", border: "1px solid rgba(139,26,45,0.2)",
                    borderRadius: 2, padding: "2px 8px",
                  }}>
                    Administrator
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/profile/edit")}
              style={{
                padding: "8px 18px", borderRadius: 3,
                border: "1.5px solid var(--crimson)",
                background: "transparent", color: "var(--crimson)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                fontFamily: "'IBM Plex Sans', sans-serif", transition: "all .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--crimson)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--crimson)"; }}
            >
              Edit Profile
            </button>
          </div>

          {/* Contact / Identity fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="profile-fields">
            {[
              { label: "Email Address", value: user.email },
              { label: "NIC Number",    value: user.nic || "Not provided" },
            ].map(({ label, value }, i) => (
              <div key={label} style={{
                padding: "20px 28px",
                borderBottom: "1px solid var(--paper-dk)",
                borderRight: i % 2 === 0 ? "1px solid var(--paper-dk)" : "none",
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 15, color: "var(--ink)" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Fine summary */}
          <div style={{ padding: "20px 28px" }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
              Traffic Fine Summary
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "Total Fines", value: finesSummary.total,  color: "var(--slate)"   },
                { label: "Paid",        value: finesSummary.paid,   color: "var(--success)" },
                { label: "Unpaid",      value: finesSummary.unpaid, color: "var(--danger)"  },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: "center", padding: "16px 8px", background: "var(--paper)", borderRadius: 3, border: "1px solid var(--rule)" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 500, color, lineHeight: 1, marginBottom: 8 }}>{value}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 560px) {
          .profile-fields { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
