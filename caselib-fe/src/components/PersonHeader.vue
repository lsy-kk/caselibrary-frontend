<!--个人中心：头部栏-->
<template>
    <div class="static flex bg-white">
        <div class="static w-1/6 text-center my-auto">
            你的名字
        </div>
        <div v-if="!showHeader" class="static w-2/3">
            <el-menu 
                menu-trigger="click" 
                :default-active="activeIndex"
                mode="horizontal">
                <el-menu-item index="case" @click="handleJumpCase">案例</el-menu-item>
                <el-menu-item index="favorites" @click="handleJumpFavorites">收藏</el-menu-item>
                <el-menu-item index="setting" @click="handleJumpSetting">设置</el-menu-item>
            </el-menu>
        </div>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { key } from '@/store'
import { ArrowDown, Edit, Notification } from '@element-plus/icons-vue';
// 组件参数
const props = defineProps<{
  // 当前默认选中页面
  activeIndex: String,
  // 是否展示BaseHeader头部
  showHeader: Boolean,
}>()
const route = useRoute()
const router = useRouter()
const handleJumpCase=() => {
    router.push({path:`/user/${route.params.id}/case`})
}
const handleJumpFavorites=() => {
    router.push({path:`/user/${route.params.id}/favorites`})
}
const handleJumpSetting=() => {
    router.push({path:`/user/${route.params.id}/setting`})
}
</script>

<style scoped>
</style>