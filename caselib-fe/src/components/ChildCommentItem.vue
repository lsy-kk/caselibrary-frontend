<template>
    <div class="block w-full">
        <!--案例作者相关-->
        <div class="relative align-middle flex">
            <!--头像-->
            <el-avatar
                :size="80" 
                class="m-2" 
                :src="comment.author.image" />
            <div class="my-2 w-full">
                <!--作者名称-->
                <div class="flex"> 
                    <span class="mr-2">{{ comment.author.username }}</span>
                    <template v-if="comment.author.id === caseAuthorId">
                        <span>[作者]</span>
                    </template>
                </div>
                <div class="my-2 break-all">
                    <template v-if="comment.toUser !== undefined && comment.toUser !== null">
                        回复 
                        <a href="https://blog.mszlu.com/#/view/1517502795805274114"
                            class="no-underline"> @{{ comment.toUser.username }}
                        </a>
                        : 
                    </template>
                    {{comment.content}}
                </div>
               
                <div class="my-2 text-xs text-gray-400 absolute right-0 top-0">
                
                </div>
                <div class="my-2 text-xs text-gray-400">
                    <!--发布更新时间-->
                    <span class="mr-4">
                        发布时间 {{ comment.createTime }}
                    </span>
                    <template v-if="comment.createTime !== comment.updateTime">
                        <span class="mr-4">
                            内容最后修改于 {{ comment.updateTime }}
                        </span>
                    </template>
                    <!--
                        <a class="mr-4" @click="handleReply">回复</a>
                    -->
                    <el-button 
                        @click="handleReply" 
                        link>
                        <span class="text-xs">回复</span>
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ICommentVo } from '@/type/comment' 
import { defineEmits } from 'vue'
// 组件参数
const props = defineProps<{
    comment: ICommentVo,
    caseAuthorId: number,
}>()
const emit = defineEmits<{
  (e: 'wantToReply', comment: ICommentVo): void
}>()
// 展开回复评论列表
const handleReply = () => {
    emit('wantToReply', props.comment);
}
</script>

<style scoped>

</style>