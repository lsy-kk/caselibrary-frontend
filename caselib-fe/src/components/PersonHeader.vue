<!--个人中心：头部栏-->
<template>
    <div class="static flex bg-white">
        <div class="static w-1/6 text-center my-auto">
            你的名字
        </div>
        <div v-if="!showHeader" class="static w-2/3">
            <el-menu 
                menu-trigger="click" 
                :default-active="$route.path.substring($route.path.lastIndexOf('/')+1)"
                mode="horizontal"
                router>
                <el-menu-item index="case" >案例</el-menu-item>
                <el-menu-item index="favorites">收藏</el-menu-item>
                <template v-if="route.params.id === String(store.state.id)">
                    <el-menu-item index="setting">设置</el-menu-item>
                </template>
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
// 组件参数
const props = defineProps<{
  // 是否展示BaseHeader头部
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