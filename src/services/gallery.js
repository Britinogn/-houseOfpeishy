import api from './api'

export const galleryAPI = {
  // Get all gallery items
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return await api.get(`/gallery${queryString ? '?' + queryString : ''}`)
  },

  // Get gallery item by ID
  async getById(id) {
    return await api.get(`/gallery/${id}`)
  },

  // Upload media (both image and video)
  async upload(formData) {
    return await api.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Deprecated - keeping for backward compatibility
  async uploadImage(formData) {
    return await this.upload(formData)
  },

  // Deprecated - keeping for backward compatibility
  async uploadVideo(formData) {
    return await this.upload(formData)
  },

  // Update gallery item
  async update(id, data) {
    return await api.put(`/gallery/${id}`, data)
  },

  // Delete gallery item
  async delete(id) {
    return await api.delete(`/gallery/${id}`)
  },

  // Get by category
  async getByCategory(category) {
    return await api.get(`/gallery/category/${category}`)
  }
}



