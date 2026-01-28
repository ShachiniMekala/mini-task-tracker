import React from 'react';
import Button from '../common/Button/Button';
import './ProjectSidebar.css';

const ProjectSidebar = ({ projects, selectedProject, onSelectProject, onAddProject }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Mini Tracker</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-title">
          Your Projects
        </div>
        <ul className="project-list">
          {projects.map((project) => (
            <li 
              key={project.id} 
              className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
              onClick={() => onSelectProject(project)}
            >
              {project.name}
            </li>
          ))}
        </ul>

        {projects.length === 0 && (
          <div className="sidebar-empty">
            No projects yet.
          </div>
        )}
      </nav>

      <Button 
        onClick={onAddProject}
        className="sidebar-footer-btn btn-large"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        }
      >
        Add Project
      </Button>
    </aside>
  );
};

export default ProjectSidebar;
