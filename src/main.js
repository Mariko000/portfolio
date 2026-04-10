import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import '@vue-flow/core/dist/style.css'





import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './assets/style.css';


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)


app.mount('#app')

// ↓ これ追加
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(
        import.meta.env.BASE_URL + 'sw.js'
      )
    })
  }
