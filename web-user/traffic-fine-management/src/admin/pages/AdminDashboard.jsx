import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getAllFines, getAllUsers } from "../services/adminApi";

export default function AdminDashboard() {
  const [fines, setFines] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [finesRes, usersRes] = await Promise.all([
          getAllFines(),
          getAllUsers(),
        ]);
        setFines(finesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalFines = fines.length;
  const paidFines = fines.filter((f) => f.status === "PAID").length;
  const pendingFines = fines.filter((f) => f.status === "UNPAID").length;
  const recentFines = fines.slice(0, 5);

  return (
    <>
      <div className="container-fluid p-4">
        <h2 className="mb-4">Traffic Fine Management Dashboard</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="row g-3">
              <div className="col-md-3">
                <StatCard title="Total Fines" value={totalFines} color="blue" />
              </div>
              <div className="col-md-3">
                <StatCard title="Paid Fines" value={paidFines} color="green" />
              </div>
              <div className="col-md-3">
                <StatCard title="Pending" value={pendingFines} color="orange" />
              </div>
              <div className="col-md-3">
                <StatCard title="Users" value={users.length} color="red" />
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-header">Recent Fines</div>
              <div className="card-body">
                {recentFines.length === 0 ? (
                  <p className="text-muted">No fines found.</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Vehicle</th>
                        <th>Violation</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentFines.map((fine) => (
                        <tr key={fine.id}>
                          <td>{fine.id}</td>
                          <td>{fine.vehicleNo}</td>
                          <td>{fine.violationType}</td>
                          <td>Rs. {fine.amount}</td>
                          <td>{fine.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
