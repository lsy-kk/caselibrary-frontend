<template>
    <!--案例列表-->
    <div class="m-1 flex-1 box-border overflow-auto block p-5">
        <div class="h-60px flex-shrink-0
                    box-border overflow-auto relative">
            <SearchHeader :showHeader=false />
        </div>
        <div class="h-[calc(100%-120px)]block flex-1
                    box-border overflow-auto">
            <!--路由出口-->
            <router-view/>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import SearchHeader from '@/components/SearchHeader.vue';
</script>


<style lang="scss" scoped>
</style>