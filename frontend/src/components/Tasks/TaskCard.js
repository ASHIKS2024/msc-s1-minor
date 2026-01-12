import React, { useState } from 'react';
import { User, Calendar, Flag } from 'lucide-react';
import TaskDetail from './TaskDetail';

function TaskCard({ task, onUpdate, onRefresh }) {
  const [showDetail, setShowDetail] = useState(false);

  const priorityColors = {
    low: '#3498db',
    medium: '#f39c12',
    high: '#e67e22',
    critical: '#e74c3c',
  };

  return (
    <>
      <div style={styles.card} onClick={() => setShowDetail(true)}>
        <div style={styles.header}>
          <span style={{...styles.priority, background: priorityColors[task.priority]}}>
            {task.priority}
          </span>
        </div>
        <h4 style={styles.title}>{task.title}</h4>
        <p style={styles.description}>{task.description.substring(0, 80)}...</p>
        <div style={styles.footer}>
          {task.assigned_to && (
            <div style={styles.assignee}>
              <User size={14} />
              <span>{task.assigned_to.username}</span>
            </div>
          )}
          {task.due_date && (
            <div style={styles.date}>
              <Calendar size={14} />
              <span>{new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div style={styles.points}>
          <Flag size={14} />
          <span>{task.story_points} pts</span>
        </div>
      </div>
      {showDetail && (
        <TaskDetail
          task={task}
          onClose={() => setShowDetail(false)}
          onUpdate={onUpdate}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

const styles = {
  card: {
    background: 'white',
    padding: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  priority: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  description: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  assignee: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: '#666',
  },
  date: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: '#666',
  },
  points: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: '#999',
  },
};

export default TaskCard;