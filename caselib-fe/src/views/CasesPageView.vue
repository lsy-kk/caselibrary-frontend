<template>
  <!--案例列表-->
  <div class="m-1 flex-1 box-border overflow-auto block">
      <!--案例列表主体-->
      <CaseItem 
        v-for="(item, index) in data.list" 
        :key="index" 
        :caseVo="item" 
        class="mb-4"/>

      <div style="margin: 10px 0">
          <!--分页栏-->
          <el-pagination
              v-model:currentPage="data.selectData.page"
              v-model:page-size="data.selectData.pageSize"
              :page-sizes="[5, 10, 15]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="data.pageCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          >
          </el-pagination>
      </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import CaseItem from '@/components/CaseItem.vue' 
import { getCaseVoList } from '@/request/api/case';
import { CaseVoData } from '@/type/case';
const data = reactive(new CaseVoData())
// 生命周期函数
onMounted(() => {
  reload()
})
// 搜索操作
const handleSearch = () => {
  reload()
}

// 更新页面上的数据
const reload = () => {
  getCaseVoList(data.selectData).then(res=>{
      data.list = res.data.recordList
      data.pageCount = res.data.total
  })
}

// 改变当前每页的显示条数时触发
const handleSizeChange = (newPageSize: number) => { 
  data.selectData.pageSize = newPageSize
  reload()
}

// 改变当前页码时触发
const handleCurrentChange = (newPageNum: number) => { 
  data.selectData.page = newPageNum
  reload()
}
</script>


<style lang="scss" scoped>
</style>