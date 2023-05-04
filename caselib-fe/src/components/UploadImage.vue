<template>
    <div style="width: 120px; height: 120px;">
        <div>
            <el-tooltip content="点击上传图片" placement="top" effect="light">
                <el-upload
                    class="flex align-middle justify-center"
                    style="width: 120px; height: 120px;"
                    :limit="1"
                    :action="url"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <el-avatar v-if="imageUrl" shape="square" :size="120" fit="fill" :src="imageUrl" />
                    <el-icon v-else class="my-auto" style="font-size: 32px;"><Plus /></el-icon>
                    <!--
                        <span v-else class="my-auto">点击上传</span>
                    -->
                </el-upload>
            </el-tooltip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
const props = defineProps<{
  oldImageUrl: string,
}>()
const imageUrl = ref(props.oldImageUrl)
const url = import.meta.env.VITE_BASE_URL + "/file/uploadFile"
// 向父组件传参
const emit = defineEmits<{
    (e: 'imageUrl', url: string): void
}>()
// 传递图片url
const sendImageUrl = () => {
    emit('imageUrl', imageUrl.value);
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    if (response.success){
        // 得到图片的url
        uploadFile.url = response.data
        imageUrl.value = response.data
        ElMessage.success("上传成功")  
        sendImageUrl()
    }
    else {
        ElMessage.error("上传失败，请稍后重试")
    }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('上传的图片格式应当为jpg或png，请重新提交。')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不得超过2MB，请重新提交。')
        return false
    }
    return true
}
</script>

<style scoped>

</style>