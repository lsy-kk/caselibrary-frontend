<template>
    <div>
        <el-container>
            <el-aside style="width: 180px">
                <!--收藏夹列表-->
                <FavoritesAside v-if="favoritesVoList"
                    :favoritesVoList="favoritesVoList"
                    :key="favoritesVoList"
                    @sendNewFavoritesVo="getNewFavoritesVo"
                    @sendChoosenFavoritesVo="getChoosenFavoritesVo"/>
            </el-aside>
            <el-main>
                <FavoritesItem v-if="choosenFavoritesVo"
                    :key="choosenFavoritesVo"
                    :favoritesVo="choosenFavoritesVo"
                    @sendDelete="getDelete"
                    @sendUpdate="getUpdate" />
            </el-main>
    </el-container>
    </div>
</template>

<script setup lang="ts">
import FavoritesAside from '@/components/FavoritesAside.vue';
import FavoritesItem from '@/components/FavoritesItem.vue';
import { getFavoritesVoById, getFavoritesByOwnerId } from '@/request/api/favorites'
import { IFavoritesVo } from '@/type/favorites';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const route = useRoute()
const router = useRouter()
const userId = Number(route.params.id)
const choosenFavoritesVo = ref()
const favoritesVoList = ref()
onMounted(() => {
    getChoosenFavoritesVoByRoute()
    getFavoritesVoList()
})
// 获取用户创建的收藏夹
const getFavoritesVoList = () => {
    getFavoritesByOwnerId(userId).then(res => {
        favoritesVoList.value = res.data
    })
}
// 根据路由中的id获取对应收藏夹信息
const getChoosenFavoritesVoByRoute = () => {
    if (route.query.fid){
        getFavoritesVoById(Number(route.query.fid)).then((res) => {
            choosenFavoritesVo.value = res.data
        })
    }
}
// 将新增的收藏夹插入队尾，选中收藏夹改为新建的收藏夹
const getNewFavoritesVo = (favoritesVo: IFavoritesVo) => {
    favoritesVoList.value.push(favoritesVo)
}
// 获取选中的收藏夹vo
const getChoosenFavoritesVo = (favoritesVo: IFavoritesVo) =>{
    choosenFavoritesVo.value = favoritesVo
}
// 删除选中收藏夹
const getDelete = () => {
    choosenFavoritesVo.value = undefined
    ElMessage.success("删除成功")
    getFavoritesVoList()
    router.push({path: `/user/${userId}/favorites`})
}
// 更新选中收藏夹刷新页面
const getUpdate = () => {
    ElMessage.success("更新成功")
    getFavoritesVoList()
    getChoosenFavoritesVoByRoute()
}
</script>

<style scoped>

</style>