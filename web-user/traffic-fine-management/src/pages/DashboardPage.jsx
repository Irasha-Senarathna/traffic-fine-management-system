import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFinesByUser } from "../services/fineService";

function formatCurrency(n) {
  const num = Number(n) || 0;
  return `$${num.toFixed(2)}`;
}

function getIconForFine(reason) {
  if (!reason) return "🚔";
  const r = reason.toLowerCase();
  if (r.includes("speed")) return "🚗";
  if (r.includes("park")) return "🅿️";
  if (r.includes("signal") || r.includes("red")) return "🚦";
  if (r.includes("overtake") || r.includes("overtaking")) return "↗️";
  if (r.includes("cut") || r.includes("line")) return "🚧";
  if (r.includes("u-turn") || r.includes("u turn")) return "🔄";
  if (r.includes("reckless")) return "⚠️";
  if (r.includes("helmet")) return "🪖";
  if (r.includes("seat") || r.includes("belt")) return "🔒";
  if (r.includes("block")) return "🚫";
  return "🚔";
}

export default function DashboardPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    setLoading(true);
    setError(null);
    getFinesByUser(uid)
      .then((data) => setFines(data || []))
      .catch((err) => setError(err?.message || "Failed to load fines"))
      .finally(() => setLoading(false));
  }, []);

  const totalFines = fines.length;
  const unpaidAmount = fines.reduce(
    (s, f) => s + (f.status !== "PAID" ? Number(f.amount) || 0 : 0),
    0,
  );
  const unpaidCount = fines.filter((f) => f.status !== "PAID").length;
  const highest = fines.reduce((best, f) => {
    const amt = Number(f.amount) || 0;
    if (!best || amt > (Number(best.amount) || 0)) return f;
    return best;
  }, null);

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <h1 className="mb-3">Dashboard</h1>

      {/* Summary row */}
      <div className="row g-3 mb-4 align-items-stretch">
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <div className="h6 mb-1">Total Fines</div>
              <div className="display-6 mb-0">{totalFines}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm border-danger">
            <div className="card-body text-center d-flex flex-column justify-content-center bg-danger text-white">
              <div className="h6 mb-1">Unpaid</div>
              <div className="h3 mb-0">{unpaidCount}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <div className="h6 mb-1">Amount Due</div>
              <div className="h4 mb-0">{formatCurrency(unpaidAmount)}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <div className="h6 mb-1">Highest Fine</div>
              <div className="h5 mb-0">
                {highest ? formatCurrency(highest.amount) : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

        {error && <div className="text-danger mb-3">{error}</div>}

        {loading ? (
          <div>Loading fines...</div>
        ) : (
          <div className="row g-3">
          <div className="col-lg-8">
            <div className="card mb-3">
              <div className="card-header">Outstanding Fines</div>
              <ul className="list-group list-group-flush">
                {fines.length === 0 ? (
                  <li className="list-group-item text-muted">
                    No fines found.
                  </li>
                ) : (
                  fines.map((f) => (
                    <li
                      key={f.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-bold">
                          #{f.id} — {getIconForFine(f.reason)}{" "}
                          {f.vehiclePlate || "-"}
                        </div>
                        <div className="small text-muted">{f.reason}</div>
                      </div>
                      <div className="text-end">
                        <div className="fw-semibold">
                          {formatCurrency(f.amount)}
                        </div>
                        <div className="small text-muted">{f.status}</div>
                        <div className="mt-2">
                          {f.status !== "PAID" && (
                            <Link
                              to={`/payments/${f.id}`}
                              className="btn btn-sm btn-primary"
                            >
                              Pay
                            </Link>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-3">
              <div className="card-header">Highest Fine</div>
              <div className="card-body">
                {highest ? (
                  <>
                    <div className="h4 mb-2">
                      {formatCurrency(highest.amount)}
                    </div>
                    <div className="small text-muted">Reason</div>
                    <div className="mb-2">{highest.reason || "-"}</div>
                    <div className="small text-muted">Issued</div>
                    <div>{highest.issuedAt || highest.issuedDate || "-"}</div>
                  </>
                ) : (
                  <div className="text-muted">No fines</div>
                )}
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
