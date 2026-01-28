import React, { useState } from 'react';
import { rules } from '../../utility/rules';
import Button from '../common/Button/Button';
import './ProjectForm.css';

const ProjectForm = ({ onSubmit, onCancel }) => {
  const [project, setProject] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    const nameError = rules.validate(project.name, [
      rules.required,
      rules.maxLength(255)
    ]);
    if (nameError) newErrors.name = nameError;

    const descError = rules.validate(project.description, [
      rules.maxLength(1000)
    ]);
    if (descError) newErrors.description = descError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(project);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="project-form-container">
        <h2 className="project-form-title">Create New Project</h2>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label label-required">Project Name</label>
            <input 
              type="text" 
              className={`input-field ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Website Redesign"
              value={project.name} 
              onChange={(e) => {
                setProject(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors(prev => ({ ...prev, name: null }));
              }} 
              disabled={isSubmitting}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          
          <div className="form-group-large">
            <label className="form-label">Description (Optional)</label>
            <textarea 
              className={`input-field form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="What is this project about?"
              value={project.description} 
              onChange={(e) => {
                setProject(prev => ({ ...prev, description: e.target.value }));
                if (errors.description) setErrors(prev => ({ ...prev, description: null }));
              }} 
              disabled={isSubmitting}
            />
              {errors.description && <div className="error-text">{errors.description}</div>}
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
              className="btn-primary"
              loading={isSubmitting}
              loadingText="Creating..."
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
