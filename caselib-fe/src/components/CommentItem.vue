<template>
    <div class="block w-full">
        <!--案例作者相关-->
        <div class="relative align-middle flex w-full">
            <!--头像-->
            <el-avatar
                :size="80" 
                class="m-2" 
                :src="comment.author.image" />
            <div class="m-2 w-full">
                <!--作者名称-->
                <div class="flex"> 
                    <a 
                        @click="handleViewUser(comment.author.id)" 
                        class="font-semibold text-base mr-2" 
                        v-html="comment.author.username"></a>
                    <template v-if="comment.author.id === caseAuthorId">
                        <span>[作者]</span>
                    </template>
                </div>
                <div class="my-2 break-all">
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
                <div class="relative align-middle flex" v-show="replyInputShow">
                    <el-avatar
                        :size="80" 
                        class="m-2" 
                        :src="store.state.image"/>
                    <div class="my-2 w-full flex">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2}"
                            maxlength="255"
                            show-word-limit
                            :placeholder="placeholder"
                            v-model="replyComment.content"
                            resize="none">
                        </el-input>
                        <el-button
                            @click="handleSubmitComment"
                            class="mx-2">
                            <el-icon class="mr-1"><ChatSquare /></el-icon>发布评论
                        </el-button>
                    </div>
                </div>
                <ChildCommentItem 
                    v-for="(item, index) in comment.children"
                    :key="index"
                    :comment="item"
                    :caseAuthorId="caseAuthorId"
                    @wantToReply="wantToReply"
                    class="inline-block" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '@/store'
import type { ICommentVo, IComment } from '@/type/comment'
import { insertComment } from '@/request/api/comment';
import { ChatSquare} from '@element-plus/icons-vue'; 
import { ElMessage } from 'element-plus';
import { defineEmits } from 'vue'
import ChildCommentItem from '@/components/ChildCommentItem.vue';
import { useRouter } from 'vue-router';
// 组件参数
const props = defineProps<{
    comment: ICommentVo,
    caseId: number,
    caseAuthorId: number,
    index: number,
}>()
onMounted(() => {

})
const emit = defineEmits<{
  (e: 'clickReplyReload', index: number, commentVo: ICommentVo): void
}>()
const store = useStore()
const replyInputShow = ref(false)
const replyComment = ref<IComment>({
    content: "",
    authorId: store.state.id,
    parentId: props.comment.id,
    toUserId: undefined
})
const placeholder = ref("")
// 想要评论父评论，展开评论框
const handleReply = () => {
    replyInputShow.value = !replyInputShow.value
    placeholder.value = "回复 @" + props.comment.author.username + " : ";
    replyComment.value.toUserId = undefined
}
// 发布评论
const handleSubmitComment = () => {
  replyComment.value.caseId = props.caseId
  insertComment(replyComment.value).then((res) => {
    if (res.success){
      ElMessage.success("评论成功");
      // 二级评论，传递给父组件
      emit('clickReplyReload', props.index, res.data)
      replyComment.value.content = ""
    }
    else {
      ElMessage.error("评论失败，请稍后重试")
    }
  })
}
// 想要评论子评论，展开回复列表（返回的是被评论的评论）
const wantToReply = (commentVo : ICommentVo) => {
    replyInputShow.value = true
    replyComment.value.toUserId = commentVo.author.id
    placeholder.value = "回复 @" + commentVo.author.username + " : ";
}
const router = useRouter()
const handleViewUser = (id: number) => {
  router.push({path:`/user/${id}`})
}
</script>

<style scoped>

</style>