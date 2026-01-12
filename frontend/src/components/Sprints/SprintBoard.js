// ========== src/components/Sprints/SprintBoard.js (UPDATED - Admin Read-Only) ==========
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Eye } from 'lucide-react';
import TaskCard from '../Tasks/TaskCard';
import TaskForm from '../Tasks/TaskForm';

function SprintBoard() {
  const { id } = useParams();
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // Get user info to check if admin
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.is_staff || false;

  useEffect(() => {
    fetchSprint();
    fetchTasks();
  }, [id]);

  const fetchSprint = async () => {
    try {
      const response = await api.get(`/sprints/${id}/`);
      setSprint(response.data);
    } catch (error) {
      console.error('Error fetching sprint:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks/?sprint=${id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    fetchTasks();
  };

  const handleTaskUpdate = async (taskId, newStatus) => {
    // Block admin from updating tasks
    if (isAdmin) {
      alert('Admins have read-only access to sprints. Cannot modify tasks.');
      return;
    }
    
    try {
      await api.patch(`/tasks/${taskId}/`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: '#3498db' },
    { id: 'in_progress', title: 'In Progress', color: '#f39c12' },
    { id: 'in_review', title: 'In Review', color: '#9b59b6' },
    { id: 'done', title: 'Done', color: '#2ecc71' },
  ];

  if (!sprint) return <div>Loading...</div>;

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{sprint.name}</h1>
          <p style={styles.goal}>{sprint.goal}</p>
        </div>
        
        {/* Only show New Task button for non-admin users */}
        {!isAdmin ? (
          <button onClick={() => setShowTaskForm(true)} style={styles.addButton}>
            <Plus size={20} />
            New Task
          </button>
        ) : (
          <div style={styles.readOnlyBadge}>
            <Eye size={20} />
            <span>Read-Only View</span>
          </div>
        )}
      </div>

      {/* Show info message for admin */}
      {isAdmin && (
        <div style={styles.adminInfo}>
          <span style={styles.infoIcon}>ℹ️</span>
          <span>You are viewing this sprint in read-only mode. You cannot create or modify tasks.</span>
        </div>
      )}

      {showTaskForm && !isAdmin && (
        <TaskForm
          projectId={sprint.project}
          sprintId={id}
          onClose={() => setShowTaskForm(false)}
          onSuccess={handleTaskCreated}
        />
      )}

      <div style={styles.board}>
        {columns.map((column) => (
          <div key={column.id} style={styles.column}>
            <div style={{...styles.columnHeader, borderTop: `3px solid ${column.color}`}}>
              <h3 style={styles.columnTitle}>{column.title}</h3>
              <span style={styles.columnCount}>
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            <div style={styles.columnContent}>
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onRefresh={fetchTasks}
                    isReadOnly={isAdmin}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  goal: {
    fontSize: '16px',
    color: '#666',
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
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  column: {
    background: '#f8f9fa',
    borderRadius: '12px',
    minHeight: '500px',
  },
  columnHeader: {
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
  columnTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  columnCount: {
    background: '#e0e0e0',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
  },
  columnContent: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
};

export default SprintBoard;