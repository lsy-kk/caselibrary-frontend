<template>
  <div class="bg-white m-1 flex-1 p-8 box-border overflow-auto block">
    <span class="text-2xl font-semibold leading-loose px-4 ">
      {{caseHeader.title}}
    </span>
    <!--案例作者相关-->
    <div class="relative align-middle block mt-2">
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
    </div>
    
    <template 
      v-if="caseHeader.tags !== undefined && caseHeader.tags.length !== 0">
      <div class="mt-4">
        标签：
        <el-tag 
          size="mini" 
          type="primary" 
          v-for="t in caseHeader.tags" 
          :key="t.id" 
          round 
          plain>
          {{t.name}}
        </el-tag>
      </div>
    </template>
    <div>
      <!--markdown编辑器-->
      <md-editor 
        previewOnly
        previewTheme="vuepress"
        v-model="caseHeader.caseBody.content"
        class=" mb-4"/>
    </div>
    <div class="relative align-middle mb-8">
      <el-button
        @click="handleThumb()"
        class="absolute top-0 right-20 mr-4"
        type="primary"
        plain>
        <el-icon class="mr-1"><CaretTop /></el-icon>点赞
      </el-button>
      <el-button
        @click="handleFavorites()"
        class="absolute top-0 right-0"
        type="warning"
        plain>
        <el-icon class="mr-1"><StarFilled /></el-icon>收藏
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  console.log(caseHeader);
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