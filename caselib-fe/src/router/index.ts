import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { store } from '@/store'
import { getToken } from '@/request/token'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }, 
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }, 
    {
      path: '/confirmpwd',
      name: 'confirmpwd',
      component: () => import('../views/ConfirmPasswordView.vue')
    }, 
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminHomeView.vue'),
      children:[
        {
          path: '/admin/user',
          name: 'adminUser',
          meta: {
            isShow: true,
            title: "用户管理"
          },
          component: () => import('../views/AdminUserView.vue'),
        },
        {
          path: '/admin/tag',
          name: 'adminTag',
          meta: {
            isShow: true,
            title: "标签管理"
          },
          component: () => import('../views/AdminTagView.vue'),
        },
        {
          path: '/admin/audit',
          name: 'adminAudit',
          meta: {
            isShow: true,
            title: "审核案例"
          },
          component: () => import('../views/AdminAuditView.vue'),
        },
        {
          path: '/admin/case',
          name: 'adminCase',
          meta: {
            isShow: true,
            title: "案例管理"
          },
          component: () => import('../views/AdminCaseView.vue'),
        },
        {
          path: '/admin/comment',
          name: 'adminComment',
          meta: {
            isShow: true,
            title: "评论管理"
          },
          component: () => import('../views/AdminCommentView.vue'),
        },
        {
          path: '/admin/favorites',
          name: 'adminFavorites',
          meta: {
            isShow: true,
            title: "收藏夹管理"
          },
          component: () => import('../views/AdminFavoritesView.vue'),
        },
      ]
    }, 
  ]
})

// 路由前，检查登录状态
router.beforeEach((to, from, next) => {
  // 前端已登录
  if (getToken()) {
    console.log('???');
    console.log(store);
    console.log(getToken());
    // 找不到用户信息，则根据token从后端接口获取
    if (store.state.id === -1) {
      store.dispatch('getUserByToken').then(() => { 
        // 正常获取用户信息并跳转
        next()
      }).catch(() => {
        // 后端token失效，退出登录状态
        return false
      })
    } 
    else {
      // 已有用户信息，直接跳转
      next()
    }
  }
  // 未登录（游客用户）正常使用
  else {
    next()
  }
})



export default router
