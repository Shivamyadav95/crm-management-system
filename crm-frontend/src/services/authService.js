import api from './api';

export const authService = {
  register: (data) => api.post('/api/register', data),
  login: (data) => api.post('/api/login', data),
  getCurrentUser: () => api.get('/api/users/me'),
};
