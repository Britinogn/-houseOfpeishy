import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    toggleTheme
  }
}