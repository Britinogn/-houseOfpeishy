import axios from 'axios'
import { auth } from './auth'
import { useRouter } from 'vue-router' // Import router for redirects

// Base API URL (use env var for production)
//const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://houseofpeishy.onrender.com/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s default; can be overridden per request
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = auth.token || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors & clean data
api.interceptors.response.use(
  (response) => response.data, // Return data directly
  (error) => {
    // 401: Clear auth & redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      auth.token = null
      const router = useRouter() // Get router instance
      router.push('/login')
    }

    // Extract friendly message
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api