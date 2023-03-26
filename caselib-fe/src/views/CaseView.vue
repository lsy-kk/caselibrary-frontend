<template>
  <div class="p-5">
    <!--标题头部分-->
    <div class="m-2 flex">
      <div class="mr-2"
        style="width: 200px;">
      </div>
      <div class="bg-white px-4 flex-1">
        <span class="text-2xl font-semibold leading-loose px-4 break-all">
          {{caseHeader.title}}
        </span>
        <!--案例作者相关-->
        <div class="relative align-middle block p-2">
          <!--头像-->
          <el-avatar
            :size="100" 
            class="m-2" 
            :src="caseHeader.author.image"/>
          <div class="mt-2 inline-block">
            <!--作者名称-->
            <div class="mb-1"> 
              <span>{{caseHeader.author.username}}</span>
            </div>
            <!--阅读与点击-->
            <div class="align-middle text-xs text-gray-400 mb-1">
              <span>
                <el-icon class="mr-1"><View /></el-icon>阅读   {{caseHeader.viewtimes}}
              </span>
              <span class="ml-4">
                <el-icon class="mr-1"><Comment /></el-icon>评论   {{caseHeader.comment}}
              </span>
            </div>
            <!--发布更新时间-->
            <div class="text-xs text-gray-400 mb-1">
              <span class="mr-10">
                发布时间 {{caseHeader.createTime }}
              </span>
              <template v-if="caseHeader.createTime!=caseHeader.caseBody.updateTime">
                <span class="mr-10">
                  内容最后修改于 {{caseHeader.caseBody.updateTime}}
                </span>
              </template>
            </div>
          </div>
          <el-button
            v-if="caseHeader.author.id == store.state.id"
            @click="handleEdit()"
            class="absolute top-0 right-0"
            type="success"
            plain>
            <el-icon class="mr-1"><Edit   /></el-icon>编辑
          </el-button>
          <div class="m-2 break-all" v-if="caseHeader.summary !== undefined && caseHeader.summary !== null">
              <span>简介：</span>
              {{caseHeader.summary}}
            </div> 
          <template 
            v-if="caseHeader.tags !== undefined && caseHeader.tags.length !== 0">
            <div class="m-2">
              <span>标签：</span>
              <el-tag 
                v-for="t in caseHeader.tags" 
                :key="t.id" 
                size="mini" 
                type="primary" 
                round 
                plain
                class="mr-2">
                {{t.name}}
              </el-tag>
            </div>
          </template>
          <div v-if="caseHeader.caseBody.appendixList !== undefined && 
                    caseHeader.caseBody.appendixList !== null && 
                    caseHeader.caseBody.appendixList.length !== 0" 
            class="m-2 flex">
            <span>附件：</span>
            <UploadItem 
              v-for="(item, index) in caseHeader.caseBody.appendixList"
              :key="index"
              :file="item"
              class="inline-block"/>
          </div>
        </div>
      </div>
    </div>
    <!--标题头部分结束-->
    <!--md部分-->
    <div class="m-2 flex">
      <!--markdown预览+目录-->
      <div class="mr-2">
        <el-affix :offset="160">
          <MarkdownCatalog 
              theme="light" 
              id="my-editor"
              class="sticky overflow-auto bg-white"
              style="width: 200px;"
            />
        </el-affix>
      </div>
      <div class="bg-white p-4 flex-1">
        <MarkdownPreview 
          theme="light" 
          id="my-editor" 
          :text="caseHeader.caseBody.content" 
          class="overflow-auto"
        />
        <!--操作部分-->
        <div class="mt-8 flex-1 relative">
          <el-button
            @click="handleThumb()"
            class="absolute bottom-0 right-20 mr-4"
            type="primary"
            plain>
            <el-icon class="mr-1"><CaretTop /></el-icon>点赞
          </el-button>
          <el-button
            @click="dialogShow = true"
            class="absolute bottom-0 right-0"
            type="warning"
            plain>
            <el-icon class="mr-1"><StarFilled /></el-icon>收藏
          </el-button>
        </div>
        <!--收藏弹窗-->
        <FavoritesDialog 
            :dialogShow="dialogShow" 
            @dialogClose="dialogClose"
            @dialogSuccess="dialogSuccess">
        </FavoritesDialog>
      </div>
    </div>
    <!--md部分结束-->
    <!--评论部分开始-->
    <div class="m-2 flex">
      <div class="mr-2 "
        style="width: 200px;">
      </div>
      <div class="flex-1 bg-white">
        <!--评论提交-->
        <div class="relative align-middle flex">
          <el-avatar
            :size="80" 
            class="m-2" 
            :src="store.state.image"/>
          <div class="my-4 w-full flex">
              <el-input
                  type="textarea"
                  :autosize="{ minRows: 2}"
                  maxlength="255"
                  show-word-limit
                  placeholder="你的评论..."
                  v-model="comment.content"
                  resize="none">
              </el-input>
              <el-button
                @click="handleComment"
                class="mx-2">
                <el-icon class="mr-1"><ChatSquare /></el-icon>发布评论
              </el-button>
          </div>
        </div>
        <!--评论展示-->
        <div v-if="caseHeader.comments !== undefined && 
                  caseHeader.comments !== null && 
                  caseHeader.comments.length !== 0" 
            class="my-2 w-full">
            <CommentItem 
              v-for="(item, index) in caseHeader.comments"
              :key="index"
              :comment="item"
              :case-id="caseHeader.id"
              :caseAuthorId="caseHeader.author.id"
              :index="index"
              @clickReplyReload="getReply"
              class="inline-block"/>
        </div>
      </div>
    </div>
    <!--评论部分结束-->
  </div>
</template>

<script setup lang="ts">
import UploadItem from '@/components/UploadItem.vue';
import CommentItem from '@/components/CommentItem.vue';
import MarkdownCatalog from '@/components/MarkdownCatalog.vue';
import MarkdownPreview from '@/components/MarkdownPreview.vue';
import FavoritesDialog from '@/components/FavoritesDialog.vue';
import { ref, onMounted } from 'vue'
import { getCaseHeaderVo } from '@/request/api/case'
import type {ICaseHeaderVo } from '@/type/case'
import type {IComment, ICommentVo } from '@/type/comment'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Comment, View, Edit, ChatSquare, CaretTop, StarFilled, Plus} from '@element-plus/icons-vue'; 
import router from '@/router'
import { insertComment } from '@/request/api/comment';
import { ElMessage } from 'element-plus';
const store = useStore(key)
const route = useRoute()
const caseHeader = ref<ICaseHeaderVo>({
    id: 0,
    title: "",
    summary: "",
    thumb: 0,
    viewtimes: 0, 
    comment: 0,
    visible: 0,
    createTime: "",
    updateTime: "",
    caseBody: {
      id: 0,
      content: "# hello",
      appendixList: [],
      state: 1,
      version: 0,
      createTime: "",
      updateTime: "",
    },
    author: {
      id: 0,
      email: "",
      image: "",
      username: "",
      authority: 0,
    },
    tags: [],
    comments: [],
})
const comment = ref<IComment>({
    content: "",
    authorId: store.state.id,
    parentId: 0,
})
onMounted(() => {
  reload()
})
const reload = () => {
  caseHeader.value.id = Number(route.params.id)
  getCaseHeaderVo(caseHeader.value.id, true, true).then((res) => {
      if (res.msg === "success"){
          caseHeader.value = res.data
      }
  })
}
const handleEdit = () => {
  router.push({
    name: 'md',
    params:{
    	caseId: caseHeader.value.id,
    },
  })
}
const reloadComment = () => {
  comment.value = {
    caseId: caseHeader.value.id,
    content: "",
    authorId: store.state.id,
    parentId: 0,
  }
}
// 发布一级评论
const handleComment = () => {
  comment.value.caseId = caseHeader.value.id
  insertComment(comment.value).then((res) => {
    if (res.msg === "success"){
      ElMessage.success("评论成功");
      // 更新评论列表
      caseHeader.value.comments.push(res.data)
    }
    else {
      ElMessage.error("评论失败，请稍后重试")
    }
  })
  reload()
  reloadComment()
}
// 获取子组件的评论，更新评论列表
const getReply = (index: number, commentVo: ICommentVo) => {
  caseHeader.value.comments[index].children.push(commentVo);
}
// 点赞操作
const handleThumb = () => {
  
}
// 控制收藏弹窗操作
const dialogShow = ref(false)
const dialogClose = () =>{
  dialogShow.value = false
}
const dialogSuccess = () =>{
  dialogShow.value = false
  ElMessage.success("收藏成功")
}
</script>

<style scoped>

</style>