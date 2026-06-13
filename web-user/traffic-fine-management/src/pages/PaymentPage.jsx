import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { processPayment, getPaymentByFine } from "../services/paymentService";
import {
  getFineById as fetchFine,
  getFinesByUser,
} from "../services/fineService";

export default function PaymentPage() {
  const { fineId } = useParams();
  const navigate = useNavigate();
  const [fine, setFine] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fineId) return;
    fetchFine(fineId)
      .then((f) => {
        setFine(f);
        setAmount(String(f?.amount || ""));
      })
      .catch((err) => setError(err?.message || "Failed to load fine"));
  }, [fineId]);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const dto = { fineId: Number(fineId), amount: Number(amount) };
    setLoading(true);
    processPayment(dto)
      .then(() => navigate("/payment-success"))
      .catch((err) =>
        setError(
          err?.response?.data?.message || err.message || "Payment failed",
        ),
      )
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <h1 className="mb-3">Pay Fine</h1>
      {error && <div className="text-danger mb-2">{error}</div>}
      {!fine ? (
        <div>Loading fine...</div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Fine #{fine.id}</h5>
                <div className="mb-2">
                  <strong>Vehicle:</strong> {fine.vehiclePlate || "-"}
                </div>
                <div className="mb-2">
                  <strong>Reason:</strong> {fine.reason}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong> {fine.status}
                </div>
                <div className="mb-2">
                  <strong>Amount:</strong> $
                  {Number(fine.amount || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-header">Payment</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select">
                      <option>Card</option>
                      <option>Online</option>
                      <option>Cash</option>
                    </select>
                  </div>
                  <div className="d-grid">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="card">
              <div className="card-header">My Fines (paid & unpaid)</div>
              <div className="card-body">
                <PaidList
                  userFineId={
                    fine.user?.id ||
                    fine.userId ||
                    localStorage.getItem("userId")
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
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
    setErr(null);

    getFinesByUser(uid)
      .then(async (fines) => {
        if (!fines || fines.length === 0) {
          setPaid([]);
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
        setPaid(checks || []);
      })
      .catch((e) => setErr(e?.message || "Failed"))
      .finally(() => setLoadingPaid(false));
  }, [userFineId]);

  if (loadingPaid) return <div>Loading paid fines...</div>;
  if (err) return <div className="text-danger">{err}</div>;
  if (!paid || paid.length === 0)
    return <div className="text-muted">No paid fines found.</div>;

  return (
    <ul className="list-group list-group-flush">
      {paid.map(({ fine: f, payment }) => (
        <li
          key={f.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <div className="fw-bold">
              #{f.id} — {f.vehiclePlate || "-"}
            </div>
            <div className="small text-muted">{f.reason}</div>
            {payment && payment.paidAt && (
              <div className="small text-muted">
                Paid at: {new Date(payment.paidAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="text-end">{Number(f.amount || 0).toFixed(2)}</div>
        </li>
      ))}
    </ul>
  );
}

function severityForAmount(amount) {
  const a = Number(amount || 0);
  if (a <= 50) return "Low";
  if (a <= 200) return "Medium";
  return "High";
}

function consequenceText(severity, daysOverdue) {
  if (daysOverdue > 0) {
    return `Overdue: may incur additional penalties and collection actions after ${daysOverdue} days`;
  }
  if (severity === "High")
    return "High severity: may lead to legal action if unpaid.";
  if (severity === "Medium") return "Medium severity: late fees may apply.";
  return "Low severity: prompt payment avoids reminders.";
}
