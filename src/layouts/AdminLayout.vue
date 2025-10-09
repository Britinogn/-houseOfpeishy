<template>
  <div class="admin-layout min-h-screen bg-background-primary">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />
    
    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Topbar -->
      <Topbar @toggle-sidebar="toggleSidebar" />
      
      <!-- Page Content (Dashboard, Services, etc render here) -->
      <main class="p-6">
        <router-view />
      </main>
    </div>
    
    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen" 
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<style scoped>
.admin-layout {
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 260px; /* Sidebar width */
  min-height: 100vh;
}

main {
  background-color: var(--bg-secondary);
  min-height: calc(100vh - 64px); /* Subtract topbar height */
}

/* Mobile Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

/* Responsive: Mobile */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .sidebar-overlay {
    display: block;
  }
}
</style>