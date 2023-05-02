<template>
    <div>
        <SortHeader 
                :showHeader=false
                @sortOption="sortOption" />
        <!--案例列表主体-->
        <CaseItem 
            v-for="item in caseList" 
            :key="item.id" 
            :caseVo="item" 
            class="mb-4"/>
        <div v-if="hasSearch && caseList.length === 0" 
            class="bg-white h-20 my-4 text-center">
            <span class="text-xl" >
                找不到结果~ 换个关键词试试吧~
            </span>
        </div>
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
import { onMounted, ref, watch } from 'vue'
import CaseItem from '@/components/CaseItem.vue' 
import SortHeader from '@/components/SortHeader.vue';
import { getSearchList } from '@/request/api/case';
import type { ICaseHeaderVo } from '@/type/case';
import type { PageParams } from '@/type/page';
import { useRoute } from 'vue-router';
const route = useRoute()
const props = defineProps<{
  opt?: string,
}>()
const pageParams = ref<PageParams>({
    page: 1,
    pageSize: 10,
});
const pageCount = ref(0)
var keyword: string = ''
const caseList = ref<ICaseHeaderVo[]>([])
var hasSearch = ref(false)
const sortOpt = ref('hot')
const sortOption = (opt: string) => {
    sortOpt.value = opt
    reload()
}
// 生命周期函数
onMounted(() => {
    keyword = String(route.params.keyword)
    reload()
})
watch(route, async (newRoute, oldRoute) => {
    keyword = String(newRoute.params.keyword)
    reload()
})
// 更新页面上的数据
const reload = () => {
    getSearchList(pageParams.value.page, pageParams.value.pageSize, keyword, sortOpt.value).then(res=>{
        caseList.value = res.data.recordList
        pageCount.value = res.data.total
        hasSearch.value = true
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

<style scoped>

</style>