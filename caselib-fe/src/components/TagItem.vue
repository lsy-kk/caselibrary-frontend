<!--单个案例：表项-->
<template>
    <el-card 
      :body-style="{ padding: '16px' }"
      shadow="hover">
      <div class="pb-4">
        <el-avatar shape="square" :size="100" fit="fill" :src="image" />
        <a @click="handleViewCase(id)" class="font-semibold text-base">{{name}}</a>
      </div>

      <div class="text-sm mb-4 break-all">
        {{description}}
      </div> 
    </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { ITagVo } from "@/type/tag";
import { Comment, View, User, Stopwatch} from '@element-plus/icons-vue'; 
defineProps<{
  id: number,
  name: string,
  description: string,
  image: string,
}>()
const router = useRouter()
// 跳转到案例内容页面
const handleViewCase = (id: Number) => {
  router.push({path:`/tag/${id}`})
}
</script>

<style scoped>
</style>