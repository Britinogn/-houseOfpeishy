<template>
  <aside class="sidebar" :class="{ 'sidebar-open': isOpen }">
    <!-- Logo/Brand -->
    <div class="sidebar-header">
      <!-- <h2 class="text-2xl font-bold text-primary">Salon Admin</h2> -->
      
      <h2 class="text-2xl font-bold text-primary">House of Peishy</h2>
      <!-- <p class="brand-subtitle text-secondary text-sm mt-1">Admin Panel</p> -->
      <!-- Close button for mobile -->
      <button @click="$emit('close')" class="close-btn">
        <XIon />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <r 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="nav-item-active"
        @click="$emit('close')"
      >
        <component :is="item.icon" class="nav-icon" />
        <span>{{ item.label }}</span>
      </r outer-link>
    </nav>

    <!-- Logout Button -->
    <div class="sidebar-footer">
      <button @click="handleLogout" class="logout-btn">
        <LogOutIcon class="nav-icon" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { logout } from '../services/auth.js'
import { CalendarIcon, ImageIcon, UserIcon, LogOutIcon , ClockIcon, XIcon , Brush , LayoutDashboardIcon}from 'lucide-vue-next'

// Props
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
defineEmits(['close'])


const router = useRouter()

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { path: '/admin/appointments', label: 'Appointments', icon: CalendarIcon },
  { path: '/admin/services', label: 'Services', icon: Brush },
  { path: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { path: '/admin/availability', label: 'Availability', icon: ClockIcon },
  { path: '/admin/profile', label: 'Profile', icon: UserIcon },
]

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: var(--secondary);
  color: var(--primary);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-item:hover {
  background-color: var(--bg-secondary);
  color: var(--primary);
}

.nav-item-active {
  background-color: var(--bg-secondary);
  color: var(--primary);
  border-right: 3px solid var(--primary);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: transparent;
  border: none;
  color: var(--error);
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar-open {
    transform: translateX(0);
  }
  
  .close-btn {
    display: block;
  }
}
</style>