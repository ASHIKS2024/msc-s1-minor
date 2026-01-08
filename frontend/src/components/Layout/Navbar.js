import React from 'react';
import { LogOut, User } from 'lucide-react';

function Navbar({ user, onLogout }) {
  return (
    <div style={styles.navbar}>
      <h2 style={styles.title}>Sprint Management System</h2>
      <div style={styles.userSection}>
        <User size={20} />
        <span style={styles.username}>{user?.username}</span>
        <button onClick={onLogout} style={styles.logoutBtn}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px',
    height: '60px',
    background: 'white',
    borderBottom: '1px solid #e0e0e0',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  username: {
    fontWeight: '500',
    color: '#666',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 16px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;
