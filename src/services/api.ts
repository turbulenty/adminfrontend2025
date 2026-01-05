import axios from 'axios';

// API 基础配置
const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 用户管理 API
export const userApi = {
  // getUsers: () => api.get('/api/users'),
  getUsers: (page: number = 0, size: number = 10, search: string = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search) {
      params.append('search', search);
    }
    return api.get(`/api/users?${params.toString()}`);
  },
  createUser: (data: any) => api.post('/api/users', data),
  updateUser: (id: number, data: any) => api.put(`/api/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/api/users/${id}`),
};

// Dashboard管理 API
export const dashboardApi = {
  // 获取统计数据
  getStats: () => api.get('/api/dashboard/stats'),

  // 获取角色分布
  getRoleDistribution: () => api.get('/api/dashboard/role-distribution'),

  // 获取用户增长趋势
  getUserGrowth: () => api.get('/api/dashboard/user-growth'),
};

// 设置管理 API（12.28）
export const settingsApi = {
  getSettings: () => api.get('/api/settings'),
  saveSettings: (data: any) => api.put('/api/settings', data),
};

// 设置用户认证 API（1.1）
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  changePassword: (data: { email: string; currentPassword: string; newPassword: string }) =>
    api.post('/api/auth/change-password', data),
  // 获取当前用户信息
  getCurrentUser: (email: string) => api.get(`/api/users/current?email=${email}`),
};

// 通知 API
export const notificationApi = {
  getNotifications: () => api.get('/api/notifications'),
  getUnreadCount: () => api.get('/api/notifications/unread-count'),
  markAllAsRead: () => api.post('/api/notifications/mark-all-read'),
};

