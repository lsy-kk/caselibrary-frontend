<template>
    <div>
        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#fff"
            @open="handleOpen"
            @close="handleClose"
            router
        >
            <!--动态路由模式-->
            <!--
            <el-menu-item :index="item.path" v-for="item in list" :key="item.path">
                <span>{{ item.meta.title }}</span>
            </el-menu-item>
            -->

            <!--router开启路由模式，根据index（路径）进行页面的跳转-->
            <el-menu-item index="/user">
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
            </el-menu-item>
            
            <el-menu-item index="/tag">
            <el-icon><CollectionTag /></el-icon>
            <span>标签管理</span>
            </el-menu-item>

            <el-menu-item index="/">
            <el-icon><DocumentChecked /></el-icon>
            <span>案例审核</span>
            </el-menu-item>

            <el-menu-item index="4">
            <el-icon><Document /></el-icon>
            <span>案例管理</span>
            </el-menu-item>

            <el-menu-item index="5">
            <el-icon><ChatLineRound /></el-icon>
            <span>评论管理</span>
            </el-menu-item>

            <el-menu-item index="6">
            <el-icon><Folder /></el-icon>
            <span>收藏夹管理</span>
            </el-menu-item>
        </el-menu> 
    </div>
</template>

<script setup lang="ts">
import {
    UserFilled,
    CollectionTag,
    DocumentChecked,
    Document,
    ChatLineRound,
    Folder,
} from '@element-plus/icons-vue'
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

</style>