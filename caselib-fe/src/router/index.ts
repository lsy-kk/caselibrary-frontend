import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'
import { getToken } from '@/request/api/token'

const router = createRouter({
  history: createWebHistory(import.meta.env.PUBLIC_URL),
  routes: [
    {
      path: '',
      name: 'Home',
      //在地址为空时，直接跳转hot路由
      redirect:'/hot',
      component: () => import('../views/HomeView.vue'),
      children:[
        {
          // 首页，显示最热案例
          path:'/hot',
          component: () => import('../views/HotCaseView.vue')
        },
        {
          // 标签
          path:'/tag',
          component: () => import('../views/HotTagView.vue'),
        },
        {
          // 标签及对应的案例
          path:'/tag/:id',
          name: 'tag',
          component: () => import('../views/TagView.vue'),
        },
        {
          // 消息中心，id为用户id
          path:'/notice/:id',
          component: () => import('../views/Notice/NoticeView.vue'),
          children:[
            {
              path: '/notice/:id',
              redirect:{
                name: 'reply',
              }
            },
            {
              path: '/notice/:id/system',
              component: () => import('../views/Notice/SystemNoticeView.vue'),
            },
            {
              path: '/notice/:id/reply',
              name: 'reply',
              component: () => import('../views/Notice/ReplyNoticeView.vue'),
            },
            {
              path: '/notice/:id/communication',
              component: () => import('../views/Notice/CommunicationNoticeView.vue'),
            },
          ]
        },
        {
          // 搜索结果页面，type为搜索类型，keyword为搜索关键字
          path:'/search/:keyword',
          component: () => import('../views/Search/SearchView.vue'),
          children:[
            {
              path:'/search/:keyword',
              redirect:{
                name: 'searchCase',
              }
            },
            {
              // 关键字综合搜索
              path:'/search/:keyword/case',
              name: 'searchCase',
              component: () => import('../views/Search/SearchCaseView.vue'),
            },
            {
              // 标签（匹配优先）
              path:'/search/:keyword/tag',
              component: () => import('../views/Search/SearchTagView.vue'),
            },
            {
              // 作者搜索（匹配优先）
              path:'/search/:keyword/user',
              component: () => import('../views/Search/SearchUserView.vue'),
            }
          ]
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
          name: 'case',
          component: () => import('../views/CaseView.vue'),
        },
        {
          // 个人主页，id为用户id
          path:'/user/:id',
          component: () => import('../views/UserHome/UserHomeView.vue'),
          children:[
            {
              path:'/user/:id',
              redirect:{
                name: 'userCase',
              }
            },
            {
              // 个人发布案例
              path:'/user/:id/case',
              name: 'userCase',
              component: () => import('../views/UserHome/UserCaseView.vue'),
            },
            {
              // 个人收藏夹
              path:'/user/:id/favorites',
              component: () => import('../views/UserHome/UserFavoritesView.vue'),
            },
            {
              // 个人设置页面
              path:'/user/:id/setting',
              component: () => import('../views/UserHome/UserSettingView.vue'),
            }
          ]
        },
      ]
    },
    {
      // 后台管理系统（仅管理员可进）
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin/AdminHomeView.vue'),
      children:[
        {
          path:'/admin',
          redirect:'/admin/user'
        },
        {
          path: '/admin/user',
          name: 'adminUser',
          meta: {
            isShow: true,
            title: "用户管理"
          },
          component: () => import('../views/Admin/AdminUserView.vue'),
        },
        {
          path: '/admin/tag',
          name: 'adminTag',
          meta: {
            isShow: true,
            title: "标签管理"
          },
          component: () => import('../views/Admin/AdminTagView.vue'),
        },
        {
          path: '/admin/case',
          name: 'adminCase',
          meta: {
            isShow: true,
            title: "案例管理"
          },
          component: () => import('../views/Admin/AdminCaseView.vue'),
        },
        {
          path: '/admin/comment',
          name: 'adminComment',
          meta: {
            isShow: true,
            title: "评论管理"
          },
          component: () => import('../views/Admin/AdminCommentView.vue'),
        },
        {
          path: '/admin/favorites',
          name: 'adminFavorites',
          meta: {
            isShow: true,
            title: "收藏夹管理"
          },
          component: () => import('../views/Admin/AdminFavoritesView.vue'),
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
      // 更改密码
      path: '/reset',
      name: 'reset',
      component: () => import('../views/ResetEmailOrPasswordView.vue')
    }, 
    {
      // 忘记密码页
      path: '/confirmpwd',
      name: 'confirmpwd',
      component: () => import('../views/ResetEmailOrPasswordView.vue')
    }, 
    // 兜底404页
    {
      name: 'notfound',
      path: '/notfound',
      component: () => import('@/views/NotFoundView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/notfound'
    },
  ]
})

// 路由前，检查登录状态
// 若已经登陆，检查websocket连接状态
router.beforeEach((to, from, next) => {
  // 前端已登录
  if (getToken()) {
    if (to.path === '/login' || to.path==='/register') {
      next({path: '/'})
    }
    // 找不到用户信息，则根据token从后端接口获取
    if (store.state.id === -1) {
      store.dispatch('getUserVoByToken').then(() => { 
        // 正常获取用户信息并跳转
        next()
      }).catch(() => {
        // 后端token失效，退出登录状态，跳回首页
        next({path: '/'})
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
