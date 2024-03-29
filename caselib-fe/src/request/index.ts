import axios from 'axios'
import { store } from '@/store'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000,
    headers:{
        "Content-Type": "application/json;charset=utf-8"
    }
})
// 请求拦截，即发送请求之前，对请求内容做的处理
service.interceptors.request.use((config)=>{
    config.headers = config.headers || {}
    if (localStorage.getItem('token')){
        config.headers['Authorization'] = localStorage.getItem('token') || ""
    }
    return config
})
// 响应拦截
service.interceptors.response.use((res)=>{
    //全局统一处理 Session超时
    if (res.headers['session_time_out'] == 'timeout') {
        store.dispatch('logout')
    }
    if (res.data.success){
        return res.data
    }
    ElMessage.error(res.data.msg)
    return Promise.reject(res.data)
},(error)=>{
    ElMessage({
        type: "error",
        showClose: true,
        message: "连接超时",
    })
    return Promise.reject('error')
})
// 把axios实例暴露出去
export default service
