// ========== src/components/Admin/UserManagement.js ==========
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, CheckCircle, XCircle, Trash2, Clock, AlertCircle } from 'lucide-react';

function UserManagement() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [pendingRes, allRes] = await Promise.all([
        api.get('/auth/admin/users/pending/'),
        api.get('/auth/admin/users/all/'),
      ]);

      setPendingUsers(pendingRes.data);
      setAllUsers(allRes.data);

      setStats({
        total: allRes.data.length,
        pending: pendingRes.data.length,
        approved: allRes.data.filter(u => u.is_approved).length,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Approve this user?')) return;

    try {
      await api.post(`/auth/admin/users/${userId}/approve/`);
      alert('User approved successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Reject and delete this user? This cannot be undone.')) return;

    try {
      await api.post(`/auth/admin/users/${userId}/reject/`);
      alert('User rejected and removed');
      fetchUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;

    try {
      await api.delete(`/auth/admin/users/${userId}/delete/`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      manager: '#3498db',
      developer: '#2ecc71',
      tester: '#f39c12',
    };
    return colors[role] || '#95a5a6';
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>User Management</h1>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, background: '#3498db' }}>
            <Users size={28} color="white" />
          </div>
          <div>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, background: '#f39c12' }}>
            <Clock size={28} color="white" />
          </div>
          <div>
            <div style={styles.statValue}>{stats.pending}</div>
            <div style={styles.statLabel}>Pending Approval</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.iconBox, background: '#2ecc71' }}>
            <CheckCircle size={28} color="white" />
          </div>
          <div>
            <div style={styles.statValue}>{stats.approved}</div>
            <div style={styles.statLabel}>Approved Users</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'pending' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approvals ({stats.pending})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'all' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('all')}
        >
          All Users ({stats.total})
        </button>
      </div>

      {/* User List */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.loading}>Loading users...</div>
        ) : activeTab === 'pending' ? (
          pendingUsers.length === 0 ? (
            <div style={styles.emptyState}>
              <CheckCircle size={48} color="#95a5a6" />
              <p style={styles.emptyText}>No pending user approvals</p>
            </div>
          ) : (
            <div style={styles.userList}>
              {pendingUsers.map((user) => (
                <div key={user.id} style={styles.userCard}>
                  <div style={styles.userInfo}>
                    <div style={styles.userHeader}>
                      <h3 style={styles.userName}>{user.username}</h3>
                      <span
                        style={{
                          ...styles.roleBadge,
                          background: getRoleBadgeColor(user.role),
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div style={styles.userDetails}>
                      <p style={styles.detailText}>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p style={styles.detailText}>
                        <strong>Name:</strong> {user.first_name} {user.last_name}
                      </p>
                      <p style={styles.detailText}>
                        <strong>Registered:</strong> {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                  <div style={styles.actions}>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApprove(user.id)}
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleReject(user.id)}
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div style={styles.userList}>
            {allUsers.map((user) => (
              <div key={user.id} style={styles.userCard}>
                <div style={styles.userInfo}>
                  <div style={styles.userHeader}>
                    <h3 style={styles.userName}>{user.username}</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span
                        style={{
                          ...styles.roleBadge,
                          background: getRoleBadgeColor(user.role),
                        }}
                      >
                        {user.role}
                      </span>
                      {user.is_approved ? (
                        <span style={styles.approvedBadge}>
                          <CheckCircle size={14} /> Approved
                        </span>
                      ) : (
                        <span style={styles.pendingBadge}>
                          <AlertCircle size={14} /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={styles.userDetails}>
                    <p style={styles.detailText}>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p style={styles.detailText}>
                      <strong>Name:</strong> {user.first_name} {user.last_name}
                    </p>
                    <p style={styles.detailText}>
                      <strong>Registered:</strong> {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>
                <div style={styles.actions}>
                  {!user.is_approved && (
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApprove(user.id)}
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                  )}
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
  },
  tab: {
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.3s',
  },
  activeTab: {
    color: '#667eea',
    borderBottomColor: '#667eea',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minHeight: '400px',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
  },
  emptyState: {
    padding: '60px',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: '20px',
    color: '#666',
    fontSize: '16px',
  },
  userList: {
    padding: '20px',
  },
  userCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #f0f0f0',
    gap: '20px',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '10px',
  },
  userName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  roleBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500',
  },
  approvedBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500',
    background: '#2ecc71',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  pendingBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500',
    background: '#f39c12',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  detailText: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  approveBtn: {
    padding: '10px 20px',
    background: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.3s',
  },
  rejectBtn: {
    padding: '10px 20px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.3s',
  },
  deleteBtn: {
    padding: '10px 20px',
    background: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.3s',
  },
};

export default UserManagement;