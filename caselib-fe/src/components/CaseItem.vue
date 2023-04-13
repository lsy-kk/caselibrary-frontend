<!--单个案例：表项-->
<template>
    <el-card 
      :body-style="{ padding: '16px' }"
      shadow="hover">
      <div class="pb-4">
        <a @click="handleViewCase(caseVo.id)" 
          class="font-semibold text-base" 
          v-html="caseVo.title">
        </a>
        <span class="float-right pl-4 text-xs text-gray-400">
          <el-icon><Comment /></el-icon>&nbsp;{{caseVo.comment}}
        </span>
        <span class="float-right pl-4 text-xs text-gray-400">
          <el-icon><View /></el-icon>&nbsp;{{caseVo.viewtimes}}
        </span>
      </div>

      <div class="text-sm mb-4 break-all">
        <a v-html="caseVo.summary"></a>
      </div> 

      <div>
        <span class="text-sm pr-4 text-gray-400">
          <el-icon><User /></el-icon>&nbsp;{{caseVo.author.username}}
        </span>

        <el-tag 
          v-for="t in caseVo.tags" 
          :key="t.id" 
          round 
          plain
          class="mr-2">
          {{t.name}}
        </el-tag>

        <span class="float-right pl-4 text-xs text-gray-400">
          <el-icon><Stopwatch /></el-icon>&nbsp;{{caseVo.createTime}}
        </span>
      </div>
    </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { ICaseHeaderVo } from '@/type/case';
import { Comment, View, User, Stopwatch} from '@element-plus/icons-vue'; 
const props = defineProps<{
  caseVo: ICaseHeaderVo
}>()
const router = useRouter()
// 跳转到案例内容页面
const handleViewCase = (id: Number) => {
  router.push({path:`/case/${id}`})
}
</script>

<style scoped>
</style>