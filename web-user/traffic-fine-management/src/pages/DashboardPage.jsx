import React from "react";

const summary = {
  total: 12,
  unpaid: 5,
  overdue: 2,
  amountDue: "$320.00",
};

const outstanding = [
  { id: "F-1001", type: "Speeding", amount: "$50", date: "2026-05-10" },
  { id: "F-1002", type: "Illegal Parking", amount: "$30", date: "2026-05-12" },
  { id: "F-1003", type: "Signal Violation", amount: "$40", date: "2026-05-14" },
];

const recent = [
  {
    id: "R-2001",
    type: "Speeding",
    location: "A1 Highway",
    date: "2026-06-01",
  },
  { id: "R-2002", type: "Parking", location: "Main St", date: "2026-05-28" },
];

const payments = [
  {
    id: "P-3001",
    fineId: "F-0999",
    amount: "$25",
    date: "2026-05-20",
    method: "Card",
  },
  {
    id: "P-3002",
    fineId: "F-1000",
    amount: "$60",
    date: "2026-05-22",
    method: "Online",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-3">Dashboard</h1>

      {/* Summary row */}
      <div className="row g-3 mb-4 align-items-stretch">
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <div className="h6 mb-1">Total Fines</div>
              <div className="display-6 mb-0">{summary.total}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <div className="h6 mb-1">Unpaid</div>
              <div className="h3 text-danger mb-0">{summary.unpaid}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <div className="h6 mb-1">Overdue</div>
              <div className="h3 text-warning mb-0">{summary.overdue}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <div className="h6 mb-1">Amount Due</div>
              <div className="h4 mb-0">{summary.amountDue}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Fines */}
      <div className="card mb-4">
        <div className="card-header">Outstanding Fines</div>
        <ul className="list-group list-group-flush">
          {outstanding.map((f) => (
            <li
              key={f.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div className="fw-bold">
                  {f.id} — {f.type}
                </div>
                <div className="small text-muted">Issued: {f.date}</div>
              </div>
              <div className="text-end">
                <div className="fw-semibold">{f.amount}</div>
                <a className="btn btn-sm btn-link ms-2" href={`/fines/${f.id}`}>
                  View
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Two-column statistics and recent/payment lists */}
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card mb-3">
            <div className="card-header">Violation Statistics</div>
            <div className="card-body">
              <div className="small text-muted">By type (last 30 days)</div>
              <ul className="list-unstyled mt-2">
                <li>Speeding: 7</li>
                <li>Illegal Parking: 3</li>
                <li>Signal Violation: 2</li>
              </ul>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header">Recent Violations</div>
            <div className="card-body">
              {recent.map((r) => (
                <div
                  key={r.id}
                  className="d-flex justify-content-between align-items-center py-2 border-bottom"
                >
                  <div>
                    <div className="fw-bold">{r.type}</div>
                    <div className="small text-muted">
                      {r.location} — {r.date}
                    </div>
                  </div>
                  <div className="text-end">{r.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card mb-3">
            <div className="card-header">Payment Statistics</div>
            <div className="card-body">
              <div className="small text-muted">Last 30 days</div>
              <div className="mt-2">
                Total paid: <strong>$1,240</strong>
              </div>
              <div className="mt-2">
                Average payment: <strong>$62</strong>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header">Payment History</div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Fine ID</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.fineId}</td>
                        <td>{p.amount}</td>
                        <td>{p.date}</td>
                        <td>{p.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications and Quick Actions */}
      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Notifications</div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="py-2 border-bottom">
                  Payment due for F-1002 on 2026-06-15
                </li>
                <li className="py-2 border-bottom">
                  New evidence uploaded for F-1003
                </li>
                <li className="py-2">System maintenance on 2026-06-20</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Quick Actions</div>
            <div className="card-body d-flex flex-column gap-2">
              <button className="btn btn-primary">Pay Outstanding Fines</button>
              <button className="btn btn-outline-secondary">
                Download Statement
              </button>
              <button className="btn btn-outline-secondary">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
