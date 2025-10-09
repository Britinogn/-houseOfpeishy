<template>
  <nav class="fixed top-0 left-0 right-0 rounded-sm shadow-2xl z-50" :style="{ background: `linear-gradient(to right, var(  --bg-secondary), var(  --bg-primary))` }">
    <div class="px-6">
      <div class="flex justify-between items-center h-16">
        
        <router-link to="/" >

            <div class="flex items-center space-x-3">
                <!-- <div class="w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-md">
                    <span class="text-accent font-bold text-lg">✨</span>
                </div> -->
                <img src="/images/logohop.png" alt="" class="w-11">
                <span class="text-xl font-bold" :style="{ color: 'var( --accent)' }">HouseOfPeishy</span>
            </div>

        </router-link>

        
        
        <div class="hidden md:flex items-center space-x-1">
          <router-link v-for="item in navItems" :key="item.name" :to="item.path"
             class="px-4 py-2 text-secondary hover:text-bg-secondary hover:bg-card rounded-xl transition-all duration-300 hover:scale-105"
             :style="{ color: 'var(  --text-primary)' }"
          >
            {{ item.name }}
          </router-link>
        </div>
        
        <div class="flex items-center space-x-3">
          
          <!-- Theme Toggle Button -->
          <button 
            @click="toggleTheme" 
            class="p-2 rounded-lg hover:bg-card/50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
            :style="{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            title="Toggle theme"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>
          
          <button 
            @click="toggleMenu" 
            class="md:hidden rounded-lg p-2 hover:bg-card/50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
            :style="{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }"
            :aria-expanded="isOpen"
            :aria-label="isOpen ? 'Close menu' : 'Open menu'"
          >
            <svg class="w-5 h-5 transition-transform duration-300" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div 
      v-show="isOpen" 
      class="md:hidden backdrop-blur-sm rounded-b-2xl border-t overflow-hidden transition-all duration-300"
      :style="{ 
        backgroundColor: 'color-mix(in srgb, var(--card-bg) 95%, transparent)', 
        borderColor: 'var(--border-color)',
        maxHeight: isOpen ? '100vh' : '0' 
      }"
    >
      <div class="px-4 pt-4 pb-4 space-y-2">
        <router-link 
          v-for="item in navItems" 
          :key="item.name" 
          :to="item.path" 
          @click="closeMenu"
          class="block px-4 py-3 text-secondary hover:bg-secondary hover:text-primary rounded-xl transition-all duration-300 hover:scale-105"
          :style="{ color: 'var(--text-secondary)' }"
        >
          {{ item.name }}
        </router-link>
        
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'FloatingNavbar',
  data() {
    return {
      isOpen: false,
      isDark: false,  // Track current theme
      navItems: [
        { name: 'Home', path: '/' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Services', path: '/services' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' }
      ]
    }
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    },
    closeMenu() {
      this.isOpen = false
    },
    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light')
      // Optional: Save to localStorage
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    }
  },
  mounted() {
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light'
    this.isDark = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
}
</script>