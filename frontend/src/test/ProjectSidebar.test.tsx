import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectSidebar from '../components/project/ProjectSidebar/ProjectSidebar';
import { Project } from '../utility/types';

const mockProjects: Project[] = [
  { id: 1, name: 'Project One', description: 'Desc One', createdAt: '2026-01-01' },
  { id: 2, name: 'Project Two', description: 'Desc Two', createdAt: '2026-01-02' },
];

describe('ProjectSidebar', () => {
  it('renders the list of projects', () => {
    render(
      <ProjectSidebar 
        projects={mockProjects} 
        selectedProject={null} 
        onSelectProject={() => {}} 
        onAddProject={() => {}} 
      />
    );

    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();
  });

  it('calls onSelectProject when a project is clicked', () => {
    const onSelectProject = vi.fn();
    render(
      <ProjectSidebar 
        projects={mockProjects} 
        selectedProject={null} 
        onSelectProject={onSelectProject} 
        onAddProject={() => {}} 
      />
    );

    fireEvent.click(screen.getByText('Project One'));
    expect(onSelectProject).toHaveBeenCalledWith(mockProjects[0]);
  });

  it('calls onAddProject when the add button is clicked', () => {
    const onAddProject = vi.fn();
    render(
      <ProjectSidebar 
        projects={[]} 
        selectedProject={null} 
        onSelectProject={() => {}} 
        onAddProject={onAddProject} 
      />
    );

    fireEvent.click(screen.getByText('Add Project'));
    expect(onAddProject).toHaveBeenCalled();
  });
});



