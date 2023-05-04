<!--收藏管理：侧边栏-->
<template>
    <div>
        <el-menu 
            menu-trigger="click" 
            :default-active="fid"> 
            <el-menu-item 
                v-if="userId === store.state.id"
                @click="handleInsert"
                index="-1">
                <el-icon><FolderAdd /></el-icon>
                <span> 新建收藏夹 </span>
            </el-menu-item>
            <el-menu-item 
                v-for="(favoritesVo, index) in favoritesVoList" 
                :key="index"
                :index="String(favoritesVo.id)"
                @click="handleChange(favoritesVo)">
                <el-icon><Folder /></el-icon>
                <span>{{ favoritesVo.name }}</span>
            </el-menu-item>
        </el-menu>
        <FavoritesDetailDialog 
            :dialogShow="dialogShow"
            @dialogClose="handleDialogClose"
            @dialogSuccessInsert="sendNewFavoritesVo" />
    </div>
</template>

<script setup lang="ts">
import FavoritesDetailDialog from '@/components/FavoritesDetailDialog.vue'
import { Folder, FolderAdd } from '@element-plus/icons-vue';
import { IFavoritesVo } from '@/type/favorites';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useStore } from '@/store';
const store = useStore()
const route = useRoute()
const router = useRouter()
const userId = Number(route.params.id)
const fid = ref('-1')
const dialogShow = ref(false)
const props = defineProps<{
    favoritesVoList: IFavoritesVo[]
}>()
onMounted(() => {
    if (route.query.fid){
        fid.value = String(route.query.fid)
    }
    else if (props.favoritesVoList && props.favoritesVoList.length>0){
        fid.value = String(props.favoritesVoList[0].id)
        if (props.favoritesVoList[0]){
            handleChange(props.favoritesVoList[0])
        }
    }
})
const emit = defineEmits<{
    (e: 'sendChoosenFavoritesVo', favoritesVo: IFavoritesVo): void
    (e: 'sendNewFavoritesVo', favoritesVo: IFavoritesVo): void
}>()
const handleDialogClose = () =>{
  dialogShow.value = false
}
// 向父组件发送新建好的收藏夹vo
const sendNewFavoritesVo = (newFavoritesVo: IFavoritesVo) =>{
  dialogShow.value = false
  ElMessage.success("收藏夹新建成功")
  emit('sendNewFavoritesVo', newFavoritesVo);
  handleChange(newFavoritesVo)
}
// 打开插入收藏夹对话框
const handleInsert = () => {
    fid.value = '-1'
    dialogShow.value = true
}
// 查看收藏夹具体内容，向父组件发送对应收藏夹的vo
const handleChange = (favoritesVo :IFavoritesVo) => {
    fid.value = String(favoritesVo.id);
    router.push({
        path: `/user/${userId}/favorites`,
        query: {
            fid: favoritesVo.id,
        }
    })
    emit('sendChoosenFavoritesVo', favoritesVo);
}
</script>

<style scoped>

</style>