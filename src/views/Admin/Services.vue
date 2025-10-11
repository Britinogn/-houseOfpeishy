<template>
  <div class="services-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="text-3xl font-bold text-text-primary">Services Management</h1>
        <p class="text-text-secondary mt-2">Manage your salon services and products</p>
      </div>
      <button @click="openCreateModal" class="btn-primary">
        <PlusIcon />
        <span>Add Service</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-group">
        <label>Category</label>
        <select v-model="filters.category" class="filter-select">
          <option value="">All Categories</option>
          <option value="Beauty Treatment">Beauty Treatment</option>
          <option value="Hair Styling">Hair Styling</option>
          <option value="Braid Style">Braid Style</option>
          <option value="Wig Making">Wig Making</option>
          <option value="Hair Sales">Hair Sales</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Type</label>
        <select v-model="filters.type" class="filter-select">
          <option value="">All Types</option>
          <option value="service">Services Only</option>
          <option value="product">Products Only</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Status</label>
        <select v-model="filters.status" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <LoadingSpinner />
      <p>Loading services...</p>
    </div>

    <!-- Services Grid -->
    <div v-else-if="filteredServices.length > 0" class="services-grid">
      <div v-for="service in filteredServices" :key="service._id" class="service-card">
        <!-- Image -->
        <div class="service-image">
          <img 
            :src="service.coverImage?.url || 'https://via.placeholder.com/300x200?text=No+Image'" 
            :alt="service.name"
          />
          <span v-if="!service.isActive" class="inactive-badge">Inactive</span>
          <span v-if="service.isProduct" class="product-badge">Product</span>
        </div>

        <!-- Content -->
        <div class="service-content">
          <h3 class="service-name">{{ service.name }}</h3>
          <p class="service-category">{{ service.category }}</p>
          <p class="service-description">{{ service.description }}</p>

          <div class="service-meta">
            <span class="service-price">₦{{ service.price.toLocaleString() }}</span>
            <span v-if="service.duration" class="service-duration">{{ service.duration }} mins</span>
            <span v-if="service.isProduct && service.stockQuantity !== null" class="service-stock">
              Stock: {{ service.stockQuantity }}
            </span>
          </div>

          <!-- Actions -->
          <div class="service-actions">
            <button @click="openEditModal(service)" class="btn-edit">
              <EditIcon />
              Edit
            </button>
            <button @click="confirmDelete(service)" class="btn-delete">
              <TrashIcon />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>No services found</p>
      <button @click="openCreateModal" class="btn-primary">Add Your First Service</button>
    </div>

    <!-- Create/Edit Modal -->
    <ServiceModal
      v-if="showModal"
      :service="selectedService"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Delete Service"
      :message="`Are you sure you want to delete '${serviceToDelete?.name}'? This action cannot be undone.`"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { servicesAPI } from '../../services/services'
import ServiceModal from '../../components/ServiceModal.vue'
import ConfirmModal from '../../components/ConfirmModal.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { PlusIcon, TrashIcon, EditIcon}from 'lucide-vue-next'

// Icons
// const PlusIcon = {
//   template: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
// }
// const EditIcon = {
//   template: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
// }
// const TrashIcon = {
//   template: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
// }

// State
const services = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedService = ref(null)
const serviceToDelete = ref(null)

const filters = ref({
  category: '',
  type: '',
  status: ''
})

// Computed
const filteredServices = computed(() => {
  return services.value.filter(service => {
    // Category filter
    if (filters.value.category && service.category !== filters.value.category) {
      return false
    }

    // Type filter
    if (filters.value.type === 'service' && service.isProduct) return false
    if (filters.value.type === 'product' && !service.isProduct) return false

    // Status filter
    if (filters.value.status === 'active' && !service.isActive) return false
    if (filters.value.status === 'inactive' && service.isActive) return false

    return true
  })
})

// Methods
const fetchServices = async () => {
  loading.value = true
  try {
    const data = await servicesAPI.getAll()
    services.value = data.services || data
  } catch (error) {
    console.error('Error fetching services:', error)
    alert('Failed to load services')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedService.value = null
  showModal.value = true
}

const openEditModal = (service) => {
  selectedService.value = service
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedService.value = null
}

const handleSave = async (serviceData) => {
  await fetchServices() // Refresh list
  closeModal()
}

const confirmDelete = (service) => {
  serviceToDelete.value = service
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await servicesAPI.delete(serviceToDelete.value._id)
    services.value = services.value.filter(s => s._id !== serviceToDelete.value._id)
    showDeleteModal.value = false
    serviceToDelete.value = null
  } catch (error) {
    console.error('Error deleting service:', error)
    alert('Failed to delete service')
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.services-page {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

/* Filters */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem;
  color: var(--text-secondary);
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px var(--shadow);
}

.service-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--bg-secondary);
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inactive-badge,
.product-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.inactive-badge {
  background-color: var(--error);
}

.product-badge {
  background-color: var(--info);
  top: 2.75rem;
}

.service-content {
  padding: 1.25rem;
}

.service-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.service-category {
  font-size: 0.875rem;
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.service-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.service-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.service-duration,
.service-stock {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.service-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-edit,
.btn-delete {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background-color: var(--secondary);
  color: var(--text-primary);
}

.btn-edit:hover {
  background-color: var(--secondary-hover);
}

.btn-delete {
  background-color: transparent;
  color: var(--error);
  border: 1px solid var(--error);
}

.btn-delete:hover {
  background-color: var(--error);
  color: white;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem;
  text-align: center;
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>