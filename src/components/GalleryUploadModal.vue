<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 sm:p-6" @click.self="$emit('close')">
    <div class="bg-[var(--card-bg)] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[var(--border-color)]">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 sm:p-6 border-b border-[var(--border-color)]">
        <h2 class="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">Upload Media</h2>
        <button @click="$emit('close')" class="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 overflow-y-auto flex-1">
        <!-- Media Type Selection -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-3">Media Type *</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button 
              type="button"
              @click="form.mediaType = 'image'"
              :class="[
                'p-4 sm:p-6 border-2 rounded-xl transition-all flex flex-col items-center justify-center',
                form.mediaType === 'image' 
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                  : 'border-[var(--border-color)] hover:border-[var(--primary)]/50'
              ]"
            >
              <ImageIcon class="mx-auto mb-2 w-8 h-8" :class="form.mediaType === 'image' ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'" />
              <p class="font-medium text-sm sm:text-base" :class="form.mediaType === 'image' ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'"/> Image < /p>
              <p class="text-xs text-[var(--text-secondary)] mt-1 text-center">JPG, PNG, WebP</p>
            </button>

            <button 
              type="button"
              @click="form.mediaType = 'video'"
              :class="[
                'p-4 sm:p-6 border-2 rounded-xl transition-all flex flex-col items-center justify-center',
                form.mediaType === 'video' 
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                  : 'border-[var(--border-color)] hover:border-[var(--primary)]/50'
              ]"
            >
              <VideoIcon class="mx-auto mb-2 w-8 h-8" :class="form.mediaType === 'video' ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'" />
              <p class="font-medium text-sm sm:text-base" :class="form.mediaType === 'video' ? 'text-[var(--primary)]' : 'text-[var(--text-primary)] '">Video</p>
              <p class="text-xs text-[var(--text-secondary)] mt-1 text-center">MP4 (Max 15min)</p>
            </button>
          </div>
        </div>

        <!-- File Upload -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">
            {{ form.mediaType === 'image' ? 'Upload Image' : 'Upload Video' }} *
          </label>
          
          <input 
            type="file" 
            ref="fileInput"
            :accept="form.mediaType === 'image' ? 'image/*' : 'video/mp4,video/webm'"
            @change="handleFileChange"
            class="hidden"
          />

          <!-- Preview or Upload Button -->
          <div v-if="preview" class="relative">
            <!-- Image Preview -->
            <img 
              v-if="form.mediaType === 'image'" 
              :src="preview" 
              class="w-full h-48 sm:h-64 object-cover rounded-xl border-2 border-[var(--border-color)]"
            />
            
            <!-- Video Preview -->
            <video 
              v-else
              :src="preview" 
              controls
              class="w-full h-48 sm:h-64 rounded-xl border-2 border-[var(--border-color)] bg-black"
            ></video>

            <!-- Remove Button -->
            <button 
              type="button"
              @click="removeFile" 
              class="absolute top-2 right-2 p-2 bg-[var(--error)] text-white rounded-lg hover:bg-[var(--error)]/90 transition-colors"
            >
              <TrashIcon class="w-4 h-4" />
            </button>

            <!-- File Info -->
            <div class="mt-2 text-sm text-[var(--text-secondary)]">
              <p class="truncate">{{ selectedFile?.name }}</p>
              <p>{{ formatFileSize(selectedFile?.size) }}</p>
              <p v-if="videoDuration" class="text-[var(--primary)]">Duration: {{ formatDuration(videoDuration) }}</p>
            </div>
          </div>

          <!-- Upload Area -->
          <button 
            v-else
            type="button"
            @click="$refs.fileInput.click()"
            class="w-full p-8 sm:p-12 border-2 border-dashed border-[var(--border-color)] hover:border-[var(--primary)] rounded-xl transition-all bg-[var(--bg-secondary)] hover:bg-[var(--primary)]/5 flex flex-col items-center justify-center"
          >
            <Upload  class="mx-auto mb-3 w-8 h-8 text-[var(--text-secondary)]" />
            <p class="text-[var(--text-primary)] font-medium text-sm sm:text-base">Click to upload {{ form.mediaType }}</p>
            <p class="text-xs text-[var(--text-secondary)] mt-1 text-center">
              {{ form.mediaType === 'image' ? 'JPG, PNG, WebP up to 10MB' : 'MP4, WebM up to 100MB, Max 15 minutes' }}
            </p>
          </button>

          <span v-if="errors.file" class="text-[var(--error)] text-sm mt-1 block">{{ errors.file }}</span>
        </div>

        <!-- Category -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Category *</label>
          <select 
            v-model="form.category" 
            required
            class="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          >
            <option value="">Select a category</option>
            <option value="Beauty Salon">Beauty Salon</option>
            <option value="Hair Styling">Hair Styling</option>
            <option value="Braid Style">Braid Style</option>
            <option value="Wig Making">Wig Making</option>
            <option value="Hair Sales">Hair Sales</option>
            <option value="Before & After">Before & After</option>
          </select>
          <span v-if="errors.category" class="text-[var(--error)] text-sm mt-1 block">{{ errors.category }}</span>
        </div>

        <!-- Caption -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Caption (Optional)</label>
          <textarea 
            v-model="form.caption" 
            rows="3"
            placeholder="Add a description..."
            class="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
          ></textarea>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploading" class="mb-4 sm:mb-6">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-[var(--text-primary)]">Uploading...</span>
            <span class="text-[var(--primary)] font-medium">{{ uploadProgress }}%</span>
          </div>
          <div class="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div 
              class="h-full bg-[var(--primary)] transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
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
          :disabled="uploading"
          class="px-4 sm:px-6 py-2.5 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--text-primary)] rounded-lg font-medium transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          :disabled="uploading || !selectedFile || !form.category"
          class="px-4 sm:px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <LoadingSpinner v-if="uploading" class="w-4 h-4" />
          <span>{{ uploading ? 'Uploading...' : 'Upload' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { galleryAPI } from '../services/gallery'
import LoadingSpinner from './LoadingSpinner.vue'
import { ImageIcon, VideoIcon, X, TrashIcon , Upload } from 'lucide-vue-next'

const UploadIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'
}

// Emits
const emit = defineEmits(['close', 'uploaded'])

// State
const fileInput = ref(null)
const selectedFile = ref(null)
const preview = ref(null)
const videoDuration = ref(0)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')
const errors = ref({})

const form = ref({
  mediaType: 'image',
  category: '',
  caption: ''
})

// Methods
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  errors.value = {}
  error.value = ''

  // Validate file type
  if (form.value.mediaType === 'image') {
    if (!file.type.startsWith('image/')) {
      errors.value.file = 'Please select an image file'
      return
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      errors.value.file = 'Image size must be less than 10MB'
      return
    }
  } else {
    if (!file.type.startsWith('video/')) {
      errors.value.file = 'Please select a video file'
      return
    }
    if (file.size > 100 * 1024 * 1024) { // 100MB
      errors.value.file = 'Video size must be less than 100MB'
      return
    }
  }

  selectedFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target.result

    // Get video duration if video
    if (form.value.mediaType === 'video') {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        videoDuration.value = Math.floor(video.duration)
        
        if (videoDuration.value > 900) { // 15 minutes
          errors.value.file = 'Video duration cannot exceed 15 minutes'
          removeFile()
        }
      }
      video.src = URL.createObjectURL(file)
    }
  }
  reader.readAsDataURL(file)
}

const removeFile = () => {
  selectedFile.value = null
  preview.value = null
  videoDuration.value = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!selectedFile.value) {
    errors.value.file = 'Please select a file'
    isValid = false
  }

  if (!form.value.category) {
    errors.value.category = 'Please select a category'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  uploading.value = true
  uploadProgress.value = 0
  error.value = ''

  try {
    const formData = new FormData()
    
    // Your backend expects 'files' as array
    formData.append('files', selectedFile.value)
    
    formData.append('mediaType', form.value.mediaType)
    formData.append('category', form.value.category)
    formData.append('caption', form.value.caption || '')

    // If video, add duration
    if (form.value.mediaType === 'video' && videoDuration.value) {
      formData.append('duration', videoDuration.value)
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    // Use the upload endpoint
    const response = await galleryAPI.upload(formData)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    setTimeout(() => {
      emit('uploaded', response)
    }, 500)
  } catch (err) {
    console.error('Error uploading media:', err)
    error.value = err.message || 'Failed to upload media. Please try again.'
  } finally {
    uploading.value = false
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>