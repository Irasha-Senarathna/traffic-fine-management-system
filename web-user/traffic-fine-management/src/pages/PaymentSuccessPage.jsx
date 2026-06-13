import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFinesByUser } from "../services/fineService";
import { getPaymentByFine } from "../services/paymentService";

export default function PaymentSuccessPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    setLoading(true);
    setErr(null);
    getFinesByUser(uid)
      .then(async (fines) => {
        if (!fines || fines.length === 0) {
          setItems([]);
          return;
        }
        const checks = await Promise.all(
          fines.map(async (f) => {
            try {
              const p = await getPaymentByFine(f.id);
              return { fine: f, payment: p };
            } catch (e) {
              return { fine: f, payment: null };
            }
          }),
        );
        setItems(checks || []);
      })
      .catch((e) => setErr(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  function severityForAmount(amount) {
    const a = Number(amount || 0);
    if (a <= 50) return "Low";
    if (a <= 200) return "Medium";
    return "High";
  }

  if (loading) return <div className="container py-4">Loading payments...</div>;
  if (err) return <div className="container py-4 text-danger">{err}</div>;

  return (
    <div className="container py-4">
      <div className="p-3 mb-3 bg-light rounded-3 shadow-sm">
        <h2 className="mb-1">My Payments</h2>
        <p className="mb-0 text-muted">
          Your payment history and receipts are shown below.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-muted">No fines found.</div>
      ) : (
        <div className="list-group">
          {items.map(({ fine: f, payment }) => (
            <div
              key={f.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <div className="fw-bold">
                  #{f.id} — {f.vehiclePlate || "-"}
                </div>
                <div className="small text-muted">{f.reason}</div>
                <div className="small text-muted">Status: {f.status}</div>
                {payment && payment.paidAt && (
                  <div className="small text-success">
                    Paid at: {new Date(payment.paidAt).toLocaleString()}
                  </div>
                )}
                <div className="mt-1">
                  <strong>Severity:</strong> {severityForAmount(f.amount)}
                </div>
              </div>
              <div className="text-end">
                <div className="fw-semibold">
                  ${Number(f.amount || 0).toFixed(2)}
                </div>
                <div className="mt-2">
                  {f.status !== "PAID" ? (
                    <Link
                      className="btn btn-sm btn-primary"
                      to={`/payments/${f.id}`}
                    >
                      Pay
                    </Link>
                  ) : (
                    <span className="badge bg-success">PAID</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
