<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content max-w-md">
      <div class="p-4">
        <h3 class="text-lg font-semibold">{{ title || 'Confirm' }}</h3>
        <p class="text-gray-600 mt-2">{{ message || 'Are you sure?' }}</p>

        <div class="flex justify-end gap-2 mt-4">
          <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
          <button class="btn-primary" @click="$emit('confirm')">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ title: String, message: String })
</script>

<style scoped>
.modal-content { background: white; border-radius: 0.5rem }
.btn-primary { background: var(--primary); color: white; padding: 0.5rem 0.75rem; border-radius: 0.375rem }
.btn-cancel { background: #f3f4f6; padding: 0.5rem 0.75rem; border-radius: 0.375rem }
</style>