import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../services/userService";

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", nic: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      setError("No user id found. Please login.");
      return;
    }
    setLoading(true);
    getUserById(id)
      .then((data) => {
        setUser({
          name: data.name || "",
          email: data.email || "",
          nic: data.nic || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(
          err?.response?.data?.message || err.message || "Failed to load user",
        );
      });
  }, []);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const id = localStorage.getItem("userId");
    if (!id) return setError("No user id found.");
    setSaving(true);
    try {
      await updateUser(id, user);
      setSaving(false);
      navigate("/profile");
    } catch (err) {
      setSaving(false);
      setError(err?.response?.data?.message || err.message || "Failed to save");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="mb-3">Edit Profile</h4>

              <div className="mb-3">
                <label className="form-label">Full name</label>
                <input
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">NIC</label>
                <input
                  name="nic"
                  value={user.nic}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
