<template>
    <div>
        <TagItem :tagVo="tagVo" class="mt-4"/>
        <div class="p-6 flex-1 box-border overflow-auto block">
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
    </div>
</template>

<script setup lang="ts">
import { getTagVoById } from '@/request/api/tag'
import { ITagVo } from '@/type/tag'
import TagItem from '@/components/TagItem.vue' 
import CaseItem from '@/components/CaseItem.vue' 
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router';
import { getListByTagId } from '@/request/api/case'
import { CaseVoData } from '@/type/case';
const data = reactive(new CaseVoData())
const route = useRoute()
const tid = Number(route.params.id)
const tagVo = ref<ITagVo>({
    id: 0,
    name: '',
    description: '',
    image: '',
    status: 1,
    caseNumber: 0,
    createTime: '',
})
onMounted(() => {
    getTagVoById(tid).then((res) => {
        tagVo.value = res.data
    })
    reload()
})

// 更新页面上的数据
const reload = () => {
  getListByTagId(data.selectData.page, data.selectData.pageSize, tid).then(res=>{
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

<style scoped>

</style>