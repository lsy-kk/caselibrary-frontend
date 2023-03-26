<template>
<!--案例列表-->
<div class="m-1 flex-1 box-border overflow-auto block p-5">
    <!--案例列表主体-->
    <CaseItem v-for="a in caseList" :key="a.id" v-bind="a" class="mb-4"/>

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
import { onMounted, ref } from 'vue'
import CaseItem from '@/components/CaseItem.vue' 
import { getSearchList } from '@/request/api/case';
import type { ICaseHeaderVo } from '@/type/case';
import type { PageParams } from '@/type/page';
import { useRoute } from 'vue-router';
const route = useRoute()
const pageParams = ref<PageParams>({
    page: 1,
    pageSize: 10,
});
const pageCount = ref(0)
const keyword: string = String(route.params.keyword)
var caseList: ICaseHeaderVo[]=[]
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
    getSearchList(pageParams.value.page, pageParams.value.pageSize, keyword).then(res=>{
        caseList = res.data.recordList
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