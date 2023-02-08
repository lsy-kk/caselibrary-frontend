// compiler-vue.d.ts
// 由于AxiosResponse上并没有自己规定返回的一些字段，因此ts会报错
import * as axios from 'axios'

declare module 'axios' {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>
    }
}