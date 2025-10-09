// /src/services/availability.js
import api from './api'; // Assuming you have a base api instance with axios or similar

export const availabilityAPI = {
  // Public routes
 async getWeekSchedule() {
    return api.get('/availability');
  },
  async getDaySchedule(day) {
    return api.get(`/availability/day/${day}`);
  },
  async checkIfOpen(date) {
    return api.get('/availability/check', { params: { date } });
  },

  // Protected routes (assumes token in api instance)
  async setAvailability(data) {
    return api.post('/availability', data);
  },
  async updateAvailability(id, data) {
    return api.put(`/availability/${id}`, data);
  },
  async deleteAvailability(id) {
    return api.delete(`/availability/${id}`);
  }
};
