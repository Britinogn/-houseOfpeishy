<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2 class="text-2xl font-bold text-primary">House of Peishy</h2>
        <p class="brand-subtitle text-secondary text-sm mt-1">Admin Panel</p>
        <p class="login-subtitle">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Email Input -->
        <div class="input-group">
          <label for="email" class="input-label">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            class="input-field"
            :class="{ 'input-error': errors.email }"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Password Input -->
        <div class="input-group">
          <label for="password" class="input-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            class="input-field"
            :class="{ 'input-error': errors.password }"
            required
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          <span v-else>Sign In</span>
        </button>

        <!-- Forgot Password Link -->
        <!-- <div class="login-footer">
          <router-link to="/forgot-password" class="forgot-link">Forgot Password?</router-link>
        </div> -->
      </form>

      <!-- Error Alert -->
      <div v-if="error" class="error-alert">
        {{ error }}
      </div>
    </div>
  </div>
</template>


<script>
import api from '../services/api'
import { useRouter } from 'vue-router'
import { setToken, setAdmin } from '../services/auth'

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {
        email: '',
        password: ''
      },
      error: '',
      isLoading: false
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    validateForm() {
      let isValid = true
      this.errors = { email: '', password: '' }

      if (!this.form.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = 'Email is invalid'
        isValid = false
      }

      if (!this.form.password) {
        this.errors.password = 'Password is required'
        isValid = false
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
        isValid = false
      }

      return isValid
    },
    async handleSubmit() {
      if (!this.validateForm()) return
      
      this.error = ''
      this.isLoading = true
      

      try {
        // Use api for login request
        const res = await api.post('/auth/login', this.form);
        
        // Use imported helpers to set token and admin
        const token = res.token;

        //const token = res.data.token;
        setToken(token);
        setAdmin({
            id: res.id,
            username: res.username || this.form.username,
            email: res.email || this.form.email,
            role: res.role || this.form.role
        });

        // setToken(response.data.token)
        // setAdmin(response.data.admin)
        
        // Or use the login helper if it wraps the above
        // await login(this.form)
        
        this.router.push('/admin/dashboard') // Redirect to admin dashboard
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Invalid credentials. Please try again.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: var(--bg-primary);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: var(--bg-secondary);
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px var(--shadow), 0 2px 4px -1px var(--shadow);
  border: 1px solid var(--border-color);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  margin: 0 0 0.5rem 0;
  color: var(--primary);
}

.login-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.input-field {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
}

.input-field::placeholder {
  color: var(--text-secondary);
}

.input-error {
  border-color: var(--error);
}

.error-message {
  color: var(--error);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.submit-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-footer {
  text-align: center;
}

.forgot-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: var(--primary);
}

.error-alert {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error);
  color: var(--error);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
}

/* Mobile */
@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
}
</style>