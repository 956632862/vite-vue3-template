import { createApp } from 'vue'
import App from './App.vue'

import router from './router/index'
import store from "./store/index"
import "@/styles/common.scss"
import globalEvent from  "./plugins/globalEvent"
const app = createApp(App)
app.use(router)
app.use(store)
app.use(globalEvent)
app.mount('#app')
