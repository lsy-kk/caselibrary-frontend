<template>
    <div class="py-5">
        <TagItem 
            v-for="item in tagList" 
            :key="item.id" 
            :tagVo="item" 
            class="mb-4"/>
        <div v-if="hasSearch && tagList.length === 0" 
            class="bg-white h-20 my-4 text-center">
            <span class="text-xl" >
                找不到结果~ 换个关键词试试吧~
            </span>
        </div>
        <div style="margin: 10px 0">
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
import TagItem from '@/components/TagItem.vue' 
import { getSearchList } from '@/request/api/tag';
import type { PageParams } from '@/type/page';
import { useRoute } from 'vue-router';
import { ITagVo } from '@/type/tag';
const route = useRoute()
const pageParams = ref<PageParams>({
    page: 1,
    pageSize: 10,
});
const pageCount = ref(0)
var keyword: string = ''
var tagList = ref<ITagVo[]>([])
var hasSearch = ref(false)
onMounted(() => {
    keyword = String(route.params.keyword)
    reload()
})
watch(route, async (newRoute, oldRoute) => {
  keyword = String(newRoute.params.keyword)
  reload()
})
const reload = () => {
    getSearchList(pageParams.value.page, pageParams.value.pageSize, keyword).then(res=>{
        tagList.value = res.data.recordList
        pageCount.value = res.data.total
        hasSearch.value = true
    })
}
const handleSizeChange = (newPageSize: number) => { 
    pageParams.value.pageSize = newPageSize
    reload()
}
const handleCurrentChange = (newPageNum: number) => { 
    pageParams.value.page = newPageNum
    reload()
}
</script>

<style scoped>

</style>