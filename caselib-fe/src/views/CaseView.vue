<template>
  <div class="p-5">
    <!--标题头部分-->
    <div class="m-2 flex">
      <div 
        class="mr-2"
        style="width: 200px;">
      </div>
      <div class="bg-white px-4 flex-1">
        <span class="text-2xl font-semibold leading-loose px-4">
          {{caseHeader.title}}
        </span>
        <!--案例作者相关-->
        <div class="relative align-middle block p-2">
          <!--头像-->
          <el-avatar
            :size="100" 
            class="mr-4" 
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
          <div class="m-2 flex">
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
      <div class="bg-white mr-2">
        <el-affix :offset="80">
          <MarkdownCatalog 
              theme="light" 
              id="my-editor"
              class="sticky overflow-auto"
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
            @click="handleFavorites()"
            class="absolute bottom-0 right-0"
            type="warning"
            plain>
            <el-icon class="mr-1"><StarFilled /></el-icon>收藏
          </el-button>
        </div>
      </div>
    </div>
    <!--md部分结束-->
    <div></div>
  </div>
</template>

<script setup lang="ts">
import UploadItem from '@/components/UploadItem.vue';
import MarkdownCatalog from '@/components/MarkdownCatalog.vue';
import MarkdownPreview from '@/components/MarkdownPreview.vue';
import { ref, reactive, onMounted } from 'vue'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { getCaseHeaderVo } from '@/request/api/case'
import type {ICaseHeaderVo } from '@/type/case'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Comment, View, Edit, Stopwatch, CaretTop, StarFilled} from '@element-plus/icons-vue'; 
import router from '@/router'
const MdCatalog = MdEditor.MdCatalog;
const scrollElement = document.documentElement;
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
const store = useStore(key)
const route = useRoute()
onMounted(() => {
  reload()
})
const reload = () => {
  caseHeader.value.id = Number(route.params.id)
  getCaseHeaderVo(caseHeader.value.id, true, false).then((res) => {
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
</script>

<style scoped>

</style>