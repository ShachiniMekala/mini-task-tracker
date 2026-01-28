import { Project } from "@/utility/types";
import Button from "../common/Button/Button";
import { PlusIcon } from "../common/Icons";
import "./ProjectSidebar.css";

interface ProjectSidebarProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onAddProject: () => void;
}

const ProjectSidebar = ({
  projects,
  selectedProject,
  onSelectProject,
  onAddProject,
}: ProjectSidebarProps) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Mini Tracker</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-title">Your Projects</div>
        <ul className="project-list">
          {projects.map((project) => (
            <li
              key={project.id}
              className={`project-item ${selectedProject?.id === project.id ? "active" : ""}`}
              onClick={() => onSelectProject(project)}
            >
              {project.name}
            </li>
          ))}
        </ul>

        {projects.length === 0 && (
          <div className="sidebar-empty">No projects yet.</div>
        )}
      </nav>

      <Button
        onClick={onAddProject}
        className="sidebar-footer-btn btn-large"
        icon={<PlusIcon />}
      >
        Add Project
      </Button>
    </aside>
  );
};

export default ProjectSidebar;
