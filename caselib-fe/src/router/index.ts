import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'
import { getToken } from '@/request/api/token'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      children:[
        {
          // 首页，显示最热案例
          path:'/hot',
          component: () => import('../views/HotCaseView.vue')
        },
        {
          // 消息中心，id为用户id
          path:'/notification/:id',
          component: () => import('../views/NotificationView.vue')
        },
        {
          // 搜索结果页面，type为搜索类型，keyword为搜索关键字
          path:'/search/:type/:keyword',
          component: () => import('../views/SearchView.vue')
        },
        {
          // markdown编辑案例页面
          path:'/md/:caseId?',
          name: 'md',
          props: true,
          component: () => import('../views/Markdown/MarkdownView.vue')
        },
        {
          // 个人发布案例
          path:'/case/:id',
          component: () => import('../views/CaseView.vue'),
        },
        {
          // 个人主页，id为用户id
          path:'/user/:id',
          component: () => import('../views/UserHomeView.vue'),
          children:[
            {
              // 个人发布案例
              path:'/user/:id/case',
              component: () => import('../views/UserCaseView.vue'),
            },
            {
              // 个人收藏夹
              path:'/user/:id/favorites',
              component: () => import('../views/UserFavoritesView.vue'),
            },
            {
              // 个人设置页面
              path:'/user/:id/setting',
              component: () => import('../views/UserSettingView.vue'),
            }
          ]
        },
      ]
    },
    {
      // 后台管理系统（仅管理员可进）
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
    {
      // 登录页
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }, 
    {
      // 注册页
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }, 
    {
      // 忘记密码页
      path: '/confirmpwd',
      name: 'confirmpwd',
      component: () => import('../views/ConfirmPasswordView.vue')
    }, 
  ]
})

// 路由前，检查登录状态
router.beforeEach((to, from, next) => {
  // 前端已登录
  if (getToken()) {
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
