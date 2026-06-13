import React, { useEffect, useState } from "react";
import { getFinesByUser } from "../services/fineService";

export default function MyFinesPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      setError("Not signed in. Please log in to see your fines.");
      return;
    }
    setLoading(true);
    getFinesByUser(id)
      .then((data) => {
        setFines(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || err.message || "Failed to load fines",
        );
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container py-4">Loading fines...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="mb-2">My Fines</h2>
        <p className="mb-0 text-muted">
          A concise summary of your fines appears below.
        </p>
      </div>

      {fines.length === 0 ? (
        <div className="alert alert-info">You have no fines.</div>
      ) : (
        <div className="row g-3">
          {fines.map((fine) => (
            <div className="col-12" key={fine.id}>
              <div className="card">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-1">
                      {fine.vehiclePlate || "-"}
                    </h5>
                    <p className="mb-1 text-muted">
                      {fine.reason || "No reason"}
                    </p>
                    <p className="mb-0">
                      <strong>Amount:</strong>{" "}
                      {fine.amount != null ? `₹ ${fine.amount}` : "-"}
                    </p>
                    <p className="mb-0">
                      <strong>Status:</strong> {fine.status || "-"}
                    </p>
                  </div>
                  <div className="text-end">
                    <div className="small text-muted">
                      {fine.issuedAt
                        ? new Date(fine.issuedAt).toLocaleString()
                        : ""}
                    </div>
                    <a
                      href={`/fines/${fine.id}`}
                      className="btn btn-sm btn-outline-primary mt-2"
                    >
                      Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
