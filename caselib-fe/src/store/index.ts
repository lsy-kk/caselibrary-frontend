import { createStore, useStore as baseUseStore, Store } from 'vuex'
import type { InjectionKey } from 'vue'
import { login, logout, reLogin, loginByEmailCode } from '@/request/api/login'
import { getUserVoByToken } from '@/request/api/user'
import { getToken, setToken, removeToken } from '@/request/api/token'
import userImg from '@/assets/image/user.png';
import { ElMessage, ElNotification } from 'element-plus'
import { INoticeVo } from '@/type/notice'
export interface IState{
    id: number,
    email: string,
    username: string,
    image: string,
    authority: number,
    token: string,
    // ws相关
    noticeList: INoticeVo[],
    webSocket?: WebSocket,
    isConnect: boolean,
    timer: number,
}
type Modules = {
}
// 定义injectKey
export const key: InjectionKey<Store<IState & Modules>> = Symbol()
// 暴露新实例，main.ts中挂载到vue实例
export const store = createStore<IState>({
    // state存储参数
    state: {
        id: -1,
        email: '',
        username: '',
        image: userImg,
        authority: -1,
        token: getToken(),
        // websocket相关
        noticeList: [],
        isConnect: false,
        timer: 0,
    },
    // 通过getter对state状态进行筛选（例如过滤、计数），类似于计算属性
    // 通过mutations改变state状态，必须是同步的操作
    mutations: {
        setId(state, id){
            state.id = id
        },
        setEmail(state, email) {
            state.email = email
        },
        setUsername(state, username){
            state.username = username
        },
        setImage(state, image) {
            state.image = image
        },
        setAuthority(state, authority) {
            state.authority = authority
        },
        setToken(state, token){
            state.token = token
        },
        // websocket连接初始化，rootState：使用其他模块
        initWebsocket(state) {
            // 连接的ws地址
            state.webSocket = new WebSocket(import.meta.env.VITE_BASE_WS_URL+'/notice/'+ state.id)
            // 建立连接
            state.webSocket.onopen = function () {
                // 连接成功
                // console.log('通讯开始')
                state.isConnect = true
                // 心跳，防止ws协议自动断联
                   state.timer = window.setInterval(() => {
                        if (state.webSocket !== undefined){
                            state.webSocket.send('1')
                        }}, 1000 * 60)
            }
            //接收服务端消息
            state.webSocket.onmessage = function (e){
                // 收到消息时回调函数
                // // console.log('收到的数据：', e.data)
                let noticeVo: INoticeVo = JSON.parse(e.data)
                ElMessage.info("收到新消息，请前往消息系统查看")
                state.noticeList.push(noticeVo)
            }
            // 通讯异常处理
            state.webSocket.onerror = function () {
                state.isConnect = false
                clearInterval(state.timer)
                // console.log('通讯异常')
            }
            state.webSocket.onclose = function (){
                state.isConnect = false
                clearInterval(state.timer)
                state.webSocket = new WebSocket(import.meta.env.VITE_BASE_WS_URL+'/notice/'+ state.id)
                // console.log('连接断开')
            }
            //关闭连接时的回调函数
            state.webSocket.close = function () { 
                state.isConnect = false
                clearInterval(state.timer)
                // console.log('连接已断开')
            }
        },
        // 关闭websocket连接
        websocketClose(state) {
            state.isConnect = false
            // 不再发送心跳信号
            clearInterval(state.timer)
        },
        clearNotice(state) {
            state.noticeList = []
        },
    },
    // action提交mutations方法，但不同的是可以执行异步操作
    actions: {
        login({commit}, user){
            return new Promise((resolve, reject) => {
                login(user).then((res)=>{
                    if (res.success){
                        // 保存用户信息及token
                        commit('setToken', res.data)
                        setToken(res.data)
                        resolve(res.msg)
                    }
                    else {
                        reject(res.msg)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 根据前端token，获取用户信息
        getUserVoByToken({commit}){
            return new Promise((resolve, reject) => {
                getUserVoByToken().then((res) => { 
                    if (res.success){
                        // 保存用户信息
                        commit('setId', res.data.id)
                        commit('setEmail', res.data.email)
                        commit('setUsername', res.data.username)
                        commit('setImage', res.data.image)
                        commit('setAuthority', res.data.authority)
                        // 开启websocket连接
                        commit('initWebsocket')
                        
                        resolve(res.msg)
                    }
                    else {
                        // 后端token失效，变为未登录状态
                        commit('setId', -1)
                        commit('setEmail', '')
                        commit('setUsername', '')
                        commit('setImage', userImg)
                        commit('setAuthority', -1)
                        commit('setToken', '')
                        removeToken()
                        // 关闭websocket连接
                        store.commit('websocketClose')
                        resolve(res.msg)
                    }
                }).catch(error => {
                    commit('setId', -1)
                    commit('setEmail', '')
                    commit('setUsername', '')
                    commit('setImage', userImg)
                    commit('setAuthority', -1)
                    commit('setToken', '')
                    removeToken()
                    // 关闭websocket连接
                    store.commit('websocketClose')
                    // 抛出异常
                    reject(error)
                })
            })
        },
        // 登出
        logout({commit}) {
            return new Promise((resolve, reject) => {
                logout().then((res)=>{ 
                    if (res.success){
                        commit('setId', -1)
                        commit('setEmail', '')
                        commit('setUsername', '')
                        commit('setImage', userImg)
                        commit('setAuthority', -1)
                        commit('setToken', '')
                        removeToken()
                        // 关闭websocket连接
                        store.commit('websocketClose')
                        resolve(res.msg)
                    }
                    else{
                        reject(res.msg)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 重新登录，刷新用户信息
        reLogin({commit}) {
            return new Promise((resolve, reject) => {
                reLogin().then((res)=>{ 
                    if (res.success){
                        commit('setId', res.data.id)
                        commit('setEmail', res.data.email)
                        commit('setUsername', res.data.username)
                        commit('setImage', res.data.image)
                        commit('setAuthority', res.data.authority)
                        resolve(res.msg)
                    }
                    else{
                        // token过期，登出
                        commit('setId', -1)
                        commit('setEmail', '')
                        commit('setUsername', '')
                        commit('setImage', userImg)
                        commit('setAuthority', -1)
                        commit('setToken', '')
                        removeToken()
                        resolve(res.msg)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        loginByEmailCode({commit}, user) {
            return new Promise((resolve, reject) => {
                loginByEmailCode(user).then((res)=>{
                    if (res.success){
                        // 保存用户信息及token
                        commit('setToken', res.data)
                        setToken(res.data)
                        resolve(res.msg)
                    }
                    else {
                        reject(res.msg)
                    }
                }).catch((error) => {
                    reject(error)
                })
            })
        }
    },
    modules: {
    }
})
export function useStore () {
    return baseUseStore(key)
}