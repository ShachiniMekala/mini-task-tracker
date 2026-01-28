import apiClient from './core.service';

export const projectService = {
  getAll: () => apiClient.get('/projects'),
  create: (data) => apiClient.post('/projects', data),
};

