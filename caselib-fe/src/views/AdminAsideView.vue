<template>
    <div>
        <template v-if="isCollapse === false">
            <el-button @click="isCollapse=true" :icon="DArrowLeft" class="m-2"/>
        </template>
        <template v-if="isCollapse === true">
            <el-button @click="isCollapse=false" :icon="DArrowRight" class="m-2"/>
        </template>
        <el-menu
            :collapse="isCollapse"
            default-active="/admin/user"
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

            <el-menu-item index="/admin/user">
                <el-icon><UserFilled /></el-icon>
                <span>用户管理</span>
            </el-menu-item>
            
            <el-menu-item index="/admin/tag">
                <el-icon><CollectionTag /></el-icon>
                <span>标签管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/audit">
                <el-icon><DocumentChecked /></el-icon>
                <span>案例审核</span>
            </el-menu-item>

            <el-menu-item index="/admin/case">
                <el-icon><Document /></el-icon>
                <span>案例管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/comment">
                <el-icon><ChatLineRound /></el-icon>
                <span>评论管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/favorites">
                <el-icon><Folder /></el-icon>
                <span>收藏夹管理</span>
            </el-menu-item>
        </el-menu>    
    </div>
</template>

<script setup lang="ts">
import {
    DArrowLeft,
    UserFilled,
    CollectionTag,
    DocumentChecked,
    Document,
    ChatLineRound,
    Folder,
DArrowRight,
} from '@element-plus/icons-vue'
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
// 动态路由模式
// const router = useRouter();
// const list = router.getRoutes().filter(v=>v.meta.isShow)
// console.log(list)
const isCollapse = ref(false)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
</style>