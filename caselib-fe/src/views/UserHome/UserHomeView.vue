<template>
    <div class="w-5/6 mx-auto min-h-full"
        :style="{backgroundImage:'url('+bgImg+')',backgroundSize: '100% 100%',
                backgroundAttachment: 'fixed' }">
        <div class="min-w-0 flex-col flex box-border">
            <div class="h-60px flex-shrink-0
                        box-border overflow-auto relative 
                        mt-20">
                <UserItem 
                  v-if="hasUserVo" 
                  :userVo="userVo"
                  class="mb-4">
                </UserItem>
                <PersonHeader :showHeader=false />
            </div>
            <div class="h-[calc(100%-60px)] block flex-1
                        box-border overflow-auto">
                <!--路由出口-->
                <router-view/>
            </div>
        </div>  
    </div>
</template>

<script setup lang="ts">
import PersonHeader from '@/components/PersonHeader.vue';
import UserItem from '@/components/UserItem.vue';
import { getUserVoById } from '@/request/api/user';
import type { IUserVo } from '@/type/user';
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import bgImg from '@/assets/background/red-bg.png'
const route = useRoute()
var activeIndex: String = '/case'
var userVo: IUserVo
const hasUserVo = ref(false)
onMounted(() => {
    getUserVoById(Number(route.params.id)).then((res) => {
        userVo = res.data
        hasUserVo.value = true
    })
})
</script>

<style scoped>

</style>