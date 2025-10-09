<template>
  <section class="min-h-screen" :style="{ backgroundColor: 'var(--bg-primary)' }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <!-- Gallery Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl lg:text-5xl font-bold mb-4" :style="{ color: 'var(--text-primary)' }">Our Gallery</h1>
        <p class="max-w-2xl mx-auto text-lg" :style="{ color: 'var(--text-secondary)' }">Discover the magic of transformation through our latest works. From intricate braids to stunning makeovers, see what our stylists create.</p>
      </div>
      
      <!-- Debug Info (Remove in Production) -->
      <div v-if="$route.query.debug" class="rounded-lg p-4 mb-6 max-w-md mx-auto" :style="{ backgroundColor: 'color-mix(in srgb, var(--warning) 10%, transparent)', border: `1px solid var(--warning)` }">
        <p :style="{ color: 'var(--text-primary)' }">Total Media: {{ gallery.length }}</p>
        <p :style="{ color: 'var(--text-primary)' }">Images: {{ gallery.filter(m => m.mediaType === 'image').length }}</p>
        <p :style="{ color: 'var(--text-primary)' }">Videos: {{ gallery.filter(m => m.mediaType === 'video').length }}</p>
      </div>

      <!-- Filters (Optional: by type) -->
      <div class="mb-8 text-center">
        <div class="inline-flex rounded-full bg-card p-1 shadow-lg">
          <button
            @click="setFilter('all')"
            :class="{ 'bg-primary text-white': activeFilter === 'all' }"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            :style="{ color: activeFilter === 'all' ? 'var(  --primary)' : 'var(--text-secondary)' }"
          >
            All
          </button>
          <button
            @click="setFilter('image')"
            :class="{ 'bg-primary text-white': activeFilter === 'image' }"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            :style="{ color: activeFilter === 'image' ? 'var(  --primary)' : 'var(--text-secondary)' }"
          >
            Photos
          </button>
          <button
            @click="setFilter('video')"
            :class="{ 'bg-primary text-white': activeFilter === 'video' }"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            :style="{ color: activeFilter === 'video' ? 'var(  --primary)' : 'var(--text-secondary)' }"
          >
            Videos
          </button>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" :style="{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }"></div>
        <span class="ml-4 text-xl" :style="{ color: 'var(--text-secondary)' }">Loading gallery...</span>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="text-center py-20 rounded-xl p-8 max-w-md mx-auto" :style="{ backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)', border: `1px solid var(--error)` }">
        <p class="text-xl font-semibold mb-6" :style="{ color: 'var(--error)' }">{{ error }}</p>
        <button 
          @click="fetchGallery" 
          class="px-6 py-3 rounded-lg font-semibold transition-colors"
          :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
          :class="{ 'hover:bg-primary-hover': true }"
        >
          Retry Load
        </button>
      </div>

      <!-- Gallery Grid -->
      <div v-else-if="filteredGallery.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
        <article 
          v-for="media in filteredGallery" 
          :key="media._id" 
          class="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 bg-card cursor-pointer"
          role="img"
          :aria-label="media.caption || `Gallery ${media.mediaType === 'image' ? 'image' : 'video'}`"
          @click="openMediaModal(media)"
        >
          <!-- Media Preview -->
          <div class="relative w-full h-48 lg:h-56 overflow-hidden">
            <img
              v-if="media.mediaType === 'image'"
              :src="media.coverImage?.url"
              :alt="media.caption || 'Gallery image'"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <video
              v-else
              :src="media.video?.url"
              class="w-full h-full object-cover"
              muted
              loop
              playsinline
              controls
            ></video>
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-[var(--bg-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="media.mediaType === 'image'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.414 7l3.293 3.293a1 1 0 010 1.414l-3.293 3.293a1 1 0 11-1.414-1.414L14.586 11H9a1 1 0 110-2h5.586l-1.707-1.707a1 1 0 011.414-1.414z"/>
              </svg>
            </div>
          </div>

          <!-- Caption -->
          <div class="p-3 lg:p-4" :style="{ backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)' }">
            <p class="text-sm font-medium line-clamp-2" :style="{ color: 'var(--text-primary)' }">{{ media.caption || `Stunning ${media.mediaType === 'image' ? 'photo' : 'video'}` }}</p>
            <p v-if="media.createdAt" class="text-xs opacity-75" :style="{ color: 'var(--text-secondary)' }">{{ formatDate(media.createdAt) }}</p>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
          <svg class="w-12 h-12 text-secondary" :style="{ color: 'var(--text-secondary)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold mb-3" :style="{ color: 'var(--text-primary)' }">No Gallery Yet</h3>
        <p class="mb-8 text-lg max-w-md mx-auto" :style="{ color: 'var(--text-secondary)' }">Our portfolio is growing. Check back soon for inspiring transformations!</p>
        <button 
          @click="fetchGallery" 
          class="px-6 py-3 rounded-lg font-semibold transition-colors"
          :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
          :class="{ 'hover:bg-primary-hover': true }"
        >
          Refresh Gallery
        </button>
      </div>
    </div>

    <!-- Media Modal -->
    <div v-if="selectedMedia" class="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 lg:p-8" @click.self="closeMediaModal">
      <button @click="closeMediaModal" class="absolute top-6 right-6 text-white text-3xl font-bold hover:text-primary transition-colors">&times;</button>
      
      <div class="relative w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
        <!-- Media Content -->
        <div class="flex-1 flex items-center justify-center mb-6">
          <img
            v-if="selectedMedia.mediaType === 'image'"
            :src="selectedMedia.coverImage?.url"
            :alt="selectedMedia.caption || 'Full size image'"
            class="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
          <video
            v-else
            :src="selectedMedia.video?.url"
            controls
            autoplay
            class="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            :style="{ backgroundColor: 'black' }"
          ></video>
        </div>

        <!-- Caption & Metadata -->
        <div class="bg-card/90 backdrop-blur-sm rounded-b-xl p-6 text-center" :style="{ color: 'var(--text-primary)' }">
          <p class="text-lg font-medium mb-2" :style="{ color: 'var(--text-primary)' }">{{ selectedMedia.caption || 'Gallery media' }}</p>
          <div class="flex justify-between text-sm opacity-80" :style="{ color: 'var(--text-secondary)' }">
            <span>{{ selectedMedia.mediaType === 'image' ? 'Photo' : 'Video' }}</span>
            <span v-if="selectedMedia.createdAt">{{ formatDate(selectedMedia.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../services/api';

export default {
  name: 'GalleryPage',
  data() {
    return {
      gallery: [],
      loading: false,
      error: null,
      activeFilter: 'all',
      selectedMedia: null,
      debounceTimer: null,
    };
  },

  computed: {
    filteredGallery() {
      if (this.activeFilter === 'all') return this.gallery;
      return this.gallery.filter(media => media.mediaType === this.activeFilter);
    },
  },

  watch: {
    activeFilter() {
      this.debounceApplyFilters();
    },
  },

  methods: {
    async fetchGallery() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/gallery');
        const data = response.data || response;
        this.gallery = (data.media || data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Latest first
      } catch (err) {
        console.error('Error fetching gallery:', err);
        this.error = 'Failed to load gallery. Please try again.';
      } finally {
        this.loading = false;
      }
    },


    

    setFilter(filter) {
      this.activeFilter = filter;
    },

    applyFilters() {
      // Filters are reactive; no-op for now
    },

    debounceApplyFilters() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.applyFilters();
      }, 300);
    },

    openMediaModal(media) {
      this.selectedMedia = media;
      document.body.style.overflow = 'hidden';
    },

    closeMediaModal() {
      this.selectedMedia = null;
      document.body.style.overflow = 'auto';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
  },

  mounted() {
    this.fetchGallery();
  },

  beforeUnmount() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.selectedMedia) document.body.style.overflow = 'auto';
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.primary-btn { 
  background-color: var(--primary); 
  color: white; 
}

.primary-btn:hover { 
  background-color: var(--primary-hover); 
}

.bg-card {
  background-color: var(--card-bg);
}

.text-secondary {
  color: var(--text-secondary);
}

.text-primary {
  color: var(--primary);
}

.bg-secondary {
  background-color: var(--secondary);
}

.border-primary {
  border-color: var(--primary);
}

.hover\:text-primary:hover {
  color: var(--primary);
}

.hover\:bg-primary-hover:hover {
  background-color: var(--primary-hover);
}
</style>