import React, { useEffect, useState } from 'react';
import {
  getAllFines, getFineById, getFinesByUser, getFinesByVehicle,
  issueFine, updateFine, deleteFine, markFineAsPaid
} from '../services/api';

const DISTRICTS = [
  'Ampara','Anuradhapura','Badulla','Batticaloa','Colombo',
  'Galle','Gampaha','Hambantota','Jaffna','Kalutara',
  'Kandy','Kegalle','Kilinochchi','Kurunegala','Mannar',
  'Matale','Matara','Monaragala','Mullaitivu','Nuwara Eliya',
  'Polonnaruwa','Puttalam','Ratnapura','Trincomalee','Vavuniya',
];

const CATEGORIES = [
  'Speeding','Illegal Parking','Signal Violation','Overtaking (Unsafe)',
  'Cutting Road Lines','Illegal U-turn','Reckless Driving',
  'No Helmet (Motorcycle)','Seatbelt Violation','Blocking Intersection','Other',
];

const CATEGORY_AMOUNTS = {
  'Speeding': 5000,
  'Illegal Parking': 3000,
  'Signal Violation': 4000,
  'Overtaking (Unsafe)': 7500,
  'Cutting Road Lines': 6000,
  'Illegal U-turn': 4500,
  'Reckless Driving': 15000,
  'No Helmet (Motorcycle)': 2500,
  'Seatbelt Violation': 2000,
  'Blocking Intersection': 5500,
  'Other': 0,
};

const EMPTY_FORM = {
  vehiclePlate: '', fineCategory: CATEGORIES[0], reason: '', amount: '',
  district: DISTRICTS[4], userId: '',
};

export default function FinesPage() {
  const [fines,    setFines]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(null);

  // search
  const [searchBy, setSearchBy] = useState('all');
  const [query,    setQuery]    = useState('');

  // issue / edit form
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { loadAll(); }, []);

  function loadAll() {
    setLoading(true);
    setError(null);
    getAllFines()
      .then((r) => setFines(r.data || []))
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Failed'))
      .finally(() => setLoading(false));
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim() || searchBy === 'all') { loadAll(); return; }
    setLoading(true);
    setError(null);
    const q = query.trim();
    const call =
      searchBy === 'id'      ? getFineById(q).then((r) => setFines([r.data])) :
      searchBy === 'user'    ? getFinesByUser(q).then((r) => setFines(r.data || [])) :
      searchBy === 'vehicle' ? getFinesByVehicle(q).then((r) => setFines(r.data || [])) :
      Promise.resolve();
    call
      .catch((e) => { setError(e?.response?.data?.message || e.message || 'Not found'); setFines([]); })
      .finally(() => setLoading(false));
  }

  function openIssueForm() {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  }

  function openEditForm(fine) {
    setEditId(fine.id);
    setForm({
      vehiclePlate: fine.vehiclePlate || '',
      fineCategory: fine.fineCategory || CATEGORIES[0],
      reason: fine.reason || '',
      amount: String(fine.amount || ''),
      district: fine.district || DISTRICTS[4],
      userId: String(fine.user?.id || fine.userId || ''),
    });
    setShowForm(true);
  }

  function handleFormChange(field, val) {
    const next = { ...form, [field]: val };
    if (field === 'fineCategory' && val !== 'Other') {
      next.amount = String(CATEGORY_AMOUNTS[val] || '');
    }
    setForm(next);
  }

  function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      vehiclePlate: form.vehiclePlate,
      reason: form.fineCategory !== 'Other' ? form.fineCategory : form.reason,
      fineCategory: form.fineCategory,
      amount: parseFloat(form.amount) || 0,
      district: form.district,
      userId: parseInt(form.userId, 10) || 0,
    };
    const call = editId ? updateFine(editId, payload) : issueFine(payload);
    call
      .then(() => {
        setSuccess(editId ? 'Fine updated.' : 'Fine issued successfully.');
        setShowForm(false);
        setTimeout(() => setSuccess(null), 3000);
        loadAll();
      })
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Save failed'))
      .finally(() => setSaving(false));
  }

  function handleDelete(id) {
    if (!confirm('Delete this fine?')) return;
    deleteFine(id)
      .then(() => loadAll())
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Delete failed'));
  }

  function handleMarkPaid(id) {
    markFineAsPaid(id)
      .then(() => {
        setSuccess('Fine marked as paid.');
        setTimeout(() => setSuccess(null), 3000);
        loadAll();
      })
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Failed'));
  }

  return (
    <div>
      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Issue Fine Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="panel-header">
              {editId ? 'Edit Fine' : 'Issue New Fine'}
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Close</button>
            </div>
            <form onSubmit={handleSave} style={{ padding: 20 }}>
              <div className="form-row form-row-2">
                <div className="form-group">
                  <label>Vehicle Plate *</label>
                  <input
                    value={form.vehiclePlate}
                    onChange={(e) => handleFormChange('vehiclePlate', e.target.value)}
                    placeholder="ABC-1234"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>User ID *</label>
                  <input
                    type="number"
                    value={form.userId}
                    onChange={(e) => handleFormChange('userId', e.target.value)}
                    placeholder="e.g. 1"
                    required
                  />
                </div>
              </div>

              <div className="form-row form-row-2">
                <div className="form-group">
                  <label>Fine Category *</label>
                  <select
                    value={form.fineCategory}
                    onChange={(e) => handleFormChange('fineCategory', e.target.value)}
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>District *</label>
                  <select
                    value={form.district}
                    onChange={(e) => handleFormChange('district', e.target.value)}
                  >
                    {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {form.fineCategory === 'Other' && (
                <div className="form-group">
                  <label>Reason (required for "Other")</label>
                  <input
                    value={form.reason}
                    onChange={(e) => handleFormChange('reason', e.target.value)}
                    placeholder="Describe the violation"
                    required={form.fineCategory === 'Other'}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Fine Amount (LKR) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editId ? 'Update Fine' : 'Issue Fine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search + Actions */}
      <div className="panel">
        <div className="panel-header">
          All Fines
          <button className="btn btn-primary btn-sm" onClick={openIssueForm}>Issue Fine</button>
        </div>

        <div className="search-bar">
          <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)} style={{ maxWidth: 140 }}>
            <option value="all">All Fines</option>
            <option value="id">Fine ID</option>
            <option value="user">User ID</option>
            <option value="vehicle">Vehicle Plate</option>
          </select>
          {searchBy !== 'all' && (
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchBy === 'vehicle' ? 'ABC-1234' : 'Enter ID…'}
              style={{ maxWidth: 200 }}
            />
          )}
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>Search</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setQuery(''); setSearchBy('all'); loadAll(); }}>Reset</button>
        </div>

        {loading ? (
          <div className="spinner">Loading fines…</div>
        ) : fines.length === 0 ? (
          <div className="empty">No fines found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Vehicle</th>
                  <th>Category</th>
                  <th>District</th>
                  <th>Amount (LKR)</th>
                  <th>Status</th>
                  <th>Issued</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((f) => (
                  <tr key={f.id}>
                    <td>#{f.id}</td>
                    <td>{f.vehiclePlate || '—'}</td>
                    <td>{f.fineCategory || f.reason || '—'}</td>
                    <td>{f.district || '—'}</td>
                    <td>{Number(f.amount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${f.status === 'PAID' ? 'badge-paid' : 'badge-unpaid'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {f.issuedAt ? new Date(f.issuedAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditForm(f)}>Edit</button>
                        {f.status !== 'PAID' && (
                          <button className="btn btn-success btn-sm" onClick={() => handleMarkPaid(f.id)}>Pay</button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>Delete</button>
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
