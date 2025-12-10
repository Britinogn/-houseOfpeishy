
<template>
  <section class="min-h-screen" :style="{ backgroundColor: 'var(--bg-primary)' }">
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-3" :style="{ color: 'var(--text-primary)' }">
          Book Your Appointment
        </h1>
        <p :style="{ color: 'var(--text-secondary)' }">
          Choose your service, pick a time, and we'll confirm your booking
        </p>
      </div>

      <nav class="mb-8 flex items-center gap-3 text-sm font-medium" :style="{ color: 'var(--text-secondary)' }">
        <button 
          @click="$router.go(-1)" 
          class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-secondary hover:text-primary"
          :style="{ color: 'var(--text-secondary)' }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Back to Appointment</span>
        </button>
      </nav>

      <!-- Progress Indicator -->
      <div class="mb-12">
        <div class="flex justify-between mb-4">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex-1 text-center"
          >
            <div
              class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center font-semibold transition-all"
              :style="{
                backgroundColor: currentStep > index ? 'var(--primary)' : currentStep === index ? 'var(--primary)' : 'var(--border-color)',
                color: currentStep >= index ? 'white' : 'var(--text-secondary)'
              }"
            >
              {{ index + 1 }}
            </div>
            <p class="text-sm" :style="{ color: currentStep >= index ? 'var(--primary)' : 'var(--text-secondary)' }">
              {{ step }}
            </p>
          </div>
        </div>
        <div class="w-full h-1 bg-gradient-to-r" :style="{ backgroundImage: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(currentStep / 3) * 100}%, var(--border-color) ${(currentStep / 3) * 100}%, var(--border-color) 100%)` }"></div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingServices" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" :style="{ borderColor: 'var(--primary)' }"></div>
        <p :style="{ color: 'var(--text-secondary)' }">Loading services...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-lg p-6 mb-8" :style="{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--error)' }">
        <p style="color: var(--error); font-weight: 600;" class="mb-3">{{ error }}</p>
        <button
          @click="fetchServices"
          class="px-4 py-2 rounded transition-colors"
          :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
        >
          Retry
        </button>
      </div>

      

      <!-- Form Container -->
      <div v-else>
        <!-- Step 1: Select Service -->
        <div v-if="currentStep === 0" class="animate-fadeIn">
          <div class="rounded-xl p-8" :style="{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }">
            <h2 class="text-2xl font-semibold mb-6" :style="{ color: 'var(--text-primary)' }">
              Choose a Service
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                v-for="service in services"
                :key="service._id"
                @click="selectService(service)"
                class="p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg"
                :style="{
                  borderColor: selectedService?._id === service._id ? 'var(--primary)' : 'var(--border-color)',
                  backgroundColor: selectedService?._id === service._id ? 'rgba(251, 191, 36, 0.05)' : 'transparent'
                }"
              >
                <h3 class="font-semibold mb-2" :style="{ color: 'var(--text-primary)' }">
                  {{ service.name }}
                </h3>
                <p class="text-sm mb-2" :style="{ color: 'var(--text-secondary)' }">
                  {{ service.category }}
                </p>
                <p class="text-sm mb-3 line-clamp-2" :style="{ color: 'var(--text-secondary)' }">
                  {{ service.description }}
                </p>
                <div class="flex justify-between items-center">
                  <span class="font-bold" :style="{ color: 'var(--primary)' }">
                    ₦{{ formatPrice(service.price) }}
                  </span>
                  <span class="text-xs" :style="{ color: 'var(--text-secondary)' }">
                    {{ service.duration }}min
                  </span>
                </div>
              </div>
            </div>

            <div v-if="services.length === 0" class="text-center py-8">
              <p :style="{ color: 'var(--text-secondary)' }">No services available</p>
            </div>

            <button
              @click="nextStep"
              :disabled="!selectedService"
              class="w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :style="{
                backgroundColor: selectedService ? 'var(--primary)' : 'var(--border-color)',
                color: 'white'
              }"
            >
              Continue to Date & Time
            </button>
          </div>
        </div>

        <!-- Step 2: Select Date & Time -->
        <div v-if="currentStep === 1" class="animate-fadeIn">
          <div class="rounded-xl p-8" :style="{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }">
            <h2 class="text-2xl font-semibold mb-6" :style="{ color: 'var(--text-primary)' }">
              Pick Date & Time
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Date Picker -->
              <div>
                <label class="block font-semibold mb-2" :style="{ color: 'var(--text-primary)' }">
                  Date *
                </label>
                <input
                  v-model="form.appointmentDate"
                  type="date"
                  :min="minDate"
                  class="w-full px-4 py-2 rounded-lg border"
                  :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
                  @change="fetchAvailableSlots"
                />
              </div>

              <!-- Time Picker -->
              <div>
                <label class="block font-semibold mb-2" :style="{ color: 'var(--text-primary)' }">
                  Time *
                </label>
                <select
                  v-model="form.appointmentTime"
                  class="w-full px-4 py-2 rounded-lg border"
                  :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
                  :disabled="loadingSlots || availableSlots.length === 0"
                >
                  <option value="">{{ loadingSlots ? 'Loading times...' : 'Select a time' }}</option>
                  <option v-for="slot in availableSlots" :key="slot" :value="slot">
                    {{ slot }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="form.appointmentDate && availableSlots.length === 0 && !loadingSlots" class="text-center py-8 mb-6" :style="{ backgroundColor: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px' }">
              <p :style="{ color: 'var(--warning)' }">No available slots for this date. Please choose another.</p>
            </div>

            <div class="flex gap-4">
              <button
                @click="prevStep"
                class="flex-1 py-3 rounded-lg font-semibold border-2 transition-all"
                :style="{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }"
              >
                Back
              </button>
              <button
                @click="nextStep"
                :disabled="!form.appointmentDate || !form.appointmentTime"
                class="flex-1 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :style="{
                  backgroundColor: form.appointmentDate && form.appointmentTime ? 'var(--primary)' : 'var(--border-color)',
                  color: 'white'
                }"
              >
                Continue to Your Info
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Customer Information -->
        <div v-if="currentStep === 2" class="animate-fadeIn">
          <div class="rounded-xl p-8" :style="{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }">
            <h2 class="text-2xl font-semibold mb-6" :style="{ color: 'var(--text-primary)' }">
              Your Information
            </h2>

            <div class="space-y-4 mb-6">
              <!-- Name -->
              <div>
                <label class="block font-semibold mb-2" :style="{ color: 'var(--text-primary)' }">
                  Full Name *
                </label>
                <input
                  v-model="form.customerName"
                  type="text"
                  placeholder="Jane Doe"
                  class="w-full px-4 py-2 rounded-lg border"
                  :style="{ borderColor: errors.customerName ? 'var(--error)' : 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
                />
                <p v-if="errors.customerName" style="color: var(--error);" class="text-sm mt-1">
                  {{ errors.customerName }}
                </p>
              </div>

              <!-- Phone -->
              <div>
                <label class="block font-semibold mb-2" :style="{ color: 'var(--text-primary)' }">
                  Phone Number *
                </label>
                <input
                  v-model="form.customerPhone"
                  type="tel"
                  placeholder="08012345678"
                  class="w-full px-4 py-2 rounded-lg border"
                  :style="{ borderColor: errors.customerPhone ? 'var(--error)' : 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
                />
                <p v-if="errors.customerPhone" style="color: var(--error);" class="text-sm mt-1">
                  {{ errors.customerPhone }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <label class="block font-semibold mb-2" :style="{ color: 'var(--text-primary)' }">
                  Email Address *
                </label>
                <input
                  v-model="form.customerEmail"
                  type="email"
                  placeholder="jane@example.com"
                  class="w-full px-4 py-2 rounded-lg border"
                  :style="{ borderColor: errors.customerEmail ? 'var(--error)' : 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
                />
                <p v-if="errors.customerEmail" style="color: var(--error);" class="text-sm mt-1">
                  {{ errors.customerEmail }}
                </p>
              </div>

              <!-- Notes -->
              <div>
                <label class="block font-semibold mb-2" :style="{ color: 'var(--text-primary)' }">
                  Notes (Optional)
                </label>
                <textarea
                  v-model="form.notes"
                  placeholder="Any special requests..."
                  rows="3"
                  class="w-full px-4 py-2 rounded-lg border"
                  :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
                ></textarea>
              </div>
            </div>

            <!-- Booking Summary -->
            <div class="rounded-lg p-4 mb-6" :style="{ backgroundColor: 'rgba(251, 191, 36, 0.1)', borderLeft: '4px solid var(--primary)' }">
              <h3 class="font-semibold mb-3" :style="{ color: 'var(--text-primary)' }">Booking Summary</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between" :style="{ color: 'var(--text-secondary)' }">
                  <span>Service:</span>
                  <span class="font-semibold" :style="{ color: 'var(--text-primary)' }">{{ selectedService?.name }}</span>
                </div>
                <div class="flex justify-between" :style="{ color: 'var(--text-secondary)' }">
                  <span>Date:</span>
                  <span class="font-semibold" :style="{ color: 'var(--text-primary)' }">{{ formatDate(form.appointmentDate) }}</span>
                </div>
                <div class="flex justify-between" :style="{ color: 'var(--text-secondary)' }">
                  <span>Time:</span>
                  <span class="font-semibold" :style="{ color: 'var(--text-primary)' }">{{ form.appointmentTime }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t" :style="{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }">
                  <span>Price:</span>
                  <span class="font-bold" :style="{ color: 'var(--primary)' }">₦{{ formatPrice(selectedService?.price) }}</span>
                </div>
              </div>
            </div>

            <div class="flex gap-4">
              <button
                @click="prevStep"
                class="flex-1 py-3 rounded-lg font-semibold border-2 transition-all"
                :style="{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }"
              >
                Back
              </button>
              <button
                @click="submitBooking"
                :disabled="submitting"
                class="flex-1 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
              >
                {{ submitting ? 'Booking...' : 'Book Appointment' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 4: Success -->
        <div v-if="currentStep === 3" class="animate-fadeIn">
          <div class="rounded-xl p-8 text-center" :style="{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '2px solid var(--success)' }">
            <div class="mb-4">
              <svg class="w-16 h-16 mx-auto" :style="{ color: 'var(--success)' }" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h2 class="text-3xl font-bold mb-2" :style="{ color: 'var(--success)' }">
              Booking Confirmed!
            </h2>
            <!-- <p class="mb-6" :style="{ color: 'var(--text-secondary)' }">
              Your appointment has been successfully booked. Check your email for confirmation.
            </p> -->

            <p class="mb-6" :style="{ color: 'var(--text-secondary)' }">
              Your appointment has been successfully booked. 
              <span v-if="selectedService.emailSent?.booking">
                Check your email for confirmation.
              </span>
              <span v-else>
                A confirmation email will be sent shortly.
              </span>
            </p>

            <div class="rounded-lg p-4 mb-6 text-left" :style="{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }">
              <h3 class="font-semibold mb-3" :style="{ color: 'var(--text-primary)' }">Appointment Details</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between" :style="{ color: 'var(--text-secondary)' }">
                  <span>Service:</span>
                  <span :style="{ color: 'var(--text-primary)' }">{{ selectedService?.name }}</span>
                </div>
                <div class="flex justify-between" :style="{ color: 'var(--text-secondary)' }">
                  <span>Date:</span>
                  <span :style="{ color: 'var(--text-primary)' }">{{ formatDate(form.appointmentDate) }}</span>
                </div>
                <div class="flex justify-between" :style="{ color: 'var(--text-secondary)' }">
                  <span>Time:</span>
                  <span :style="{ color: 'var(--text-primary)' }">{{ form.appointmentTime }}</span>
                </div>
                <div class="flex justify-between" :style="{ color: 'var(--text-secondary)' }">
                  <span>Name:</span>
                  <span :style="{ color: 'var(--text-primary)' }">{{ form.customerName }}</span>
                </div>
              </div>
            </div>

            <button
              @click="resetForm"
              class="px-6 py-3 rounded-lg font-semibold"
              :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../services/api'

export default {
  name: 'BookingForm',
  data() {
    return {
      steps: ['Service', 'Date & Time', 'Your Info', 'Confirmation'],
      currentStep: 0,
      services: [],
      availableSlots: [],
      loadingServices: false,
      loadingSlots: false,
      submitting: false,
      error: null,
      selectedService: null,
      form: {
        serviceId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
      },
      errors: {}
    }
  },

  computed: {
    minDate() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split('T')[0]
    }
  },

  methods: {
    async fetchServices() {
      this.loadingServices = true
      this.error = null
      try {
        const response = await api.get('/services')
        const data = response.data || response
        this.services = (data.services || data).filter(s => s.isActive) || []
      } catch (err) {
        console.error('Error fetching services:', err)
        this.error = 'Failed to load services. Please try again.'
      } finally {
        this.loadingServices = false
      }
    },

    async fetchAvailableSlots() {
      if (!this.form.appointmentDate || !this.selectedService) return

      this.loadingSlots = true
      try {
        const response = await api.get(`/appointments/available-slots/${this.selectedService._id}`, {
          params: { date: this.form.appointmentDate }
        })
        const data = response.data || response
        this.availableSlots = data.availableSlots || []
      } catch (err) {
        console.error('Error fetching slots:', err)
        this.availableSlots = []
      } finally {
        this.loadingSlots = false
      }
    },

    selectService(service) {
      this.selectedService = service
      this.form.serviceId = service._id
    },

    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.form.customerName || this.form.customerName.trim().length < 2) {
        this.errors.customerName = 'Name must be at least 2 characters'
        isValid = false
      }

      const phoneRegex = /^[0-9]{10,11}$/
      if (!this.form.customerPhone || !phoneRegex.test(this.form.customerPhone.replace(/\s/g, ''))) {
        this.errors.customerPhone = 'Please enter a valid phone number'
        isValid = false
      }

      const emailRegex = /\S+@\S+\.\S+/
      if (!this.form.customerEmail || !emailRegex.test(this.form.customerEmail)) {
        this.errors.customerEmail = 'Please enter a valid email'
        isValid = false
      }

      return isValid
    },

    async submitBooking() {
      if (!this.validateForm()) return

      this.submitting = true
      try {
        const payload = {
          serviceId: this.form.serviceId,
          customerName: this.form.customerName.trim(),
          customerPhone: this.form.customerPhone.trim(),
          customerEmail: this.form.customerEmail.trim().toLowerCase(),
          appointmentDate: this.form.appointmentDate,
          appointmentTime: this.form.appointmentTime,
          notes: this.form.notes?.trim() || ''
        }

        await api.post('/appointments', payload)
        this.currentStep = 3
      } catch (err) {
        console.error('Error booking appointment:', err)
        this.error = err.response?.data?.message || 'Failed to book appointment. Please try again.'
      } finally {
        this.submitting = false
      }
    },

    resetForm() {
      this.currentStep = 0
      this.selectedService = null
      this.form = {
        serviceId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
      }
      this.errors = {}
      this.availableSlots = []
    },

    formatPrice(price) {
      if (!price || isNaN(price)) return '0'
      return Number(price).toLocaleString()
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },

  mounted() {
    this.fetchServices()
  }
}
</script> 


<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>