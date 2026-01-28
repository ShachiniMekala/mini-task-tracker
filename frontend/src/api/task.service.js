import apiClient from './core.service';

export const taskService = {
  getByProject: (projectId, filters = {}) => {
    const params = {};
    if (filters.status) params['filter[status]'] = filters.status;
    if (filters.q) params['filter[q]'] = filters.q;
    
    return apiClient.get(`/projects/${projectId}/tasks`, { params });
  },
  create: (projectId, data) => apiClient.post(`/projects/${projectId}/tasks`, data),
  update: (taskId, data) => apiClient.patch(`/tasks/${taskId}`, data),
  delete: (taskId) => apiClient.delete(`/tasks/${taskId}`),
};
