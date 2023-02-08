<template>
    <!--管理员后台管理系统：头部导航 + 侧边栏 + 主要内容（表单）-->
    <div class="common-layout">
        <el-container>
            <!--管理员后台管理系统：头部导航栏-->
            <el-header>
                <el-row :gutter="20">
                    <el-col :span="4"><img src="/logo.png" class="logo"/></el-col>
                    <el-col :span="16"><h2>后台管理系统</h2></el-col>
                    <el-col :span="4"><span class="logout">退出登录</span></el-col>
                </el-row>
            </el-header>

            <el-container>
                <!--管理员后台管理系统：侧边导航栏-->
                <el-aside>
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
                </el-aside>
                <el-main>
                    <!--路由出口-->
                    <router-view style="flex: 1"/>
                </el-main>
            </el-container>
        </el-container>
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

<style lang="scss" scoped>
.el-header {
    height: 40px;
    background-color: rgb(106, 139, 230);
    .logo{
        height: 40px;
    }
    h2,.logout{
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: white
    }
}
.el-aside {
    width: 200px;
    .el-menu{
        height: calc(100vh - 40px);
    }
}
</style>