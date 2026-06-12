import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFines } from "../services/adminApi";

export default function FinesListPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllFines()
      .then((res) => setFines(res.data))
      .catch(() => setError("Failed to load fines."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = fines.filter(
    (f) =>
      f.vehicleNo?.toLowerCase().includes(search.toLowerCase()) ||
      f.nic?.toLowerCase().includes(search.toLowerCase()) ||
      f.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>All Fines</h2>
          <Link to="/admin/fines/new" className="btn btn-primary btn-sm">
            + Issue Fine
          </Link>
        </div>

        <input
          className="form-control mb-3"
          placeholder="Search by vehicle, NIC, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted">No fines found.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle</th>
                <th>NIC</th>
                <th>Violation</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fine) => (
                <tr key={fine.id}>
                  <td>{fine.id}</td>
                  <td>{fine.vehicleNo}</td>
                  <td>{fine.nic}</td>
                  <td>{fine.violationType}</td>
                  <td>Rs. {fine.amount}</td>
                  <td>{fine.status}</td>
                  <td>
                    <Link
                      to={`/admin/fines/${fine.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
