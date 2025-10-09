<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Gallery</h1>
        <p class="text-[var(--text-secondary)] mt-2 text-sm sm:text-base">Manage your salon photos and videos</p>
      </div>
      <button @click="openUploadModal" class="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg font-medium transition-all">
        <PlusIcon class="w-4 h-4" />
        <span>Upload Media</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 sm:p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
            <ImageIcon class="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <p class="text-sm text-[var(--text-secondary)]">Total Images</p>
            <p class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] m-0">{{ stats.images }}</p>
          </div>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 sm:p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center">
            <VideoIcon class="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div>
            <p class="text-sm text-[var(--text-secondary)]">Total Videos</p>
            <p class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] m-0">{{ stats.videos }}</p>
          </div>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 sm:p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-[var(--secondary)]/50 rounded-lg flex items-center justify-center">
            <FolderIcon class="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <p class="text-sm text-[var(--text-secondary)]">Total Items</p>
            <p class="text-xl sm:text-2xl font-bold text-[var(--text-primary)] m-0">{{ stats.total }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Category</label>
          <select v-model="filters.category" class="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
            <option value="">All Categories</option>
            <option value="Beauty Salon">Beauty Salon</option>
            <option value="Hair Styling">Hair Styling</option>
            <option value="Braid Style">Braid Style</option>
            <option value="Wig Making">Wig Making</option>
            <option value="Hair Sales">Hair Sales</option>
            <option value="Before & After">Before & After</option>
          </select>
        </div>

        <!-- Media Type Filter -->
        <div>
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Media Type</label>
          <select v-model="filters.mediaType" class="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
            <option value="">All Types</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>

        <!-- Clear Filters -->
        <div class="flex items-end">
          <button @click="clearFilters" class="w-full px-4 py-2 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--text-primary)] rounded-lg font-medium transition-all">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 sm:py-20 text-[var(--text-secondary)]">
      <LoadingSpinner />
      <p class="mt-4 text-sm sm:text-base">Loading gallery...</p>
    </div>

    <!-- Gallery Grid -->
    <div v-else-if="filteredItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <div 
        v-for="item in filteredItems" 
        :key="item._id"
        class="group bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        <!-- Media -->
        <div class="relative aspect-square overflow-hidden bg-[var(--bg-secondary)]">
          <!-- Image -->
          <img 
            v-if="item.mediaType === 'image'" 
            :src="item.coverImage?.url" 
            :alt="item.caption"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          <!-- Video -->
          <div v-else class="relative w-full h-full">
            <video 
              :src="item.video?.url" 
              class="w-full h-full object-cover"
              muted
            ></video>
            <div class="absolute inset-0 flex items-center justify-center bg-black/30">
              <div class="w-12 sm:w-16 h-12 sm:h-16 bg-white/90 rounded-full flex items-center justify-center">
                <Play class="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] ml-0.5 sm:ml-1" />
              </div>
            </div>
            <div class="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {{ formatDuration(item.video?.duration) }}
            </div>
          </div>

          <!-- Media Type Badge -->
          <div class="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
            {{ item.mediaType === 'image' ? '📷 Image' : '🎥 Video' }}
          </div>

          <!-- Category Badge -->
          <div class="absolute top-2 right-2 bg-[var(--primary)]/90 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
            {{ item.category }}
          </div>

          <!-- Overlay Actions (show on hover) -->
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-2">
            <button @click="viewItem(item)" class="p-2 sm:p-3 bg-white rounded-full hover:bg-[var(--primary)] hover:text-white transition-all" title="View">
              <EyeIcon class="w-4 h-4" />
            </button>
            <button @click="openEditModal(item)" class="p-2 sm:p-3 bg-white rounded-full hover:bg-[var(--primary)] hover:text-white transition-all" title="Edit">
              <EditIcon class="w-4 h-4" />
            </button>
            <button @click="confirmDelete(item)" class="p-2 sm:p-3 bg-white rounded-full hover:bg-[var(--error)] hover:text-white transition-all" title="Delete">
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Caption -->
        <div class="p-3 sm:p-4">
          <p class="text-sm text-[var(--text-primary)] line-clamp-2" :title="item.caption">
            {{ item.caption || 'No caption' }}
          </p>
          <p class="text-xs text-[var(--text-secondary)] mt-2">
            {{ formatDate(item.createdAt) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 sm:py-20 text-center text-[var(--text-secondary)]">
      <ImageIconEmpty class="w-16 sm:w-20 h-16 sm:h-20 mb-4 opacity-30" />
      <p class="text-sm sm:text-lg mb-4">No media found</p>
      <button @click="openUploadModal" class="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg font-medium transition-all">
        <PlusIcon class="w-4 h-4" />
        <span>Upload First Media</span>
      </button>
    </div>

    <!-- Upload Modal -->
    <GalleryUploadModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @uploaded="handleUploaded"
    />

    <!-- Edit Modal -->
    <GalleryEditModal
      v-if="showEditModal"
      :item="selectedItem"
      @close="showEditModal = false"
      @updated="handleUpdated"
    />

    <!-- View Modal -->
    <GalleryViewModal
      v-if="showViewModal"
      :item="selectedItem"
      @close="showViewModal = false"
      @edit="openEditFromView"
      @delete="confirmDeleteFromView"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Delete Media"
      :message="`Are you sure you want to delete this ${itemToDelete?.mediaType}? This action cannot be undone.`"
      confirm-text="Delete"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { galleryAPI } from '../../services/gallery'
import GalleryUploadModal from '../../components/GalleryUploadModal.vue'
import GalleryEditModal from '../../components/GalleryEditModal.vue'
import GalleryViewModal from '../../components/GalleryViewModal.vue'
import ConfirmModal from '../../components/ConfirmModal.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { PlusIcon, ImageIcon, VideoIcon, FolderIcon, Play, EyeIcon, EditIcon, TrashIcon } from 'lucide-vue-next'

const ImageIconEmpty = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
}

// State
const items = ref([])
const loading = ref(false)
const showUploadModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const selectedItem = ref(null)
const itemToDelete = ref(null)

const filters = ref({
  category: '',
  mediaType: ''
})

// Computed
const stats = computed(() => {
  return {
    images: items.value.filter(i => i.mediaType === 'image').length,
    videos: items.value.filter(i => i.mediaType === 'video').length,
    total: items.value.length
  }
})

const filteredItems = computed(() => {
  return items.value.filter(item => {
    if (filters.value.category && item.category !== filters.value.category) {
      return false
    }
    if (filters.value.mediaType && item.mediaType !== filters.value.mediaType) {
      return false
    }
    return true
  })
})

// Methods
const fetchGallery = async () => {
  loading.value = true
  try {
    const data = await galleryAPI.getAll()
    console.log('Gallery API response:', data) // Debug log
    
    // Handle different response structures
    if (Array.isArray(data)) {
      items.value = data
    } else if (Array.isArray(data.gallery)) {
      items.value = data.gallery
    } else if (Array.isArray(data.data)) {
      items.value = data.data
    } else if (data.items && Array.isArray(data.items)) {
      items.value = data.items
    } else {
      console.error('Unexpected response structure:', data)
      items.value = []
    }
  } catch (error) {
    console.error('Error fetching gallery:', error)
    alert('Failed to load gallery')
    items.value = [] // Ensure it's always an array
  } finally {
    loading.value = false
  }
}

const openUploadModal = () => {
  showUploadModal.value = true
}

const openEditModal = (item) => {
  selectedItem.value = item
  showEditModal.value = true
}

const viewItem = (item) => {
  selectedItem.value = item
  showViewModal.value = true
}

const openEditFromView = () => {
  showViewModal.value = false
  showEditModal.value = true
}

const confirmDeleteFromView = () => {
  itemToDelete.value = selectedItem.value
  showViewModal.value = false
  showDeleteModal.value = true
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await galleryAPI.delete(itemToDelete.value._id)
    items.value = items.value.filter(i => i._id !== itemToDelete.value._id)
    showDeleteModal.value = false
    itemToDelete.value = null
  } catch (error) {
    console.error('Error deleting item:', error)
    alert('Failed to delete media')
  }
}

const handleUploaded = () => {
  fetchGallery()
  showUploadModal.value = false
}

const handleUpdated = () => {
  fetchGallery()
  showEditModal.value = false
}

const clearFilters = () => {
  filters.value = {
    category: '',
    mediaType: ''
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  fetchGallery()
})
</script>