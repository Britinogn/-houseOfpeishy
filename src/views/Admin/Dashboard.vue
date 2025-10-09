
<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
        <p class="text-[var(--text-secondary)] mt-2 text-sm sm:text-base">{{ welcomeMessage }}</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(59,130,246,0.1)] text-[var(--info)]">
          <Calendar class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Appointments</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.totalAppointments }}</p>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(16,185,129,0.1)] text-[var(--success)]">
          <Scissors class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Services</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.totalServices }}</p>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(251,191,36,0.1)] text-[var(--warning)]">
          <GalleryHorizontal class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Gallery Items</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.totalGalleryItems }}</p>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(239,68,68,0.1)] text-[var(--error)]">
          <UsersIcon class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Admins</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">{{ stats.totalAdmins }}</p>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(147,51,234,0.1)] text-[var(--purple)]">
          <Currency class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Revenue</h3>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] m-0">₦{{ stats.totalRevenue.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Appointments -->
    <div class="mt-6 sm:mt-8">
      <h2 class="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-4 sm:mb-6">Recent Appointments</h2>
      <div v-if="loading" class="flex flex-col items-center justify-center gap-4 p-8 sm:p-16 text-[var(--text-secondary)]">
        <LoadingSpinner />
        <p class="text-sm sm:text-base">Loading recent appointments...</p>
      </div>

      <!-- Mobile: Card-based list for better UX -->
      <div v-else-if="recentAppointments.length > 0" class="md:hidden">
        <div v-for="appointment in recentAppointments" :key="appointment._id" class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 sm:p-6 mb-4 last:mb-0 hover:bg-[var(--bg-secondary)]/50">
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-start">
              <div class="flex flex-col gap-1">
                <span class="font-medium text-[var(--text-primary)] text-sm">{{ formatDate(appointment.appointmentDate) }}</span>
                <span class="text-xs text-[var(--text-secondary)]">{{ appointment.appointmentTime }}</span>
              </div>
              <span class="text-[var(--primary)] font-semibold text-sm">₦{{ appointment.serviceId?.price?.toLocaleString() || 'N/A' }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-medium text-[var(--text-primary)] text-base">{{ appointment.customerName }}</span>
              <span class="text-[var(--primary)] font-medium text-sm">{{ appointment.serviceId?.name || 'N/A' }}</span>
              <span class="text-sm text-[var(--text-secondary)]/80">{{ appointment.serviceId?.category || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Desktop: Table layout -->
      <div v-if="recentAppointments.length > 0" class="hidden md:block">
        <div class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[600px] table-auto">
              <thead class="bg-[var(--bg-secondary)]">
                <tr>
                  <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Date & Time</th>
                  <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Customer</th>
                  <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Service</th>
                  <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Category</th>
                  <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--border-color)]">
                <tr v-for="appointment in recentAppointments" :key="appointment._id" class="hover:bg-[var(--bg-secondary)]/50">
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-col gap-1">
                      <span class="font-medium text-[var(--text-primary)] text-sm">{{ formatDate(appointment.appointmentDate) }}</span>
                      <span class="text-xs text-[var(--text-secondary)]">{{ appointment.appointmentTime }}</span>
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span class="font-medium text-[var(--text-primary)] text-sm">{{ appointment.customerName }}</span>
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span class="text-[var(--primary)] font-medium text-sm">{{ appointment.serviceId?.name || 'N/A' }}</span>
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span class="text-[var(--text-primary)] text-sm">{{ appointment.serviceId?.category || 'N/A' }}</span>
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span class="text-[var(--primary)] font-semibold text-sm">₦{{ appointment.serviceId?.price?.toLocaleString() || 'N/A' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div v-else class="flex flex-col items-center justify-center gap-4 p-8 sm:p-16 text-center text-[var(--text-secondary)]">
        <Calendar class="w-12 h-12 text-[var(--text-secondary)] opacity-50" />
        <p class="text-sm sm:text-base">No recent appointments found</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminDashboardAPI } from '../../services/adminDashboard';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import { UsersIcon, GalleryHorizontal, Calendar, Currency, Scissors } from 'lucide-vue-next';
// State
const stats = ref({
  totalAppointments: 0,
  totalServices: 0,
  totalGalleryItems: 0,
  totalAdmins: 0,
  totalRevenue: 0
});
const recentAppointments = ref([]);
const welcomeMessage = ref('');
const loading = ref(false);

// Fetch dashboard stats
const fetchDashboardStats = async () => {
  loading.value = true;
  try {
    const response = await adminDashboardAPI.getStats();
    stats.value = response.data || {
      totalAppointments: 0,
      totalServices: 0,
      totalGalleryItems: 0,
      totalAdmins: 0,
      totalRevenue: 0
    };
    recentAppointments.value = response.data.recentAppointments || [];
    welcomeMessage.value = response.message || 'Welcome to the Admin Dashboard';
  } catch (error) {
    console.error('Error fetching dashboard stats:', {
      message: error.message,
      status: error.response?.status,
    });
    alert(`Failed to load dashboard data: ${error.response?.message || error.message}`);
  } finally {
    loading.value = false;
  }
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchDashboardStats();
});
</script>