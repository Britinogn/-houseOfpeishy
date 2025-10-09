
<template>
  <section class="footer">
    <div class="social-list">
      <!-- <router-link 
        href="https://github.com/Britinogn"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ion-icon name="logo-github"></ion-icon>
      </router-link> -->

      <a
        href="https://www.facebook.com/profile.php?id=100086133922788"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
     <i class="fa-brands fa-facebook"></i>
      </a>

      <a
        href="https://www.tiktok.com/@house_of_peishy"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
      <i class="fa-brands fa-tiktok"></i>
      </a>

      <a
        href="https://www.pinterest.com/house_of_peishy/"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="fa-brands fa-pinterest"></i>
      </a>

      <a
        href="https://www.instagram.com/_houseofpeishy"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="fa-brands fa-instagram"></i>
        
      </a>
    </div>

    <div class="copy">
      <i class="fa-regular fa-copyright"></i>
      {{ currentYear }}
      <a href="https://github.com/Britinogn" target="_blank" rel="noopener noreferrer">
        House Of Peishy
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Reactive year (updates automatically)
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 2rem 1rem;
  background-color:var(--text-secondary);
  color:var(--bg-primary);
}

.social-list {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.social-link {
  color:var(--bg-secondary);
  font-size: 1.5rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.social-link:hover {
  color: var(--secondary, #e91e63);
  transform: scale(1.1);
}

.copy {
  font-size: 1.2rem;
}

.copy a {
  color: var(--primary, #e91e63);
  margin-left: 4px;
  text-decoration: none;
}

.copy a:hover {
  text-decoration: underline;
}
</style>
