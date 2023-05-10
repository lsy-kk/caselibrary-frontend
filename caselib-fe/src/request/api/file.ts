import axios from 'axios'
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
        config.headers.token = localStorage.getItem('token') || ""
    }
    return config
})
// 响应拦截
serviceFile.interceptors.response.use((res)=>{
    const status:number = res.status
    if (status != 200){
        return Promise.reject();
    }
    return res.data
},(err)=>{
    // console.log(err)
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
