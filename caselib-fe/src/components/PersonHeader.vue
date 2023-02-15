<!--个人中心：头部栏-->
<template>
    <el-row>
        <el-col :span="4">
        
        </el-col>
        <el-col v-if="!showHeader" :span="20">
            <el-menu 
                menu-trigger="click" 
                :default-active="activeIndex"
                mode="horizontal">
                <el-menu-item index="case" @click="handleJumpCase">案例</el-menu-item>
                <el-menu-item index="favorites">收藏</el-menu-item>
                <el-menu-item index="setting">设置</el-menu-item>
            </el-menu>
        </el-col>
        <template v-else>
            <slot></slot>
        </template>
    </el-row>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { key } from '@/store'
import { ArrowDown, Edit, Notification } from '@element-plus/icons-vue';
// 组件参数
defineProps<{
// 当前默认选中页面
activeIndex: {
    type: String,
},
// 是否展示BaseHeader头部
showHeader?: {
    type: Boolean,
    default: false,
}
}>()
const route = useRoute()
const router = useRouter()
const handleJumpCase=() => {
    router.push({path:`/user/${route.params.id}/case`})
}
</script>

<style scoped>
</style>