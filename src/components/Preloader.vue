<template>
  <div id="preloader" v-if="isVisible" class="preloader-wrapper">
    <div id="ctn-preloader" class="ctn-preloader">
      <div class="animation-preloader">
        <!-- <div class="spinner"></div> -->
        <div class="txt-loading">
          <span
            v-for="(letter, index) in 'HOUSEOFPEISHY'"
            :key="index"
            :data-text-preloader="letter"
            class="letters-loading"
          >
            {{ letter }}
          </span>
        </div>
      </div>
      <div class="loader">
        <div class="row">
          <div class="col-3 loader-section section-left">
            <div class="bg"></div>
          </div>
          <div class="col-3 loader-section section-left">
            <div class="bg"></div>
          </div>
          <div class="col-3 loader-section section-right">
            <div class="bg"></div>
          </div>
          <div class="col-3 loader-section section-right">
            <div class="bg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(true)

onMounted(() => {
  // Hide preloader after 2.5 seconds
  setTimeout(() => {
    isVisible.value = false
  }, 2500)
})
</script>

<style scoped>
.preloader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(  --bg-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.ctn-preloader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.animation-preloader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

/* Spinner */
.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--primary, #333);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Text Loading */
.txt-loading {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.letters-loading {
  font-size: 32px;
  font-weight: bold;
  color: var(--text-primary);
  opacity: 0;
  animation: letterBounce 0.8s ease-in-out infinite;
}

.letters-loading:nth-child(1) {
  animation-delay: 0s;
}
.letters-loading:nth-child(2) {
  animation-delay: 0.1s;
}
.letters-loading:nth-child(3) {
  animation-delay: 0.2s;
}
.letters-loading:nth-child(4) {
  animation-delay: 0.3s;
}
.letters-loading:nth-child(5) {
  animation-delay: 0.4s;
}
.letters-loading:nth-child(6) {
  animation-delay: 0.5s;
}
.letters-loading:nth-child(7) {
  animation-delay: 0.6s;
}
.letters-loading:nth-child(8) {
  animation-delay: 0.7s;
}
.letters-loading:nth-child(9) {
  animation-delay: 0.8s;
}
.letters-loading:nth-child(10) {
  animation-delay: 0.9s;
}

@keyframes letterBounce {
  0%,
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
  50% {
    opacity: 1;
    transform: translateY(-5px);
  }
}

/* Loader Sections */
.loader {
  margin-top: 20px;
}

.row {
  display: grid;
  grid-template-columns: repeat(4, 60px);
  gap: 10px;
  justify-content: center;
}

.loader-section {
  width: 60px;
  height: 60px;
  position: relative;
  overflow: hidden;
}

.bg {
  width: 100%;
  height: 100%;
  background: var(--primary, #333);
  opacity: 0.2;
  animation: sectionAnim 1.2s ease-in-out infinite;
}

.section-left .bg {
  animation-delay: 0s;
}

.loader-section:nth-child(2) .bg {
  animation-delay: 0.2s;
}

.loader-section:nth-child(3) .bg {
  animation-delay: 0.4s;
}

.loader-section:nth-child(4) .bg {
  animation-delay: 0.6s;
}

@keyframes sectionAnim {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(0.9);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .spinner {
    width: 50px;
    height: 50px;
    border-width: 3px;
  }

  .letters-loading {
    font-size: 24px;
    gap: 4px;
  }

  .txt-loading {
    gap: 4px;
  }

  .row {
    grid-template-columns: repeat(4, 50px);
  }

  .loader-section {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .spinner {
    width: 40px;
    height: 40px;
    border-width: 2px;
  }

  .letters-loading {
    font-size: 18px;
  }

  .txt-loading {
    gap: 2px;
  }

  .row {
    grid-template-columns: repeat(4, 40px);
    gap: 5px;
  }

  .loader-section {
    width: 40px;
    height: 40px;
  }
}
</style>