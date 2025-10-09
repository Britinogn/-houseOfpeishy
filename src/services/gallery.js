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

  // Upload image
  async uploadImage(formData) {
    return await api.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Upload video
  async uploadVideo(formData) {
    return await api.post('/gallery/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Create gallery item
  async create(formData) {
    return await api.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update gallery item
  async update(id, formData) {
    return await api.put(`/gallery/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete gallery item
  async delete(id) {
    return await api.delete(`/gallery/${id}`)
  },

  // Get by category
  async getByCategory(category) {
    return await api.get(`/gallery/category/${category}`)
  },

  // Get by media type
  async getByMediaType(mediaType) {
    return await api.get(`/gallery/type/${mediaType}`)
  }
}