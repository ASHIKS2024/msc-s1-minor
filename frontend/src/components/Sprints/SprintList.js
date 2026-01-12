// ========== src/components/Sprints/SprintList.js (FIXED) ==========
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Calendar, Target, Activity } from 'lucide-react';
import SprintForm from './SprintForm';

// REMOVED THE WRONG IMPORT: import SprintList from './components/Sprints/SprintList';

function SprintList() {
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProjects();
    fetchSprints();
  }, []);

  useEffect(() => {
    fetchSprints();
  }, [selectedProject, filterStatus]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchSprints = async () => {
    try {
      let url = '/sprints/';
      const params = [];
      
      if (selectedProject) {
        params.push(`project=${selectedProject}`);
      }
      if (filterStatus !== 'all') {
        params.push(`status=${filterStatus}`);
      }
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      
      const response = await api.get(url);
      setSprints(response.data);
    } catch (error) {
      console.error('Error fetching sprints:', error);
    }
  };

  const handleSprintCreated = () => {
    setShowForm(false);
    fetchSprints();
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: '#95a5a6',
      active: '#2ecc71',
      completed: '#3498db',
    };
    return colors[status] || '#95a5a6';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active':
        return <Activity size={20} color="#2ecc71" />;
      case 'completed':
        return <Target size={20} color="#3498db" />;
      default:
        return <Calendar size={20} color="#95a5a6" />;
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Sprints</h1>
        <button onClick={() => setShowForm(true)} style={styles.addButton}>
          <Plus size={20} />
          New Sprint
        </button>
      </div>

      {showForm && (
        <SprintForm
          projectId={selectedProject || projects[0]?.id}
          onClose={() => setShowForm(false)}
          onSuccess={handleSprintCreated}
        />
      )}

      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter by Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={styles.select}
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Calendar size={24} color="#3498db" />
          </div>
          <div>
            <div style={styles.statValue}>{sprints.length}</div>
            <div style={styles.statLabel}>Total Sprints</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Activity size={24} color="#2ecc71" />
          </div>
          <div>
            <div style={styles.statValue}>
              {sprints.filter(s => s.status === 'active').length}
            </div>
            <div style={styles.statLabel}>Active Sprints</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Target size={24} color="#3498db" />
          </div>
          <div>
            <div style={styles.statValue}>
              {sprints.filter(s => s.status === 'completed').length}
            </div>
            <div style={styles.statLabel}>Completed Sprints</div>
          </div>
        </div>
      </div>

      {sprints.length === 0 ? (
        <div style={styles.emptyState}>
          <Calendar size={64} color="#ccc" />
          <h3 style={styles.emptyTitle}>No sprints found</h3>
          <p style={styles.emptyText}>
            {selectedProject || filterStatus !== 'all' 
              ? 'Try adjusting your filters or create a new sprint.'
              : 'Get started by creating your first sprint.'}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {sprints.map((sprint) => (
            <Link key={sprint.id} to={`/sprints/${sprint.id}`} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitleRow}>
                  {getStatusIcon(sprint.status)}
                  <h3 style={styles.cardTitle}>{sprint.name}</h3>
                </div>
                <span style={{...styles.statusBadge, background: getStatusColor(sprint.status)}}>
                  {sprint.status}
                </span>
              </div>

              <div style={styles.projectTag}>
                <span style={styles.projectName}>{sprint.project_name}</span>
              </div>

              <p style={styles.goal}>{sprint.goal}</p>

              <div style={styles.cardFooter}>
                <div style={styles.dateInfo}>
                  <Calendar size={16} />
                  <div style={styles.dates}>
                    <span style={styles.dateLabel}>Start:</span>
                    <span style={styles.dateValue}>
                      {new Date(sprint.start_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={styles.dateInfo}>
                  <Calendar size={16} />
                  <div style={styles.dates}>
                    <span style={styles.dateLabel}>End:</span>
                    <span style={styles.dateValue}>
                      {new Date(sprint.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.progress}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: sprint.status === 'completed' ? '100%' : 
                             sprint.status === 'active' ? '50%' : '10%',
                      background: getStatusColor(sprint.status)
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
  },
  select: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'white',
    cursor: 'pointer',
    minWidth: '200px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
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
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
    textTransform: 'capitalize',
  },
  projectTag: {
    marginBottom: '12px',
  },
  projectName: {
    display: 'inline-block',
    padding: '4px 12px',
    background: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
  },
  goal: {
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.5',
    fontSize: '14px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '15px',
    borderTop: '1px solid #f0f0f0',
    marginBottom: '15px',
  },
  dateInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#666',
  },
  dates: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  dateLabel: {
    fontSize: '11px',
    color: '#999',
  },
  dateValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#666',
  },
  progress: {
    marginTop: 'auto',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginTop: '20px',
    marginBottom: '10px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    maxWidth: '400px',
    margin: '0 auto',
  },
};

export default SprintList;