<template>
  <section class="min-h-screen" :style="{ backgroundColor: 'var(--bg-primary)' }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <!-- Services Page Header -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8" :style="{ color: 'var(--text-primary)' }">Our Services</h1>
        
        <!-- Debug Info (Remove in Production) -->
        <div v-if="$route.query.debug" class="rounded-lg p-4 mb-4" :style="{ backgroundColor: 'color-mix(in srgb, var(--warning) 10%, transparent)', border: `1px solid var(--warning)` }">
          <p :style="{ color: 'var(--text-primary)' }">Total Services: {{ services.length }}</p>
          <p :style="{ color: 'var(--text-primary)' }">Filtered: {{ filteredServices.length }}</p>
        </div>
        
        <!-- Filters Section -->
        <div class="rounded-lg p-6 mb-8" :style="{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)` }">
          <form @submit.prevent="applyFilters" class="flex flex-wrap gap-4 items-end">
            <div class="flex-1 min-w-64">
              <label for="searchQuery" class="sr-only">Search services</label>
              <input 
                id="searchQuery"
                v-model="searchQuery" 
                :placeholder="`Search services by name or description...`" 
                class="w-full px-4 py-2 rounded-lg border transition-colors focus:ring-2"
                :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
                :class="{ 'focus:ring-primary focus:border-primary': true }"
              />
            </div>
            
            <div>
              <label for="selectedCategory" class="sr-only">Filter by category</label>
              <select 
                id="selectedCategory"
                v-model="selectedCategory" 
                class="px-4 py-2 rounded-lg border transition-colors focus:ring-2"
                :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
                :class="{ 'focus:ring-primary focus:border-primary': true }"
              >
                <option value="">All Categories</option>
                <option 
                  v-for="category in uniqueCategories" 
                  :key="category" 
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>
            
            <button 
              type="submit"
              :disabled="loading"
              class="px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
              :class="{ 'hover:bg-primary-hover': true }"
              :aria-label="loading ? 'Searching...' : 'Apply filters'"
            >
              {{ loading ? 'Searching...' : 'Search' }}
            </button>
          </form>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2" :style="{ borderColor: 'var(--primary)' }"></div>
          <span class="ml-3 text-lg" :style="{ color: 'var(--text-secondary)' }">Loading services...</span>
        </div>

        <!-- Error Message -->
        <div v-else-if="error" class="text-center py-12 rounded-lg p-6" :style="{ backgroundColor: 'color-mix(in srgb, var(--error) 5%, transparent)', border: `1px solid var(--error)` }">
          <p class="text-lg mb-4" :style="{ color: 'var(--error)' }">{{ error }}</p>
          <button 
            @click="fetchServices" 
            class="px-4 py-2 rounded-lg font-semibold transition-colors"
            :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
            :class="{ 'hover:bg-primary-hover': true }"
          >
            Retry
          </button>
        </div>

        <!-- Service Grid -->
        <div v-else-if="filteredServices.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <article 
            v-for="service in filteredServices" 
            :key="service._id" 
            class="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border"
            :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }"
            role="article"
            :aria-label="`Service: ${service.name}`"
          >
            <!-- Main Card Content (Links to Details) -->
            <div class="cursor-pointer p-6" @click="$router.push({ name: 'ServiceDetails', params: { id: service._id } })">
              <!-- Icon Section -->
              <!-- <div class="relative overflow-hidden mb-4">
                <div class="w-full h-48 bg-gradient-to-br flex items-center justify-center" :style="{ backgroundColor: 'var(--secondary)' }">
                  <div class="w-20 h-20 rounded-full primary-btn flex items-center justify-center">
                    <span class="text-white text-3xl">{{ getServiceIcon(service.category) }}</span>
                  </div>
                </div>
              </div> -->

              <!-- Content Section -->
              <div>

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
                <!-- Title and Category -->
                <div class="flex justify-between items-start mb-3">
                  <h3 class="font-semibold text-lg line-clamp-2" :style="{ color: 'var(--text-primary)' }">{{ service.name }}</h3>
                  <span 
                    class="text-xs px-2 py-1 rounded whitespace-nowrap"
                    :style="{ backgroundColor: 'var(--secondary)', color: 'var(--text-secondary)' }"
                    :aria-label="`Category: ${service.category}`"
                  >
                    {{ service.category }}
                  </span>
                </div>

                <!-- Description -->
                <p class="text-sm line-clamp-3 mb-4" :style="{ color: 'var(--text-secondary)' }">{{ service.description }}</p>
                
                <!-- Price and Duration -->
                <div class="flex justify-between items-center mb-4">
                  <span class="text-primary font-bold text-xl">{{ formatPrice(service.price) }}</span>
                  <span class="text-sm" :style="{ color: 'var(--text-secondary)' }">{{ service.duration || '30' }} mins</span>
                </div>
              </div>
            </div>

            <!-- Action Bar -->
            <div class="flex items-center justify-between p-4 border-t" :style="{ borderColor: 'var(--border-color)', backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 100%, transparent)' }">
              <!-- View More Button -->
              <button 
                @click="$router.push({ name: 'ServiceDetails', params: { id: service._id } })"
                class="inline-flex items-center gap-2 text-primary cursor-pointer hover:text-primary-hover font-medium text-sm transition-colors"
                :aria-label="`View details for ${service.name}`"
              >
                <span>View Details</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </button>

              <!-- Book Now Button -->
              <button
                @click="bookService(service)"
                class="inline-flex items-center gap-1 px-3 py-1 cursor-pointer rounded text-sm font-medium transition-colors"
                :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
                :class="{ 'hover:bg-primary-hover': true }"
                :aria-label="`Book ${service.name}`"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>Book Now</span>
              </button>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="text-secondary mb-4 flex justify-center">
            <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" :style="{ color: 'var(--text-secondary)' }">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2" :style="{ color: 'var(--text-primary)' }">No services found</h3>
          <p class="mb-4" :style="{ color: 'var(--text-secondary)' }">Try adjusting your search or filters.</p>
          <button 
            @click="resetFilters" 
            class="px-4 py-2 rounded-lg font-semibold transition-colors"
            :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
            :class="{ 'hover:bg-primary-hover': true }"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../services/api'

export default {
  name: 'PublicServicesList',
  data() {
    return {
      services: [],
      loading: false,
      error: null,
      searchQuery: '',
      selectedCategory: '',
      debounceTimer: null,
    };
  },

  computed: {
    uniqueCategories() {
      const categories = [...new Set(this.services.map(service => service.category).filter(Boolean))];
      return categories.sort();
    },

    filteredServices() {
      return this.services.filter(service => {
        const matchesSearch = !this.searchQuery || 
          service.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = !this.selectedCategory || service.category === this.selectedCategory;
        return matchesSearch && matchesCategory;
      });
    },
  },

  watch: {
    searchQuery() {
      this.debounceApplyFilters();
    },
    selectedCategory() {
      this.debounceApplyFilters();
    },
  },

  methods: {
    async fetchServices() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/services?page=1&limit=20');
        const data = response.data || response;
        this.services = (data.services || data).filter(s => s.isActive) || [];
      } catch (error) {
        console.error('Error fetching services:', error);
        this.error = 'Failed to load services. Please try again.';
      } finally {
        this.loading = false;
      }
    },

    applyFilters() {
      // Filters are reactive; this is a no-op for now
    },

    resetFilters() {
      this.searchQuery = '';
      this.selectedCategory = '';
    },

    debounceApplyFilters() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.applyFilters();
      }, 200);
    },

    bookService(service) {
      this.$router.push({ name: 'PublicAppointments', query: { serviceId: service._id } });
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

  mounted() {
    this.fetchServices();
  },

  beforeUnmount() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
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

.focus\:ring-primary:focus {
  --tw-ring-color: var(--primary);
}

.focus\:border-primary:focus {
  border-color: var(--primary);
}
</style>