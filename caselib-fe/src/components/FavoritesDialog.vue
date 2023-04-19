<template>
    <div>
        <el-dialog 
            v-model="visible"
            title="添加到收藏夹" 
            width = "30%"
            @close="close"
            class="px-4"
            draggable>
            <!--分割线-->
            <div class="grid grid-cols-1 divide-y divide-yellow-500">
                <div class="max-h-80 overflow-auto">
                    <el-checkbox-group 
                        v-model="newItems" 
                        size="large">
                        <el-checkbox 
                            v-for="(favoritesVo, index) in favoritesVoList" 
                            :key="index"
                            :label="favoritesVo.id"
                            style="display:block;"
                            class="block">
                            <span class="overflow-hidden text-ellipsis mx-2">
                                {{ favoritesVo.name }} 
                            </span>
                        </el-checkbox>
                    </el-checkbox-group>
                    <div v-if="insertShow === false">
                        <el-button
                            @click="insertShow=true"
                            class="sticky mb-4 w-full"
                            plain>
                            <el-icon class="mr-1"><Plus /></el-icon>新建收藏夹
                        </el-button>
                    </div>
                    <div v-else class="my-2">
                        <el-input
                            maxlength="20"
                            show-word-limit
                            placeholder="请输入收藏夹名称"
                            v-model="favorites.name"
                            style="width: 80%">
                        </el-input>
                        <el-button
                            @click="handleInsertFavorites"
                            style="width: 20%"
                            type="plain">
                            <el-icon><Plus /></el-icon>
                            新建
                        </el-button>
                    </div>
                </div>
                <div>
                    <el-button
                        @click="handleFavorites"
                        class="sticky mt-2 w-full"
                        type="primary">
                        确定
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { getFavoritesVoByCaseIdAndUserId, 
        insertFavorites, 
        insertFavoritesItems, 
        deleteFavoritesItems } from '@/request/api/favorites'
import { IFavorites, IFavoritesVo, IFavoritesInstance } from '@/type/favorites';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ref, computed, defineEmits, onMounted } from 'vue'; 
import { useStore } from '@/store';
const props = defineProps<{
    dialogShow: boolean,
}>()
const route = useRoute()
const store = useStore()
const caseId = Number(route.params.id)
// 该用户创建的所有收藏夹
const favoritesVoList = ref<IFavoritesVo[]>([])
// 旧的和新的收藏记录
const oldItems = ref<number[]>([])
const newItems = ref<number[]>([])
// 新建收藏夹
const favorites = ref<IFavorites>({})
// 展示新建收藏夹的输入框
const insertShow = ref(false)
onMounted(() => {
    reset()
    getFavoritesVoList()
})
// 获取当前登录用户的收藏夹列表
const getFavoritesVoList = () => {
    getFavoritesVoByCaseIdAndUserId(caseId, store.state.id).then(res => {
        favoritesVoList.value = res.data
        oldItems.value = favoritesVoList.value
                        .filter(item => item.favorites)
                        .map(item => item.id)
        newItems.value = oldItems.value
    })
}
const emit = defineEmits<{
    (e: 'dialogClose'): void
    (e: 'dialogSuccess'): void
    (e: 'dialogDelete'): void
}>()
// 子组件定义自己的visible
const visible = computed({
    get: () => props.dialogShow,
    set: (value) => {
        // emit('update:modelValue', value)
    },
})
const reset = () => {
    newItems.value = []
    favorites.value = {}
    insertShow.value = false
}
// 关闭窗口的情况，重置选项
const close = () => {
    newItems.value = oldItems.value
    emit('dialogClose')
}
// 提交收藏记录并关闭窗口的情况
const submit = (flag: boolean) => {
    oldItems.value = newItems.value
    if (flag){
        emit('dialogSuccess')
    }
    else {
        emit('dialogDelete')
    }
}
// 新增收藏夹
const handleInsertFavorites = () =>{
    if (favorites.value.name === ''){
        ElMessage.warning('收藏夹名称不得为空');
        return
    }
    favorites.value.ownerId = store.state.id
    favorites.value.visible = 1
    // 收藏夹列表末尾，添加新建的收藏夹，并默认选中
    insertFavorites(favorites.value).then((res) => {
        favoritesVoList.value.push(res.data)
        newItems.value.push(res.data.id)
    })
    // 清空输入
    insertShow.value = false
    favorites.value = {}
}
// 新增并删除收藏记录
const handleFavorites = async () => {
    // 转成集合
    let newSet = new Set(newItems.value)
    let oldSet = new Set(oldItems.value)
    // 差集, newItem - oldItem, 需要新增的收藏实例
    let insertItems = newItems.value.filter(item => !oldSet.has(item))
    // 差集, oldItem - newItem, 需要删除的收藏实例             
    let deleteItems = oldItems.value.filter(item => !newSet.has(item))
    // console.log(oldItems.value);
    // console.log(newItems.value);
    // console.log(insertItems);
    // console.log(deleteItems);
    // 生成新增收藏记录的数组
    let insertFavorites: IFavoritesInstance[] = []
    let favoritesItem: IFavoritesInstance = {
        caseId: Number(route.params.id),
        userId: store.state.id,
    }
    insertItems.forEach(favoritesId => {
        favoritesItem.favoritesId = favoritesId
        insertFavorites.push(favoritesItem)
    });
    // 新增
    if (insertFavorites.length != 0){
        const res = await insertFavoritesItems(insertFavorites)
    }
    // 生成删除收藏记录的数组
    let deleteFavorites: IFavoritesInstance[] = []
    deleteItems.forEach(favoritesId => {
        favoritesItem.favoritesId = favoritesId
        deleteFavorites.push(favoritesItem)
    });
    // 删除
    if (deleteFavorites.length != 0){
        const res = await deleteFavoritesItems(deleteFavorites)
    }
    // 发送收藏成功或取消收藏的信号，父组件关闭收藏窗口
    submit(newItems.value.length != 0)
}
</script>

<style scoped>

</style>