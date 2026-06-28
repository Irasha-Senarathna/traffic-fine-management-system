import React, { useEffect, useState } from 'react';
import { getOfficers, createOfficer, deleteOfficer } from '../services/api';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function randomPassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/* ── SVG Icons ───────────────────────────────────────────────────────────── */
const IconBadge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const IconCopy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
  </svg>
);

/* ── Default form state ───────────────────────────────────────────────────── */
const EMPTY_FORM = { name: '', email: '', phone: '', password: '' };

export default function OfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(null);

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  // Revealed password after creation
  const [createdPass, setCreatedPass] = useState(null);
  const [copied,      setCopied]      = useState(false);

  useEffect(() => { loadAll(); }, []);

  function loadAll() {
    setLoading(true);
    setError(null);
    getOfficers()
      .then((r) => setOfficers(r.data || []))
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Failed to load officers'))
      .finally(() => setLoading(false));
  }

  function openCreate() {
    setForm({ ...EMPTY_FORM, password: randomPassword() });
    setCreatedPass(null);
    setCopied(false);
    setShowCreate(true);
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.password.trim()) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    setError(null);
    createOfficer(form)
      .then(() => {
        setCreatedPass(form.password);
        setSuccess('Officer account created successfully!');
        setTimeout(() => setSuccess(null), 5000);
        loadAll();
        setForm(EMPTY_FORM);
      })
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Create failed'))
      .finally(() => setSaving(false));
  }

  function handleDelete(id, name) {
    if (!confirm(`Remove officer "${name}"? Their issued fines will remain in the system.`)) return;
    deleteOfficer(id)
      .then(() => { setSuccess('Officer removed.'); setTimeout(() => setSuccess(null), 3000); loadAll(); })
      .catch((e) => setError(e?.response?.data?.message || e.message || 'Delete failed'));
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  function closeCreate() {
    setShowCreate(false);
    setCreatedPass(null);
    setCopied(false);
    setError(null);
  }

  return (
    <div>
      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* ── Create Officer Modal ───────────────────────────────────────────── */}
      {showCreate && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 520 }}>
            <div className="panel-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 18, height: 18, color: 'var(--accent)' }}><IconBadge /></span>
                Create Police Officer Account
              </span>
              <button className="btn btn-ghost btn-sm" onClick={closeCreate}>✕ Close</button>
            </div>

            {createdPass ? (
              /* ── Success state: show credentials ──────────────────────── */
              <div style={{ padding: '28px 24px' }}>
                <div className="alert alert-success" style={{ marginBottom: 20 }}>
                  Officer account created successfully!
                </div>

                <p style={{ color: 'var(--muted-2)', fontSize: 13.5, marginBottom: 16 }}>
                  Share these credentials with the officer. The password <strong style={{ color: 'var(--text)' }}>cannot be retrieved</strong> after closing this dialog.
                </p>

                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '14px 16px', marginBottom: 20 }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 4 }}>Email</div>
                    <div style={{ fontFamily: 'monospace', color: 'var(--text)', fontSize: 14 }}>{form.email || officers[officers.length - 1]?.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 4 }}>Temporary Password</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <code style={{ fontFamily: 'monospace', color: 'var(--gold-light)', fontSize: 15, letterSpacing: 1 }}>{createdPass}</code>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleCopy(createdPass)}
                        title="Copy password"
                      >
                        <IconCopy /> {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }} onClick={closeCreate}>
                  Done
                </button>
              </div>
            ) : (
              /* ── Create form ──────────────────────────────────────────── */
              <form onSubmit={handleCreate} style={{ padding: '24px' }}>
                {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

                <div className="form-row form-row-2" style={{ marginBottom: 16 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Full Name</label>
                    <input
                      id="officer-name"
                      placeholder="e.g. Sgt. Nimal Perera"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Phone Number</label>
                    <input
                      id="officer-phone"
                      placeholder="e.g. 0771234567"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    id="officer-email"
                    type="email"
                    placeholder="e.g. officer@police.lk"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Initial Password</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      id="officer-password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      style={{ fontFamily: 'monospace', letterSpacing: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ flexShrink: 0 }}
                      onClick={() => setForm({ ...form, password: randomPassword() })}
                      title="Generate new password"
                    >
                      ↻ Generate
                    </button>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 5 }}>
                    This will be shown once after creation. Ask the officer to change it.
                  </div>
                </div>

                {/* SMS note */}
                <div style={{ background: 'rgba(139,26,45,.05)', border: '1px solid rgba(139,26,45,.15)', borderLeft: '3px solid var(--crimson)', borderRadius: 'var(--r-md)', padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 16, height: 16, color: 'var(--crimson)', flexShrink: 0, marginTop: 1 }}><IconPhone /></span>
                  <span style={{ fontSize: 12.5, color: 'var(--muted-2)' }}>
                    The phone number will receive an <strong style={{ color: 'var(--text)' }}>SMS notification via notify.lk</strong> whenever a citizen pays a fine issued by this officer.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost" onClick={closeCreate}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving} id="create-officer-btn">
                    {saving ? 'Creating…' : 'Create Officer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Stats Strip ───────────────────────────────────────────────────── */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="stat-card accent-blue">
          <div className="label">Total Officers</div>
          <div className="value">{officers.length}</div>
          <div className="sub">Active accounts</div>
        </div>
        <div className="stat-card accent-green">
          <div className="label">With Phone</div>
          <div className="value">{officers.filter(o => o.phone).length}</div>
          <div className="sub">SMS-enabled</div>
        </div>
        <div className="stat-card accent-warn">
          <div className="label">Without Phone</div>
          <div className="value">{officers.filter(o => !o.phone).length}</div>
          <div className="sub">No SMS notifications</div>
        </div>
      </div>

      {/* ── Officers Table Panel ───────────────────────────────────────────── */}
      <div className="panel">
        <div className="panel-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="panel-icon"><IconBadge /></span>
            Police Officers
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
              {officers.length} registered
            </span>
          </span>
          <button
            id="btn-new-officer"
            className="btn btn-primary btn-sm"
            onClick={openCreate}
            style={{ gap: 6 }}
          >
            <IconPlus /> New Officer
          </button>
        </div>

        {loading ? (
          <div className="spinner">Loading officers…</div>
        ) : officers.length === 0 ? (
          <div className="empty">
            <div style={{ marginBottom: 12, fontSize: 40, opacity: .3 }}>👮</div>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-2)' }}>No officers yet</div>
            <div style={{ marginBottom: 16 }}>Create an officer account to get started.</div>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <IconPlus /> Create First Officer
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>SMS Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {officers.map((o) => (
                  <tr key={o.id}>
                    <td style={{ color: 'var(--muted)' }}>#{o.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                          background: 'var(--crimson)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: '#fff',
                        }}>
                          {(o.name || '?')[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--text)' }}>{o.name || '—'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{o.email || '—'}</td>
                    <td>
                      {o.phone ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-2)' }}>
                          <span style={{ width: 14, height: 14, color: 'var(--success)' }}><IconPhone /></span>
                          {o.phone}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--danger)', fontSize: 12 }}>Not set</span>
                      )}
                    </td>
                    <td>
                      {o.phone ? (
                        <span className="badge badge-paid">SMS Ready</span>
                      ) : (
                        <span className="badge badge-unpaid">No SMS</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(o.id, o.name)}
                        id={`delete-officer-${o.id}`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Info Banner ─────────────────────────────────────────────────────
      <div style={{
        background: 'rgba(139,26,45,.04)',
        border: '1px solid rgba(139,26,45,.15)',
        borderLeft: '3px solid var(--crimson)',
        borderRadius: 'var(--r-md)',
        padding: '14px 18px',
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ width: 18, height: 18, color: 'var(--crimson)', flexShrink: 0, marginTop: 1 }}><IconPhone /></span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
            How SMS notifications work
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted-2)', lineHeight: 1.6 }}>
            When a citizen pays a fine, the system automatically sends an SMS to the <strong style={{ color: 'var(--text)' }}>police officer who issued that fine</strong> via <strong style={{ color: 'var(--accent)' }}>notify.lk</strong>.
            The message confirms the fine number, vehicle plate, and that the driver may retrieve their license.
            Make sure to add notify.lk credentials in <code style={{ background: 'var(--surface2)', padding: '1px 6px', borderRadius: 4 }}>application-local.properties</code>.
          </div>
        </div>
      </div> */}
    </div>
  );
}
