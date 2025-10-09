import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/styles/theme.css'
import router from './routes'

//createApp(App).mount('#app')
createApp(App).use(router).mount('#app')
