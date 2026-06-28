import React, { useState } from 'react';
import { adminLogin } from '../services/api';

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 26, height: 26, color: '#fff' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 16, height: 16 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 16, height: 16 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

export default function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res  = await adminLogin({ email, password });
      const data = res.data;

      if (!data?.token) { setError('Invalid response from server.'); setLoading(false); return; }

      const role = data.role || '';
      if (role !== 'ADMIN') {
        setError('Access denied. Only ADMIN accounts can access this portal.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminName',  data.name || email);
      localStorage.setItem('adminRole',  role);
      onLogin();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Sri Lanka flag accent bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, #8B0000 0%, #FF6600 40%, #8B6914 70%, #006400 100%)',
        zIndex: 10,
      }} aria-hidden="true" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <IconShield />
          </div>
          <div>
            <h1>Admin Portal</h1>
            <p style={{ margin: 0 }}>Sri Lanka Police — Traffic Fine System</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" role="alert">
            <IconAlert />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="admin-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--muted)', pointerEvents: 'none',
              }}>
                <IconMail />
              </span>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@police.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--muted)', pointerEvents: 'none',
              }}>
                <IconLock />
              </span>
              <input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8, padding: '11px 18px', fontSize: 14 }}
            disabled={loading}
          >
            {loading ? 'Authenticating…' : 'Sign In as Administrator'}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
          Restricted access — authorized personnel only.<br />
          Unauthorized access attempts are logged and prosecuted.
        </p>
      </div>
    </div>
  );
}
