<template>
  <div class="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4" @click.self="$emit('close')">
    <div class="max-w-6xl w-full">
      <!-- Close Button -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
      >
        <CloseIcon />
      </button>

      <!-- Content -->
      <div class="bg-card rounded-xl overflow-hidden">
        <!-- Media -->
        <div class="relative bg-black">
          <img 
            v-if="item.mediaType === 'image'" 
            :src="item.coverImage?.url" 
            :alt="item.caption"
            class="w-full max-h-[70vh] object-contain"
          />
          <video 
            v-else
            :src="item.video?.url" 
            controls
            autoplay
            class="w-full max-h-[70vh] object-contain"
          ></video>
        </div>

        <!-- Info -->
        <div class="p-6 bg-card">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <!-- Category Badge -->
              <span class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                {{ item.category }}
              </span>
              
              <!-- Caption -->
              <p v-if="item.caption" class="text-text-primary text-lg">{{ item.caption }}</p>
              <p v-else class="text-text-secondary italic">No caption</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 ml-4">
              <button 
                @click="$emit('edit')" 
                class="p-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-all"
                title="Edit"
              >
                <EditIcon />
              </button>
              <button 
                @click="$emit('delete')" 
                class="p-2 bg-error hover:bg-error/90 text-white rounded-lg transition-all"
                title="Delete"
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          <!-- Metadata -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div>
              <p class="text-xs text-text-secondary mb-1">Type</p>
              <p class="text-sm font-medium text-text-primary">
                {{ item.mediaType === 'image' ? '📷 Image' : '🎥 Video' }}
              </p>
            </div>
            
            <div v-if="item.video?.duration">
              <p class="text-xs text-text-secondary mb-1">Duration</p>
              <p class="text-sm font-medium text-text-primary">
                {{ formatDuration(item.video.duration) }}
              </p>
            </div>

            <div>
              <p class="text-xs text-text-secondary mb-1">Uploaded</p>
              <p class="text-sm font-medium text-text-primary">
                {{ formatDate(item.createdAt) }}
              </p>
            </div>

            <div>
              <p class="text-xs text-text-secondary mb-1">Updated</p>
              <p class="text-sm font-medium text-text-primary">
                {{ formatDate(item.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['close', 'edit', 'delete'])

// Icons
const CloseIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
}
const EditIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
}
const TrashIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
}

// Methods
const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>