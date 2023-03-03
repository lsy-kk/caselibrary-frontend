import axios from 'axios'
// 另一种，用来传输文件
const serviceFile = axios.create({
    baseURL: "http://kkysl.free.svipss.top",
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
    console.log(err)
})

// 上传图片
export function uploadImg(data: FormData){
    return serviceFile({
        url: "/case/uploadFile", 
        method: "post",
        data,
    })
}