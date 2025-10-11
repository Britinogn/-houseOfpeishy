import { createRouter, createWebHistory } from "vue-router";

// Public Views
import Home from '../views/Home.vue'
import PublicAppointments from '../views/Appointments.vue'
import PublicServices from '../views/Services.vue'
import ServiceDetails from '../views/ServiceDetails.vue'
import PublicGallery from '../views/Gallery.vue'
import Contact from '../views/Contact.vue'
// Auth Views (no layout)
import Login from '../views/Login.vue'

// Admin Layout
import AdminLayout from '../layouts/AdminLayout.vue'

// Admin Views
import Dashboard from '../views/Admin/Dashboard.vue'
import Appointments from '../views/Admin/Appointments.vue'
import Availability from '../views/Admin/Availability.vue'
import Gallery from '../views/Admin/Gallery.vue'
import Services from '../views/Admin/Services.vue'
import Profile from '../views/Admin/Profile.vue'

const routes = [
  // Public Route
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  },

  {
    path: '/appointments',
    name: 'PublicAppointments',
    component: PublicAppointments
  },

  {
    path: '/services',
    name: 'PublicServices',
    component: PublicServices
  },
 {
    path: '/services/:id',
    name: 'ServiceDetails',
    component: ServiceDetails
  },

  {
    path: '/gallery',
    name: 'PublicGallery',
    component: PublicGallery
  },

  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  
  
  // Auth Route (Login - no layout)
  { 
    path: '/login', 
    name: 'Login', 
    component: Login ,
    meta: { hideFooter: true, hideNavbar: true } 
  },
  
  // Admin Routes (protected + wrapped in AdminLayout)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta:{hideNavbar: true},
        meta: { hideFooter: true, hideNavbar: true } 
      },
      {
        path: 'appointments',
        name: 'Appointments',
        component: Appointments,
        meta:{hideNavbar: true},
        meta: { hideFooter: true, hideNavbar: true } 
      },
      {
        path: 'services',
        name: 'Services',
        component: Services,
        meta:{hideNavbar: true},
        meta: { hideFooter: true, hideNavbar: true } 
      },
      {
        path: 'gallery',
        name: 'Gallery',
        component: Gallery,
        meta:{hideNavbar: true},
        meta: { hideFooter: true, hideNavbar: true } 
      },
      {
        path: 'availability',
        name: 'Availability',
        component: Availability,
        meta:{hideNavbar: true},
        meta: { hideFooter: true, hideNavbar: true } 
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta:{hideNavbar: true},
        meta: { hideFooter: true, hideNavbar: true } 
      },
    ]
  },
  
  // Redirect /admin to /admin/dashboard
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes  
});

// Auth Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  // Redirect to dashboard if already logged in and trying to access login
  if (to.path === '/login' && token) {
    next('/admin/dashboard');
  }
  // Redirect to login if trying to access protected route without token
  else if (to.meta.requiresAuth && !token) {
    next('/login');
  }
  else {
    next();
  }
});

export default router;