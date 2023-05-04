<template>
  <!--案例列表-->
  <div class="m-1 flex-1 box-border overflow-auto block">
      <!--案例列表主体-->
      <CaseItem 
        v-for="(item, index) in caseList" 
        :key="index" 
        :caseVo="item" 
        class="mb-4"/>

      <div style="margin: 10px 0">
          <!--分页栏-->
          <el-pagination
              v-model:currentPage="pageParams.page"
              v-model:page-size="pageParams.pageSize"
              :page-sizes="[5, 10, 15]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          >
          </el-pagination>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CaseItem from '@/components/CaseItem.vue' 
import { getHotList } from '@/request/api/case';
import { PageParams } from '@/type/page';
import { ICaseHeaderVo } from '@/type/case';
const pageParams = ref<PageParams>({
    page: 1,
    pageSize: 10,
});
const pageCount = ref(0)
const caseList = ref<ICaseHeaderVo[]>([])
// 生命周期函数
onMounted(() => {
  reload()
})

// 更新页面上的数据
const reload = () => {
  getHotList(pageParams.value.page, pageParams.value.pageSize).then(res=>{
      caseList.value = res.data.recordList
      pageCount.value = res.data.total
  })
}

// 改变当前每页的显示条数时触发
const handleSizeChange = (newPageSize: number) => { 
  pageParams.value.pageSize = newPageSize
  reload()
}

// 改变当前页码时触发
const handleCurrentChange = (newPageNum: number) => { 
  pageParams.value.page = newPageNum
  reload()
}
</script>


<style lang="scss" scoped>
</style>