import axios from 'axios'
import { store } from '@/store'
import { ElMessage } from 'element-plus'
import service from '..'

// 另一种，用来传输文件
const serviceFile = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000,
    headers:{
        "Content-Type": "multipart/form-data;charset=utf-8"
    }
})
// 请求拦截，即发送请求之前，对请求内容做的处理
serviceFile.interceptors.request.use((config)=>{
    config.headers = config.headers || {}
    if (localStorage.getItem('token')){
        config.headers['Authorization'] = localStorage.getItem('token') || ""
    }
    return config
})
// 响应拦截
serviceFile.interceptors.response.use((res)=>{
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

// 上传文件
export function uploadFile(data: FormData){
    return serviceFile({
        url: "/file/uploadFile", 
        method: "post",
        data,
    })
}

// 删除云存储器中文件
export function deleteFile(data: String){
    return service({
        url: "/file/deleteFile", 
        method: "get",
        params:{
            path: data,
        }
    })
}
