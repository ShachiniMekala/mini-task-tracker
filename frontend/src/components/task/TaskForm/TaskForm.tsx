import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { rules } from '../../../utility/rules';
import Button from '../../common/Button/Button';
import './TaskForm.css';
import { Priority, TaskModel } from '@/utility/types';

interface TaskFormProps {
  onSubmit: (task: TaskModel) => void;
  onCancel: () => void;
}

const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_TITLE_LENGTH = 255;

const TaskForm = ({ onSubmit, onCancel }: TaskFormProps) => {
  const { priorities }: { priorities: Priority[] } = useConfig();
  const [task, setTask] = useState<TaskModel>({ 
    title: '', 
    description: '', 
    priorityId: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    if (priorities?.length > 0 && !task.priorityId) {
      setTask(prev => ({ ...prev, priorityId: String(priorities[0].id) }));
    }
  }, [priorities, task.priorityId]);

  const validate = () => {
    const newErrors: { [key: string]: string | null } = {};
    
    const titleError = rules.validate(task.title, [
      rules.required,
      rules.maxLength(MAX_TITLE_LENGTH)
    ]);
    if (titleError) newErrors.title = titleError;

    const descError = rules.validate(task.description, [
      rules.maxLength(MAX_DESCRIPTION_LENGTH)
    ]);
    if (descError) newErrors.description = descError;

    const priorityError = rules.validate(task.priorityId, [
      rules.required
    ]);
    if (priorityError) newErrors.priorityId = priorityError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
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
              className={`input-field ${errors.priorityId ? 'input-error' : ''}`}
              value={String(task.priorityId)} 
              onChange={e => {
                setTask({...task, priorityId: e.target.value});
                if (errors.priorityId) setErrors(prev => ({ ...prev, priorityId: null }));
              }}
              disabled={isSubmitting}
            >
              {!task.priorityId && <option value="">Select Priority</option>}
              {priorities?.map(p => (
                <option key={p.id} value={String(p.id)}>{p.label || p.name}</option>
              ))}
            </select>
            {errors.priorityId && <div className="error-text">{errors.priorityId}</div>}
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
