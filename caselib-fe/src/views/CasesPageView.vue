<template>
  <!--案例列表-->
  <div class="m-1 flex-1 box-border overflow-auto block">
      <!--案例列表主体-->
      <CaseItem v-for="a in data.list" :key="a.id" v-bind="a" class="mb-4"/>

      <div style="margin: 10px 0">
          <!--分页栏-->
          <el-pagination
              v-model:currentPage="data.selectData.page"
              :page-sizes="[5, 10, 15]"
              :page-size="data.selectData.pageSize"
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
import { CaseData } from '@/type/case';
const data = reactive(new CaseData())
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
      data.list = res.data
      data.pageCount = res.data.length
      console.log(res.data);
      
  })
}

// 改变当前每页的显示条数时触发
const handleSizeChange = (newPageSize:number) => { 
  data.selectData.pageSize = newPageSize
  reload()
}

// 改变当前页码时触发
const handleCurrentChange = (newPageNum:number) => { 
  data.selectData.page = newPageNum
  reload()
}
</script>


<style lang="scss" scoped>
</style>