<!--单个用户：表项-->
<template>
    <el-card 
      :body-style="{ padding: '16px' }"
      shadow="hover">
      <div class="relative block my-auto">
        <el-avatar shape="square" :size="100" fit="fill" :src="userVo.image" />
        <div class="ml-10 inline-block align-top">
            <div>
                <a class="font-semibold text-base"
                    @click="handleViewCase(userVo.id)"
                    v-html="userVo.username">
                </a>
                <span class="text-sm ml-4 text-gray-400 underline">
                     {{userVo.email}} 
                </span>
            </div>
            <div class="my-1">
                <span class="text-sm mr-8 text-gray-400">
                    <span v-if="userVo.authority === 0">管理员</span>
                    <span v-if="userVo.authority === 1">教师</span>
                    <span v-if="userVo.authority === 2">学生</span>
                </span>
                <span class="text-sm text-gray-400">
                    {{userVo.caseNumber}}个内容
                </span>
            </div>
            <div>
                <span class="my-1 text-sm text-gray-400">
                    账号创建时间：&nbsp;{{userVo.createTime}}
                </span>
            </div>
        </div>
        
      </div>
    </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Comment, View, User, Stopwatch} from '@element-plus/icons-vue'; 
import { IUserVo } from '@/type/user';
const props = defineProps<{
  userVo: IUserVo
}>()
const router = useRouter()
const handleViewCase = (id: Number) => {
  router.push({path:`/user/${id}`})
}
</script>

<style scoped>
</style>