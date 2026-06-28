import React, { useEffect, useState } from 'react';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../services/api';

export default function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(null);

  // search
  const [query, setQuery] = useState('');

  // edit modal
  const [editing, setEditing] = useState(null); // user object
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { loadAll(); }, []);

  function loadAll() {
    setLoading(true);
    setError(null);
    getAllUsers()
      .then((r) => setUsers(r.data || []))
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      String(u.id).includes(q) ||
      (u.name  || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.nic   || '').toLowerCase().includes(q)
    );
  });

  function handleDelete(id) {
    if (!confirm('Delete this user? Their fines will remain in the system.')) return;
    deleteUser(id)
      .then(() => { setSuccess('User deleted.'); setTimeout(() => setSuccess(null), 3000); loadAll(); })
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Delete failed'));
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    setSaving(true);
    updateUser(editing.id, editing)
      .then(() => {
        setSuccess('User updated.');
        setTimeout(() => setSuccess(null), 3000);
        setEditing(null);
        loadAll();
      })
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Update failed'))
      .finally(() => setSaving(false));
  }

  return (
    <div>
      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              Edit User #{editing.id}
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Close</button>
            </div>
            <form onSubmit={handleSaveEdit} style={{ padding: 20 }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editing.email || ''}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>NIC</label>
                <input
                  value={editing.nic || ''}
                  onChange={(e) => setEditing({ ...editing, nic: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editing.role || 'USER'}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          Registered Users
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
            {users.length} total
          </span>
        </div>

        <div className="search-bar">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, NIC or ID…"
          />
          <button className="btn btn-ghost btn-sm" onClick={() => setQuery('')}>Clear</button>
        </div>

        {loading ? (
          <div className="spinner">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No users found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>NIC</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.name || '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{u.email || '—'}</td>
                    <td>{u.nic || '—'}</td>
                    <td>
                      <span
                        className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : u.role === 'POLICE' ? 'badge-police' : 'badge-user'}`}
                      >
                        {u.role || 'USER'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditing({ ...u })}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
