<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Edit Service' : 'Create New Service' }}</h2>
        <button @click="$emit('close')" class="close-btn">
          <CloseIcon />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Name -->
        <div class="form-group">
          <label>Service Name *</label>
          <input 
            v-model="form.name" 
            type="text" 
            placeholder="e.g., Hair Braiding"
            required
          />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>

        <!-- Category -->
        <div class="form-group">
          <label>Category *</label>
          <select v-model="form.category" required>
            <option value="">Select a category</option>
            <option value="Beauty Treatment">Beauty Treatment</option>
            <option value="Hair Styling">Hair Styling</option>
            <option value="Braid Style">Braid Style</option>
            <option value="Wig Making">Wig Making</option>
            <option value="Hair Sales">Hair Sales</option>
          </select>
          <span v-if="errors.category" class="error">{{ errors.category }}</span>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label>Description *</label>
          <textarea 
            v-model="form.description" 
            rows="4"
            placeholder="Describe the service..."
            required
          ></textarea>
          <span v-if="errors.description" class="error">{{ errors.description }}</span>
        </div>

        <!-- Price -->
        <div class="form-group">
          <label>Price (₦) *</label>
          <input 
            v-model.number="form.price" 
            type="number" 
            min="0"
            step="0.01"
            placeholder="0.00"
            required
          />
          <span v-if="errors.price" class="error">{{ errors.price }}</span>
        </div>

        <!-- Duration (for services only) -->
        <div v-if="!form.isProduct" class="form-group">
          <label>Duration (minutes)</label>
          <input 
            v-model.number="form.duration" 
            type="number" 
            min="0"
            placeholder="e.g., 60"
          />
        </div>

        <!-- Is Product Toggle -->
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.isProduct" />
            <span>This is a product (not a service)</span>
          </label>
        </div>

        <!-- Stock Quantity (for products only) -->
        <div v-if="form.isProduct" class="form-group">
          <label>Stock Quantity</label>
          <input 
            v-model.number="form.stockQuantity" 
            type="number" 
            min="0"
            placeholder="e.g., 50"
          />
        </div>

        <!-- Is Active Toggle -->
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.isActive" />
            <span>Active (visible to customers)</span>
          </label>
        </div>

        <!-- Image Upload -->
        <div class="form-group">
          <label>Cover Image</label>
          <div class="image-upload">
            <input 
              type="file" 
              accept="image/*"
              @change="handleImageChange"
              ref="fileInput"
              hidden
            />
            
            <!-- Preview -->
            <div v-if="imagePreview || form.coverImage?.url" class="image-preview">
              <img :src="imagePreview || form.coverImage?.url" alt="Preview" />
              <button type="button" @click="removeImage" class="remove-image-btn">
                <TrashIcon />
              </button>
            </div>

            <!-- Upload Button -->
            <button 
              v-else
              type="button" 
              @click="$refs.fileInput.click()" 
              class="upload-btn"
            >
              <UploadIcon />
              <span>Choose Image</span>
            </button>
          </div>
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
            <span v-else>{{ isEditMode ? 'Update' : 'Create' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { servicesAPI } from '../services/services'
import LoadingSpinner from './LoadingSpinner.vue'

// Props
const props = defineProps({
  service: {
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
const TrashIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
}
const UploadIcon = {
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'
}

// State
const isEditMode = computed(() => !!props.service)
const loading = ref(false)
const error = ref('')
const errors = ref({})
const imageFile = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

const form = ref({
  name: '',
  category: '',
  description: '',
  price: 0,
  duration: null,
  isProduct: false,
  stockQuantity: null,
  isActive: true,
  coverImage: null
})

// Initialize form with existing service data
if (props.service) {
  form.value = {
    name: props.service.name,
    category: props.service.category,
    description: props.service.description,
    price: props.service.price,
    duration: props.service.duration,
    isProduct: props.service.isProduct || false,
    stockQuantity: props.service.stockQuantity,
    isActive: props.service.isActive !== undefined ? props.service.isActive : true,
    coverImage: props.service.coverImage
  }
}

// Watch isProduct toggle
watch(() => form.value.isProduct, (isProduct) => {
  if (isProduct) {
    form.value.duration = null
  } else {
    form.value.stockQuantity = null
  }
})

// Methods
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
  form.value.coverImage = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.name || form.value.name.trim().length < 3) {
    errors.value.name = 'Service name must be at least 3 characters'
    isValid = false
  }

  if (!form.value.category) {
    errors.value.category = 'Please select a category'
    isValid = false
  }

  if (!form.value.description || form.value.description.trim().length < 10) {
    errors.value.description = 'Description must be at least 10 characters'
    isValid = false
  }

  if (form.value.price <= 0) {
    errors.value.price = 'Price must be greater than 0'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('category', form.value.category)
    formData.append('description', form.value.description)
    formData.append('price', form.value.price)
    formData.append('isActive', form.value.isActive)
    formData.append('isProduct', form.value.isProduct)

    if (form.value.duration) {
      formData.append('duration', form.value.duration)
    }

    if (form.value.stockQuantity !== null) {
      formData.append('stockQuantity', form.value.stockQuantity)
    }

    // Add image with correct field name (matches backend)
    if (imageFile.value) {
      formData.append('coverImage', imageFile.value)  // ← CHANGED FROM 'image'
    }

    let response
    if (isEditMode.value) {
      response = await servicesAPI.update(props.service._id, formData)
    } else {
      response = await servicesAPI.create(formData)
    }

    emit('save', response)
  } catch (err) {
    console.error('Error saving service:', err)
    error.value = err.message || 'Failed to save service. Please try again.'
  } finally {
    loading.value = false
  }
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

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-group input[type="text"],
.form-group input[type="number"],
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
  min-height: 100px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
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

/* Image Upload */
.image-upload {
  margin-top: 0.5rem;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid var(--border-color);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: var(--error);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  background-color: #dc2626;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 2rem;
  border: 2px dashed var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
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
  min-width: 100px;
  justify-content: center;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>