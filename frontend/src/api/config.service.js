import apiClient from './core.service';

export const configService = {
  getStatuses: () => apiClient.get('/statuses'),
  getPriorities: () => apiClient.get('/priorities'),
};
