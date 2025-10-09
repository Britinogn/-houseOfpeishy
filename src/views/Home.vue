<template>
  <section
    class="relative bg-cover bg-center"
    :style="{ backgroundImage: `url(${heroBg})` }"
    aria-label="Hero"
  >
    <!-- dim overlay -->
    <div class="absolute inset-0" :style="{ backgroundColor: 'var(--bg-primary)' }"></div>

    <div class="relative z-10 max-w-7xl mx-auto pt-35 px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-10">
      <!-- left: text -->
      <div class="w-full lg:w-1/2 text-center lg:text-left">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight" :style="{ color: 'var(--text-primary)' }">
         Step Into Confidence. Redefine Your Beauty at House of Peishy.
        </h1>
        <p class="mt-4 text-sm sm:text-base" :style="{ color: 'var(--text-secondary)' }">
          Experience premium hairstyling, luxury wigs, flawless braids, 
          and elegant beauty transformations crafted by stylists who understand your crown.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row items-center sm:justify-start gap-3">
          <button
            @click="goToAppointments"
            class="inline-flex items-center gap-2 px-6 py-3 cursor-pointer rounded-md font-semibold shadow hover:shadow-lg  bg-[var(--primary)]  hover:bg-[var(--primary-hover)] transition-all duration-300"
            :style="{ backgroundColor: '', color: 'white' }"
          >
            Book Appointment
          </button>

          <button
            @click="scrollTo('gallery')"
            class="inline-flex items-center gap-2 px-6 cursor-pointer  py-3 rounded-md border bg-[var(--bg-secondary)] hover:bg-[var(--primary-hover)] text-sm backdrop-blur-sm transition-all duration-300"
            :style="{ borderColor: 'var(  --border-color)', color: 'var(  --text-primary)'  }"
          >
            View Gallery
          </button>
        </div>
      </div>

      <!-- right: optional visual -->
      <div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
        <img
          :src="heroImage"
          alt="Hero visual of salon styling"
          class="w-full max-w-md h-64 sm:h-80 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section
    id="about"
    class="relative py-20"
    :style="{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }"
  >
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- image -->
      <div class="flex justify-center lg:justify-end">
        <img
          :src="aboutImage"
          alt="About our salon team and space"
          class="w-full max-w-md rounded-2xl shadow-lg object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <!-- text -->
      <div>
        <h2
          class="text-3xl sm:text-4xl font-bold mb-4"
          :style="{ color: 'var(--primary)' }"
        >
          About House of Peishy
        </h2>

        <p class="text-base leading-relaxed mb-4" :style="{ color: 'var(--text-primary)' }">
            At House of Peishy, we believe your hair tells your story 
            and every strand deserves care, artistry, and confidence. 
            Our team of certified stylists specializes in creating timeless looks that elevate your natural beauty.

        </p>

        <p class="text-base mb-5 leading-relaxed" :style="{ color: 'var(--text-secondary)' }">
          From sleek braids and luxury wigs to custom treatments and trend-setting styles,
          we turn everyday hair into extraordinary art. Every appointment is more than beauty 
          it’s self-expression redefined.

        </p>

        <button
          @click="goToAppointments"
          class="inline-flex  items-center gap-2 px-6 py-3 rounded-md font-semibold shadow hover:shadow-lg transition-all duration-300"
          :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
        >
          Book Appointment
        </button>
      </div>
    </div>
  </section>

  <!-- SERVICE SECTION -->
  <section
    id="services"
    class="py-20"
    :style="{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }"
  >
    <div class="max-w-7xl mx-auto px-6 text-center">
      <h2
        class="text-3xl sm:text-4xl font-bold mb-4"
        :style="{ color: 'var(--text-primary)' }"
      >
        Our Signature Services
      </h2>
      <p class="mb-10 max-w-2xl mx-auto" :style="{ color: 'var(--text-secondary)' }">
        Discover our exclusive range of beauty services  
        from precision cuts to luxury installs 
        each designed to help you look radiant, feel empowered, and own your style.
      </p>

      <!-- Error State -->
      <div v-if="servicesError" class="text-center py-12 mb-8 rounded-xl p-6 max-w-md mx-auto" :style="{ backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)', border: `1px solid var(--error)` }">
        <p class="mb-2" :style="{ color: 'var(--error)' }">{{ servicesError }}</p>
        <button @click="fetchServices" class="underline hover:no-underline transition-colors" :style="{ color: 'var(--error)' }">Retry</button>
      </div>

      <!-- Loading State -->
      <div v-else-if="servicesLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" :style="{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }"></div>
        <p :style="{ color: 'var(--text-secondary)' }">Loading services...</p>
      </div>

      <!-- Service Grid -->
      <div v-else-if="services.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div
          v-for="service in services"
          :key="service._id"
          class="rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-300 bg-[var(--bg-secondary)] border hover:scale-105 hover:-translate-y-1"
          :style="{ borderColor: 'var(--border-color)' }"
        >
          <div class="flex justify-center mb-4">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              :style="{ backgroundColor: 'var(--primary)' }"
            >
              <span style="color: white; font-size: 28px;">{{ getServiceIcon(service.category) }}</span>
            </div>
          </div>


          <div class="relative overflow-hidden">
            <img 
                v-if="service.coverImage?.url"
                :src="service.coverImage.url" 
                :alt="service.title"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
            />
            <div v-else class="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>

          <h3 class="text-xl font-semibold mb-2" :style="{ color: 'var(--text-primary)' }">
            {{ service.name }}
          </h3>

          <p class="text-sm mb-3" :style="{ color: 'var(--text-secondary)' }">
            {{ service.category || 'Premium Service' }}
          </p>

          <p class="text-sm mb-4 line-clamp-2" :style="{ color: 'var(--text-secondary)' }">
            {{ service.description || 'Professional beauty service' }}
          </p>

          <p class="font-bold text-lg" :style="{ color: 'var(--primary)' }">
            {{ formatPrice(service.price) }}
          </p>
        </div>
      
      </div>

      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-secondary" :style="{ color: 'var(--text-secondary)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <p :style="{ color: 'var(--text-secondary)' }">No services available at the moment.</p>
      </div>

      <router-link to="/gallery" class="mt-12">
        <button
          @click="scrollTo('gallery')"
          class="px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
        >
          View Gallery
        </button>
      </router-link>
    </div>
  </section>

  <!-- Gallery Section -->
   
  <section id="gallery" class="py-12 lg:py-20" :style="{ backgroundColor: 'var(--bg-secondary)' }">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl lg:text-4xl font-bold mb-6 text-center" :style="{ color: 'var(--text-primary)' }">The Peishy Experience</h2>
      <p class="text-center mb-8 max-w-2xl mx-auto" :style="{ color: 'var(--text-secondary)' }">
        Explore our gallery of stunning transformations — each look a reflection of confidence, artistry, and the unique elegance of every woman who walks through our doors.
      </p>
      <!-- Error State -->
      <div v-if="galleryError" class="text-center py-12 mb-8 rounded-xl p-6 max-w-md mx-auto" :style="{ backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)', border: `1px solid var(--error)` }">
        <p class="mb-2" :style="{ color: 'var(--error)' }">{{ galleryError }}</p>
        <button @click="fetchGallery" class="underline hover:no-underline transition-colors" :style="{ color: 'var(--error)' }">Retry</button>
      </div>

      <!-- Loading State -->
      <div v-else-if="galleryLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" :style="{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }"></div>
        <p :style="{ color: 'var(--text-secondary)' }">Loading gallery...</p>
      </div>

      <!-- Gallery Grid -->
      <div v-else-if="gallery.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="media in gallery"
          :key="media._id"
          class="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border group"
          :style="{ borderColor: 'var(--border-color)' }"
        >
          <div class="relative overflow-hidden">
            <img
              v-if="media.mediaType === 'image'"
              :src="media.coverImage?.url"
              :alt="media.caption || 'Gallery image'"
              class="w-full h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <video
              v-else
              :src="media.video?.url"
              controls
              preload="metadata"
              poster="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
              class="w-full h-48 lg:h-56 object-cover"
            ></video>
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          <div class="p-4" :style="{ backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)' }">
            <p class="text-sm font-medium line-clamp-1">{{ media.caption || 'Gallery media' }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-secondary" :style="{ color: 'var(--text-secondary)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p :style="{ color: 'var(--text-secondary)' }">No gallery items yet.</p>
      </div>
    </div>
  </section>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const goToAppointments = () => {
  router.push('/appointments')
}

// Hero images
const heroBg = '/images/hero-bg.jpg'
const heroImage = '/images/hero-bg.png'
//const aboutImage = '/images/about.jpg'
const aboutImage = '/images/about2.png'
// Services
const services = ref([])
const servicesLoading = ref(false)
const servicesError = ref('')

const getServiceIcon = (category) => {
  const icons = {
    hair: '💇',
    braids: '🧑‍🦰',
    wigs: '👩‍🦳',
    makeup: '💄',
    styling: '✂️',
  }
  return icons[category?.toLowerCase()] || '💇'
}

const formatPrice = (price) => {
  if (!price || isNaN(price)) return 'Price on request'
  return `₦${Number(price).toLocaleString('en-NG')}`
}

const fetchServices = async () => {
  servicesError.value = ''
  servicesLoading.value = true
  try {
    const response = await api.get('/services')
    const data = response.data || response
    services.value = data.services || data || []
  } catch (err) {
    console.error('Error fetching services:', err)
    servicesError.value = 'Failed to load services'
    services.value = []
  } finally {
    servicesLoading.value = false
  }
}

// Gallery
const gallery = ref([])
const galleryLoading = ref(false)
const galleryError = ref('')

const fetchGallery = async () => {
  galleryError.value = ''
  galleryLoading.value = true
  try {
    const response = await api.get('/gallery')
    const data = response.data || response
    gallery.value = data.media || data || []
  } catch (err) {
    console.error('Error fetching gallery:', err)
    galleryError.value = 'Failed to load gallery'
    gallery.value = []
  } finally {
    galleryLoading.value = false
  }
}

onMounted(() => {
  fetchServices()
  fetchGallery()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>