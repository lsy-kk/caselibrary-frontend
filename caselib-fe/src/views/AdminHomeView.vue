<template>
    <!--管理员后台管理系统：头部导航 + 侧边栏 + 主要内容（表单）-->
    <div>
        <el-container class="w-screen h-screen">
            <!--管理员后台管理系统：头部导航栏-->
            <el-header class="ring-2 ring-gray-400 ring-opacity-50">
                <BaseHeader :active-index="activeIndexHeader" :showHeader=false />
            </el-header>
            <el-container class="bg-blue-100">
                <!--管理员后台管理系统：侧边导航栏-->
                <el-aside>
                    <AdminAsideView :activeIndex="activeIndexAside" />
                </el-aside>
                <el-main>
                    <!--路由出口-->
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  

<script setup lang="ts">
import AdminAsideView from '@/views/AdminAsideView.vue'
import BaseHeader from './BaseHeader.vue'
var activeIndexHeader:String = '/admin'
var activeIndexAside:String = '/admin/user'
</script>

<style scoped>
.el-header {
  height: 60px;
}
.el-aside {
  width: 180px;
  min-height: calc(100vh - 60px);
}
.el-main {
    height: calc(100vh - 60px);
}
</style>