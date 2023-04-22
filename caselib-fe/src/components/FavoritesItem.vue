<template>
    <!--收藏夹内的案例列表-->
    <div class="mb-4 mx-1 p-4 bg-blue-100">
        <div class="relative block pb-4">
            <el-avatar
                :size="100" 
                class="m-2" 
                :src="favoritesVo.image"/>
            <div class="ml-4 mt-4 inline-block align-top">
                <div class="font-semibold text-base">
                    {{ favoritesVo.name }}
                </div>
                <div class="relative">
                    <div class="text-sm my-1 text-gray-400">
                        创建者:
                        &nbsp;{{favoritesVo.owner.username}}
                    </div>
                    <div class="my-1">
                        <span class="text-sm pr-4 text-gray-400">
                            {{data.list.length}}个内容
                        </span>
                        <span v-if="favoritesVo.visible" class="text-sm pr-4 text-gray-400">公开</span>
                        <span v-else class="text-sm pr-4 text-gray-400">隐藏</span>
                    </div>
                    <div class="my-1 text-sm text-gray-400">
                        创建时间：&nbsp;{{favoritesVo.createTime}}
                    </div>
                </div>
                <div v-if="favoritesVo.owner.id === store.state.id">
                    <el-popconfirm 
                        width="220"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        :icon="InfoFilled"
                        icon-color="#626AEF"
                        title="确定要删除该收藏夹吗?"
                        @confirm="handleDelete">
                        <template #reference>
                            <el-button
                                class="absolute top-0 right-20 mr-4"
                                type="danger" size="small" plain>删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                    <el-button
                        @click="dialogShow=true"
                        class="absolute top-0 right-0"
                        type="primary" size="small" plain>修改信息
                    </el-button>
                </div>
                <FavoritesDetailDialog
                    :favoritesVo="favoritesVo"
                    :key="dialogShow" 
                    :dialogShow="dialogShow"
                    @dialogClose="handleDialogClose"
                    @dialogSuccessUpdate="handleUpdate" />
            </div>
        </div>
        <div class="text-sm m-2 break-all">
            <span class="font-semibold">简介：</span>
            {{ favoritesVo.description }}
        </div> 
    </div>
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
                    v-model:current-page="data.selectData.page"
                    v-model:page-size="data.selectData.pageSize"
                    :page-sizes="[5, 10, 15]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="data.pageCount"
                    @update:size-change="handleSizeChange"
                    @update:current-change="handleCurrentChange"
                />
            </div>
    </div>
</template>

<script setup lang="ts">
import { getCaseByFavoritesId } from '@/request/api/case'
import { IFavoritesVo } from '@/type/favorites';
import { changeFavoritesStatus } from '@/request/api/favorites'
import { CaseVoData } from '@/type/case';
import { ref, reactive, onMounted } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store';
const route = useRoute()
const data = reactive(new CaseVoData())
const dialogShow = ref(false)
const store = useStore()
const props = defineProps<{
  favoritesVo: IFavoritesVo
}>()
onMounted(() => {
    reload()
})
const reload = () => {
    if (props.favoritesVo.id !== -1){
        getCaseByFavoritesId(data.selectData.page, data.selectData.pageSize, props.favoritesVo.id).then((res) => {
            data.list = res.data.recordList
            data.pageCount = res.data.total
        })
    }
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
const handleDialogClose = () => {
    dialogShow.value = false
}
const emit = defineEmits<{
    (e: 'sendDelete'): void
    (e: 'sendUpdate'): void
}>()
const handleDelete = () =>{
    // 删除，跳转到默认页
    changeFavoritesStatus(props.favoritesVo.id, 0).then((res) => {
        emit('sendDelete');
    })
}
const handleUpdate = () =>{
    // 更新，刷新页面
    emit('sendUpdate');
}
</script>

<style scoped>

</style>