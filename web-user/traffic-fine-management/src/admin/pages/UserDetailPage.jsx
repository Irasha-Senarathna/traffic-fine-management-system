import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, deleteUser } from "../services/adminApi";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserById(id)
      .then((res) => setUser(res.data))
      .catch(() => setError("Failed to load user details."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      navigate("/admin/users");
    } catch (err) {
      setError("Failed to delete user.");
    }
  }

  return (
    <>
      <div className="container mt-4" style={{ maxWidth: 600 }}>
        <button
          className="btn btn-link ps-0 mb-3"
          onClick={() => navigate("/admin/users")}
        >
          &larr; Back to Users
        </button>

        <h2>User Details</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <div className="card p-4">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>NIC:</strong> {user.nic}</p>

            <button className="btn btn-danger mt-2" onClick={handleDelete}>
              Delete User
            </button>
          </div>
        ) : (
          <p>User not found.</p>
        )}
      </div>
    </>
  );
}
