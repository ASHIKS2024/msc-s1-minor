// ========== src/components/Admin/AdminDashboard.js ==========
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, CheckCircle, Clock, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        api.get('/auth/admin/users/pending/'),
        api.get('/auth/admin/users/all/'),
      ]);

      const allUsers = allRes.data;
      const pendingUsers = pendingRes.data;

      setStats({
        totalUsers: allUsers.length,
        pendingUsers: pendingUsers.length,
        approvedUsers: allUsers.filter(u => u.is_approved).length,
      });

      setRecentUsers(allUsers.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#3498db' },
    { icon: Clock, label: 'Pending Approval', value: stats.pendingUsers, color: '#f39c12' },
    { icon: CheckCircle, label: 'Approved Users', value: stats.approvedUsers, color: '#2ecc71' },
  ];

  return (
    <div>
      <h1 style={styles.pageTitle}>Admin Dashboard</h1>
      
      <div style={styles.statsGrid}>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} style={styles.statCard}>
              <div style={{ ...styles.iconBox, background: card.color }}>
                <Icon size={28} color="white" />
              </div>
              <div>
                <div style={styles.statValue}>{card.value}</div>
                <div style={styles.statLabel}>{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Recent User Registrations</h2>
          <button 
            style={styles.manageBtn}
            onClick={() => navigate('/admin/users')}
          >
            Manage All Users →
          </button>
        </div>
        {recentUsers.map((user) => (
          <div key={user.id} style={styles.listItem}>
            <div>
              <div style={styles.itemTitle}>{user.username}</div>
              <div style={styles.itemSubtext}>
                {user.email} • {user.role}
              </div>
            </div>
            <span style={{
              ...styles.badge, 
              background: user.is_approved ? '#2ecc71' : '#f39c12'
            }}>
              {user.is_approved ? 'Approved' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  pageTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  iconBox: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
  },
  card: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  manageBtn: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #f0f0f0',
  },
  itemTitle: {
    fontWeight: '500',
    color: '#333',
    marginBottom: '5px',
  },
  itemSubtext: {
    fontSize: '13px',
    color: '#666',
  },
  badge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500',
  },
};

export default AdminDashboard;