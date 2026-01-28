import { ProjectModel } from '@/utility/types';
import apiClient from './client';

export const projectService = {
  getAll: () => apiClient.get('/projects'),
  create: (data: ProjectModel) => apiClient.post('/projects', data),
};

