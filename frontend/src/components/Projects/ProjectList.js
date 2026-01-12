// ========== src/components/Projects/ProjectList.js (UPDATED - Admin Read-Only) ==========
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Calendar, Users, Eye } from 'lucide-react';
import ProjectForm from './ProjectForm';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Get user info to check if admin
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.is_staff || false;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectCreated = () => {
    setShowForm(false);
    fetchProjects();
  };

  const handleNewProjectClick = () => {
    if (isAdmin) {
      alert('Admins have read-only access to projects. Cannot create new projects.');
      return;
    }
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: '#95a5a6',
      active: '#2ecc71',
      on_hold: '#f39c12',
      completed: '#3498db',
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Projects</h1>
        
        {!isAdmin ? (
          <button onClick={handleNewProjectClick} style={styles.addButton}>
            <Plus size={20} />
            New Project
          </button>
        ) : (
          <div style={styles.readOnlyBadge}>
            <Eye size={20} />
            <span>Read-Only Access</span>
          </div>
        )}
      </div>

      {isAdmin && (
        <div style={styles.adminInfo}>
          <span style={styles.infoIcon}>ℹ️</span>
          <span>You are viewing projects in read-only mode. You cannot create or modify projects.</span>
        </div>
      )}

      {showForm && !isAdmin && (
        <ProjectForm onClose={() => setShowForm(false)} onSuccess={handleProjectCreated} />
      )}

      <div style={styles.grid}>
        {projects.map((project) => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`} 
            style={{
              ...styles.card,
              ...(isAdmin ? styles.readOnlyCard : {})
            }}
          >
            <div style={styles.cardHeader}>
              <div style={styles.titleRow}>
                <h3 style={styles.cardTitle}>{project.name}</h3>
                {isAdmin && (
                  <Eye size={16} color="#95a5a6" style={{ marginLeft: '8px' }} />
                )}
              </div>
              <span style={{...styles.statusBadge, background: getStatusColor(project.status)}}>
                {project.status}
              </span>
            </div>
            <p style={styles.description}>{project.description}</p>
            <div style={styles.cardFooter}>
              <div style={styles.info}>
                <Calendar size={16} />
                <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>
              </div>
              <div style={styles.info}>
                <Users size={16} />
                <span>{project.team_members?.length || 0} members</span>
              </div>
            </div>
          </Link>
        ))}
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

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  readOnlyBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#95a5a6',
    color: 'white',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px 20px',
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    marginBottom: '20px',
    color: '#856404',
    fontSize: '15px',
  },
  infoIcon: {
    fontSize: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  readOnlyCard: {
    borderLeft: '4px solid #95a5a6',
    opacity: 0.95,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500',
  },
  description: {
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '15px',
    borderTop: '1px solid #f0f0f0',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
};

export default ProjectList;