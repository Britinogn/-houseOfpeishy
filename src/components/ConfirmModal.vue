<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button @click="$emit('cancel')" class="close-btn">
          <CloseIcon />
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button @click="$emit('cancel')" class="btn-cancel">
          Cancel
        </button>
        <button @click="$emit('confirm')" class="btn-confirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  }
})

// Emits
defineEmits(['confirm', 'cancel'])

// Icon
const CloseIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: 0.75rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: var(--secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-cancel,
.btn-confirm {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background-color: var(--secondary);
  color: var(--text-primary);
}

.btn-cancel:hover {
  background-color: var(--secondary-hover);
}

.btn-confirm {
  background-color: var(--error);
  color: white;
}

.btn-confirm:hover {
  background-color: #dc2626;
}
</style>