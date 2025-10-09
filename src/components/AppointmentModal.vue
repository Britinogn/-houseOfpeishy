<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Edit Appointment' : 'New Appointment' }}</h2>
        <button @click="$emit('close')" class="close-btn">
          <CloseIcon />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Service Selection -->
        <div class="form-group">
          <label>Service *</label>
          <select v-model="form.serviceId" required>
            <option value="">Select a service</option>
            <option v-for="service in services" :key="service._id" :value="service._id">
              {{ service.name }} - ₦{{ service.price.toLocaleString() }}
            </option>
          </select>
          <span v-if="errors.serviceId" class="error">{{ errors.serviceId }}</span>
        </div>

        <!-- Customer Name -->
        <div class="form-group">
          <label>Customer Name *</label>
          <input 
            v-model="form.customerName" 
            type="text" 
            placeholder="e.g., Jane Doe"
            required
          />
          <span v-if="errors.customerName" class="error">{{ errors.customerName }}</span>
        </div>

        <!-- Customer Phone -->
        <div class="form-group">
          <label>Phone Number *</label>
          <input 
            v-model="form.customerPhone" 
            type="tel" 
            placeholder="e.g., 08012345678"
            required
          />
          <span v-if="errors.customerPhone" class="error">{{ errors.customerPhone }}</span>
        </div>

        <!-- Customer Email -->
        <div class="form-group">
          <label>Email Address *</label>
          <input 
            v-model="form.customerEmail" 
            type="email" 
            placeholder="e.g., jane@example.com"
            required
          />
          <span v-if="errors.customerEmail" class="error">{{ errors.customerEmail }}</span>
        </div>

        <!-- Appointment Date -->
        <div class="form-row">
          <div class="form-group">
            <label>Date *</label>
            <input 
              v-model="form.appointmentDate" 
              type="date" 
              :min="today"
              required
            />
            <span v-if="errors.appointmentDate" class="error">{{ errors.appointmentDate }}</span>
          </div>

          <!-- Appointment Time -->
          <div class="form-group">
            <label>Time *</label>
            <input 
              v-model="form.appointmentTime" 
              type="time" 
              required
            />
            <span v-if="errors.appointmentTime" class="error">{{ errors.appointmentTime }}</span>
          </div>
        </div>

        <!-- Status (only for edit mode) -->
        <div v-if="isEditMode" class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label>Notes (Optional)</label>
          <textarea 
            v-model="form.notes" 
            rows="3"
            placeholder="Any special requests or notes..."
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Footer Actions -->
        <div class="modal-footer">
          <button type="button" @click="$emit('close')" class="btn-cancel" :disabled="loading">
            Cancel
          </button>
          <button type="submit" class="btn-submit" :disabled="loading">
            <LoadingSpinner v-if="loading" />
            <span v-else>{{ isEditMode ? 'Update' : 'Book Appointment' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { appointmentsAPI } from '../services/appointments'
import { servicesAPI } from '../services/services'
import LoadingSpinner from './LoadingSpinner.vue'

// Props
const props = defineProps({
  appointment: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Icons
const CloseIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
}

// State
const isEditMode = computed(() => !!props.appointment)
const loading = ref(false)
const error = ref('')
const errors = ref({})
const services = ref([])

const today = new Date().toISOString().split('T')[0]

const form = ref({
  serviceId: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  appointmentDate: '',
  appointmentTime: '',
  status: 'pending',
  notes: ''
})

// Initialize form with existing appointment data
if (props.appointment) {
  const date = new Date(props.appointment.appointmentDate).toISOString().split('T')[0]
  
  form.value = {
    serviceId: props.appointment.serviceId?._id || props.appointment.serviceId,
    customerName: props.appointment.customerName,
    customerPhone: props.appointment.customerPhone,
    customerEmail: props.appointment.customerEmail,
    appointmentDate: date,
    appointmentTime: props.appointment.appointmentTime,
    status: props.appointment.status,
    notes: props.appointment.notes || ''
  }
}

// Fetch services for dropdown
const fetchServices = async () => {
  try {
    const data = await servicesAPI.getAll()
    services.value = (data.services || data).filter(s => s.isActive)
  } catch (err) {
    console.error('Error fetching services:', err)
  }
}

// Validation
const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.serviceId) {
    errors.value.serviceId = 'Please select a service'
    isValid = false
  }

  if (!form.value.customerName || form.value.customerName.trim().length < 2) {
    errors.value.customerName = 'Name must be at least 2 characters'
    isValid = false
  }

  if (!form.value.customerPhone || !/^[0-9]{10,11}$/.test(form.value.customerPhone.replace(/\s/g, ''))) {
    errors.value.customerPhone = 'Please enter a valid phone number'
    isValid = false
  }

  if (!form.value.customerEmail || !/\S+@\S+\.\S+/.test(form.value.customerEmail)) {
    errors.value.customerEmail = 'Please enter a valid email'
    isValid = false
  }

  if (!form.value.appointmentDate) {
    errors.value.appointmentDate = 'Please select a date'
    isValid = false
  }

  if (!form.value.appointmentTime) {
    errors.value.appointmentTime = 'Please select a time'
    isValid = false
  }

  return isValid
}

// Submit
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    const appointmentData = {
      serviceId: form.value.serviceId,
      customerName: form.value.customerName.trim(),
      customerPhone: form.value.customerPhone.trim(),
      customerEmail: form.value.customerEmail.trim().toLowerCase(),
      appointmentDate: form.value.appointmentDate,
      appointmentTime: form.value.appointmentTime,
      status: form.value.status,
      notes: form.value.notes?.trim() || ''
    }

    let response
    if (isEditMode.value) {
      response = await appointmentsAPI.update(props.appointment._id, appointmentData)
    } else {
      response = await appointmentsAPI.create(appointmentData)
    }

    emit('save', response)
  } catch (err) {
    console.error('Error saving appointment:', err)
    error.value = err.message || 'Failed to save appointment. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
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
  overflow-y: auto;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: 0.75rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
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
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.error {
  display: block;
  color: var(--error);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.error-message {
  padding: 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error);
  border-radius: 0.5rem;
  color: var(--error);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-cancel,
.btn-submit {
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

.btn-submit {
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
  justify-content: center;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>