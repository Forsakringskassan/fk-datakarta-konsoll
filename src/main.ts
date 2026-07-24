import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

import '@fkui/theme-default'
import '@fkui/design'

import './styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
