<template>
  <div class="m-1 flex-1 box-border overflow-auto block">
      <!--未读-->
      <div v-if="unreadList.length!==0" class="my-2 ml-2">
        <el-divider content-position="center"/>
        <span>未读消息</span>
      </div>
      <div v-else>
        <el-divider content-position="center"/>
        <span>暂无新消息</span>
      </div>
      <NoticeItem 
          v-for="(item) in unreadList" 
          :key="item.id" 
          :noticeVo="item" 
          class="mb-4"/>
      <!--已读--> 
      <div v-if="noticeList.length!==0" class="my-4">
        <el-divider content-position="center"/>
        <span class="">已读消息</span>
      </div>
      <el-scrollbar>
        <NoticeItem 
          v-for="(item) in noticeList" 
          :key="item.id" 
          :noticeVo="item" 
          class="mb-4"/>
      </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NoticeItem from '@/components/NoticeItem.vue' 
import { INoticeVo } from '@/type/notice';
import { getListByUserIdAndTypeAndIsRead, updateUnRead } from '@/request/api/notice';
import { useStore } from '@/store';
const unreadList = ref<INoticeVo[]>([])
const noticeList = ref<INoticeVo[]>([])
const props = defineProps<{
  type: number,
}>()
// 生命周期函数
onMounted(() => {
  reload()
  // 10秒后自动更新未读消息
  let timer = setTimeout(updateAllUnRead, 10000);
})
const store = useStore()
// 更新页面上的数据
const reload = () => {
  getListByUserIdAndTypeAndIsRead(store.state.id, props.type, 0).then((res)=>{
    unreadList.value = res.data
  })
  getListByUserIdAndTypeAndIsRead(store.state.id, props.type, 1).then((res)=>{
    noticeList.value = res.dat
  })
}
// 将未读消息更新为已读
const updateAllUnRead = () => {
  updateUnRead(store.state.id, props.type).then((res) => {})
  store.commit('clearNotice')
}
</script>


<style lang="scss" scoped>
</style>`