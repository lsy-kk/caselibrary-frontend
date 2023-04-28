<!--搜索：头部栏-->
<!--个人中心：头部栏-->
<template>
    <div class="static flex bg-white my-4">
        <div v-if="!showHeader" class="static w-full">
            <el-radio-group 
                v-model="sortOpt"
                size="large">
                <el-radio-button
                    v-for="option in options"
                    :key="option.opt"
                    :label="option.opt"
                    @change="handleSortOption">
                    {{ option.text }}
                </el-radio-button>
            </el-radio-group>
        </div>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, defineEmits, ref } from 'vue'
const props = defineProps<{
  showHeader: Boolean,
}>()
const options = [
  { text: '综合排序', opt: 'hot' },
  { text: '最新发布', opt: 'new' },
  { text: '最多点击', opt: 'view' },
  { text: '最多点赞', opt: 'thumb' },
  { text: '最多收藏', opt: 'favorite' },
]
onMounted(() => {
})
const sortOpt = ref('hot') 
const emit = defineEmits<{
    (e: 'sortOption', opt: string): void
}>()
const handleSortOption = () => {
    emit('sortOption', sortOpt.value);
}
</script>

<style scoped>
</style>