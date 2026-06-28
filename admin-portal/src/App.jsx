import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FinesPage from './pages/FinesPage';
import UsersPage from './pages/UsersPage';
import OfficersPage from './pages/OfficersPage';

const PAGE_TITLES = {
  dashboard: 'Dashboard Overview',
  fines:     'Fine Management',
  users:     'User Management',
  officers:  'Police Officers',
};

const PAGE_SUBTITLES = {
  dashboard: 'Analytics & statistics summary',
  fines:     'Issue, search and manage traffic fines',
  users:     'Manage registered citizen accounts',
  officers:  'Create and manage officer accounts & SMS notifications',
};

function isAuthenticated() {
  return !!localStorage.getItem('adminToken');
}

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [page,   setPage]   = useState('dashboard');

  useEffect(() => {
    const check = () => setAuthed(isAuthenticated());
    window.addEventListener('focus', check);
    return () => window.removeEventListener('focus', check);
  }, []);

  function handleLogin()  { setAuthed(true); setPage('dashboard'); }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    setAuthed(false);
  }

  if (!authed) return <LoginPage onLogin={handleLogin} />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'fines':     return <FinesPage />;
      case 'users':     return <UsersPage />;
      case 'officers':  return <OfficersPage />;
      default:          return <DashboardPage />;
    }
  };

  return (
    <div className="layout">
      <Sidebar active={page} onNavigate={setPage} onLogout={handleLogout} />

      <div className="main">
        <header className="topbar">
          <div>
            <h2>{PAGE_TITLES[page] || 'Admin'}</h2>
          </div>
          <div className="spacer" />
          <span className="badge-role">ADMIN</span>
        </header>

        <div className="content" role="main">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
