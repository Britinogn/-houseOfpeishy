// /src/services/adminDashboard.js
import api from './api';

export const adminDashboardAPI = {
  // Get dashboard statistics
  async getStats() {
    return await api.get('/admin/dashboard');
  }
};