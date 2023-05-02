<template>
    <div>
        <el-container class="bg-blue-100">
            <!--管理员后台管理系统：侧边导航栏-->
            <el-aside>
                <NotificationAside :activeIndex="activeIndexAside" />
            </el-aside>
            <el-main>
                <!--路由出口-->
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import NotificationAside from '@/components/NotificationAside.vue'
var activeIndexHeader:String = '/admin'
var activeIndexAside:String = '/admin/user'
</script>

<style scoped>

</style>