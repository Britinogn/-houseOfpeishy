
<template>
  <section class="footer">
    <div class="social-list">
      <a
        href="https://github.com/Britinogn"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ion-icon name="logo-github"></ion-icon>
      </a>

      <a
        href="https://www.facebook.com/profile.php?id=100093484083511&mibextid=ZbWKwL"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ion-icon name="logo-facebook"></ion-icon>
      </a>

      <a
        href="https://twitter.com/officialbritino"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ion-icon name="logo-twitter"></ion-icon>
      </a>

      <a
        href="https://www.linkedin.com/in/bright-onwuemeri-597090263"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ion-icon name="logo-linkedin"></ion-icon>
      </a>

      <a
        href="https://instagram.com/britinogn_"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ion-icon name="logo-instagram"></ion-icon>
      </a>
    </div>

    <div class="copy">
      <i class="fa-regular fa-copyright"></i>
      {{ currentYear }}
      <a href="https://brightonwuemeri.com/" target="_blank" rel="noopener noreferrer">
        Bright Onwuemeri
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
  background-color: #0b0b0b;
  color: #fff;
}

.social-list {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.social-link {
  color: #fff;
  font-size: 1.5rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.social-link:hover {
  color: var(--primary, #e91e63);
  transform: scale(1.1);
}

.copy {
  font-size: 0.9rem;
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
