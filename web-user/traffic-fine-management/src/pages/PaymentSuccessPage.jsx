import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getFinesByUser } from "../services/fineService";
import { getPaymentByFine, verifyStripeSession } from "../services/paymentService";

function formatLKR(n) {
  const num = Number(n) || 0;
  return `LKR ${num.toLocaleString("en-LK", { minimumFractionDigits: 0 })}`;
}

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const urlFineId = searchParams.get("fineId");

  const [verifying,          setVerifying]          = useState(!!sessionId);
  const [verificationError,  setVerificationError]  = useState(null);
  const [paymentDetails,     setPaymentDetails]     = useState(null);

  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState(null);

  const verificationInitiated = useRef(false);

  useEffect(() => {
    if (!sessionId || verificationInitiated.current) return;
    verificationInitiated.current = true;
    setVerifying(true);
    verifyStripeSession(sessionId)
      .then((data) => { setPaymentDetails(data); setVerifying(false); })
      .catch((e) => { setVerificationError(e?.response?.data?.message || e.message || "Failed to verify Stripe payment"); setVerifying(false); });
  }, [sessionId]);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    setLoading(true);
    getFinesByUser(uid)
      .then(async (fines) => {
        if (!fines || fines.length === 0) { setItems([]); return; }
        const checks = await Promise.all(
          fines.map(async (f) => {
            try { const p = await getPaymentByFine(f.id); return { fine: f, payment: p }; }
            catch { return { fine: f, payment: null }; }
          })
        );
        setItems(checks);
        if (sessionId && !paymentDetails) {
          const match = checks.find((c) => c.payment && c.payment.transactionId === sessionId);
          if (match) setPaymentDetails(match.payment);
        }
      })
      .catch((e) => setErr(e?.message || "Failed to load payment history"))
      .finally(() => setLoading(false));
  }, [paymentDetails]);

  if (verifying) {
    return (
      <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, padding: "48px 40px", maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid var(--rule)", borderTopColor: "var(--crimson)", margin: "0 auto 20px", animation: "spin .8s linear infinite" }} />
          <h2 style={{ fontFamily: "'PT Serif', serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
            Verifying Stripe Transaction
          </h2>
          <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.65 }}>
            Please wait while we confirm your payment. Do not close or refresh this window.
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 62px)", background: "var(--paper)", padding: "36px 24px", fontFamily: "'IBM Plex Sans', sans-serif", color: "var(--ink)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Success card */}
        {sessionId && paymentDetails && (
          <div style={{
            background: "var(--white)", border: "1px solid var(--rule)",
            borderTop: "4px solid var(--success)",
            borderRadius: 3, padding: "40px 36px", marginBottom: 24, textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--success-bg)", color: "var(--success)",
              fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", border: "1.5px solid #BBF7D0",
            }}>
              ✓
            </div>
            <h2 style={{ fontFamily: "'PT Serif', serif", fontSize: 22, fontWeight: 700, color: "var(--success)", marginBottom: 8 }}>
              Payment Confirmed
            </h2>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.65, marginBottom: 28, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Your traffic fine has been resolved. The issuing officer will be notified via SMS shortly.
            </p>

            {/* Receipt */}
            <div style={{
              background: "var(--paper)", border: "1px solid var(--rule)",
              borderRadius: 3, padding: "16px 20px", maxWidth: 440, margin: "0 auto 28px", textAlign: "left",
            }}>
              {[
                { label: "Transaction ID", value: `${paymentDetails.transactionId?.substring(0, 24)}…`, mono: true },
                { label: "Fine Reference", value: `#${urlFineId || paymentDetails.fine?.id}`, mono: true },
                { label: "Amount Paid", value: formatLKR(paymentDetails.amount), mono: true },
                { label: "Date & Time", value: paymentDetails.paidAt ? new Date(paymentDetails.paidAt).toLocaleString("en-LK") : new Date().toLocaleString("en-LK"), mono: false },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: "var(--muted)", fontSize: 10, fontWeight: 600, letterSpacing: 0.9, textTransform: "uppercase", alignSelf: "center" }}>{label}</span>
                  <span style={{ fontFamily: mono ? "'IBM Plex Mono', monospace" : "'IBM Plex Sans', sans-serif", fontWeight: 500, color: "var(--ink)" }}>{value}</span>
                </div>
              ))}
            </div>

            <Link to="/dashboard" style={{
              display: "inline-block", padding: "10px 28px",
              borderRadius: 3, background: "var(--crimson)", color: "#fff",
              fontWeight: 600, fontSize: 14, textDecoration: "none",
              fontFamily: "'IBM Plex Sans', sans-serif",
              transition: "background .15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--crimson-dk)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--crimson)")}
            >
              Return to Dashboard
            </Link>
          </div>
        )}

        {/* Error card */}
        {sessionId && verificationError && !paymentDetails && (
          <div style={{
            background: "var(--white)", border: "1px solid var(--rule)",
            borderTop: "4px solid var(--danger)",
            borderRadius: 3, padding: "40px 36px", marginBottom: 24, textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--danger-bg)", color: "var(--danger)",
              fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", border: "1.5px solid #FECACA",
            }}>
              ✕
            </div>
            <h2 style={{ fontFamily: "'PT Serif', serif", fontSize: 22, fontWeight: 700, color: "var(--danger)", marginBottom: 8 }}>
              Verification Failed
            </h2>
            <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 28 }}>{verificationError}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <Link to={`/payments/${urlFineId || ""}`} style={{
                padding: "10px 20px", borderRadius: 3,
                border: "1.5px solid var(--danger)", color: "var(--danger)",
                background: "transparent", fontWeight: 600, fontSize: 13.5,
                textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif",
              }}>
                Retry Payment
              </Link>
              <Link to="/dashboard" style={{
                padding: "10px 20px", borderRadius: 3,
                border: "1px solid var(--rule)", color: "var(--slate)",
                background: "transparent", fontWeight: 600, fontSize: 13.5,
                textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif",
              }}>
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Payment history */}
        <div style={{ background: "var(--white)", border: "1px solid var(--rule)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'PT Serif', serif", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Payment History</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>All transactions</span>
          </div>

          {loading ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>Loading transactions…</div>
          ) : err ? (
            <div style={{ padding: "20px", color: "var(--danger)", fontSize: 14 }}>{err}</div>
          ) : items.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>No payment logs found.</div>
          ) : (
            <>
              {/* Table header */}
              <div style={{
                display: "grid", gridTemplateColumns: "52px 1fr 100px 130px 80px",
                gap: 8, padding: "8px 20px",
                background: "var(--paper)", borderBottom: "1px solid var(--rule)",
                fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)",
              }}>
                <span>Ref</span>
                <span>Violation</span>
                <span>Paid On</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              {items.map(({ fine: f, payment }, idx) => (
                <div key={f.id} style={{
                  display: "grid", gridTemplateColumns: "52px 1fr 100px 130px 80px",
                  gap: 8, padding: "13px 20px",
                  borderBottom: idx < items.length - 1 ? "1px solid var(--paper-dk)" : "none",
                  alignItems: "center",
                }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--muted)" }}>#{f.id}</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{f.vehiclePlate || "—"}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 1 }}>{f.reason || "—"}</div>
                    {payment?.transactionId && (
                      <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "var(--muted)", marginTop: 2 }}>
                        TXN: {payment.transactionId.substring(0, 18)}…
                      </div>
                    )}
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--slate)" }}>
                    {payment?.paidAt ? new Date(payment.paidAt).toLocaleDateString("en-LK") : "—"}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500 }}>
                    {formatLKR(f.amount)}
                  </span>
                  <div>
                    {f.status === "PAID" ? (
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "var(--success)" }}>Paid</span>
                    ) : (
                      <Link to={`/payments/${f.id}`} style={{ fontSize: 11, fontWeight: 600, color: "var(--crimson)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                        Pay Now
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
