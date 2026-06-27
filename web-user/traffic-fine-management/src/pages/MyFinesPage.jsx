import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFinesByUser } from "../services/fineService";

function formatLKR(n) {
  const num = Number(n) || 0;
  return `LKR ${num.toLocaleString("en-LK", { minimumFractionDigits: 0 })}`;
}

const STATUS_META = {
  PAID:    { label: "Paid",    color: "var(--success)" },
  UNPAID:  { label: "Unpaid",  color: "var(--danger)"  },
  PENDING: { label: "Pending", color: "var(--warning)" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING;
  return (
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: meta.color, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      {meta.label}
    </span>
  );
}

export default function MyFinesPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) { setError("Not signed in. Please log in to see your fines."); return; }
    setLoading(true);
    getFinesByUser(id)
      .then((data) => { setFines(data || []); setLoading(false); })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || "Failed to load fines");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", padding: "36px 24px", fontFamily: "'IBM Plex Sans', sans-serif", color: "var(--ink)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--crimson)", marginBottom: 8 }}>
            Traffic Records
          </div>
          <h1 style={{ fontFamily: "'PT Serif', 'Georgia', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>
            My Fines
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--slate)" }}>
            All traffic fines issued against your account.
          </p>
        </div>

        {error && (
          <div style={{ background: "var(--danger-bg)", border: "1px solid #FECACA", borderRadius: 3, padding: "12px 16px", color: "var(--danger)", fontSize: 14, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--muted)", fontSize: 14 }}>
            Loading fines…
          </div>
        ) : fines.length === 0 ? (
          <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, padding: "48px 24px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
            No fines found on your account.
          </div>
        ) : (
          <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'PT Serif', serif", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Fine Records</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{fines.length} record{fines.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "52px 1fr 100px 130px 90px",
              gap: 8, padding: "8px 20px",
              background: "var(--paper)", borderBottom: "1px solid var(--rule)",
              fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)",
            }}>
              <span>Ref</span>
              <span>Violation</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {fines.map((f, idx) => (
              <div key={f.id} style={{
                display: "grid", gridTemplateColumns: "52px 1fr 100px 130px 90px",
                gap: 8, padding: "13px 20px",
                borderBottom: idx < fines.length - 1 ? "1px solid var(--paper-dk)" : "none",
                alignItems: "center",
              }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--muted)" }}>
                  #{f.id}
                </span>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13.5 }}>{f.vehiclePlate || "—"}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 1 }}>{f.reason || f.fineCategory || "—"}</div>
                </div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--slate)" }}>
                  {f.issuedAt ? new Date(f.issuedAt).toLocaleDateString("en-LK") : "—"}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500 }}>
                  {formatLKR(f.amount)}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <StatusBadge status={f.status} />
                  {f.status !== "PAID" && (
                    <Link to={`/payments/${f.id}`} style={{ fontSize: 11, fontWeight: 600, color: "var(--crimson)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                      Pay Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
