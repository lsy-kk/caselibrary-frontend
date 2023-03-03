<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { RouterLink, RouterView } from 'vue-router'
const locale = zhCn
</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView/>
  </el-config-provider>
</template>

<style scoped>
*{
  margin:0;
  padding:0;
  border:0;
}
</style>
