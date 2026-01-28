import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { rules } from '../../utility/rules';
import Button from '../common/Button/Button';
import './TaskForm.css';

const TaskForm = ({ onSubmit, onCancel }) => {
  const { priorities } = useConfig();
  const [task, setTask] = useState({ 
    title: '', 
    description: '', 
    priority_id: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (priorities?.length > 0 && !task.priority_id) {
      setTask(prev => ({ ...prev, priority_id: String(priorities[0].id) }));
    }
  }, [priorities, task.priority_id]);

  const validate = () => {
    const newErrors = {};
    
    const titleError = rules.validate(task.title, [
      rules.required,
      rules.maxLength(255)
    ]);
    if (titleError) newErrors.title = titleError;

    const descError = rules.validate(task.description, [
      rules.maxLength(1000)
    ]);
    if (descError) newErrors.description = descError;

    const priorityError = rules.validate(task.priority_id, [
      rules.required
    ]);
    if (priorityError) newErrors.priority_id = priorityError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(task);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="task-form-container">
        <h2 className="task-form-title">New Task</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label label-required">Task Title</label>
            <input 
              className={`input-field ${errors.title ? 'input-error' : ''}`}
              placeholder="What needs to be done?"
              value={task.title} 
              onChange={e => {
                setTask({...task, title: e.target.value});
                if (errors.title) setErrors(prev => ({ ...prev, title: null }));
              }}
              disabled={isSubmitting}
            />
            {errors.title && <div className="error-text">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className={`input-field form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Add some details..."
              value={task.description} 
              onChange={e => {
                setTask({...task, description: e.target.value});
                if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              }}
              disabled={isSubmitting}
            />
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>

          <div className="form-group form-group-last">
            <label className="form-label label-required">Priority</label>
            <select 
              className={`input-field ${errors.priority_id ? 'input-error' : ''}`}
              value={String(task.priority_id)} 
              onChange={e => {
                setTask({...task, priority_id: e.target.value});
                if (errors.priority_id) setErrors(prev => ({ ...prev, priority_id: null }));
              }}
              disabled={isSubmitting}
            >
              {!task.priority_id && <option value="">Select Priority</option>}
              {priorities?.map(p => (
                <option key={p.id} value={String(p.id)}>{p.label || p.name}</option>
              ))}
            </select>
            {errors.priority_id && <div className="error-text">{errors.priority_id}</div>}
          </div>

          <div className="form-actions">
            <Button 
              onClick={onCancel} 
              className="btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn-primary btn-large"
              loading={isSubmitting}
              loadingText="Adding..."
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
