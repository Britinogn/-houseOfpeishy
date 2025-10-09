import api from './api'

export const servicesAPI = {
  // Get all services
  async getAll() {
    return await api.get('/services')
  },

  // Get service by ID
  async getById(id) {
    return await api.get(`/services/${id}`)
  },

  // Create new service (with image upload)
  async create(formData) {
    return await api.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update service (with optional image upload)
  async update(id, formData) {
    return await api.put(`/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete service
  async delete(id) {
    return await api.delete(`/services/${id}`)
  }
}