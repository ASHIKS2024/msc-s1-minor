import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Calendar, Users, Activity } from 'lucide-react';
import SprintForm from '../Sprints/SprintForm';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [showSprintForm, setShowSprintForm] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchSprints();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}/`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchSprints = async () => {
    try {
      const response = await api.get(`/sprints/?project=${id}`);
      setSprints(response.data);
    } catch (error) {
      console.error('Error fetching sprints:', error);
    }
  };

  const handleSprintCreated = () => {
    setShowSprintForm(false);
    fetchSprints();
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{project.name}</h1>
          <p style={styles.description}>{project.description}</p>
        </div>
        <button onClick={() => setShowSprintForm(true)} style={styles.addButton}>
          <Plus size={20} />
          New Sprint
        </button>
      </div>

      {showSprintForm && (
        <SprintForm
          projectId={id}
          onClose={() => setShowSprintForm(false)}
          onSuccess={handleSprintCreated}
        />
      )}

      <div style={styles.infoCards}>
        <div style={styles.infoCard}>
          <Calendar size={24} color="#3498db" />
          <div>
            <div style={styles.infoLabel}>Start Date</div>
            <div style={styles.infoValue}>{new Date(project.start_date).toLocaleDateString()}</div>
          </div>
        </div>
        <div style={styles.infoCard}>
          <Users size={24} color="#2ecc71" />
          <div>
            <div style={styles.infoLabel}>Team Members</div>
            <div style={styles.infoValue}>{project.team_members?.length || 0}</div>
          </div>
        </div>
        <div style={styles.infoCard}>
          <Activity size={24} color="#e74c3c" />
          <div>
            <div style={styles.infoLabel}>Sprints</div>
            <div style={styles.infoValue}>{sprints.length}</div>
          </div>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Sprints</h2>
      <div style={styles.sprintList}>
        {sprints.map((sprint) => (
          <Link key={sprint.id} to={`/sprints/${sprint.id}`} style={styles.sprintCard}>
            <div style={styles.sprintHeader}>
              <h3 style={styles.sprintName}>{sprint.name}</h3>
              <span style={{...styles.badge, background: getSprintColor(sprint.status)}}>
                {sprint.status}
              </span>
            </div>
            <p style={styles.sprintGoal}>{sprint.goal}</p>
            <div style={styles.sprintDates}>
              {new Date(sprint.start_date).toLocaleDateString()} - {new Date(sprint.end_date).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const getSprintColor = (status) => {
  const colors = {
    planned: '#95a5a6',
    active: '#2ecc71',
    completed: '#3498db',
  };
  return colors[status] || '#95a5a6';
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
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
  infoCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  infoCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  infoValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  sprintList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  sprintCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  sprintHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  sprintName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  badge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500',
  },
  sprintGoal: {
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  sprintDates: {
    fontSize: '14px',
    color: '#999',
  },
};

export default ProjectDetail;