<template>
  <header class="topbar">
    <div class="topbar-left">
      <!-- Mobile Menu Toggle -->
      <button @click="toggleSidebar" class="mobile-menu-btn">
        <MenuIcon />
      </button>
      
      <!-- Page Title (optional) -->
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>

    <div class="topbar-right">
      <!-- Theme Toggle -->
      <ThemeToggle />
      
      <!-- Notifications -->
      <button class="icon-btn" title="Notifications">
        <BellIcon />
        <span class="notification-badge">3</span>
      </button>
      
      <!-- User Profile Dropdown -->
      <div class="user-profile">
        <button @click="toggleDropdown" class="profile-btn">
          <img 
            src="https://ui-avatars.com/api/?name=Admin+User&background=f59e0b&color=fff" 
            alt="Admin" 
            class="avatar"
          />
          <span class="admin-name">Admin User</span>
          <ChevronDownIcon />
        </button>
        
        <!-- Dropdown Menu -->
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <router-link to="/admin/profile" class="dropdown-item">
            <UserIcon />
            <span>Profile</span>
          </router-link>
          <router-link to="/admin/settings" class="dropdown-item">
            <SettingsIcon />
            <span>Settings</span>
          </router-link>
          <hr class="dropdown-divider" />
          <button @click="handleLogout" class="dropdown-item text-error">
            <LogOutIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logout } from '../services/auth.js'
import ThemeToggle from './ThemeToggle.vue'
import { ChevronDownIcon, SettingsIcon, UserIcon, LogOutIcon , MenuIcon, Currency, Scissors}from 'lucide-vue-next'


const route = useRoute()
const router = useRouter()
const isDropdownOpen = ref(false)
const emit = defineEmits(['toggle-sidebar'])
// Icons (inline SVG components)


const pageTitle = computed(() => {
  const titles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/appointments': 'Appointments',
    '/admin/services': 'Services',
    '/admin/gallery': 'Gallery',
    '/admin/availability': 'Availability',
    '/admin/profile': 'Profile',
    '/admin/settings': 'Settings',
  }
  return titles[route.path] || 'Admin'
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const toggleSidebar = () => {
  // Emit event to toggle sidebar (we'll implement this later)
  emit('toggle-sidebar')
  console.log('Toggle sidebar')
}

const handleLogout = () => {
  // Add logout logic
   logout()
}

// Close dropdown on outside click
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-profile')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.topbar {
  height: 64px;
  background-color: var(--topbar-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px var(--shadow);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.35rem;
  transition: background-color 0.2s ease;
}

.mobile-menu-btn:hover {
  background-color: var(--secondary);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  position: relative;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: var(--secondary);
  color: var(--text-primary);
}

.notification-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: var(--accent);
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-profile {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
}

.profile-btn:hover {
  background-color: var(--secondary);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.admin-name {
  color: var(--text-primary);
  font-weight: 500;
  margin-right: 0.25rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px var(--shadow), 0 2px 4px -1px var(--shadow);
  z-index: 101;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: var(--secondary);
  color: var(--primary);
}

.dropdown-divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 0;
}

.text-error {
  color: var(--error) !important;
}

.text-error:hover {
  background-color: var(--bg-secondary) !important;
  color: var(--error) !important;
}

/* Responsive: Show mobile menu on small screens */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .topbar-right {
    gap: 0.5rem;
  }
  
  .admin-name {
    display: none;
  }
  
  .topbar {
    padding: 0 1rem;
  }
}
</style>