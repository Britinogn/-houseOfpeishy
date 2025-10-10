<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Appointments</h1>
        <p class="text-[var(--text-secondary)] mt-2 text-sm sm:text-base">Manage customer bookings</p>
      </div>
      <button @click="openCreateModal" class="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all hover:bg-[var(--primary-hover)] hover:-translate-y-0.5">
        <Plus class="w-4 h-4" />
        <span>New Appointment</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(251,191,36,0.1)] text-[var(--warning)]">
          <Clock class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Pending</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.pending }}</p>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(59,130,246,0.1)] text-[var(--info)]">
          <CheckCircle class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Confirmed</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.confirmed }}</p>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(16,185,129,0.1)] text-[var(--success)]">
          <CalendarCheck class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Completed</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.completed }}</p>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(239,68,68,0.1)] text-[var(--error)]">
          <XCircle class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Cancelled</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.cancelled }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8 flex-wrap items-end">
      <div class="flex-1 min-w-0">
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Status</label>
        <select v-model="filters.status" class="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div class="flex-1 min-w-0">
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Date</label>
        <input 
          v-model="filters.date" 
          type="date" 
          class="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm"
        />
      </div>

      <div class="flex-1 min-w-0">
        <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">Search</label>
        <input 
          v-model="filters.search" 
          type="text" 
          placeholder="Search by name, phone, email..."
          class="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm"
        />
      </div>

      <button @click="clearFilters" class="px-4 py-2 bg-[var(--secondary)] text-[var(--text-primary)] rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-[var(--secondary-hover)] whitespace-nowrap border-none">
        Clear Filters
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 p-8 sm:p-16 text-[var(--text-secondary)]">
      <LoadingSpinner />
      <p class="text-sm sm:text-base">Loading appointments...</p>
    </div>

    <!-- Appointments Table (Desktop) -->
    <div v-if="filteredAppointments.length > 0 && !loading" class="hidden md:block">
      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead class="bg-[var(--bg-secondary)]">
              <tr>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-32">Date & Time</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-48">Customer</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-48">Service</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-32">Status</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-64">Contact</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              <tr v-for="appointment in filteredAppointments" :key="appointment._id" class="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                <!-- Date & Time -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col gap-1">
                    <span class="font-medium text-[var(--text-primary)] text-sm">{{ formatDate(appointment.appointmentDate) }}</span>
                    <span class="text-xs text-[var(--text-secondary)]">{{ appointment.appointmentTime }}</span>
                  </div>
                </td>

                <!-- Customer -->
                <td class="px-4 sm:px-6 py-4">
                  <span class="font-medium text-[var(--text-primary)] text-sm block">{{ appointment.customerName }}</span>
                </td>

                <!-- Service -->
                <td class="px-4 sm:px-6 py-4">
                  <span class="text-[var(--primary)] font-medium text-sm block">{{ appointment.serviceId?.name || 'N/A' }}</span>
                </td>

                <!-- Status -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <select 
                    :value="appointment.status" 
                    @change="updateStatus(appointment._id, $event.target.value)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-[var(--border-color)] cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    :class="{
                      'bg-[rgba(251,191,36,0.1)] text-[var(--warning)] border-[rgba(251,191,36,0.2)]': appointment.status === 'pending',
                      'bg-[rgba(59,130,246,0.1)] text-[var(--info)] border-[rgba(59,130,246,0.2)]': appointment.status === 'confirmed',
                      'bg-[rgba(16,185,129,0.1)] text-[var(--success)] border-[rgba(16,185,129,0.2)]': appointment.status === 'completed',
                      'bg-[rgba(239,68,68,0.1)] text-[var(--error)] border-[rgba(239,68,68,0.2)]': appointment.status === 'cancelled'
                    }"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <!-- Contact -->
                <td class="px-4 sm:px-6 py-4 max-w-xs">
                  <div class="flex flex-col gap-1 text-sm">
                    <a :href="`tel:${appointment.customerPhone}`" class="text-[var(--primary)] no-underline hover:underline block truncate">
                      {{ appointment.customerPhone }}
                    </a>
                    <a :href="`mailto:${appointment.customerEmail}`" class="text-[var(--primary)] no-underline hover:underline block truncate">
                      {{ appointment.customerEmail }}
                    </a>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div class="flex gap-1">
                    <button @click="viewDetails(appointment)" class="p-2 text-[var(--text-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] rounded transition-all cursor-pointer border-none" title="View Details">
                      <Eye class="w-4 h-4" />
                    </button>
                    <button @click="openEditModal(appointment)" class="p-2 text-[var(--text-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] rounded transition-all cursor-pointer border-none" title="Edit">
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button @click="confirmDelete(appointment)" class="p-2 text-[var(--text-secondary)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--error)] rounded transition-all cursor-pointer border-none" title="Delete">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Appointments Cards (Mobile) -->
    <div v-if="filteredAppointments.length > 0 && !loading" class="md:hidden space-y-4">
      <div v-for="appointment in filteredAppointments" :key="appointment._id" class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 hover:bg-[var(--bg-secondary)]/50 transition-colors">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-start">
            <div class="flex flex-col gap-1 flex-1">
              <span class="font-medium text-[var(--text-primary)] text-sm">{{ formatDate(appointment.appointmentDate) }}</span>
              <span class="text-xs text-[var(--text-secondary)]">{{ appointment.appointmentTime }}</span>
            </div>
            <select 
              :value="appointment.status" 
              @change="updateStatus(appointment._id, $event.target.value)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-[var(--border-color)] cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 self-start"
              :class="{
                'bg-[rgba(251,191,36,0.1)] text-[var(--warning)] border-[rgba(251,191,36,0.2)]': appointment.status === 'pending',
                'bg-[rgba(59,130,246,0.1)] text-[var(--info)] border-[rgba(59,130,246,0.2)]': appointment.status === 'confirmed',
                'bg-[rgba(16,185,129,0.1)] text-[var(--success)] border-[rgba(16,185,129,0.2)]': appointment.status === 'completed',
                'bg-[rgba(239,68,68,0.1)] text-[var(--error)] border-[rgba(239,68,68,0.2)]': appointment.status === 'cancelled'
              }"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="flex flex-col gap-2 pt-2">
            <div class="flex justify-between items-center">
              <span class="font-medium text-[var(--text-primary)] text-base">{{ appointment.customerName }}</span>
              <span class="text-[var(--primary)] font-medium text-sm">{{ appointment.serviceId?.name || 'N/A' }}</span>
            </div>
            <div class="flex flex-col gap-1 text-sm">
              <a :href="`tel:${appointment.customerPhone}`" class="text-[var(--primary)] no-underline hover:underline">Phone: {{ appointment.customerPhone }}</a>
              <a :href="`mailto:${appointment.customerEmail}`" class="text-[var(--primary)] no-underline hover:underline">Email: {{ appointment.customerEmail }}</a>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
            <button @click="viewDetails(appointment)" class="p-2 text-[var(--text-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] rounded transition-all cursor-pointer border-none" title="View Details">
              <Eye class="w-4 h-4" />
            </button>
            <button @click="openEditModal(appointment)" class="p-2 text-[var(--text-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] rounded transition-all cursor-pointer border-none" title="Edit">
              <Edit2 class="w-4 h-4" />
            </button>
            <button @click="confirmDelete(appointment)" class="p-2 text-[var(--text-secondary)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--error)] rounded transition-all cursor-pointer border-none" title="Delete">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="flex flex-col items-center justify-center gap-4 p-8 sm:p-16 text-center text-[var(--text-secondary)]">
      <Calendar class="w-12 h-12 text-[var(--text-secondary)] opacity-50" />
      <p class="text-sm sm:text-base">No appointments found</p>
      <button @click="openCreateModal" class="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all hover:bg-[var(--primary-hover)] hover:-translate-y-0.5">
        <Plus class="w-4 h-4" />
        <span>Book First Appointment</span>
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <AppointmentModal
      v-if="showModal"
      :appointment="selectedAppointment"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Details Modal -->
    <AppointmentDetailsModal
      v-if="showDetailsModal"
      :appointment="selectedAppointment"
      @close="showDetailsModal = false"
      @edit="openEditFromDetails"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Delete Appointment"
      :message="`Are you sure you want to delete the appointment for ${appointmentToDelete?.customerName}?`"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { appointmentsAPI } from '../../services/appointments'
import AppointmentModal from '../../components/AppointmentModal.vue'
import AppointmentDetailsModal from '../../components/AppointmentDetailsModal.vue'
import ConfirmModal from '../../components/ConfirmModal.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { Plus, Clock, CheckCircle, CalendarCheck, XCircle, Eye, Edit2, Trash2, Calendar } from 'lucide-vue-next'
// Icons

// State
const appointments = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const selectedAppointment = ref(null)
const appointmentToDelete = ref(null)

const filters = ref({
  status: '',
  date: '',
  search: ''
})

// Computed
const stats = computed(() => {
  return {
    pending: appointments.value.filter(a => a.status === 'pending').length,
    confirmed: appointments.value.filter(a => a.status === 'confirmed').length,
    completed: appointments.value.filter(a => a.status === 'completed').length,
    cancelled: appointments.value.filter(a => a.status === 'cancelled').length
  }
})

const filteredAppointments = computed(() => {
  return appointments.value.filter(appointment => {
    // Status filter
    if (filters.value.status && appointment.status !== filters.value.status) {
      return false
    }

    // Date filter
    if (filters.value.date) {
      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0]
      if (appointmentDate !== filters.value.date) {
        return false
      }
    }

    // Search filter
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      const matchesName = appointment.customerName.toLowerCase().includes(search)
      const matchesPhone = appointment.customerPhone.includes(search)
      const matchesEmail = appointment.customerEmail.toLowerCase().includes(search)
      
      if (!matchesName && !matchesPhone && !matchesEmail) {
        return false
      }
    }

    return true
  })
})

// Methods
const fetchAppointments = async () => {
  loading.value = true
  try {
    const data = await appointmentsAPI.getAll()
    appointments.value = data.appointments || data
  } catch (error) {
    console.error('Error fetching appointments:', error)
    alert('Failed to load appointments')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedAppointment.value = null
  showModal.value = true
}

const openEditModal = (appointment) => {
  selectedAppointment.value = appointment
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedAppointment.value = null
}

const handleSave = async () => {
  await fetchAppointments()
  closeModal()
}

const viewDetails = (appointment) => {
  selectedAppointment.value = appointment
  showDetailsModal.value = true
}

const openEditFromDetails = () => {
  showDetailsModal.value = false
  showModal.value = true
}

const updateStatus = async (id, newStatus) => {
  try {
    await appointmentsAPI.updateStatus(id, newStatus)
    const appointment = appointments.value.find(a => a._id === id)
    if (appointment) {
      appointment.status = newStatus
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Failed to update status')
  }
}

const confirmDelete = (appointment) => {
  appointmentToDelete.value = appointment
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await appointmentsAPI.delete(appointmentToDelete.value._id)
    appointments.value = appointments.value.filter(a => a._id !== appointmentToDelete.value._id)
    showDeleteModal.value = false
    appointmentToDelete.value = null
  } catch (error) {
    console.error('Error deleting appointment:', error)
    alert('Failed to delete appointment')
  }
}

const clearFilters = () => {
  filters.value = {
    status: '',
    date: '',
    search: ''
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchAppointments()
})
</script>