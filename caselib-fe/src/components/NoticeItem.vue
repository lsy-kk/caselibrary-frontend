<!--消息：表项-->
<template>
    <el-card 
      :body-style="{ padding: '16px' }"
      shadow="hover">
      <div class="relative block my-auto">
        <el-avatar shape="square" :size="100" fit="fill" :src="noticeVo.fromUser.image" />
        <div class="ml-4 inline-block align-top">
          <div class="pb-4">
            <a 
              v-if="noticeVo.type !== 1"
              @click="handleViewUser(noticeVo.fromUser.id)" 
              class="font-semibold text-base text-cyan-400 mr-2" 
              v-html="noticeVo.fromUser.username"></a>
            <a 
              @click="handleViewCase(noticeVo.caseId)" 
              class="font-semibold text-base" 
              v-html="noticeVo.title"></a>
          </div>

          <div class="text-sm mb-4 break-all">
            <a v-html="noticeVo.content"></a>
          </div> 

          <div>

            <span class="text-xs text-gray-400">
              <el-icon><Stopwatch /></el-icon>&nbsp;{{noticeVo.createTime}}
            </span>
          </div>
        </div>
        
      </div>
    </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Comment, View, User, Stopwatch} from '@element-plus/icons-vue'; 
import type { IUserVo } from '@/type/user';
import { INoticeVo } from '@/type/notice';
const props = defineProps<{
  noticeVo: INoticeVo 
}>()
// type = reply 回复
// type = system 系统
const router = useRouter()
// 跳转到案例内容页面
const handleViewCase = (id: Number) => {
  router.push({path:`/case/${id}`})
}
const handleViewUser = (id: number) => {
  router.push({path:`/user/${id}`})
}
</script>

<style scoped>
</style>