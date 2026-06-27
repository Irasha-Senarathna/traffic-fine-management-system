import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { processPayment, getPaymentByFine, createStripeSession } from "../services/paymentService";
import { getFineById as fetchFine, getFinesByUser } from "../services/fineService";

function formatLKR(n) {
  const num = Number(n) || 0;
  return `LKR ${num.toLocaleString("en-LK", { minimumFractionDigits: 0 })}`;
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontSize: 14, color: "var(--ink)",
        fontFamily: mono ? "'IBM Plex Mono', monospace" : "'IBM Plex Sans', sans-serif",
      }}>
        {value}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const { fineId } = useParams();
  const navigate = useNavigate();
  const [fine, setFine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fineId) return;
    fetchFine(fineId)
      .then((f) => setFine(f))
      .catch((err) => setError(err?.message || "Failed to load fine"));
  }, [fineId]);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    createStripeSession(Number(fineId))
      .then((res) => {
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          throw new Error("Stripe checkout URL not returned");
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || "Failed to initiate Stripe payment");
        setLoading(false);
      });
  }

  const statusColor = fine?.status === "PAID" ? "var(--success)" : fine?.status === "PENDING" ? "var(--warning)" : "var(--danger)";

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", padding: "36px 24px", fontFamily: "'IBM Plex Sans', sans-serif", color: "var(--ink)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--rule)" }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--crimson)", marginBottom: 8 }}>
            Online Payment
          </div>
          <h1 style={{ fontFamily: "'PT Serif', 'Georgia', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>
            Resolve Traffic Fine
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--slate)" }}>
            Review violation details and proceed to the secure payment gateway.
          </p>
        </div>

        {error && (
          <div style={{ background: "var(--danger-bg)", border: "1px solid #FECACA", borderRadius: 3, padding: "12px 16px", color: "var(--danger)", fontSize: 14, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {!fine ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--muted)", fontSize: 14 }}>
            Loading fine details…
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }} className="payment-grid">

            {/* Left: Fine Details */}
            <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)" }}>
                <span style={{ fontFamily: "'PT Serif', serif", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                  Violation Overview
                </span>
              </div>
              <div style={{ padding: "20px 20px 4px" }}>
                <DetailRow label="Fine Reference" value={`#${fine.id}`} mono />
                <DetailRow label="Vehicle Plate"  value={fine.vehiclePlate || "—"} />
                <DetailRow label="Reason / Offence" value={fine.reason || fine.fineCategory || "—"} />
                {fine.district && <DetailRow label="Location" value={fine.district} />}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>
                    Fine Amount
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 500, color: "var(--ink)", lineHeight: 1 }}>
                    {formatLKR(fine.amount)}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>
                    Status
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: statusColor }}>
                    {fine.status || "UNPAID"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Payment + History */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Payment card */}
              <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontFamily: "'PT Serif', serif", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                    Secure Payment Gateway
                  </span>
                </div>
                <div style={{ padding: "20px" }}>
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                        Amount (LKR)
                      </div>
                      <div style={{
                        padding: "9px 0", borderBottom: "1.5px solid var(--rule)",
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 500, color: "var(--ink)",
                      }}>
                        {formatLKR(fine.amount)}
                      </div>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                        Payment Method
                      </div>
                      <div style={{
                        padding: "10px 0", borderBottom: "1.5px solid var(--rule)",
                        fontSize: 14, fontWeight: 500, color: "var(--ink)",
                        display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <span>💳</span> Stripe Checkout (Sandbox)
                      </div>
                    </div>

                    <div style={{
                      fontSize: 12, color: "var(--slate)", lineHeight: 1.65,
                      background: "var(--paper)", border: "1px solid var(--rule)",
                      borderLeft: "3px solid var(--gold)",
                      borderRadius: 3, padding: "10px 14px", marginBottom: 20,
                    }}>
                      You will be redirected to the Stripe Developer sandbox to simulate a card transaction safely.
                    </div>

                    <button
                      type="submit"
                      disabled={loading || fine.status === "PAID"}
                      style={{
                        width: "100%", padding: "12px",
                        borderRadius: 3, border: "none",
                        background: (loading || fine.status === "PAID") ? "var(--rule)" : "var(--crimson)",
                        color: "#fff", fontWeight: 600, fontSize: 14,
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        cursor: (loading || fine.status === "PAID") ? "not-allowed" : "pointer",
                        letterSpacing: 0.3, transition: "background .15s",
                      }}
                      onMouseEnter={(e) => { if (!loading && fine.status !== "PAID") e.currentTarget.style.background = "var(--crimson-dk)"; }}
                      onMouseLeave={(e) => { if (!loading && fine.status !== "PAID") e.currentTarget.style.background = "var(--crimson)"; }}
                    >
                      {loading ? "Redirecting…" : fine.status === "PAID" ? "Already Paid" : "Pay via Stripe"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Payment history */}
              <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontFamily: "'PT Serif', serif", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                    My Payment History
                  </span>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  <PaidList userFineId={fine.user?.id || fine.userId || localStorage.getItem("userId")} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .payment-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function PaidList({ userFineId }) {
  const [paid, setPaid] = useState([]);
  const [loadingPaid, setLoadingPaid] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const uid = userFineId || localStorage.getItem("userId");
    if (!uid) return;
    setLoadingPaid(true);
    getFinesByUser(uid)
      .then(async (fines) => {
        if (!fines || fines.length === 0) { setPaid([]); return; }
        const checks = await Promise.all(
          fines.map(async (f) => {
            try { const p = await getPaymentByFine(f.id); return { fine: f, payment: p }; }
            catch { return { fine: f, payment: null }; }
          })
        );
        setPaid(checks.filter((c) => c.payment !== null));
      })
      .catch((e) => setErr(e?.message || "Failed to load history"))
      .finally(() => setLoadingPaid(false));
  }, [userFineId]);

  if (loadingPaid) return <div style={{ fontSize: 12, color: "var(--muted)" }}>Loading history…</div>;
  if (err)         return <div style={{ fontSize: 12, color: "var(--danger)" }}>{err}</div>;
  if (!paid.length) return <div style={{ fontSize: 12, color: "var(--muted)" }}>No paid fines recorded yet.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {paid.map(({ fine: f, payment }) => (
        <div key={f.id} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 14px",
          background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 3,
        }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 13 }}>Fine #{f.id} — {f.vehiclePlate || "—"}</div>
            {payment?.paidAt && (
              <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "var(--muted)", marginTop: 2 }}>
                {new Date(payment.paidAt).toLocaleDateString("en-LK")}
              </div>
            )}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, fontSize: 13, color: "var(--success)" }}>
            {formatLKR(f.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
