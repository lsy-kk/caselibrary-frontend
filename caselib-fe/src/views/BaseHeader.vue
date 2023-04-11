<template>
  <div class="static flex w-full">
    <div class="static w-1/6">
      
    </div>
    <div v-if="!showHeader" class="static w-2/3">
      <el-menu 
        :router=true 
        menu-trigger="click" 
        :default-active="activeIndex"
        mode="horizontal">
        <el-menu-item index="/hot">首页</el-menu-item>
        <el-menu-item index="/tag">标签</el-menu-item>
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
            <el-autocomplete
              v-model="keyword"
              class="w-100 mt-4 border-2 border-gray-300 rounded-md"
              :fetch-suggestions="querySearch"
              placeholder="输入关键字搜索......"
              @select="handleSelect"
              @keyup.enter.native="handleSearch"
            />
        </div>
      </el-menu>
    </div>
    <template v-else>
      <slot></slot>
    </template>
    <div class="flex justify-end items-center flex-grow mr-8">
        <!--假若找不到权限，说明是游客用户-->
        <template v-if="store.state.authority === -1">
          <el-button type="primary" class="mt-4" @click="handleLogin">登录</el-button>
          <el-button type="primary" class="mt-4" @click="handleRegister">注册</el-button>
        </template>
        <template v-else>
          <div class="">
          <!--已登录-通知按钮和下拉菜单-->
          <el-button class="mt-4 mr-4" @click="handleNotification">
            <el-icon><Notification /></el-icon>
          </el-button>
          <el-dropdown class="mt-2" @command="handleCommand">
            <div>
              <el-avatar
                :src="store.state.image"/>
            </div>
            <template #dropdown>
              <el-dropdown-menu 
                size="large"
                class="">
                <div class="relative">
                  <el-avatar
                    :size="80"
                    class="block mr-4"
                    :src="store.state.image"/>
                    <div class="inline-block">
                      <div class="text-sm align-middle mr-4"> 
                        <template v-if="store.state.authority === 0">
                          管理员
                        </template>
                        <template v-if="store.state.authority === 1">
                          教师
                        </template>
                        <template v-if="store.state.authority === 2">
                          用户 
                        </template>
                      </div>
                      <div class="mr-4">
                        {{ store.state.username }}
                      </div>
                    </div>
                </div>
                <el-dropdown-item command="center" divided>个人中心</el-dropdown-item>
                <el-dropdown-item command="setting" divided>个人设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { Edit, Notification } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 组件参数
const props = defineProps<{
  // 当前默认选中页面
  activeIndex: String,
  // 是否展示BaseHeader头部
  showHeader: Boolean,
}>()

// 获取store
const store = useStore()
// 获取router
const router = useRouter()
const querySearch = () => {

}
const handleSelect = () => {

}
const keyword = ref('')
// 搜索
const handleSearch = () => {
  router.push({path:`/search/${keyword.value}`})
}
// 通知系统
const handleNotification = () => {
  router.push({path:`/notification/${store.state.id}`})
}
const handleLogin = () => {
  router.push('/login')
}
const handleRegister = () => {
  router.push('/register')
}
const handleCommand = (command: string) => {
  console.log(`click on item ${command}`);
  if (command === 'center'){
    router.push({path:`/user/${store.state.id}`})
  }
  else if (command === 'setting'){
    router.push({path:`/user/${store.state.id}/setting`})
  }
  else if (command === 'logout'){
    store.dispatch('logout').then(() => { 
      // 登出并跳转到首页
      router.push('/hot')
    })
  }
}

</script>

<style scoped>
</style>