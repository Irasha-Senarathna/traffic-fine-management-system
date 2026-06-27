import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFinesByUser } from "../services/fineService";

function formatLKR(n) {
  const num = Number(n) || 0;
  return `LKR ${num.toLocaleString("en-LK", { minimumFractionDigits: 0 })}`;
}

const STATUS_META = {
  PAID:    { label: "Paid",    color: "var(--success)"  },
  UNPAID:  { label: "Unpaid", color: "var(--danger)"   },
  PENDING: { label: "Pending",color: "var(--warning)"  },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      letterSpacing: 0.5, textTransform: "uppercase",
      color: meta.color,
      fontFamily: "'IBM Plex Sans', sans-serif",
    }}>
      {meta.label}
    </span>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: "var(--white)",
      border: "1px solid var(--rule)",
      borderTop: `3px solid ${accent}`,
      borderRadius: 3,
      padding: "18px 20px",
    }}>
      <div style={{
        fontSize: 9, fontWeight: 600, letterSpacing: 1.2,
        textTransform: "uppercase", color: "var(--muted)",
        marginBottom: 10, fontFamily: "'IBM Plex Sans', sans-serif",
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        fontSize: 26, fontWeight: 500, color: "var(--ink)", lineHeight: 1,
      }}>
        {value}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [fines,   setFines]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const userName = localStorage.getItem("userName") || "Citizen";

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    setLoading(true);
    getFinesByUser(uid)
      .then((data) => setFines(data || []))
      .catch((err) => setError(err?.message || "Failed to load fines"))
      .finally(() => setLoading(false));
  }, []);

  const totalFines   = fines.length;
  const unpaidCount  = fines.filter((f) => f.status !== "PAID").length;
  const unpaidAmount = fines.reduce((s, f) => s + (f.status !== "PAID" ? Number(f.amount) || 0 : 0), 0);
  const highest      = fines.reduce((best, f) => {
    const amt = Number(f.amount) || 0;
    return (!best || amt > (Number(best.amount) || 0)) ? f : best;
  }, null);

  return (
    <div style={{
      minHeight: "calc(100vh - 62px)",
      background: "var(--paper)",
      padding: "36px 24px",
      fontFamily: "'IBM Plex Sans', sans-serif",
      color: "var(--ink)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Welcome header */}
        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <div style={{
            fontSize: 9, fontWeight: 600, letterSpacing: 1.8,
            textTransform: "uppercase", color: "var(--crimson)", marginBottom: 8,
          }}>
            Traffic Fine Overview
          </div>
          <h1 style={{
            fontFamily: "'PT Serif', 'Georgia', serif",
            fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2,
          }}>
            Welcome back, {userName}
          </h1>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
          gap: 10,
          marginBottom: 32,
        }}>
          <StatCard label="Total Fines"  value={totalFines}              accent="var(--slate)" />
          <StatCard label="Unpaid Fines" value={unpaidCount}             accent="var(--danger)" />
          <StatCard label="Amount Due"   value={formatLKR(unpaidAmount)} accent="var(--warning)" />
          <StatCard label="Highest Fine" value={highest ? formatLKR(highest.amount) : "—"} accent="var(--crimson)" />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "var(--danger-bg)", border: "1px solid #FECACA",
            borderRadius: 3, padding: "12px 16px",
            color: "var(--danger)", fontSize: 14, marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--muted)", fontSize: 14 }}>
            Loading fines…
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }} className="dash-grid">

            {/* Fine table */}
            <div style={{
              background: "var(--white)",
              border: "1px solid var(--rule)",
              borderRadius: 3,
              overflow: "hidden",
            }}>
              <div style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--rule)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{
                  fontFamily: "'PT Serif', serif", fontSize: 15, fontWeight: 700, color: "var(--ink)",
                }}>
                  Your Fines
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {fines.length} record{fines.length !== 1 ? "s" : ""}
                </span>
              </div>

              {fines.length === 0 ? (
                <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
                  No fines found on your account.
                </div>
              ) : (
                <>
                  {/* Table header row */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "52px 1fr 96px 120px 80px",
                    gap: 8, padding: "8px 20px",
                    background: "var(--paper)",
                    borderBottom: "1px solid var(--rule)",
                    fontSize: 9, fontWeight: 600,
                    letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)",
                  }}>
                    <span>Ref</span>
                    <span>Violation</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Status</span>
                  </div>

                  {fines.map((f, idx) => (
                    <div key={f.id} style={{
                      display: "grid",
                      gridTemplateColumns: "52px 1fr 96px 120px 80px",
                      gap: 8, padding: "13px 20px",
                      borderBottom: idx < fines.length - 1 ? "1px solid var(--paper-dk)" : "none",
                      alignItems: "center",
                    }}>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11, color: "var(--muted)",
                      }}>
                        #{f.id}
                      </span>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13.5 }}>{f.vehiclePlate || "—"}</div>
                        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 1 }}>
                          {f.reason || f.fineCategory || "—"}
                        </div>
                      </div>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11, color: "var(--slate)",
                      }}>
                        {f.issuedAt ? new Date(f.issuedAt).toLocaleDateString("en-LK") : "—"}
                      </span>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 13, fontWeight: 500,
                      }}>
                        {formatLKR(f.amount)}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <StatusBadge status={f.status} />
                        {f.status !== "PAID" && (
                          <Link to={`/payments/${f.id}`} style={{
                            fontSize: 11, fontWeight: 600,
                            color: "var(--crimson)",
                            textDecoration: "underline", textUnderlineOffset: 2,
                          }}>
                            Pay Now
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div style={{
              background: "var(--white)",
              border: "1px solid var(--rule)",
              borderRadius: 3,
              overflow: "hidden",
            }}>
              <div style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--rule)",
                fontFamily: "'PT Serif', serif",
                fontSize: 15, fontWeight: 700, color: "var(--ink)",
              }}>
                Highest Fine
              </div>
              <div style={{ padding: "20px" }}>
                {highest ? (
                  <>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 26, fontWeight: 500,
                      color: "var(--danger)", marginBottom: 20,
                      lineHeight: 1,
                    }}>
                      {formatLKR(highest.amount)}
                    </div>

                    <div style={{
                      fontSize: 9, fontWeight: 600, letterSpacing: 1.2,
                      textTransform: "uppercase", color: "var(--muted)", marginBottom: 4,
                    }}>
                      Violation
                    </div>
                    <div style={{ fontSize: 13.5, marginBottom: 16 }}>{highest.reason || "—"}</div>

                    <div style={{
                      fontSize: 9, fontWeight: 600, letterSpacing: 1.2,
                      textTransform: "uppercase", color: "var(--muted)", marginBottom: 4,
                    }}>
                      Date Issued
                    </div>
                    <div style={{
                      fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 24,
                    }}>
                      {highest.issuedAt ? new Date(highest.issuedAt).toLocaleDateString("en-LK") : "—"}
                    </div>

                    {highest.status !== "PAID" && (
                      <Link to={`/payments/${highest.id}`} style={{
                        display: "block", textAlign: "center",
                        padding: "10px", borderRadius: 3,
                        background: "var(--crimson)",
                        color: "#fff", fontWeight: 600, fontSize: 13.5,
                        textDecoration: "none",
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        transition: "background .15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--crimson-dk)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--crimson)")}
                      >
                        Pay This Fine
                      </Link>
                    )}
                  </>
                ) : (
                  <div style={{ color: "var(--muted)", fontSize: 14 }}>No fines on record.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
