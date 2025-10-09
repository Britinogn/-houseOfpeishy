<template>
  <section class="min-h-screen" :style="{ backgroundColor: 'var(--bg-primary)' }">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <!-- Breadcrumb & Back -->
      <nav class="mb-8 flex items-center gap-3 text-sm font-medium" :style="{ color: 'var(--text-secondary)' }">
        <button 
          @click="$router.go(-1)" 
          class="flex items-center gap-2 px-3 py-12 rounded-lg transition-all hover:bg-secondary hover:text-primary"
          :style="{ color: 'var(--text-secondary)' }"
        >
          <svg class="w-4 h-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Back to Services</span>
        </button>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6" :style="{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }"></div>
        <p class="text-xl" :style="{ color: 'var(--text-secondary)' }">Loading service details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20 rounded-xl p-8 max-w-md mx-auto" :style="{ backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)', border: `1px solid var(--error)` }">
        <svg class="w-16 h-16 mx-auto mb-4 text-error" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <p class="text-xl font-semibold mb-4" :style="{ color: 'var(--error)' }">{{ error }}</p>
        <button 
          @click="fetchService" 
          class="px-6 py-3 rounded-lg font-semibold transition-colors"
          :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
          :class="{ 'hover:bg-primary-hover': true }"
        >
          Retry
        </button>
      </div>

      <!-- Service Details -->
      <div v-else-if="service" class="space-y-12 lg:space-y-16">
        <!-- Hero Section -->
        <div class="relative rounded-2xl overflow-hidden shadow-xl group" :style="{ backgroundColor: 'var(--card-bg)' }">
          <!-- Background Image (if available) -->
          <div v-if="service.coverImage && service.coverImage.length > 0" class="h-72 lg:h-96 bg-cover bg-center relative" :style="{ backgroundImage: `url(${service.coverImage[0].url})` }">
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
          <!-- Fallback Icon -->
          <div v-else class="h-72 lg:h-96 bg-gradient-to-br flex items-center justify-center relative" :style="{ backgroundColor: 'var(--secondary)' }">
            <div class="w-40 h-40 rounded-full primary-btn flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <span class="text-white text-7xl">{{ getServiceIcon(service.category) }}</span>
            </div>
          </div>

          <!-- Overlay Content -->
          <div class="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm">
            <span class="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-3 uppercase tracking-wide" :style="{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }">
              {{ service.category }}
            </span>
            <h1 class="text-3xl lg:text-5xl font-bold mb-3 leading-tight">{{ service.name }}</h1>
            <div class="flex flex-wrap items-center gap-6 text-lg font-medium">
              <span class="text-2xl">{{ formatPrice(service.price) }}</span>
              <div class="flex items-center gap-1 text-white/90">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ service.duration || '30' }} mins</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Description & Features -->
          <div class="space-y-6 lg:space-y-8" :style="{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)`, padding: '2.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }">
            <div>
              <h2 class="text-3xl font-bold mb-4" :style="{ color: 'var(--text-primary)' }">About This Service</h2>
              <p class="text-lg leading-relaxed" :style="{ color: 'var(--text-secondary)' }">{{ service.description }}</p>
            </div>
            
            <!-- Features -->
            <div v-if="service.features && service.features.length > 0" class="space-y-4 pt-6 border-t" :style="{ borderColor: 'var(--border-color)' }">
              <h3 class="text-2xl font-semibold flex items-center gap-3" :style="{ color: 'var(--text-primary)' }">
                <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                What's Included
              </h3>
              <ul class="space-y-3">
                <li v-for="(feature, index) in service.features" :key="index" class="flex items-start gap-3 py-2 pl-1 rounded-lg hover:bg-secondary transition-colors">
                  <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span class="text-base" :style="{ color: 'var(--text-secondary)' }">{{ feature }}</span>
                </li>
              </ul>
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
          <!-- Gallery -->
          <div v-if="service.coverImage && service.coverImage.length > 1" class="space-y-6 lg:space-y-8" :style="{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)`, padding: '2.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }">
            <h2 class="text-3xl font-bold mb-6 flex items-center gap-3" :style="{ color: 'var(--text-primary)' }">
              Gallery
              <span class="text-sm font-normal text-primary" :style="{ color: 'var(--primary)' }">({{ service.coverImage.length - 1 }} photos)</span>
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div 
                v-for="(img, index) in service.coverImage.slice(1, 5)" 
                :key="index"
                class="relative group cursor-pointer overflow-hidden rounded-xl aspect-square"
                @click="openGallery(index)"
              >
                <img 
                  :src="img.url" 
                  :alt="service.name + ' example ' + (index + 1)"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                </div>
              </div>
              <div v-if="service.coverImage.length > 5" class="col-span-2 grid place-items-center rounded-xl aspect-square bg-secondary cursor-pointer hover:bg-primary transition-colors" @click="openGallery(4)">
                <span class="text-2xl font-bold" :style="{ color: 'var(--text-primary)' }">+{{ service.coverImage.length - 5 }} more</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking CTA -->
        <div class="text-center space-y-6" :style="{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)`, padding: '3rem', borderRadius: '1rem', boxShadow: 'var(--shadow)' }">
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold mb-4" :style="{ color: 'var(--text-primary)' }">Ready to Transform?</h2>
            <p class="text-xl max-w-2xl mx-auto" :style="{ color: 'var(--text-secondary)' }">Experience premium styling with certified experts. Book your slot today.</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="bookService"
              class="flex-1 max-w-sm px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
              :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
              :class="{ 'hover:bg-primary-hover transform hover:scale-105': true }"
            >
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Book This Service
            </button>
            <button
              @click="$router.push({ name: 'PublicServices' })"
              class="flex-1 max-w-sm px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all shadow-lg hover:shadow-xl"
              :style="{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }"
              :class="{ 'hover:border-primary hover:text-primary transform hover:scale-105': true }"
            >
              Explore More Services
            </button>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-20">
        <svg class="w-24 h-24 mx-auto mb-6 text-secondary" :style="{ color: 'var(--text-secondary)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h2 class="text-3xl font-bold mb-4" :style="{ color: 'var(--text-primary)' }">Service Not Found</h2>
        <p class="mb-8 text-lg max-w-md mx-auto" :style="{ color: 'var(--text-secondary)' }">The service you're looking for doesn't exist or has been removed.</p>
        <button 
          @click="$router.push({ name: 'ServicesList' })"
          class="px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
          :class="{ 'hover:bg-primary-hover transform hover:scale-105': true }"
        >
          Discover Our Services
        </button>
      </div>
    </div>

    <!-- Gallery Modal -->
    <div v-if="showGallery" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" @click="showGallery = false">
      <button @click="showGallery = false" class="absolute top-6 right-6 text-white text-3xl font-bold hover:text-primary transition-colors">&times;</button>
      <div class="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
        <img :src="currentGalleryImage" :alt="service.name" class="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
        <!-- Navigation Arrows -->
        <button @click="prevGalleryImage" class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-3 text-white transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button @click="nextGalleryImage" class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-3 text-white transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../services/api'

export default {
  name: 'ServiceDetails',
  data() {
    return {
      service: null,
      loading: false,
      error: null,
      showGallery: false,
      currentGalleryIndex: 0,
    };
  },

  methods: {
    async fetchService() {
      const { id } = this.$route.params;
      if (!id) {
        this.error = 'No service ID provided.';
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/services/${id}`);
        const data = response.data || response;
        this.service = data.service || data;
        if (!this.service) {
          this.error = 'Service not found.';
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        this.error = 'Failed to load service details. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    bookService() {
      this.$router.push({ name: 'PublicAppointments', query: { serviceId: this.service._id } });
    },

    openGallery(index) {
      this.currentGalleryIndex = index + 1; // Adjust for slice(1)
      this.showGallery = true;
      document.body.style.overflow = 'hidden'; // Prevent scroll
    },

    closeGallery() {
      this.showGallery = false;
      document.body.style.overflow = 'auto';
    },

    prevGalleryImage() {
      if (this.currentGalleryIndex > 0) this.currentGalleryIndex--;
    },

    nextGalleryImage() {
      if (this.currentGalleryIndex < (this.service?.images?.length || 0) - 1) this.currentGalleryIndex++;
    },

    getServiceIcon(category) {
      const icons = {
        hair: '💇',
        braids: '🧑‍🦰',
        wigs: '👩‍🦳',
        makeup: '💄',
        styling: '✂️',
      };
      return icons[category?.toLowerCase()] || '💅';
    },

    formatPrice(price) {
      if (!price || isNaN(Number(price))) return '₦0';
      return `₦${Number(price).toLocaleString('en-NG')}`;
    },
  },

  computed: {
    currentGalleryImage() {
      if (!this.service?.images || this.currentGalleryIndex >= this.service.coverImage.length) return '';
      return this.service.coverImage[this.currentGalleryIndex].url;
    },
  },

  mounted() {
    this.fetchService();
  },

  beforeUnmount() {
    if (this.showGallery) document.body.style.overflow = 'auto';
  },
};
</script>

<style scoped>
.primary-btn { 
  background-color: var(--primary); 
  color: white; 
}

.primary-btn:hover { 
  background-color: var(--primary-hover); 
}

.focus\:ring-primary:focus {
  --tw-ring-color: var(--primary);
}

.focus\:border-primary:focus {
  border-color: var(--primary);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom shadows using var */
@layer utilities {
  .shadow-custom { box-shadow: 0 10px 25px -5px var(--shadow); }
  .hover\:shadow-xl:hover { box-shadow: 0 20px 25px -5px var(--shadow); }
}
</style>