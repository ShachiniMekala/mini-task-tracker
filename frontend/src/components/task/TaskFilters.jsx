import React from 'react';
import './TaskFilters.css';

const TaskFilters = ({ searchQuery, onSearchChange, statusFilter, onStatusChange, statuses }) => {
  return (
    <div className="filter-bar">
      <div className="filter-search">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="input-field"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-status">
        <select 
          value={statusFilter} 
          onChange={(e) => onStatusChange(e.target.value)} 
          className="input-field"
        >
          <option value="">All Statuses</option>
          {statuses.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;

