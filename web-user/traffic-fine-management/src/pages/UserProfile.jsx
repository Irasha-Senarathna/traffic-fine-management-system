import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../services/userService";
import { getFinesByUser } from "../services/fineService";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finesSummary, setFinesSummary] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
  });

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      setError("No user id found. Please login.");
      return;
    }

    setLoading(true);
    Promise.all([getUserById(id), getFinesByUser(id)])
      .then(([data, fines]) => {
        setUser({
          name: data.name || "",
          email: data.email || "",
          nic: data.nic || "",
          role: data.role || "USER",
        });

        const total = Array.isArray(fines) ? fines.length : 0;
        const paid = Array.isArray(fines)
          ? fines.filter((f) => f.status === "PAID").length
          : 0;
        const unpaid = total - paid;
        setFinesSummary({ total, paid, unpaid });

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(
          err?.response?.data?.message || err.message || "Failed to load user",
        );
      });
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!user) return null;

  const initials = (user.name || "")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isAdmin =
    localStorage.getItem("isAdmin") === "true" || user.role === "ADMIN";

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center gap-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{
                    width: 96,
                    height: 96,
                    background: "#0d6efd",
                    fontSize: 28,
                  }}
                >
                  {initials || "U"}
                </div>
                <div className="flex-grow-1">
                  <h4 className="mb-1">{user.name || "Unnamed"}</h4>
                  <div className="text-muted">{user.email}</div>
                  <div className="mt-2">
                    <span className="badge bg-secondary me-2">
                      NIC: {user.nic || "-"}
                    </span>
                    {isAdmin && <span className="badge bg-danger">Admin</span>}
                  </div>
                </div>
                <div className="ms-auto text-end">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate("/profile/edit")}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <hr />

              <div className="row mt-3">
                <div className="col-md-6">
                  <h6 className="text-uppercase text-muted">Contact</h6>
                  <p className="mb-1">{user.email}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-uppercase text-muted">Identity</h6>
                  <p className="mb-1">{user.nic || "Not provided"}</p>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <h6 className="text-uppercase text-muted">Traffic Batch</h6>
                  <div className="d-flex gap-2 align-items-center">
                    <span className="badge bg-primary">
                      Total: {finesSummary.total}
                    </span>
                    <span className="badge bg-success">
                      Paid: {finesSummary.paid}
                    </span>
                    <span className="badge bg-warning text-dark">
                      Unpaid: {finesSummary.unpaid}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
