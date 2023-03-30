import { createStore, useStore as baseUseStore, Store } from 'vuex'
import type { InjectionKey } from 'vue'
import { userModule} from './modules/user'
import type { IUserState } from './modules/user'
import { login, logout, loginByEmailCode } from '@/request/api/login'
import { getUserByToken } from '@/request/api/user'
import { getToken, setToken, removeToken } from '@/request/api/token'
import userImg from '@/assets/image/user.png';
export interface IState{
    id: number,
    email: string,
    username: string,
    image: string,
    authority: number,
    token: string,
}
type Modules = {
    user: IUserState
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
        getUserByToken({commit}){
            return new Promise((resolve, reject) => {
                getUserByToken(getToken()).then((res) => { 
                    if (res.success){
                        // 保存用户信息
                        commit('setId', res.data.id)
                        commit('setEmail', res.data.email)
                        commit('setUsername', res.data.username)
                        commit('setImage', res.data.image)
                        commit('setAuthority', res.data.authority)
                        commit('setToken', res.data.token)
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
                    // 抛出异常
                    reject(error)
                })
            })
        },
        // 登出
        logout({commit}) {
            return new Promise((resolve, reject) => {
                logout(getToken()).then((res)=>{ 
                    if (res.success){
                        commit('setId', -1)
                        commit('setEmail', '')
                        commit('setUsername', '')
                        commit('setImage', userImg)
                        commit('setAuthority', -1)
                        commit('setToken', '')
                        removeToken()
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
        user: userModule,
    }
})
export function useStore () {
    return baseUseStore(key)
}