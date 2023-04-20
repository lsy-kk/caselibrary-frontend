<template>
    <div>
        <div> 404 </div>
        <div> 找不到页面 </div>
        <el-button @click="handleJumpHome">返回到首页</el-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()
const handleJumpHome = () => {
    router.push({path:`/hot`})
}
</script>

<style scoped>

</style>