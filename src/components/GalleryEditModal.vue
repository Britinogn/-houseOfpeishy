<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 sm:p-6" @click.self="$emit('close')">
    <div class="bg-[var(--card-bg)] rounded-xl max-w-2xl w-full shadow-2xl border border-[var(--border-color)] max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 sm:p-6 border-b border-[var(--border-color)]">
        <h2 class="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">Edit Media</h2>
        <button @click="$emit('close')" class="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
          <CloseIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 overflow-y-auto flex-1">
        <!-- Media Preview -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Preview</label>
          <div class="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-secondary)] border-2 border-[var(--border-color)]">
            <img 
              v-if="item.mediaType === 'image'" 
              :src="item.coverImage?.url" 
              class="w-full h-full object-cover"
            />
            <video 
              v-else
              :src="item.video?.url" 
              controls
              class="w-full h-full object-contain bg-black"
            ></video>
          </div>
        </div>

        <!-- Category -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Category *</label>
          <select 
            v-model="form.category" 
            required
            class="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          >
            <option value="Beauty Salon">Beauty Salon</option>
            <option value="Hair Styling">Hair Styling</option>
            <option value="Braid Style">Braid Style</option>
            <option value="Wig Making">Wig Making</option>
            <option value="Hair Sales">Hair Sales</option>
            <option value="Before & After">Before & After</option>
          </select>
        </div>

        <!-- Caption -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Caption</label>
          <textarea 
            v-model="form.caption" 
            rows="4"
            placeholder="Add a description..."
            class="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 sm:p-4 bg-[var(--error)]/10 border border-[var(--error)] rounded-lg mb-4 sm:mb-6">
          <p class="text-[var(--error)] text-sm">{{ error }}</p>
        </div>
      </form>

      <!-- Footer -->
      <div class="flex justify-end gap-3 p-4 sm:p-6 border-t border-[var(--border-color)]">
        <button 
          type="button"
          @click="$emit('close')" 
          :disabled="loading"
          class="px-4 sm:px-6 py-2.5 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--text-primary)] rounded-lg font-medium transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          :disabled="loading"
          class="px-4 sm:px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2 disabled:cursor-not-allowed"
        >
          <LoadingSpinner v-if="loading" class="w-4 h-4" />
          <span>{{ loading ? 'Updating...' : 'Update' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { galleryAPI } from '../services/gallery'
import LoadingSpinner from './LoadingSpinner.vue'

const CloseIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
}

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'updated'])

// State
const loading = ref(false)
const error = ref('')

const form = ref({
  category: props.item.category,
  caption: props.item.caption || ''
})

// Methods
const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    await galleryAPI.update(props.item._id, form.value)
    emit('updated')
  } catch (err) {
    console.error('Error updating media:', err)
    error.value = err.message || 'Failed to update media. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>