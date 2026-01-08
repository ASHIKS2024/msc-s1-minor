// ========== src/components/Layout/Sidebar.js (CORRECTED VERSION) ==========
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Folder, Activity, BarChart3 } from 'lucide-react';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/projects', icon: Folder, label: 'Projects' },
    { path: '/sprints', icon: Activity, label: 'Sprints' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <Activity size={32} color="#3498db" />
        <span style={styles.logoText}>Sprint Manager</span>
      </div>
      
      <div style={styles.menu}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.activeMenuItem : {}),
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '250px',
    background: '#2c3e50',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '25px',
    borderBottom: '1px solid #34495e',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  menu: {
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px 25px',
    color: '#ecf0f1',
    textDecoration: 'none',
    transition: 'all 0.3s',
    fontSize: '15px',
  },
  activeMenuItem: {
    background: '#34495e',
    borderLeft: '4px solid #3498db',
    color: '#ffffff',
  },
};

export default Sidebar;