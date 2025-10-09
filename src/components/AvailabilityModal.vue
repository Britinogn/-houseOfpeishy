<!-- /src/components/AvailabilityModal.vue -->
<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 sm:p-6" @click.self="$emit('close')">
    <div class="bg-[var(--card-bg)] rounded-xl max-w-md w-full shadow-2xl border border-[var(--border-color)] max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 sm:p-6 border-b border-[var(--border-color)]">
        <h2 class="text-lg font-semibold text-[var(--text-primary)]">{{ selectedSlot ? 'Edit Slot' : 'New Slot' }}</h2>
        <button @click="$emit('close')" class="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 overflow-y-auto flex-1">
        <!-- Day of Week -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Day of Week *</label>
          <select v-model="form.dayOfWeek" required class="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <span v-if="errors.dayOfWeek" class="text-[var(--error)] text-sm mt-1 block">{{ errors.dayOfWeek }}</span>
        </div>

        <!-- Open Time -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Open Time</label>
          <input 
            v-model="form.openTime" 
            type="time" 
            class="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <!-- Close Time -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Close Time</label>
          <input 
            v-model="form.closeTime" 
            type="time" 
            class="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <!-- Closed Toggle -->
        <div class="mb-4 sm:mb-6">
          <label class="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            <input v-model="form.isClosed" type="checkbox" class="rounded border-[var(--border-color)] focus:ring-[var(--primary)]/20">
            <span>Closed Day</span>
          </label>
        </div>

        <!-- Slot Duration -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Slot Duration (min) *</label>
          <input 
            v-model.number="form.slotDuration" 
            type="number" 
            min="15" 
            max="240"
            class="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
          <span v-if="errors.slotDuration" class="text-[var(--error)] text-sm mt-1 block">{{ errors.slotDuration }}</span>
        </div>

        <!-- Buffer Time -->
        <div class="mb-4 sm:mb-6">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Buffer Time (min)</label>
          <input 
            v-model.number="form.bufferTime" 
            type="number" 
            min="0" 
            max="60"
            class="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
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
          :disabled="saving"
          class="px-4 sm:px-6 py-2.5 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--text-primary)] rounded-lg font-medium transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          :disabled="saving || !form.dayOfWeek || (!form.openTime && !form.closeTime && !form.isClosed)"
          class="px-4 sm:px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2 disabled:cursor-not-allowed"
        >
          <LoadingSpinner v-if="saving" class="w-4 h-4" />
          <span>{{ saving ? 'Saving...' : 'Save' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { availabilityAPI } from '../services/availability';
import LoadingSpinner from './LoadingSpinner.vue';
import { X } from 'lucide-vue-next';

// Props
const props = defineProps({
  slot: Object
});

// Emits
const emit = defineEmits(['close', 'save']);

// State
const saving = ref(false);
const error = ref('');
const errors = ref({});

const form = ref({
  dayOfWeek: '',
  openTime: '',
  closeTime: '',
  isClosed: false,
  slotDuration: 60,
  bufferTime: 15
});

// Watch for prop changes (edit mode)
watch(() => props.slot, (newSlot) => {
  if (newSlot) {
    form.value = { ...newSlot };
  } else {
    form.value = {
      dayOfWeek: '',
      openTime: '',
      closeTime: '',
      isClosed: false,
      slotDuration: 60,
      bufferTime: 15
    };
  }
}, { immediate: true });

// Methods
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.dayOfWeek) {
    errors.value.dayOfWeek = 'Day is required';
    isValid = false;
  }

  if (!form.value.isClosed && (!form.value.openTime || !form.value.closeTime)) {
    errors.value.openTime = 'Open and close times are required if not closed';
    isValid = false;
  }

  if (form.value.slotDuration < 15 || form.value.slotDuration > 240) {
    errors.value.slotDuration = 'Slot duration must be between 15-240 minutes';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  saving.value = true;
  error.value = '';

  try {
    let response;
    if (props.slot) {
      response = await availabilityAPI.updateAvailability(props.slot._id, form.value);
    } else {
      response = await availabilityAPI.setAvailability(form.value);
    }
    emit('save', response.data?.slot);
  } catch (err) {
    console.error('Error saving slot:', err);
    error.value = err.response?.data?.message || 'Failed to save slot';
  } finally {
    saving.value = false;
  }
};
</script>