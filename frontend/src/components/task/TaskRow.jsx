import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import './TaskRow.css';

const TaskRow = ({ task, onUpdate, onDelete }) => {
  const { statuses, priorities } = useConfig();

  return (
    <div className="task-row">
      <div className="task-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h3 className="task-title">{task.title}</h3>
        </div>
        <p className="task-desc">{task.description || 'No description provided.'}</p>
      </div>
      
      <div className="task-status-col">
        <select 
          value={task.status.id} 
          onChange={(e) => onUpdate(task.id, { status_id: e.target.value })}
          className="task-select"
        >
          {statuses.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="task-priority-col">
        <select 
          value={String(task.priority.id)} 
          onChange={(e) => onUpdate(task.id, { priority_id: e.target.value })}
          className="task-select"
        >
          {priorities?.map(p => (
            <option key={p.id} value={String(p.id)}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="task-date">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>

      <div className="task-actions">
        <button 
          onClick={() => onDelete(task.id)}
          className="task-delete-btn"
          title="Delete Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskRow;
