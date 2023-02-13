import { logout } from '@/request/api/login'
import { getUserByToken } from '@/request/api/user'
import { getToken, removeToken } from '@/request/api/token'
import type { Module } from 'vuex'
import type { IState } from '..'

export interface IUserState {
    id: number,
    email: String,
    username: String,
    image: String,
    authority: number,
}

export const userModule: Module<IUserState, IState> = {
    namespaced: true,
    // state存储参数
    state: ():IUserState => ({
        id: -1,
        email: '',
        username: '',
        image: '',
        authority: -1,
    }),
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
    },
    // action提交mutations方法，但不同的是可以执行异步操作
    actions: {
        // 根据前端token，获取用户信息
        getUserByToken({commit}){
            return new Promise((resolve, reject) => {
                getUserByToken(getToken()).then((res) => { 
                    if (res.msg == 'success'){
                        // 保存用户信息
                        commit('setId', res.data.id)
                        commit('setEmail', res.data.email)
                        commit('setUsername', res.data.username)
                        commit('setImage', res.data.username)
                        commit('setAuthority', res.data.authority)
                        resolve('success')
                    }
                    else {
                        // 后端token失效，变为未登录状态
                        commit('setId', -1)
                        commit('setEmail', '')
                        commit('setUsername', '')
                        commit('setImage', '')
                        commit('setAuthority', -1)
                        removeToken()
                        resolve('fail')
                    }
                }).catch(err => {
                    commit('setId', -1)
                    commit('setEmail', '')
                    commit('setUsername', '')
                    commit('setImage', '')
                    commit('setAuthority', -1)
                    // 抛出异常
                    reject(err)
                    removeToken()
                })
            })
        },
        // 登出
        logout({commit}) {
            return new Promise((resolve, reject) => {
                logout(getToken()).then(res=>{
                    commit('setId', -1)
                    commit('setEmail', '')
                    commit('setUsername', '')
                    commit('setImage', '')
                    commit('setAuthority', -1)
                    removeToken()
                    resolve('success')
                }).catch(err => {
                    reject(err)
                })
            })
        },
    },
    
}