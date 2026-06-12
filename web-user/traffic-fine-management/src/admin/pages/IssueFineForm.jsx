import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { issueFine } from "../services/adminApi";

const VIOLATION_TYPES = [
  "Speeding",
  "Running Red Light",
  "No Seatbelt",
  "Drunk Driving",
  "Wrong Parking",
  "Using Mobile While Driving",
  "No License",
  "Overloading",
];

export default function IssueFineForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleNo: "",
    nic: "",
    violationType: "",
    amount: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await issueFine(formData);
      navigate("/admin/fines");
    } catch (err) {
      setError("Failed to issue fine. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container mt-4" style={{ maxWidth: 600 }}>
        <h2>Issue New Fine</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Vehicle Plate Number</label>
            <input
              className="form-control"
              name="vehicleNo"
              value={formData.vehicleNo}
              onChange={handleChange}
              placeholder="e.g. CAA-1234"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Driver NIC</label>
            <input
              className="form-control"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="e.g. 200112345678"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Violation Type</label>
            <select
              className="form-select"
              name="violationType"
              value={formData.violationType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Violation --</option>
              {VIOLATION_TYPES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Fine Amount (LKR)</label>
            <input
              className="form-control"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 5000"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date of Violation</label>
            <input
              className="form-control"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              className="form-control"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Galle Road, Colombo"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Officer Notes (optional)</label>
            <textarea
              className="form-control"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Issuing..." : "Issue Fine"}
          </button>
        </form>
      </div>
    </>
  );
}
