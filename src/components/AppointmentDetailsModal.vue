<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <h2>Appointment Details</h2>
        <button @click="$emit('close')" class="close-btn">
          <CloseIcon />
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Status Badge -->
        <div class="status-badge" :class="appointment.status">
          {{ appointment.status.toUpperCase() }}
        </div>

        <!-- Service Info -->
        <div class="section">
          <h3>Service</h3>
          <div class="info-card">
            <div class="info-row">
              <span class="label">Service Name:</span>
              <span class="value">{{ appointment.serviceId?.name || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Price:</span>
              <span class="value price">₦{{ appointment.serviceId?.price?.toLocaleString() || 'N/A' }}</span>
            </div>
            <div class="info-row" v-if="appointment.serviceId?.duration">
              <span class="label">Duration:</span>
              <span class="value">{{ appointment.serviceId.duration }} minutes</span>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="section">
          <h3>Customer Information</h3>
          <div class="info-card">
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">{{ appointment.customerName }}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <a :href="`tel:${appointment.customerPhone}`" class="value link">
                {{ appointment.customerPhone }}
              </a>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <a :href="`mailto:${appointment.customerEmail}`" class="value link">
                {{ appointment.customerEmail }}
              </a>
            </div>
          </div>
        </div>

        <!-- Appointment Schedule -->
        <div class="section">
          <h3>Schedule</h3>
          <div class="info-card">
            <div class="info-row">
              <span class="label">Date:</span>
              <span class="value">{{ formatDate(appointment.appointmentDate) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Time:</span>
              <span class="value">{{ appointment.appointmentTime }}</span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="section" v-if="appointment.notes">
          <h3>Notes</h3>
          <div class="info-card">
            <p class="notes">{{ appointment.notes }}</p>
          </div>
        </div>

        <!-- SMS Status -->
        <div class="section">
          <h3>SMS Notifications</h3>
          <div class="info-card">
            <div class="sms-status">
              <div class="sms-item">
                <CheckIcon v-if="appointment.smsSent?.booking" class="check-icon success" />
                <XIcon v-else class="check-icon error" />
                <span>Booking Confirmation</span>
              </div>
              <div class="sms-item">
                <CheckIcon v-if="appointment.smsSent?.confirmation" class="check-icon success" />
                <XIcon v-else class="check-icon error" />
                <span>Appointment Confirmation</span>
              </div>
              <div class="sms-item">
                <CheckIcon v-if="appointment.smsSent?.reminder" class="check-icon success" />
                <XIcon v-else class="check-icon error" />
                <span>Reminder</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Timestamps -->
        <div class="section">
          <div class="timestamps">
            <span class="timestamp">Created: {{ formatDateTime(appointment.createdAt) }}</span>
            <span class="timestamp">Updated: {{ formatDateTime(appointment.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">
          Close
        </button>
        <button @click="$emit('edit')" class="btn-primary">
          <EditIcon />
          Edit Appointment
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  appointment: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['close', 'edit'])

// Icons
const CloseIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
}
const EditIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
}
const CheckIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
}
const XIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
}

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
  overflow-y: auto;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: 0.75rem;
  max-width: 700px;
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

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.status-badge.pending {
  background-color: rgba(251, 191, 36, 0.1);
  color: var(--warning);
}

.status-badge.confirmed {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info);
}

.status-badge.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.status-badge.cancelled {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.section {
  margin-bottom: 1.5rem;
}

.section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.info-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
  text-align: right;
}

.value.price {
  color: var(--primary);
  font-weight: 600;
}

.value.link {
  color: var(--primary);
  text-decoration: none;
}

.value.link:hover {
  text-decoration: underline;
}

.notes {
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.sms-status {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sms-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.check-icon {
  flex-shrink: 0;
}

.check-icon.success {
  color: var(--success);
}

.check-icon.error {
  color: var(--error);
}

.timestamps {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-secondary,
.btn-primary {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background-color: var(--secondary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background-color: var(--secondary-hover);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

@media (max-width: 640px) {
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .value {
    text-align: left;
  }

  .timestamps {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>