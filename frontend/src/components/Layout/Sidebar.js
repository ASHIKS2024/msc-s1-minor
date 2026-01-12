// ========== src/components/Layout/Sidebar.js (UPDATED FOR ADMIN) ==========
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Folder, 
  Activity, 
  BarChart3, 
  Users,
  Shield,
  Eye
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.is_staff || false;

  // Admin menu items (can view but not edit)
  const adminMenuItems = [
    { icon: Shield, label: 'Admin Dashboard', path: '/' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Eye, label: 'View Projects', path: '/projects' },
    { icon: Eye, label: 'View Sprints', path: '/sprints' },
  ];

  // Regular user menu items
  const regularMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Folder, label: 'Projects', path: '/projects' },
    { icon: Activity, label: 'Sprints', path: '/sprints' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  const menuItems = isAdmin ? adminMenuItems : regularMenuItems;

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <Activity size={32} color="#667eea" />
        <h2 style={styles.title}>Sprint Manager</h2>
      </div>

      {isAdmin && (
        <div style={styles.adminBadge}>
          <Shield size={16} />
          Admin Panel
        </div>
      )}

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.activeNavItem : {}),
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
  },
  header: {
    padding: '30px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
  },
  adminBadge: {
    margin: '20px',
    padding: '10px 15px',
    background: 'rgba(102, 126, 234, 0.3)',
    border: '1px solid rgba(102, 126, 234, 0.5)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  nav: {
    padding: '20px 0',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px 25px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    transition: 'all 0.3s',
    cursor: 'pointer',
    fontSize: '15px',
  },
  activeNavItem: {
    background: 'rgba(102, 126, 234, 0.2)',
    borderLeft: '4px solid #667eea',
    color: 'white',
    paddingLeft: '21px',
  },
};

export default Sidebar;