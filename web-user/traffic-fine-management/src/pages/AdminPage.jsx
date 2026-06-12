import React, { useEffect, useState } from "react";
import {
  getAllFines,
  getFineById,
  getFinesByUser,
  getFinesByVehicle,
  issueFine,
  deleteFine,
  updateFine,
  markFineAsPaid,
} from "../services/fineService";
import { getUserById, updateUser, deleteUser } from "../services/userService";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("fines");
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search state
  const [findBy, setFindBy] = useState("fineId");
  const [query, setQuery] = useState("");

  const fineTypes = [
    { label: "Speeding", icon: "🚗", amount: 50 },
    { label: "Illegal Parking", icon: "🅿️", amount: 30 },
    { label: "Signal Violation", icon: "🚦", amount: 40 },
    { label: "Overtaking (Unsafe)", icon: "↗️", amount: 75 },
    { label: "Cutting Road Lines", icon: "🚧", amount: 60 },
    { label: "Illegal U-turn", icon: "🔄", amount: 45 },
    { label: "Reckless Driving", icon: "⚠️", amount: 150 },
    { label: "No Helmet (Motorcycle)", icon: "🪖", amount: 25 },
    { label: "Seatbelt Violation", icon: "🔒", amount: 20 },
    { label: "Blocking Intersection", icon: "🚫", amount: 55 },
    { label: "Other", icon: "❓", amount: 0 },
  ];

  // Issue fine form
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [otherReason, setOtherReason] = useState("");

  // inline edit state map by fine id
  const [editing, setEditing] = useState({});

  useEffect(() => {
    loadAllFines();
  }, []);

  useEffect(() => {
    if (!selectedType && fineTypes.length > 0)
      setSelectedType(fineTypes[0].label);
  }, []);

  // user management state
  const [searchUserId, setSearchUserId] = useState("");
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);

  function loadAllFines() {
    setLoading(true);
    setError(null);
    getAllFines()
      .then((data) => setFines(data || []))
      .catch((err) => setError(err?.message || "Failed to load fines"))
      .finally(() => setLoading(false));
  }

  function handleSearch(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const q = query.trim();
    if (!q) {
      loadAllFines();
      return;
    }

    const onError = (err) => {
      setError(err?.message || "Search failed");
      setFines([]);
      setLoading(false);
    };

    if (findBy === "fineId") {
      getFineById(q)
        .then((f) => setFines(f ? [f] : []))
        .catch(onError)
        .finally(() => setLoading(false));
    } else if (findBy === "user") {
      getFinesByUser(q)
        .then((list) => setFines(list || []))
        .catch(onError)
        .finally(() => setLoading(false));
    } else if (findBy === "vehicle") {
      getFinesByVehicle(q)
        .then((list) => setFines(list || []))
        .catch(onError)
        .finally(() => setLoading(false));
    }
  }

  function handleIssue(e) {
    e.preventDefault();
    setError(null);
    const dto = {
      vehiclePlate,
      reason:
        selectedType === "Other"
          ? otherReason || reason
          : selectedType || reason,
      amount: parseFloat(amount),
      userId: Number(userId),
    };
    issueFine(dto)
      .then(() => {
        setVehiclePlate("");
        setReason("");
        setAmount("");
        setUserId("");
        loadAllFines();
      })
      .catch((err) => setError(err?.message || "Issue fine failed"));
  }

  function handleDelete(id) {
    if (!confirm("Delete this fine?")) return;
    // optimistic UI update: remove from list immediately
    const previous = fines;
    setFines((s) => s.filter((f) => String(f.id) !== String(id)));

    deleteFine(id)
      .then(() => {
        // nothing — list already updated; ensure latest from server
        loadAllFines();
      })
      .catch((err) => {
        // revert on error
        setFines(previous);
        setError(err?.message || "Delete failed");
      });
  }

  function startEdit(fine) {
    setEditing((s) => ({ ...s, [fine.id]: { ...fine } }));
  }

  function cancelEdit(id) {
    setEditing((s) => {
      const nxt = { ...s };
      delete nxt[id];
      return nxt;
    });
  }

  function saveEdit(id) {
    const dto = editing[id];
    if (!dto) return;
    const payload = {
      vehiclePlate: dto.vehiclePlate,
      reason: dto.reason,
      amount: Number(dto.amount),
      userId: dto.user?.id || dto.userId || null,
    };
    updateFine(id, payload)
      .then(() => {
        cancelEdit(id);
        loadAllFines();
      })
      .catch((err) => setError(err?.message || "Update failed"));
  }

  function markPaid(id) {
    markFineAsPaid(id)
      .then(() => loadAllFines())
      .catch((err) => setError(err?.message || "Mark paid failed"));
  }

  // User management handlers
  function handleFindUser(e) {
    e && e.preventDefault && e.preventDefault();
    setUserError(null);
    setUser(null);
    const id = (searchUserId || "").toString().trim();
    if (!id) return setUserError("Enter a user id");
    setUserLoading(true);
    getUserById(id)
      .then((u) => setUser(u))
      .catch((err) =>
        setUserError(
          err?.response?.data?.message || err?.message || "User not found",
        ),
      )
      .finally(() => setUserLoading(false));
  }

  function handleUpdateUser(e) {
    e && e.preventDefault && e.preventDefault();
    if (!user || !user.id) return setUserError("No user loaded");
    setUserError(null);
    setUserLoading(true);
    updateUser(user.id, user)
      .then((u) => setUser(u))
      .catch((err) =>
        setUserError(
          err?.response?.data?.message || err?.message || "Update failed",
        ),
      )
      .finally(() => setUserLoading(false));
  }

  function handleDeleteUser() {
    if (!user || !user.id) return setUserError("No user loaded");
    if (!confirm("Delete this user?")) return;
    setUserError(null);
    setUserLoading(true);
    deleteUser(user.id)
      .then(() => {
        setUser(null);
        setSearchUserId("");
      })
      .catch((err) =>
        setUserError(
          err?.response?.data?.message || err?.message || "Delete failed",
        ),
      )
      .finally(() => setUserLoading(false));
  }

  return (
    <div className="container py-4">
      <h1 className="mb-3 text-danger">Admin Dashboard</h1>

      <div className="mb-3">
        <div className="btn-group" role="tablist">
          <button
            className={`btn ${activeTab === "fines" ? "btn-danger" : "btn-outline-secondary"}`}
            onClick={() => setActiveTab("fines")}
          >
            Fine Management
          </button>
          <button
            className={`btn ${activeTab === "users" ? "btn-danger" : "btn-outline-secondary"}`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
        </div>
      </div>

      {activeTab === "fines" ? (
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="card p-3 mb-3">
              <h5>Search fines</h5>
              <form className="d-flex gap-2" onSubmit={handleSearch}>
                <select
                  className="form-select"
                  value={findBy}
                  onChange={(e) => setFindBy(e.target.value)}
                  style={{ maxWidth: 140 }}
                >
                  <option value="fineId">Fine Id</option>
                  <option value="user">User Id</option>
                  <option value="vehicle">Vehicle</option>
                </select>
                <input
                  className="form-control"
                  placeholder="Value"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  Search
                </button>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={loadAllFines}
                >
                  Reset
                </button>
              </form>
              {error && <div className="text-danger mt-2">{error}</div>}
            </div>

            <div className="card p-3">
              <h5>Issue Fine</h5>
              <form onSubmit={handleIssue}>
                <div className="mb-2">
                  <label className="form-label">Vehicle Plate</label>
                  <input
                    className="form-control"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Fine Type</label>
                  <select
                    className="form-select"
                    value={selectedType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedType(val);
                      const t = fineTypes.find((ft) => ft.label === val);
                      if (t && t.amount) setAmount(String(t.amount));
                      if (val !== "Other") setOtherReason("");
                    }}
                  >
                    {fineTypes.map((ft) => (
                      <option key={ft.label} value={ft.label}>
                        {ft.label}
                      </option>
                    ))}
                  </select>
                  {selectedType === "Other" && (
                    <div className="mt-2">
                      <label className="form-label">Other reason</label>
                      <input
                        className="form-control"
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <label className="form-label">Amount</label>
                  <input
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">User Id</label>
                  <input
                    className="form-control"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success" type="submit">
                    Issue
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => {
                      setVehiclePlate("");
                      setReason("");
                      setAmount("");
                      setUserId("");
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card p-3">
              <h5>All fines</h5>
              {loading ? (
                <div>Loading...</div>
              ) : fines.length === 0 ? (
                <div className="text-muted">No fines found.</div>
              ) : (
                <div className="list-group">
                  {fines.map((fine) => (
                    <div key={fine.id} className="list-group-item">
                      {editing[fine.id] ? (
                        <div className="d-flex gap-2 align-items-start">
                          <div style={{ flex: 1 }}>
                            <input
                              className="form-control mb-1"
                              value={editing[fine.id].vehiclePlate || ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  [fine.id]: {
                                    ...s[fine.id],
                                    vehiclePlate: e.target.value,
                                  },
                                }))
                              }
                            />
                            <input
                              className="form-control mb-1"
                              value={editing[fine.id].reason || ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  [fine.id]: {
                                    ...s[fine.id],
                                    reason: e.target.value,
                                  },
                                }))
                              }
                            />
                            <input
                              className="form-control"
                              value={editing[fine.id].amount || ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  [fine.id]: {
                                    ...s[fine.id],
                                    amount: e.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                          <div className="d-flex flex-column">
                            <button
                              className="btn btn-sm btn-primary mb-1"
                              onClick={() => saveEdit(fine.id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => cancelEdit(fine.id)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="fw-bold">
                              {fine.vehiclePlate || "-"}{" "}
                              <small className="text-muted">#{fine.id}</small>
                            </div>
                            <div className="text-muted">{fine.reason}</div>
                            <div>
                              <strong>Amount:</strong> {fine.amount}
                            </div>
                            <div>
                              <strong>Status:</strong> {fine.status}
                            </div>
                          </div>
                          <div className="d-flex flex-column align-items-end">
                            <button
                              className="btn btn-sm btn-outline-primary mb-1"
                              onClick={() => startEdit(fine)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success mb-1"
                              onClick={() => markPaid(fine.id)}
                            >
                              Mark Paid
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(fine.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // User Management Tab
        <div className="card p-3">
          <h5>User Management</h5>
          <form className="d-flex gap-2 mb-3" onSubmit={handleFindUser}>
            <input
              className="form-control"
              placeholder="User ID"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Find
            </button>
          </form>
          {userError && <div className="text-danger mb-2">{userError}</div>}
          {userLoading ? (
            <div>Loading user...</div>
          ) : user ? (
            <div>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={user.name || ""}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  value={user.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">NIC</label>
                <input
                  className="form-control"
                  value={user.nic || ""}
                  onChange={(e) => setUser({ ...user, nic: e.target.value })}
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={handleUpdateUser}>
                  Update
                </button>
                <button className="btn btn-danger" onClick={handleDeleteUser}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="text-muted">No user loaded.</div>
          )}
        </div>
      )}
    </div>
  );
}
