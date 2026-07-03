import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customers', label: 'Customers' },
  { to: '/leads', label: 'Leads' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/sales', label: 'Sales' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="rail" />
          Pipeline CRM
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <strong>{user?.fullName}</strong>
            {user?.email}
            <div style={{ marginTop: 6 }}>
              <span className="badge-role">{user?.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
