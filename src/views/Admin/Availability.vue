<!-- /src/views/admin/Availability.vue -->
<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Availability</h1>
        <p class="text-[var(--text-secondary)] mt-2 text-sm sm:text-base">Manage salon availability slots</p>
      </div>
      <button @click="openCreateModal" class="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all hover:bg-[var(--primary-hover)] hover:-translate-y-0.5">
        <Plus class="w-4 h-4" />
        <span>New Slot</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(16,185,129,0.1)] text-[var(--success)]">
          <CalendarCheck class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Slots</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.totalSlots }}</p>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(59,130,246,0.1)] text-[var(--info)]">
          <Clock class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Available</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.available }}</p>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(239,68,68,0.1)] text-[var(--error)]">
          <XCircle class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Booked</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.booked }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-[var(--text-primary)] mb-2">Day</label>
          <select v-model="filters.day" class="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
            <option value="">All Days</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
        <button @click="clearFilters" class="px-4 py-2 bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--text-primary)] rounded-lg font-medium transition-all whitespace-nowrap">
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 p-8 sm:p-16 text-[var(--text-secondary)]">
      <LoadingSpinner />
      <p class="text-sm sm:text-base">Loading availability...</p>
    </div>

    <!-- Availability Table (Desktop) -->
    <div v-else-if="filteredSlots.length > 0" class="hidden md:block">
      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead class="bg-[var(--bg-secondary)]">
              <tr>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Day</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Open Time</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Close Time</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Slot Duration</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Buffer Time</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              <tr v-for="slot in filteredSlots" :key="slot._id" class="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span class="font-medium text-[var(--text-primary)] text-sm">{{ slot.dayOfWeek }}</span>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span class="text-[var(--text-primary)] text-sm">{{ slot.openTime || 'N/A' }}</span>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span class="text-[var(--text-primary)] text-sm">{{ slot.closeTime || 'N/A' }}</span>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                    slot.isClosed ? 'bg-[rgba(239,68,68,0.1)] text-[var(--error)]' : 'bg-[rgba(16,185,129,0.1)] text-[var(--success)]'
                  ]">
                    {{ slot.isClosed ? 'Closed' : 'Open' }}
                  </span>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span class="text-[var(--text-primary)] text-sm">{{ slot.slotDuration }} min</span>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span class="text-[var(--text-primary)] text-sm">{{ slot.bufferTime }} min</span>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div class="flex gap-2">
                    <button @click="openEditModal(slot)" class="p-2 text-[var(--text-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] rounded transition-all cursor-pointer border-none" title="Edit">
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button @click="confirmDelete(slot)" class="p-2 text-[var(--text-secondary)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--error)] rounded transition-all cursor-pointer border-none" title="Delete">
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

    <!-- Availability Cards (Mobile) -->
    <div v-else-if="filteredSlots.length > 0" class="md:hidden space-y-4">
      <div v-for="slot in filteredSlots" :key="slot._id" class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 hover:bg-[var(--bg-secondary)]/50 transition-colors">
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-start">
            <span class="font-medium text-[var(--text-primary)] text-base">{{ slot.dayOfWeek }}</span>
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              slot.isClosed ? 'bg-[rgba(239,68,68,0.1)] text-[var(--error)]' : 'bg-[rgba(16,185,129,0.1)] text-[var(--success)]'
            ]">
              {{ slot.isClosed ? 'Closed' : 'Open' }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-[var(--text-secondary)] block">Open:</span>
              <span class="text-[var(--text-primary)]">{{ slot.openTime || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-[var(--text-secondary)] block">Close:</span>
              <span class="text-[var(--text-primary)]">{{ slot.closeTime || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-[var(--text-secondary)] block">Slot:</span>
              <span class="text-[var(--text-primary)]">{{ slot.slotDuration }} min</span>
            </div>
            <div>
              <span class="text-[var(--text-secondary)] block">Buffer:</span>
              <span class="text-[var(--text-primary)]">{{ slot.bufferTime }} min</span>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
            <button @click="openEditModal(slot)" class="p-2 text-[var(--text-secondary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] rounded transition-all cursor-pointer border-none" title="Edit">
              <Edit2 class="w-4 h-4" />
            </button>
            <button @click="confirmDelete(slot)" class="p-2 text-[var(--text-secondary)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--error)] rounded transition-all cursor-pointer border-none" title="Delete">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center gap-4 p-8 sm:p-16 text-center text-[var(--text-secondary)]">
      <Calendar class="w-12 h-12 opacity-50" />
      <p class="text-sm sm:text-base">No availability slots found</p>
      <button @click="openCreateModal" class="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all hover:bg-[var(--primary-hover)] hover:-translate-y-0.5">
        <Plus class="w-4 h-4" />
        <span>Create First Slot</span>
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <AvailabilityModal
      v-if="showModal"
      :slot="selectedSlot"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Delete Slot"
      :message="`Are you sure you want to delete the availability for ${slotToDelete?.dayOfWeek}?`"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { availabilityAPI } from '../../services/availability';
import AvailabilityModal from '../../components/AvailabilityModal.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
//import { Plus, Clock, CalendarCheck, XCircle, Calendar, Edit2, Trash2 } from 'lucide-vue-next';

// State
const slots = ref([]);
const loading = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const selectedSlot = ref(null);
const slotToDelete = ref(null);

const filters = ref({
  day: ''
});

// Computed
const stats = computed(() => {
  const total = slots.value.length;
  const available = slots.value.filter(s => !s.isClosed).length;
  const booked = total - available; // Assuming booked as closed/unavailable
  return { totalSlots: total, available, booked };
});

const filteredSlots = computed(() => {
  return slots.value.filter(slot => {
    if (filters.value.day && slot.dayOfWeek !== filters.value.day) return false;
    return true;
  });
});

// Methods
const fetchAvailability = async () => {
  loading.value = true;
  try {
    const response = await availabilityAPI.getWeekSchedule();
    slots.value = response.data?.schedule || [];
  } catch (error) {
    console.error('Error fetching availability:', error);
    alert('Failed to load availability');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  selectedSlot.value = null;
  showModal.value = true;
};

const openEditModal = (slot) => {
  selectedSlot.value = { ...slot };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedSlot.value = null;
};

const handleSave = async () => {
  await fetchAvailability();
  closeModal();
};

const confirmDelete = (slot) => {
  slotToDelete.value = slot;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    await availabilityAPI.deleteAvailability(slotToDelete.value._id);
    await fetchAvailability();
    showDeleteModal.value = false;
    slotToDelete.value = null;
  } catch (error) {
    console.error('Error deleting slot:', error);
    alert('Failed to delete slot');
  }
};

const clearFilters = () => {
  filters.value.day = '';
};

onMounted(() => {
  fetchAvailability();
});
</script>