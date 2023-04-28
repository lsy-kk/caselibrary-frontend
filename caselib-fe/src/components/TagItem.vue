<!--单个标签：表项-->
<template>
    <el-card 
      :body-style="{ padding: '16px' }"
      shadow="hover">
      <div class="relative block my-auto">
        <el-avatar shape="square" :size="100" fit="fill" :src="tagVo.image" />
        <div class="ml-10 inline-block align-top">
          <a class="font-semibold text-base"
            @click="handleViewCase(tagVo.id)"
            v-html="tagVo.name">
          </a>
          <div class="my-1">
              <span class="text-sm pr-4 text-gray-400">
                  {{tagVo.caseNumber}}个内容
              </span>
              <span class="my-1 text-sm text-gray-400">
                创建时间：&nbsp;{{tagVo.createTime}}
              </span>
          </div>
          <div class="text-sm break-all">
            描述：
            <a v-html="tagVo.description"></a>
          </div> 
        </div>
        
      </div>
    </el-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { ITagVo } from "@/type/tag";
import { Comment, View, User, Stopwatch} from '@element-plus/icons-vue'; 
const props = defineProps<{
  tagVo: ITagVo
}>()
const router = useRouter()
const handleViewCase = (id: Number) => {
  router.push({path:`/tag/${id}`})
}
</script>

<style scoped>
</style>