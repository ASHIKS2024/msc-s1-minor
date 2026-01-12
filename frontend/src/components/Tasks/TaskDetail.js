import React, { useState } from 'react';
import api from '../../api/axios';
import { X, User, Calendar, Flag, MessageCircle } from 'lucide-react';

function TaskDetail({ task, onClose, onUpdate, onRefresh }) {
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState(task.status);

  const handleStatusChange = async () => {
    await onUpdate(task.id, newStatus);
    onRefresh();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tasks/${task.id}/add_comment/`, { text: comment });
      setComment('');
      onRefresh();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>{task.title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>
        
        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.description}>{task.description}</p>
          </div>

          <div style={styles.details}>
            <div style={styles.detail}>
              <User size={16} />
              <span>Assigned to: {task.assigned_to?.username || 'Unassigned'}</span>
            </div>
            <div style={styles.detail}>
              <Flag size={16} />
              <span>Priority: {task.priority}</span>
            </div>
            <div style={styles.detail}>
              <Calendar size={16} />
              <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
            </div>
            <div style={styles.detail}>
              <span>Story Points: {task.story_points}</span>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={styles.select}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </select>
            {newStatus !== task.status && (
              <button onClick={handleStatusChange} style={styles.updateBtn}>
                Update Status
              </button>
            )}
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <MessageCircle size={18} />
              Comments ({task.comments?.length || 0})
            </h3>
            <form onSubmit={handleAddComment} style={styles.commentForm}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                style={styles.textarea}
                rows="3"
              />
              <button type="submit" style={styles.commentBtn}>
                Add Comment
              </button>
            </form>
            <div style={styles.comments}>
              {task.comments?.map((c) => (
                <div key={c.id} style={styles.commentItem}>
                  <div style={styles.commentHeader}>
                    <strong>{c.user.username}</strong>
                    <span style={styles.commentDate}>
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p style={styles.commentText}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
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
  content: {
    padding: '20px',
  },
  section: {
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  description: {
    color: '#666',
    lineHeight: '1.6',
  },
  details: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '25px',
  },
  detail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#666',
    fontSize: '14px',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '10px',
  },
  updateBtn: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  commentForm: {
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '10px',
    fontFamily: 'inherit',
  },
  commentBtn: {
    padding: '10px 20px',
    background: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  comments: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  commentItem: {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  commentDate: {
    fontSize: '12px',
    color: '#999',
  },
  commentText: {
    color: '#666',
    lineHeight: '1.5',
    margin: 0,
  },
};

export default TaskDetail;