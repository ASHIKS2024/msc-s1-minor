import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Folder, Activity, CheckSquare, Clock } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeSprints: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, sprintsRes, tasksRes] = await Promise.all([
        api.get('/projects/'),
        api.get('/sprints/'),
        api.get('/tasks/'),
      ]);

      const projects = projectsRes.data;
      const sprints = sprintsRes.data;
      const tasks = tasksRes.data;

      setStats({
        totalProjects: projects.length,
        activeSprints: sprints.filter(s => s.status === 'active').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'done').length,
      });

      setRecentProjects(projects.slice(0, 5));
      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const statCards = [
    { icon: Folder, label: 'Total Projects', value: stats.totalProjects, color: '#3498db' },
    { icon: Activity, label: 'Active Sprints', value: stats.activeSprints, color: '#2ecc71' },
    { icon: CheckSquare, label: 'Total Tasks', value: stats.totalTasks, color: '#e74c3c' },
    { icon: Clock, label: 'Completed Tasks', value: stats.completedTasks, color: '#f39c12' },
  ];

  return (
    <div>
      <h1 style={styles.pageTitle}>Dashboard</h1>
      
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

      <div style={styles.contentGrid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Recent Projects</h2>
          {recentProjects.map((project) => (
            <div key={project.id} style={styles.listItem}>
              <div>
                <div style={styles.itemTitle}>{project.name}</div>
                <div style={styles.itemSubtext}>Status: {project.status}</div>
              </div>
              <span style={{...styles.badge, background: getStatusColor(project.status)}}>
                {project.status}
              </span>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Recent Tasks</h2>
          {recentTasks.map((task) => (
            <div key={task.id} style={styles.listItem}>
              <div>
                <div style={styles.itemTitle}>{task.title}</div>
                <div style={styles.itemSubtext}>Priority: {task.priority}</div>
              </div>
              <span style={{...styles.badge, background: getPriorityColor(task.priority)}}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getStatusColor = (status) => {
  const colors = {
    planning: '#95a5a6',
    active: '#2ecc71',
    on_hold: '#f39c12',
    completed: '#3498db',
  };
  return colors[status] || '#95a5a6';
};

const getPriorityColor = (priority) => {
  const colors = {
    low: '#3498db',
    medium: '#f39c12',
    high: '#e67e22',
    critical: '#e74c3c',
  };
  return colors[priority] || '#95a5a6';
};

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
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
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

export default Dashboard;