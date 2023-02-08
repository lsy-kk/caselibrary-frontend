<template>
    <el-header class="fixed">
      <el-row>
        <el-col :span="4">
          
        </el-col>

        <el-col v-if="!props.showHeader" :span="16">
          <el-menu 
            :router=true 
            menu-trigger="click" 
            :default-active="props.activeIndex"
            mode="horizontal">
            <el-menu-item index="/admin">首页</el-menu-item>
            <el-menu-item index="/admin/user">标签</el-menu-item>
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
            :ellipsis="false">
            <!--假若找不到权限，说明是游客用户-->
            <template v-if="store.state.authority === -1">
              <el-menu-item index="/login">
                <el-button type="text">登录</el-button>
              </el-menu-item>
              <el-menu-item index="/register">
                <el-button type="text">注册</el-button>
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
  </el-header>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { key } from '@/store'
import { ArrowDown } from '@element-plus/icons-vue';
// 组件参数
const props = defineProps({
  // 当前默认选中页面
  activeIndex: {
    type: String,
    default: '/admin/user'
  },
  // 是否展示BaseHeader头部
  showHeader: {
    type: Boolean,
    default: false
  }
})

// 获取store
const store = useStore(key);

</script>

<style scoped>
.el-header {
  position: fixed;
  z-index: 1024;
  min-width: 100%;
  box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
}
.el-button{
  margin-top: 10px;
}
</style>