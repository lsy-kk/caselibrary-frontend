<template>
  <div class="static flex">
    <div class="static w-1/6">
      
    </div>
    <div v-if="!showHeader" class="static w-2/3">
      <el-menu 
        :router=true 
        menu-trigger="click" 
        :default-active="activeIndex"
        mode="horizontal">
        <el-menu-item index="/hot">首页</el-menu-item>
        <el-menu-item index="/admin/user">标签</el-menu-item>
        <!--管理员的后台管理按钮-->
        <template v-if="store.state.authority === 0">
          <el-menu-item index="/admin">后台管理</el-menu-item>
        </template>
        <!--教师和管理员的markdown编辑页面快速入口-->
        <template v-if="store.state.authority === 0 || store.state.authority === 1">
          
            <el-menu-item index="/md">
              <el-icon><Edit /></el-icon>
              <span>创建案例</span>
            </el-menu-item>
          
        </template>
        <!--搜索框-->
        <div class="mx-auto">
            <el-input
              class="w-12 mt-4 border-2 border-gray-300 rounded-md"
              placeholder="搜索"
            />
        </div>
      </el-menu>
    </div>
    <template v-else>
      <slot></slot>
    </template>


    <div class="static w-1/6">
        <!--假若找不到权限，说明是游客用户-->
        <template v-if="store.state.authority === -1">
          <el-button type="primary" class="mt-4" @click="handleLogin">登录</el-button>
          <el-button type="primary" class="mt-4" @click="handleRegister">注册</el-button>
        </template>
        <template v-else>
          <!--已登录-下拉菜单-->
          <el-dropdown class="mt-2">
              <img 
                class="bg-gray-200 w-10 h-10 rounded-lg" 
                :src="store.state.image"/>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item> 
                  <img 
                    class="bg-gray-200 w-20 h-20 rounded-lg mr-4" 
                    :src="store.state.image"/>
                  <template v-if="store.state.authority === 0">
                    管理员 {{ store.state.username }}
                  </template>
                  <template v-else>
                    {{ store.state.username }}
                  </template>
                </el-dropdown-item>
                <el-dropdown-item @click="">个人中心</el-dropdown-item>
                <el-dropdown-item @click="">个人设置</el-dropdown-item>
                <el-dropdown-item @click="">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { key } from '@/store'
import { ArrowDown, Edit, Notification } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
// 组件参数
const props = defineProps<{
  // 当前默认选中页面
  activeIndex: String,
  // 是否展示BaseHeader头部
  showHeader: Boolean,
}>()

// 获取store
const store = useStore(key)
console.log(store.state);

// 获取router
const router = useRouter()
const handleLogin = () => {
  router.push('/login')
}
const handleRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
</style>