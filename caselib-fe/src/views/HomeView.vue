<script setup lang="ts">
import BaseHeader from './BaseHeader.vue';
</script>

<template>
  <div>
    <el-container class="fixed w-screen h-screen">
      <el-header class="relative ring-2 ring-gray-400 ring-opacity-50">
          <BaseHeader></BaseHeader>
      </el-header>
      <el-main>
        <!--路由出口-->
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script scoped>
</script>