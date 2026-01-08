import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Calendar, Users } from 'lucide-react';
import ProjectForm from './ProjectForm';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Projects</h1>
        <button onClick={() => setShowForm(true)} style={styles.addButton}>
          <Plus size={20} />
          New Project
        </button>
      </div>

      {showForm && (
        <ProjectForm onClose={() => setShowForm(false)} onSuccess={handleProjectCreated} />
      )}

      <div style={styles.grid}>
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{project.name}</h3>
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
    marginBottom: '30px',
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
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
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