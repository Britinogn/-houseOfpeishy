import axios from 'axios'
import {auth} from './auth';

// Base API URL (change this to your Express server URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
//const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lern-stasy-server.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = auth.token || localStorage.getItem('token');
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return data directly for cleaner API calls
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      auth.token = null; // Clear auth state
      router.push('/login'); // Use router instead of window.location
    }
    
    // Extract error message
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;