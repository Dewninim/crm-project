import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/companies', label: 'Companies' },
    { path: '/logs', label: 'Activity Logs' },
  ];

  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.logo}>C</div>
          <span style={s.brandName}>CRM</span>
        </div>

        <nav style={s.nav}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...s.navItem,
                ...(location.pathname === item.path ? s.navItemActive : {})
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={s.bottomSection}>
          <button onClick={toggleTheme} style={s.themeBtn} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div style={s.userSection}>
            <div style={s.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
            <div style={s.userInfo}>
              <div style={s.userName}>{user?.username}</div>
              <div style={s.userRole}>{user?.role}</div>
            </div>
            <button onClick={handleLogout} style={s.logoutBtn} title="Sign out">
              →
            </button>
          </div>
        </div>
      </aside>

      <main style={s.main}>{children}</main>
    </div>
  );
}

const s = {
  root: { display: 'flex', minHeight: '100vh' },
  sidebar: { 
    width: '240px', 
    background: 'var(--surface)', 
    borderRight: '1px solid var(--border)', 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '24px 16px', 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    bottom: 0 
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingLeft: '8px' },
  logo: { 
    width: '32px', height: '32px', background: 'var(--accent)', 
    borderRadius: '7px', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', fontWeight: '700', fontSize: '16px', 
    color: 'white', flexShrink: 0 
  },
  brandName: { fontWeight: '600', fontSize: '15px', color: 'var(--text)' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: { 
    padding: '10px 14px', borderRadius: '8px', color: 'var(--text-muted)', 
    fontWeight: '500', fontSize: '14px', transition: 'all 0.2s' 
  },
  navItemActive: { 
    background: 'rgba(79, 110, 247, 0.1)', 
    color: 'var(--accent)', 
    fontWeight: '600' 
  },
  bottomSection: { marginTop: 'auto' },
  themeBtn: {
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    fontSize: '18px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userSection: { 
    display: 'flex', alignItems: 'center', gap: '12px', 
    padding: '12px', background: 'var(--surface2)', 
    borderRadius: '10px', border: '1px solid var(--border)' 
  },
  avatar: { 
    width: '34px', height: '34px', background: 'var(--accent)', 
    borderRadius: '50%', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', fontSize: '14px', fontWeight: '600', 
    color: 'white' 
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: '14px', fontWeight: '500', color: 'var(--text)' },
  userRole: { fontSize: '12px', color: 'var(--text-muted)' },
  logoutBtn: { 
    background: 'none', color: 'var(--text-muted)', fontSize: '18px', 
    padding: '4px 8px' 
  },
  main: { marginLeft: '240px', flex: 1, padding: '32px' },
};