import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {store, key} from './store'
import './assets/base.css'
import 'tailwindcss/tailwind.css'
// 这是坑啊，引入Elmessage样式
import 'element-plus/es/components/message-box/style/index'
import 'element-plus/es/components/message/style/index'


const app = createApp(App)

app.use(router)
app.use(store, key)

app.mount('#app')
