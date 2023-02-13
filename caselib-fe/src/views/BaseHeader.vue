<template>
  <el-row>
    <el-col :span="4">
      
    </el-col>
    <el-col v-if="!showHeader" :span="16">
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
          <el-col :span="4" :offset="2" class="w-12">
            <el-menu-item>
              <el-icon><Edit /></el-icon>
              <span>创建案例</span>
            </el-menu-item>
          </el-col>
        </template>
        <!--搜索框-->
        <el-col :span="6" :offset="4">
            <el-input
              class="w-12 mt-4 ring-2 ring-gray-400 ring-opacity-50"
              placeholder="搜索"
            />
        </el-col>
      </el-menu>
    </el-col>
    <template v-else>
      <slot></slot>
    </template>


    <el-col :span="4">
      <el-menu 
        :router=true 
        menu-trigger="click" 
        mode="horizontal" 
        :ellipsis="false"
        class="relative">
        <!--假若找不到权限，说明是游客用户-->
        <template v-if="store.state.authority === -1">
          <el-menu-item index="/login">
            <el-button type="text" class="mt-4">登录</el-button>
          </el-menu-item>
          <el-menu-item index="/register">
            <el-button type="text" class="mt-4">注册</el-button>
          </el-menu-item>
        </template>
        <template v-else>
          <!--已登录-下拉菜单-->
          <el-dropdown>
            <span class="el-dropdown-link">
              名字
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { key } from '@/store'
import { ArrowDown, Edit, Notification } from '@element-plus/icons-vue';
// 组件参数
defineProps<{
  // 当前默认选中页面
  activeIndex?: {
    type: String,
    default: '/hot',
  },
  // 是否展示BaseHeader头部
  showHeader?: {
    type: Boolean,
    default: false,
  }
}>()

// 获取store
const store = useStore(key);

</script>

<style scoped>
</style>