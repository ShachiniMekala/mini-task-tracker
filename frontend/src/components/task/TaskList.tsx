import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { messages } from '../../utility/messages';
import { taskService } from '../../api/task.service';
import { useConfig } from '../../context/ConfigContext';
import TaskForm from './TaskForm';
import TaskRow from './TaskRow';
import TaskFilters from './TaskFilters';
import Button from '../common/Button/Button';
import { PlusIcon, NoteIcon } from '../common/Icons';
import './TaskList.css';

const TaskList = ({ project }: any) => {
  const { statuses } = useConfig()!;
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (project) {
      fetchTasks();
    }
  }, [project, statusFilter, searchQuery]);

  const fetchTasks = async (showLoading = true) => {
    if (!project) return;
    if (showLoading) setLoading(true);
    try {
      const response = await taskService.getByProject(project.id, {
        status: statusFilter,
        q: searchQuery
      });
      setTasks(response.data);
    } catch (error) {
      toast.error(messages.FAILED_TO_LOAD);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      await taskService.create(project!.id, taskData);
      setShowAddForm(false);
      await fetchTasks(false);
      toast.success(messages.SUCCESSFULLY_CREATED);
    } catch (error: any) {
      toast.error(error.response?.data?.error || messages.FAILED_TO_CREATE);
    }
  };

  const handleUpdateTask = async (taskId: number, updates: any) => {
    try {
      await taskService.update(taskId, updates);
      await fetchTasks(false);
      toast.success(messages.SUCCESSFULLY_UPDATED);
    } catch (error: any) {
      toast.error(error.response?.data?.error || messages.FAILED_TO_UPDATE);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId);
        await fetchTasks(false);
        toast.success(messages.SUCCESSFULLY_DELETED);
      } catch (error: any) {
        toast.error(messages.FAILED_TO_DELETE);
      }
    }
  };

  if (!project) return (
    <div className="no-project-selected">
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-muted)' }}>Select a project to see your tasks</h3>
      </div>
    </div>
  );

  return (
    <div className="task-list-container">
      <header className="project-header">
        <div>
          <h1 className="project-title">{project.name}</h1>
          <p className="project-meta">{tasks.length} tasks in this project</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="btn-primary btn-large"
          icon={<PlusIcon />}
        >
          Add Task
        </Button>
      </header>
      
      <TaskFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statuses={statuses}
      />

      {/* Task List */}
      {loading ? (
        <div className="task-list-loading">
          <div className="loading-spinner"></div>
          <h2>Loading tasks...</h2>
        </div>
      ) : (
        <div className="task-list">
          {tasks.length > 0 && (
            <div className="task-list-header">
              <div>Task</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Date</div>
              <div style={{ textAlign: 'right' }}></div>
            </div>
          )}
          
          {tasks.map(task => (
            <TaskRow 
              key={task.id} 
              task={task} 
              onUpdate={handleUpdateTask} 
              onDelete={handleDeleteTask} 
            />
          ))}
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <NoteIcon />
          </div>
          <h3>No tasks found</h3>
          <p className="project-meta">Create your first task to get started with this project.</p>
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="btn-primary empty-state-btn"
          >
            + Create Task
          </Button>
        </div>
      )}

      {showAddForm && (
        <TaskForm 
          onSubmit={handleAddTask}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default TaskList;
