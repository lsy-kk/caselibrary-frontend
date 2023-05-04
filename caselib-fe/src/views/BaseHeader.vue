<template>
  <div class="static flex w-full">
    <div class="static w-1/6">
      
    </div>
    <div v-if="!showHeader" class="static w-2/3">
      <el-menu 
        :router=true 
        menu-trigger="click" 
        :default-active="$route.path"
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
        <SearchInput class="mx-auto"/>
      </el-menu>
    </div>
    <template v-else>
      <slot></slot>
    </template>
    <div class="flex justify-end flex-grow mr-8">
        <!--假若找不到权限，说明是游客用户-->
        <template v-if="store.state.authority === -1">
          <el-button type="primary" class="mt-4" @click="handleLogin">登录</el-button>
          <el-button type="primary" class="mt-4" @click="handleRegister">注册</el-button>
        </template>
        <template v-else>
          <div class="">
          <!--已登录-通知按钮和下拉菜单-->
          <el-button class="mt-4 mr-4" @click="handleNotification" text>
            <template v-if="store.state.noticeList.length !== 0">
              <img :src="noticeImg" class="w-6 h-6 m-2">
            </template>
            <template v-else>
              <img :src="notnoticeImg" class="w-6 h-6 m-2">
            </template>
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
                    class="block mx-4"
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
import SearchInput from '@/components/SearchInput.vue'
import { Edit, Notification } from '@element-plus/icons-vue';
import notnoticeImg from '@/assets/image/NotNotice.png';
import noticeImg from '@/assets/image/Notice.png';
import { useRouter, useRoute } from 'vue-router';
// 组件参数
const props = defineProps<{
  // 是否展示BaseHeader头部
  showHeader: Boolean,
}>()

// 获取store
const store = useStore()
// 获取router
const router = useRouter()
const route = useRoute()

const handleSelect = () => {

}
// 通知系统
const handleNotification = () => {
  router.push({path:`/notice/${store.state.id}`})
}
const handleLogin = () => {
  router.push('/login')
}
const handleRegister = () => {
  router.push('/register')
}
const handleCommand = (command: string) => {
  //console.log(`click on item ${command}`);
  if (command === 'center'){
    router.push({path:`/user/${store.state.id}/case`})
  }
  else if (command === 'setting'){
    router.push({path:`/user/${store.state.id}/setting`})
  }
  else if (command === 'logout'){
    store.dispatch('logout').then(() => { 
      // 登出
      router.push({path:`/hot`})
    })
  }
}

</script>

<style scoped>
</style>