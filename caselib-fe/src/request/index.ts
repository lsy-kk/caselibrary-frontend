import axios from 'axios'
import { useStore } from '@/store'
import {getToken} from '@/request/api/token'
import { ElMain, ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
    baseURL: "http://kkysl.free.svipss.top",
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
    const store = useStore()
    if (res.headers['session_time_out'] == 'timeout') {
        store.dispatch('logout')
    }
    if (res.status != 200){
        return Promise.reject();
    }
    if (res.data.code === '00000'){
        return res.data
    }
    ElMessage.error(res.data.msg)
    return Promise.reject(res.data)
},(error)=>{
    console.log(error);
})
// 把axios实例暴露出去
export default service
