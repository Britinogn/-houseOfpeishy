<script setup>
import ThemeToggle from './components/ThemeToggle.vue'
import { ref, onMounted } from 'vue'
import Preloader from './components/Preloader.vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'


</script>

<template>
  <div class="min-h-screen bg-background-primary text-text-primary">
    <!-- Add toggle button in top right -->
    <div class="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>
    
    <router-view />
  </div>
 
    <!-- <Navbar /> -->
    <Navbar v-if="!$route.meta.hideNavbar"/>
    <Footer v-if="!$route.meta.hideFooter" />
    <!-- <router-view /> -->

  <Preloader />
</template>






<!-- <style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->





