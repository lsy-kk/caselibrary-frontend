<template>
    <div>
        <el-container class="fixed w-screen h-screen">
            <el-header class="relative ring-2 ring-gray-400 ring-opacity-50">
                <PersonHeader/>
            </el-header>
        </el-container>  
    </div>
</template>

<script setup lang="ts">
import PersonHeader from '@/components/PersonHeader.vue';
</script>

<style scoped>

</style>