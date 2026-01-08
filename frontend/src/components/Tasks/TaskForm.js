import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { X } from 'lucide-react';

function TaskForm({ projectId, sprintId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    story_points: 1,
    due_date: '',
    project: projectId,
    sprint: sprintId || null,
    assigned_to: '',
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks/', {
        ...formData,
        assigned_to: formData.assigned_to || null,
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Create New Task</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{...styles.input, minHeight: '100px'}}
            required
          />
          <div style={styles.grid}>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              style={styles.input}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical</option>
            </select>
            <input
              type="number"
              placeholder="Story Points"
              value={formData.story_points}
              onChange={(e) => setFormData({ ...formData, story_points: parseInt(e.target.value) })}
              style={styles.input}
              min="1"
            />
          </div>
          <select
            value={formData.assigned_to}
            onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            style={styles.input}
          >
            <option value="">Unassigned</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            style={styles.input}
          />
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
  },
  form: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '15px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default TaskForm;