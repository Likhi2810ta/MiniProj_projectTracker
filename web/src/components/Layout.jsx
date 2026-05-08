import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken } from '../api';
import { useAuth } from '../context/AuthContext';

const ROLE_LABEL = { admin: 'Admin', lecturer: 'Lecturer', student: 'Student', coordinator: 'Coordinator' };

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { role, email } = useAuth();

  const NAV = [
    { to: '/batches', icon: '▣', label: 'Batches' },
    { to: '/chat',    icon: '✦', label: 'AI Chat' },
    ...(role === 'admin' ? [{ to: '/admin', icon: '⚙', label: 'Admin Panel' }] : []),
  ];

  function signOut() {
    clearToken();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="eyebrow">College</div>
          <h1>PROJECT<br />TRACKER</h1>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          {email && <p className="user-email">{email}</p>}
          {role && (
            <span style={{
              display: 'inline-block', marginBottom: 10,
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'var(--bg)', background: 'var(--accent)',
              padding: '2px 8px', borderRadius: 4, letterSpacing: '0.08em',
            }}>
              {ROLE_LABEL[role] || role}
            </span>
          )}
          <button className="btn-signout" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
