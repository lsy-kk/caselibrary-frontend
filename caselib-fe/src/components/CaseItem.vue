<!--单个案例：表项-->
<template>
    <el-card 
      :body-style="{ padding: '16px' }"
      shadow="hover">
      <div class="pb-4">

        <a @click="handleViewCase(id)" class="font-semibold text-base">{{title}}</a>
        <span class="float-right pl-4 text-xs text-gray-400">
          <el-icon><Comment /></el-icon>&nbsp;{{comment}}
        </span>
        <span class="float-right pl-4 text-xs text-gray-400">
          <el-icon><View /></el-icon>&nbsp;{{viewtimes}}
        </span>
      </div>

      <div class="text-sm mb-4">
        {{summary}}
      </div> 

      <div>
        <span class="text-sm pr-4 text-gray-400">
          <el-icon><User /></el-icon>&nbsp;{{author.username}}
        </span>

        <el-tag 
          v-for="t in tags" 
          :key="t.id" 
          size="mini" 
          type="primary" 
          round 
          plain
          class="mr-2">
          {{t.name}}
        </el-tag>

        <span class="float-right pl-4 text-xs text-gray-400">
          <el-icon><Stopwatch /></el-icon>&nbsp;{{createTime}}
        </span>
      </div>
    </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { ICaseBodyVo, ICaseHeaderVo } from '@/type/case';
import type { IUserVo } from '@/type/user';
import type { ICommentVo } from '@/type/comment';
import type { ITagVo } from "@/type/tag";
import { Comment, View, User, Stopwatch} from '@element-plus/icons-vue'; 
defineProps<{
  id: number,
  title: string,
  summary: string,
  thumb: number,
  viewtimes: number, 
  comment: number,
  visible: number,
  createTime: string,
  updateTime: string,
  caseBody: ICaseBodyVo,
  author: IUserVo,
  tags: Array<ITagVo>,
  comments: Array<ICommentVo>,
}>()
const router = useRouter()
// 跳转到案例内容页面
const handleViewCase = (id: Number) => {
  router.push({path:`/case/${id}`})
}
</script>

<style scoped>
</style>