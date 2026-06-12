import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFineById, updateFine } from "../services/adminApi";

export default function AdminFineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fine, setFine] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getFineById(id)
      .then((res) => {
        setFine(res.data);
        setStatus(res.data.status);
      })
      .catch(() => setError("Failed to load fine details."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleUpdate() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateFine(id, { ...fine, status });
      setSuccess("Status updated successfully.");
    } catch (err) {
      setError("Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="container mt-4" style={{ maxWidth: 600 }}>
        <button
          className="btn btn-link ps-0 mb-3"
          onClick={() => navigate("/admin/fines")}
        >
          &larr; Back to Fines
        </button>

        <h2>Fine Details</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : fine ? (
          <div className="card p-4">
            <p><strong>Fine ID:</strong> {fine.id}</p>
            <p><strong>Vehicle:</strong> {fine.vehicleNo}</p>
            <p><strong>NIC:</strong> {fine.nic}</p>
            <p><strong>Violation:</strong> {fine.violationType}</p>
            <p><strong>Amount:</strong> Rs. {fine.amount}</p>
            <p><strong>Location:</strong> {fine.location}</p>
            <p><strong>Date:</strong> {fine.date}</p>
            {fine.notes && <p><strong>Notes:</strong> {fine.notes}</p>}

            <div className="mb-3">
              <label className="form-label">Update Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="UNPAID">UNPAID</option>
                <option value="PAID">PAID</option>
                <option value="DISPUTED">DISPUTED</option>
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving ? "Saving..." : "Update Status"}
            </button>
          </div>
        ) : (
          <p>Fine not found.</p>
        )}
      </div>
    </>
  );
}
