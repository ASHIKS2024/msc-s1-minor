import React, { useState } from 'react';
import api from '../../api/axios';
import { X } from 'lucide-react';

function SprintForm({ projectId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    start_date: '',
    end_date: '',
    status: 'planned',
    project: projectId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sprints/', formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating sprint:', error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Create New Sprint</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Sprint Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Sprint Goal"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            style={{...styles.input, minHeight: '100px'}}
            required
          />
          <div style={styles.dateGrid}>
            <div>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                style={styles.input}
                required
              />
            </div>
          </div>
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Create Sprint
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
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  dateGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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

export default SprintForm;