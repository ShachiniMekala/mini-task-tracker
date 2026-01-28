import apiClient from './client';

export const configService = {
  getStatuses: () => apiClient.get('/statuses'),
  getPriorities: () => apiClient.get('/priorities'),
};
