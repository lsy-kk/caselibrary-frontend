<!--搜索：头部栏-->
<!--个人中心：头部栏-->
<template>
    <div class="static flex bg-white">
        <div v-if="!showHeader" class="static w-full">
            <el-menu 
                menu-trigger="click" 
                :default-active="$route.path.substring($route.path.lastIndexOf('/')+1)"
                mode="horizontal"
                router>
                <el-menu-item index="case">案例</el-menu-item>
                <el-menu-item index="tag">标签</el-menu-item>
                <el-menu-item index="user">用户</el-menu-item>
            </el-menu>
        </div>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store'
import { onMounted } from 'vue'
const props = defineProps<{
  showHeader: Boolean,
}>()
const route = useRoute()
const router = useRouter()
const store = useStore()
onMounted(() => {
})
</script>

<style scoped>
</style>