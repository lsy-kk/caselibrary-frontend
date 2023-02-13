<template>
    <!--管理员后台管理系统：头部导航 + 侧边栏 + 主要内容（表单）-->
    <div>
        <el-container class="fixed w-screen h-screen">
            <!--管理员后台管理系统：头部导航栏-->
            <el-header class="relative ring-2 ring-gray-400 ring-opacity-50">
                <BaseHeader></BaseHeader>
            </el-header>
            <el-container>
                <!--管理员后台管理系统：侧边导航栏-->
                <el-aside width="150px" class="">
                    <AdminAsideView></AdminAsideView>
                </el-aside>
                <el-main class="">
                    <!--路由出口-->
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  

<script setup lang="ts">
import AdminAsideView from '@/views/AdminAsideView.vue'
import BaseHeader from './BaseHeader.vue';
// import { useRouter } from 'vue-router';
// 动态路由模式
// const router = useRouter();
// const list = router.getRoutes().filter(v=>v.meta.isShow)
// console.log(list)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.el-aside {
  width: 180px;
  min-height: calc(100vh - 40px);
}
</style>