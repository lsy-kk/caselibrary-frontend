import axios from 'axios'
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
        config.headers.token = localStorage.getItem('token') || ""
    }
    return config
})
// 响应拦截
service.interceptors.response.use((res)=>{
    const status:number = res.status
    if (status != 200){
        return Promise.reject();
    }
    return res.data
},(err)=>{
    console.log(err)
})
// 把axios实例暴露出去
export default service
