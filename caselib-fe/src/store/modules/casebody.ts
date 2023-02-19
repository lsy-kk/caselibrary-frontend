import { logout } from '@/request/api/login'
import { getUserByToken } from '@/request/api/user'
import { getToken, removeToken } from '@/request/api/token'
import type { Module } from 'vuex'
import type { IState } from '..'

export interface ICaseBodyState {
    content: String,
}

export const userModule: Module<ICaseBodyState, IState> = {
    namespaced: true,
    // state存储参数
    state: ():ICaseBodyState => ({
        content: '',
    }),
    // 通过getter对state状态进行筛选（例如过滤、计数），类似于计算属性
    // 通过mutations改变state状态，必须是同步的操作
    mutations: {
        setContent(state, content){
            state.content = content
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
                        commit('setContent', res.data.content)
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
        // 保存案例内容
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