<!--消息中心：侧边栏-->
<template>
    <div class="mt-10">
        <el-menu
            :collapse="isCollapse"
            :default-active="$route.path.substring($route.path.lastIndexOf('/')+1)"
            @open="handleOpen"
            @close="handleClose"
            router>
            <el-menu-item :index="item.path" v-for="item in list" :key="item.path">
                <span>{{ item.title }}</span>
            </el-menu-item>
        </el-menu>    
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
// 动态路由模式
// const router = useRouter();
// const list = router.getRoutes().filter(v=>v.meta.isShow)
// // console.log(list)
const list = [
    {
        path: "reply",
        title: "回复我的"
    },
    {
        path: "system",
        title: "系统通知"
    },
    // {
    //     path: "communication",
    //     title: "私信"
    // },
]
const isCollapse = ref(false)

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
</script>

<style scoped>
</style>