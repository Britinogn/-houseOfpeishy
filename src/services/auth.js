import { reactive } from 'vue';
import api from './api';
import router from '../routes';

// Reactive auth state
export const auth = reactive({
  token: localStorage.getItem('token') || null,
  admin: JSON.parse(localStorage.getItem('admin')) || null, // ✅ Changed from 'user' to 'admin'
});

// Set token
export function setToken(token) {
  auth.token = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

// Set admin (normalize id vs _id)
export function setAdmin(admin) {
  const normalizedAdmin = admin ? { ...admin, id: admin.id || admin._id } : null;
  auth.admin = normalizedAdmin;

  if (normalizedAdmin) {
    localStorage.setItem('admin', JSON.stringify(normalizedAdmin));
  } else {
    localStorage.removeItem('admin');
  }
}

// Check if authenticated
export function isAuthenticated() {
  return !!auth.token;
}

// Get current admin
export function getAdmin() {
  return auth.admin;
}

// Get admin role
export function getAdminRole() {
  return auth.admin?.role;
}

// Login
// export async function login(credentials) {
//   try {
//     const response = await api.post('/auth/login', credentials);
//     // Expected response: { token: 'xxx', admin: { _id, name, email, role, ... } }
    
//     if (response.token && response.admin) {
//       setToken(response.token);
//       setAdmin(response.admin);
//     }
    
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }

// Logout
export function logout() {
  setToken(null);
  setAdmin(null);
  router.push('/login');
}

// Verify token (optional - call backend to verify)
// export async function verifyToken() {
//   try {
//     const response = await api.get('/auth/verify');
//     return response.valid;
//   } catch (error) {
//     return false;
//   }
// }

// Check if admin has specific role
export function hasRole(role) {
  return auth.admin?.role === role;
}

// Check if admin is super admin
export function isSuperAdmin() {
  return auth.admin?.role === 'super_admin';
}