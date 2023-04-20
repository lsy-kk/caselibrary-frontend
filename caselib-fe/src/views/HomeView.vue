<template>
  <div>
    <div class="min-w-0 flex-col flex box-border
                w-screen h-screen">
      <div class="px-0 h-60px flex-shrink-0
                  box-border overflow-auto relative 
                  ring-2 ring-gray-400 ring-opacity-50">
          <BaseHeader :showHeader=false />
      </div>
      <div class="h-[calc(100%-60px)] block flex-1
                  box-border overflow-auto bg-blue-100 ">
        <!--路由出口-->
        <router-view/>
      </div>
    </div>
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