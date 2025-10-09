import api from './api'

export const appointmentsAPI = {
  // Get all appointments
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return await api.get(`/appointments${queryString ? '?' + queryString : ''}`)
  },

  // Get appointment by ID
  async getById(id) {
    return await api.get(`/appointments/${id}`)
  },

  // Create new appointment
  async create(data) {
    return await api.post('/appointments', data)
  },

  // Update appointment
  async update(id, data) {
    return await api.put(`/appointments/${id}/status`, data)
  },

  // Delete appointment
  async delete(id) {
    return await api.delete(`/appointments/${id}`)
  },

  // Update status
  async updateStatus(id, status) {
    return await api.put(`/appointments/${id}/status`, { status })
  },

  // Get appointments by date range
  async getByDateRange(startDate, endDate) {
    return await api.get('/appointments/range', {
      params: { startDate, endDate }
    })
  },

  // Get today's appointments
  async getToday() {
    return await api.get('/appointments/today')
  },

  // Get upcoming appointments
  async getUpcoming() {
    return await api.get('/appointments/upcoming')
  }
}