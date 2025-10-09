<template>
  <section class="contact" id="contact">
    <div class="max-w-2xl mx-auto  px-4 py-16 lg:py-24 text-center">
      <h1 class="text-4xl lg:text-5xl font-bold mb-4" :style="{ color: 'var(--text-primary)' }">Contact</h1>
      <p class="text-lg mb-2" :style="{ color: 'var(--text-secondary)' }">Have a question or want to work together?</p>
      <p class="p2 text-2xl font-semibold mb-12">Let's Make It Happen!</p>

      <form @submit.prevent="submitForm" class="space-y-6 var(  --shadow) py-15 px-10 bg-[var(--text-primary)] rounded-2xl ">
        <div class="flex flex-col sm:flex-row gap-4">
          <input
            v-model="form.name"
            type="text"
            placeholder="Name"
            required
            class="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
          />
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
            class="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
          />
        </div>

        <textarea
          v-model="form.message"
          placeholder="Message"
          rows="6"
          required
          class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
          :style="{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
        ></textarea>

        <button 
          type="submit" 
          class="w-full px-8 py-4 cursor-pointer rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          :style="{ backgroundColor: 'var(--primary)', color: 'var(--bg-secondary)' }"
        >
          Send Message
        </button>
      </form>

      <!-- success message -->
      <transition name="fade">
        <p v-if="submitted" class="mt-6 px-4 py-3 rounded-lg font-medium" :style="{ backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)', color: 'var(--success)' }">
          ✅ Message ready to send via email — opening mail client...
        </p>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const submitted = ref(false)

const submitForm = () => {
  if (!form.value.name || !form.value.email || !form.value.message) return

  const subject = encodeURIComponent(`Message from ${form.value.name}`)
  const body = encodeURIComponent(`Name: ${form.value.name}\nEmail: ${form.value.email}\n\n${form.value.message}`)

  window.location.href = `mailto:Smileypeishy1@gmail.com?subject=${subject}&body=${body}`

  submitted.value = true

  setTimeout(() => {
    submitted.value = false
  }, 3000)
}
</script>

<style scoped>
/* Fade transition for success message */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.contact {
  background-color: var(--bg-primary);
}
</style>