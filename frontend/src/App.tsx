import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { messages } from './utility/messages';
import { projectService } from './api/project.service';
import ProjectSidebar from './components/project/ProjectSidebar';
import ProjectForm from './components/project/ProjectForm';
import TaskList from './components/task/TaskList';
import './App.css';
import { Project, ProjectModel } from './utility/types';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectService.getAll();
      setProjects(response.data);
      if (response.data.length > 0 && !selectedProject) {
        setSelectedProject(response.data[0]);
      }
    } catch (error) {
      toast.error(messages.FAILED_TO_LOAD);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data: ProjectModel) => {
    try {
      const response = await projectService.create(data);
      const newProject = response.data;
      setProjects([newProject, ...projects]);
      setSelectedProject(newProject);
      setShowProjectForm(false);
      toast.success(messages.SUCCESSFULLY_CREATED);
    } catch (error: any) {
      toast.error(error.response?.data?.error || messages.FAILED_TO_CREATE);
    }
  };

  return (
    <div className="app-container">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <ProjectSidebar 
        projects={projects} 
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onAddProject={() => setShowProjectForm(true)}
      />
      
      <main className="main-content">
        <TaskList project={selectedProject} />
      </main>

      {showProjectForm && (
        <ProjectForm 
          onSubmit={handleCreateProject} 
          onCancel={() => setShowProjectForm(false)} 
        />
      )}

      {loading && projects.length === 0 && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <h2>Loading Mini Tracker...</h2>
        </div>
      )}
    </div>
  );
}

export default App;
