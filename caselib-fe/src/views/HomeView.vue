<template>
  <div>
    <el-container class="w-screen h-screen">
      <el-header class="box-border overflow-auto relative 
                        ring-2 ring-gray-400 ring-opacity-50">
          <BaseHeader :active-index="activeIndex" :showHeader=false />
      </el-header>
      <el-main class="m-400 bg-blue-100">
        <!--路由出口-->
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import BaseHeader from './BaseHeader.vue';
var activeIndex:String = '/hot'
</script>


<style>

.el-aside {
  width: 180px;
  min-height: calc(100vh - 60px);
}
.el-main {
    height: calc(100vh - 60px);
}
</style>